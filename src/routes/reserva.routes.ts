import { Router } from 'express'
import {
  getReservas,
  getReserva,
  postReserva,
  patchEstadoReserva,
  patchCancelarReserva,
  getDisponibilidad
} from '../controllers/reserva.controller'
import { verificarToken } from '../middlewares/auth.middleware'
import { verificarRol } from '../middlewares/roles.middleware'
import { validar } from '../middlewares/validar.middleware'
import { registrarAuditoria } from '../middlewares/auditoria.middleware'
import { crearReservaSchema } from '../validations/reserva.validation'

const router = Router()

router.use(verificarToken)

router.get('/disponibilidad', getDisponibilidad)

router.get('/', getReservas)
router.get('/:id', getReserva)

router.post(
  '/',
  validar(crearReservaSchema),
  registrarAuditoria('reservas', 'CREAR'),
  postReserva
)

router.patch(
  '/:id/estado',
  registrarAuditoria('reservas', 'CAMBIAR_ESTADO'),
  patchEstadoReserva
)

router.patch(
  '/:id/cancelar',
  //verificarRol('ADMIN'),
  registrarAuditoria('reservas', 'CANCELAR'),
  patchCancelarReserva
)

export default router