import { Request, Response } from 'express'
import { obtenerMetricas } from '../services/dashboard.service'

export async function getMetricas(_req: Request, res: Response) {
  try {
    const metricas = await obtenerMetricas()
    res.json({ ok: true, data: metricas })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al obtener métricas'
    res.status(500).json({ ok: false, mensaje })
  }
}