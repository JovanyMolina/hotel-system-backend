import { Request, Response } from 'express'
import { registrarUsuario, loginUsuario } from '../services/auth.service'

export async function registro(req: Request, res: Response) {
  try {
    const resultado = await registrarUsuario(req.body)
    res.status(201).json({ ok: true, mensaje: 'Usuario registrado correctamente', data: resultado })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al registrar usuario'
    res.status(400).json({ ok: false, mensaje })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const resultado = await loginUsuario(req.body)
    res.status(200).json({ ok: true, mensaje: 'Login exitoso', data: resultado })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al iniciar sesión'
    res.status(401).json({ ok: false, mensaje })
  }
}