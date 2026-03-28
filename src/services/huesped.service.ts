import { prisma } from '../lib/prisma'

interface CrearHuespedData {
  nombre: string
  apellido: string
  email?: string | null
  telefono?: string | null
  documento?: string | null
  tipoDocumento?: string | null
  nacionalidad?: string | null
  notas?: string | null
  esVip?: boolean
}

type ActualizarHuespedData = Partial<CrearHuespedData>

async function encontrarHuespedOError(id: string) {
  const huesped = await prisma.huesped.findUnique({ where: { id } })
  if (!huesped) throw new Error('Huésped no encontrado')
  return huesped
}

export async function obtenerHuespedes(busqueda?: string) {
 
  if (busqueda) {
    return prisma.huesped.findMany({
      where: {
        OR: [
          { nombre: { contains: busqueda, mode: 'insensitive' } },
          { apellido: { contains: busqueda, mode: 'insensitive' } },
          { email: { contains: busqueda, mode: 'insensitive' } },
          { documento: { contains: busqueda, mode: 'insensitive' } }
        ]
      },
      orderBy: { creadoEn: 'desc' }
    })
  }

  return prisma.huesped.findMany({ orderBy: { creadoEn: 'desc' } })
}

export async function obtenerHuespedPorId(id: string) {
  const huesped = await encontrarHuespedOError(id)

  return prisma.huesped.findUnique({
    where: { id },
    include: {
      reservas: {
        include: { habitacion: true },
        orderBy: { creadoEn: 'desc' }
      }
    }
  })
}

export async function crearHuesped(data: CrearHuespedData) {

  if (data.email) {
    const existe = await prisma.huesped.findUnique({
      where: { email: data.email }
    })
    if (existe) throw new Error('Ya existe un huésped con ese email')
  }

  return prisma.huesped.create({ data })
}

export async function actualizarHuesped(id: string, data: ActualizarHuespedData) {
  await encontrarHuespedOError(id)

  if (data.email) {
    const existe = await prisma.huesped.findFirst({
      where: { email: data.email, NOT: { id } }
    })
    if (existe) throw new Error('Ese email ya está registrado por otro huésped')
  }

  return prisma.huesped.update({ where: { id }, data })
}

export async function eliminarHuesped(id: string) {
  await encontrarHuespedOError(id)

  const reservaActiva = await prisma.reserva.findFirst({
    where: {
      huespedId: id,
      estado: { in: ['PENDIENTE', 'CONFIRMADA', 'CHECKIN'] }
    }
  })

  if (reservaActiva) {
    throw new Error('No se puede eliminar un huésped con reservas activas')
  }

  return prisma.huesped.delete({ where: { id } })
}