import { Request, Response } from 'express'
import {
  obtenerHuespedes,
  obtenerHuespedPorId,
  crearHuesped,
  actualizarHuesped,
  eliminarHuesped
} from '../services/huesped.service'

export async function getHuespedes(req: Request, res: Response) {
  try {
    const busqueda = req.query.busqueda as string | undefined
    const huespedes = await obtenerHuespedes(busqueda)
    res.json({ ok: true, data: huespedes })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al obtener huéspedes'
    res.status(500).json({ ok: false, mensaje })
  }
}

export async function getHuesped(req: Request, res: Response) {
  try {
    const huesped = await obtenerHuespedPorId(req.params.id as string)
    res.json({ ok: true, data: huesped })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al obtener huésped'
    res.status(404).json({ ok: false, mensaje })
  }
}

export async function postHuesped(req: Request, res: Response) {
  try {
    const huesped = await crearHuesped(req.body)
    res.status(201).json({
      ok: true,
      mensaje: 'Huésped registrado correctamente',
      data: huesped
    })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear huésped'
    res.status(400).json({ ok: false, mensaje })
  }
}

export async function putHuesped(req: Request, res: Response) {
  try {
    const huesped = await actualizarHuesped(req.params.id as string, req.body)
    res.json({
      ok: true,
      mensaje: 'Huésped actualizado correctamente',
      data: huesped
    })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al actualizar huésped'
    res.status(400).json({ ok: false, mensaje })
  }
}

export async function deleteHuesped(req: Request, res: Response) {
  try {
    await eliminarHuesped(req.params.id as string)
    res.json({ ok: true, mensaje: 'Huésped eliminado correctamente' })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al eliminar huésped'
    res.status(400).json({ ok: false, mensaje })
  }
}