import { Request, Response } from 'express'
import {
  obtenerHabitaciones,
  obtenerHabitacionPorId,
  crearHabitacion,
  actualizarHabitacion,
  eliminarHabitacion,
  cambiarEstadoHabitacion
} from '../services/habitacion.service'
import { EstadoHabitacion } from '@prisma/client'

export async function getHabitaciones(_req: Request, res: Response) {
  try {
    const habitaciones = await obtenerHabitaciones()
    res.json({ ok: true, data: habitaciones })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al obtener habitaciones'
    res.status(500).json({ ok: false, mensaje })
  }
}

export async function getHabitacion(req: Request, res: Response) {
  try {
    const habitacion = await obtenerHabitacionPorId(req.params.id as string)
    res.json({ ok: true, data: habitacion })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al obtener habitación'
    res.status(404).json({ ok: false, mensaje })
  }
}

export async function postHabitacion(req: Request, res: Response) {
  try {
    const habitacion = await crearHabitacion(req.body)
    res.status(201).json({ ok: true, mensaje: 'Habitación creada correctamente', data: habitacion })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear habitación'
    res.status(400).json({ ok: false, mensaje })
  }
}

export async function putHabitacion(req: Request, res: Response) {
  try {
    const habitacion = await actualizarHabitacion(req.params.id as string, req.body)
    res.json({ ok: true, mensaje: 'Habitación actualizada correctamente', data: habitacion })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al actualizar habitación'
    res.status(400).json({ ok: false, mensaje })
  }
}

export async function deleteHabitacion(req: Request, res: Response) {
  try {
    await eliminarHabitacion(req.params.id as string)
    res.json({ ok: true, mensaje: 'Habitación eliminada correctamente' })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al eliminar habitación'
    res.status(400).json({ ok: false, mensaje })
  }
}

export async function patchEstadoHabitacion(req: Request, res: Response) {
  try {
    const { estado } = req.body
    if (!estado) {
      res.status(400).json({ ok: false, mensaje: 'El estado es obligatorio' })
      return
    }
    const habitacion = await cambiarEstadoHabitacion(req.params.id as string, estado as EstadoHabitacion)
    res.json({ ok: true, mensaje: 'Estado actualizado correctamente', data: habitacion })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al cambiar estado'
    res.status(400).json({ ok: false, mensaje })
  }
}