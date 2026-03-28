import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'
import { RolUsuario } from '@prisma/client'

interface RegistroData {
  nombre: string
  email: string
  password: string
  rol?: RolUsuario
}

interface LoginData {
  email: string
  password: string
}

function generarToken(usuario: { id: string; email: string; rol: RolUsuario; nombre: string }) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol, nombre: usuario.nombre },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN as any || '7d' }
  )
}

export async function registrarUsuario(data: RegistroData) {
  const existe = await prisma.usuario.findUnique({ where: { email: data.email } })
  if (existe) throw new Error('El email ya está registrado')

  const passwordHash = await bcrypt.hash(data.password, 12)

  const usuario = await prisma.usuario.create({
    data: {
      nombre: data.nombre,
      email: data.email,
      password: passwordHash,
      rol: data.rol ?? 'RECEPCIONISTA'
    },
    select: { id: true, nombre: true, email: true, rol: true, creadoEn: true }
  })

  const token = generarToken({ id: usuario.id, email: usuario.email, rol: usuario.rol, nombre: usuario.nombre })
  return { usuario, token }
}

export async function loginUsuario(data: LoginData) {
  const usuario = await prisma.usuario.findUnique({ where: { email: data.email } })
  if (!usuario || !usuario.activo) throw new Error('Credenciales incorrectas')

  const passwordValida = await bcrypt.compare(data.password, usuario.password)
  if (!passwordValida) throw new Error('Credenciales incorrectas')

  const token = generarToken({ id: usuario.id, email: usuario.email, rol: usuario.rol, nombre: usuario.nombre })

  const { password: _, ...usuarioSinPassword } = usuario
  return { usuario: usuarioSinPassword, token }
}