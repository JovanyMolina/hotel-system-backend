import { prisma } from '../lib/prisma'
import { EstadoReserva } from '@prisma/client'

interface CrearReservaData {
  huespedId: string
  habitacionId: string
  fechaEntrada: Date
  fechaSalida: Date
  notas?: string | null
  usuarioId: string
}

function calcularNoches(entrada: Date, salida: Date): number {
  const diff = salida.getTime() - entrada.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}


async function verificarDisponibilidad(
  habitacionId: string,
  fechaEntrada: Date,
  fechaSalida: Date,
  excluirReservaId?: string  
) {
  const conflicto = await prisma.reserva.findFirst({
    where: {
      habitacionId,
      estado: { notIn: ['CANCELADA', 'CHECKOUT'] },
      AND: [
        { fechaEntrada: { lt: fechaSalida } },
        { fechaSalida: { gt: fechaEntrada } }
      ],
      ...(excluirReservaId ? { NOT: { id: excluirReservaId } } : {})
    }
  })

  if (conflicto) {
    throw new Error(
      `La habitación no está disponible del ${fechaEntrada.toLocaleDateString('es-MX')} al ${fechaSalida.toLocaleDateString('es-MX')}`
    )
  }
}

export async function obtenerReservas(filtros?: {
  estado?: EstadoReserva
  huespedId?: string
  habitacionId?: string
}) {
  return prisma.reserva.findMany({
    where: filtros,
    include: {
      huesped: true,
      habitacion: true,
      usuario: {
        select: { id: true, nombre: true, email: true, rol: true }
      },
      pagos: true
    },
    orderBy: { creadoEn: 'desc' }
  })
}

export async function obtenerReservaPorId(id: string) {
  const reserva = await prisma.reserva.findUnique({
    where: { id },
    include: {
      huesped: true,
      habitacion: true,
      usuario: {
        select: { id: true, nombre: true, email: true, rol: true }
      },
      pagos: true
    }
  })
  if (!reserva) throw new Error('Reserva no encontrada')
  return reserva
}

export async function crearReserva(data: CrearReservaData) {
  const fechaEntrada = new Date(data.fechaEntrada)
  const fechaSalida = new Date(data.fechaSalida)

  // 1. Verificar que el huésped existe
  const huesped = await prisma.huesped.findUnique({ where: { id: data.huespedId } })
  if (!huesped) throw new Error('Huésped no encontrado')

  // 2. Verificar que la habitación existe y está activa
  const habitacion = await prisma.habitacion.findUnique({ where: { id: data.habitacionId } })
  if (!habitacion) throw new Error('Habitación no encontrada')
  if (!habitacion.activa) throw new Error('La habitación no está disponible')
  if (habitacion.estado === 'MANTENIMIENTO') throw new Error('La habitación está en mantenimiento')

  // 3. Verificar disponibilidad por fechas
  await verificarDisponibilidad(data.habitacionId, fechaEntrada, fechaSalida)

  // 4. Calcular noches y total
  const noches = calcularNoches(fechaEntrada, fechaSalida)
  if (noches < 1) throw new Error('La estadía mínima es de 1 noche')

  const totalPagar = noches * habitacion.precioNoche

  // 5. Crear la reserva con toda la información calculada
  return prisma.reserva.create({
    data: {
      huespedId: data.huespedId,
      habitacionId: data.habitacionId,
      usuarioId: data.usuarioId,
      fechaEntrada,
      fechaSalida,
      noches,
      precioNoche: habitacion.precioNoche,
      totalPagar,
      notas: data.notas,
      estado: 'PENDIENTE'
    },
    include: { huesped: true, habitacion: true }
  })
}

export async function cambiarEstadoReserva(id: string, estado: EstadoReserva) {
  const reserva = await obtenerReservaPorId(id)

  const transicionesValidas: Record<string, EstadoReserva[]> = {
    PENDIENTE: ['CONFIRMADA', 'CANCELADA'],
    CONFIRMADA: ['CHECKIN', 'CANCELADA'],
    CHECKIN: ['CHECKOUT'],
    CHECKOUT: [],
    CANCELADA: []
  }

  const estadosPermitidos = transicionesValidas[reserva.estado]
  if (!estadosPermitidos.includes(estado)) {
    throw new Error(
      `No se puede cambiar de ${reserva.estado} a ${estado}`
    )
  }
 
  if (estado === 'CHECKOUT') {
    await prisma.habitacion.update({
      where: { id: reserva.habitacionId },
      data: { estado: 'DISPONIBLE' }
    })
  }

  if (estado === 'CHECKIN') {
    await prisma.habitacion.update({
      where: { id: reserva.habitacionId },
      data: { estado: 'OCUPADA' }
    })
  }

  return prisma.reserva.update({
    where: { id },
    data: { estado },
    include: { huesped: true, habitacion: true }
  })
}

export async function cancelarReserva(id: string) {
  return cambiarEstadoReserva(id, 'CANCELADA')
}

export async function verificarDisponibilidadHabitacion(
  habitacionId: string,
  fechaEntrada: string,
  fechaSalida: string
) {
  const entrada = new Date(fechaEntrada)
  const salida = new Date(fechaSalida)

  const conflicto = await prisma.reserva.findFirst({
    where: {
      habitacionId,
      estado: { notIn: ['CANCELADA', 'CHECKOUT'] },
      AND: [
        { fechaEntrada: { lt: salida } },
        { fechaSalida: { gt: entrada } }
      ]
    }
  })

  return { disponible: !conflicto }
}