import { Router } from 'express'
import {
  getHuespedes,
  getHuesped,
  postHuesped,
  putHuesped,
  deleteHuesped
} from '../controllers/huesped.controller'
import { verificarToken } from '../middlewares/auth.middleware'
import { verificarRol } from '../middlewares/roles.middleware'
import { validar } from '../middlewares/validar.middleware'
import { registrarAuditoria } from '../middlewares/auditoria.middleware'
import { crearHuespedSchema, actualizarHuespedSchema } from '../validations/huesped.validation'

const router = Router()

router.use(verificarToken)

router.get('/', getHuespedes)
router.get('/:id', getHuesped)

router.post(
  '/',
  validar(crearHuespedSchema),
  registrarAuditoria('huespedes', 'CREAR'),
  postHuesped
)

router.put(
  '/:id',
  validar(actualizarHuespedSchema),
  registrarAuditoria('huespedes', 'ACTUALIZAR'),
  putHuesped
)

router.delete(
  '/:id',
  verificarRol('ADMIN'),      
  registrarAuditoria('huespedes', 'ELIMINAR'),
  deleteHuesped
)

export default router