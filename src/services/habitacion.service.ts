import { prisma } from "../lib/prisma";
import { Prisma, TipoHabitacion, EstadoHabitacion } from "@prisma/client";

interface CrearHabitacionData {
  numero: string;
  piso: number;
  tipo: TipoHabitacion;
  capacidad?: number;
  tamano?: number;
  cantidadCamas?: number;
  precioNoche: number;
  descripcion?: string;
  amenidades?: string[];
  imagenes?: string[];
  tipoCama?: string;
}

interface ActualizarHabitacionData {
  numero?: string;
  piso?: number;
  tipo?: TipoHabitacion;
  capacidad?: number;
  tamano?: number;
  vista?: string;
  tipoCama?: string;
  precioNoche?: number;
  descripcion?: string;
  amenidades?: string[];
  imagenes?: string[];
  activa?: boolean;
  estado?: EstadoHabitacion;
}

export async function obtenerHabitaciones() {
  return prisma.habitacion.findMany({
    where: { activa: true },
    orderBy: [{ piso: "asc" }, { numero: "asc" }],
  });
}

export async function obtenerHabitacionPorId(id: string) {
  const habitacion = await prisma.habitacion.findUnique({ where: { id } });
  if (!habitacion) throw new Error("Habitación no encontrada");
  return habitacion;
}

export async function crearHabitacion(data: CrearHabitacionData) {
  const existe = await prisma.habitacion.findUnique({
    where: { numero: data.numero },
  });
  if (existe)
    throw new Error(`Ya existe una habitación con el número ${data.numero}`);
  return prisma.habitacion.create({ data });
}

export async function actualizarHabitacion(
  id: string,
  data: ActualizarHabitacionData,
) {
  await obtenerHabitacionPorId(id);

  if (data.numero) {
    const existe = await prisma.habitacion.findFirst({
      where: { numero: data.numero, NOT: { id } },
    });
    if (existe)
      throw new Error(`Ya existe una habitación con el número ${data.numero}`);
  }

  return prisma.habitacion.update({ where: { id }, data });
}

export async function eliminarHabitacion(id: string) {
  const habitacion = await obtenerHabitacionPorId(id);
  if (habitacion.estado !== EstadoHabitacion.DISPONIBLE) {
    throw new Error(
      "Solo se pueden eliminar habitaciones en estado DISPONIBLE",
    );
  }

  try {
    return await prisma.habitacion.delete({ where: { id } });
  } catch (error) {
    // Si hay reservas relacionadas, no se puede borrar físicamente por FK.
    // En ese caso se aplica baja lógica para mantener el historial.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return prisma.habitacion.update({
        where: { id },
        data: { activa: false },
      });
    }
    throw error;
  }
}

export async function cambiarEstadoHabitacion(
  id: string,
  estado: EstadoHabitacion,
) {
  await obtenerHabitacionPorId(id);
  return prisma.habitacion.update({ where: { id }, data: { estado } });
}
