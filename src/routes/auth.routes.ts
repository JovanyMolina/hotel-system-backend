import { Router } from 'express'
import { registro, login } from '../controllers/auth.controller'
import { validar } from '../middlewares/validar.middleware'
import { registroSchema, loginSchema } from '../validations/auth.validation'
import { registrarAuditoria } from '../middlewares/auditoria.middleware'

const router = Router()

router.post(
  '/registro',
  validar(registroSchema),
  registrarAuditoria('auth', 'REGISTRO'),
  registro
)

router.post(
  '/login',
  validar(loginSchema),
  login
)

export default router