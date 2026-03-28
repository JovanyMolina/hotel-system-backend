import { prisma } from '../lib/prisma'
import { TipoHabitacion, EstadoHabitacion } from '@prisma/client'

interface CrearHabitacionData {
  numero: string
  piso: number
  tipo: TipoHabitacion
  capacidad?: number
  precioNoche: number
  descripcion?: string
  amenidades?: string[]
  imagenes?: string[]
}

interface ActualizarHabitacionData {
  numero?: string
  piso?: number
  tipo?: TipoHabitacion
  capacidad?: number
  precioNoche?: number
  descripcion?: string
  amenidades?: string[]
  imagenes?: string[]
  activa?: boolean
  estado?: EstadoHabitacion
}

export async function obtenerHabitaciones() {
  return prisma.habitacion.findMany({
    orderBy: [{ piso: 'asc' }, { numero: 'asc' }]
  })
}

export async function obtenerHabitacionPorId(id: string) {
  const habitacion = await prisma.habitacion.findUnique({ where: { id } })
  if (!habitacion) throw new Error('Habitación no encontrada')
  return habitacion
}

export async function crearHabitacion(data: CrearHabitacionData) {
  const existe = await prisma.habitacion.findUnique({ where: { numero: data.numero } })
  if (existe) throw new Error(`Ya existe una habitación con el número ${data.numero}`)

  return prisma.habitacion.create({ data })
}

export async function actualizarHabitacion(id: string, data: ActualizarHabitacionData) {
  await obtenerHabitacionPorId(id)

  if (data.numero) {
    const existe = await prisma.habitacion.findFirst({
      where: { numero: data.numero, NOT: { id } }
    })
    if (existe) throw new Error(`Ya existe una habitación con el número ${data.numero}`)
  }

  return prisma.habitacion.update({ where: { id }, data })
}

export async function eliminarHabitacion(id: string) {
  await obtenerHabitacionPorId(id)

  const tieneReservas = await prisma.reserva.findFirst({ where: { habitacionId: id } })
  if (tieneReservas) throw new Error('No se puede eliminar una habitación con reservas activas')

  return prisma.habitacion.delete({ where: { id } })
}

export async function cambiarEstadoHabitacion(id: string, estado: EstadoHabitacion) {
  await obtenerHabitacionPorId(id)
  return prisma.habitacion.update({ where: { id }, data: { estado } })
}