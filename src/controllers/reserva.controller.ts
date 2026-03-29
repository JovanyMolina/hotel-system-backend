import { Request, Response } from 'express'
import {
  obtenerReservas,
  obtenerReservaPorId,
  crearReserva,
  cambiarEstadoReserva,
  cancelarReserva,
  verificarDisponibilidadHabitacion
} from '../services/reserva.service'
import { EstadoReserva } from '@prisma/client'

export async function getReservas(req: Request, res: Response) {
  try {
    const { estado, huespedId, habitacionId } = req.query
    const reservas = await obtenerReservas({
      ...(estado ? { estado: estado as EstadoReserva } : {}),
      ...(huespedId ? { huespedId: huespedId as string } : {}),
      ...(habitacionId ? { habitacionId: habitacionId as string } : {})
    })
    res.json({ ok: true, data: reservas })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al obtener reservas'
    res.status(500).json({ ok: false, mensaje })
  }
}

export async function getReserva(req: Request, res: Response) {
  try {
    const reserva = await obtenerReservaPorId(req.params.id as string)
    res.json({ ok: true, data: reserva })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al obtener reserva'
    res.status(404).json({ ok: false, mensaje })
  }
}

export async function postReserva(req: Request, res: Response) {
  try {
    const reserva = await crearReserva({
      ...req.body,
      usuarioId: req.usuario!.id  
    })
    res.status(201).json({
      ok: true,
      mensaje: 'Reserva creada correctamente',
      data: reserva
    })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear reserva'
    res.status(400).json({ ok: false, mensaje })
  }
}

export async function patchEstadoReserva(req: Request, res: Response) {
  try {
    const { estado } = req.body
    if (!estado) {
      res.status(400).json({ ok: false, mensaje: 'El estado es obligatorio' })
      return
    }
    const reserva = await cambiarEstadoReserva(req.params.id as string, estado as EstadoReserva)
    res.json({ ok: true, mensaje: 'Estado actualizado correctamente', data: reserva })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al cambiar estado'
    res.status(400).json({ ok: false, mensaje })
  }
}

export async function patchCancelarReserva(req: Request, res: Response) {
  try {
    const reserva = await cancelarReserva(req.params.id as string)
    res.json({ ok: true, mensaje: 'Reserva cancelada', data: reserva })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al cancelar reserva'
    res.status(400).json({ ok: false, mensaje })
  }
}

export async function getDisponibilidad(req: Request, res: Response) {
  try {
    const { habitacionId, fechaEntrada, fechaSalida } = req.query
    if (!habitacionId || !fechaEntrada || !fechaSalida) {
      res.status(400).json({ ok: false, mensaje: 'Faltan parámetros' })
      return
    }
    const resultado = await verificarDisponibilidadHabitacion(
      habitacionId as string,
      fechaEntrada as string,
      fechaSalida as string
    )
    res.json({ ok: true, data: resultado })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al verificar disponibilidad'
    res.status(500).json({ ok: false, mensaje })
  }
}