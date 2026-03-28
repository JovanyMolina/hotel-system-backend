import { Request, Response, NextFunction } from 'express'
import { RolUsuario } from '@prisma/client'

export function verificarRol(...rolesPermitidos: RolUsuario[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      res.status(401).json({ ok: false, mensaje: 'No autenticado' })
      return
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      res.status(403).json({ ok: false, mensaje: 'No tienes permiso para esta acción' })
      return
    }

    next()
  }
}