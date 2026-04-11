import { prisma } from '../lib/prisma'

export async function obtenerMetricas() {
  const hoy = new Date()
  const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  const finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59)
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59)

  const [
    totalHabitaciones,
    habitacionesOcupadas,
    habitacionesDisponibles,
    reservasHoy,
    checkinsPendientes,
    totalHuespedes,
    ingresosMes,
    reservasRecientes
  ] = await Promise.all([

    // Total de habitaciones activas
    prisma.habitacion.count({ where: { activa: true } }),

    // Habitaciones ocupadas ahora mismo
    prisma.habitacion.count({ where: { estado: 'OCUPADA' } }),

    // Habitaciones disponibles ahora mismo
    prisma.habitacion.count({ where: { estado: 'DISPONIBLE', activa: true } }),

    // Reservas creadas hoy
    prisma.reserva.count({
      where: { creadoEn: { gte: inicioDia, lte: finDia } }
    }),

    // Check-ins pendientes o reservas confirmadas con entrada hoy
    prisma.reserva.count({
      where: {
        estado: 'CONFIRMADA',
        fechaEntrada: { gte: inicioDia, lte: finDia }
      }
    }),

    // Total de huéspedes registrados
    prisma.huesped.count(),

    // Ingresos del mes — suma de pagos pagados este mes
    prisma.pago.aggregate({
      where: {
        estado: 'PAGADO',
        fechaPago: { gte: inicioMes, lte: finMes }
      },
      _sum: { monto: true }
    }),

    // Últimas 5 reservas para la tabla de actividad reciente
    prisma.reserva.findMany({
      take: 5,
      orderBy: { creadoEn: 'desc' },
      include: {
        huesped: { select: { nombre: true, apellido: true } },
        habitacion: { select: { numero: true, tipo: true } }
      }
    })
  ])

  return {
    habitaciones: {
      total: totalHabitaciones,
      ocupadas: habitacionesOcupadas,
      disponibles: habitacionesDisponibles,
      porcentajeOcupacion: totalHabitaciones > 0
        ? Math.round((habitacionesOcupadas / totalHabitaciones) * 100)
        : 0
    },
    reservas: {
      hoy: reservasHoy,
      checkinsPendientes
    },
    huespedes: {
      total: totalHuespedes
    },
    ingresos: {
      mes: ingresosMes._sum.monto ?? 0
    },
    reservasRecientes
  }
}