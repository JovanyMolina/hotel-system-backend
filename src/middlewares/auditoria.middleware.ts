import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'

export function registrarAuditoria(modulo: string, accion: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const bodyOriginal = { ...req.body }

    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          await prisma.auditLog.create({
            data: {
              usuarioId: req.usuario?.id ?? null,
              accion,
              modulo,
              descripcion: `${accion} en módulo ${modulo}`,
              datosAntes: bodyOriginal ?? undefined,
              ip: req.ip ?? null
            }
          })
        } catch (error) {
          console.error('Error al registrar auditoría:', error)
        }
      }
    })

    next()
  }
}