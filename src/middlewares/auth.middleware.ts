import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  id: string
  email: string
  rol: string
  nombre: string
}

export function verificarToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ ok: false, mensaje: 'Token no proporcionado' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    req.usuario = {
      id: payload.id,
      email: payload.email,
      rol: payload.rol as any,
      nombre: payload.nombre
    }
    next()
  } catch {
    res.status(401).json({ ok: false, mensaje: 'Token inválido o expirado' })
  }
}