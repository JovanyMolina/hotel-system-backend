import { Router } from 'express'
import {
  getHabitaciones,
  getHabitacion,
  postHabitacion,
  putHabitacion,
  deleteHabitacion,
  patchEstadoHabitacion
} from '../controllers/habitacion.controller'
import { verificarToken } from '../middlewares/auth.middleware'
import { verificarRol } from '../middlewares/roles.middleware'
import { validar } from '../middlewares/validar.middleware'
import { registrarAuditoria } from '../middlewares/auditoria.middleware'
import { crearHabitacionSchema, actualizarHabitacionSchema } from '../validations/habitacion.validation'

const router = Router()

// Todas las rutas requieren token
router.use(verificarToken)

// GET — cualquier rol autenticado puede ver habitaciones
router.get('/', getHabitaciones)
router.get('/:id', getHabitacion)

// POST, PUT, DELETE — solo ADMIN
router.post(
  '/',
  verificarRol('ADMIN'),
  validar(crearHabitacionSchema),
  registrarAuditoria('habitaciones', 'CREAR'),
  postHabitacion
)

router.put(
  '/:id',
  verificarRol('ADMIN'),
  validar(actualizarHabitacionSchema),
  registrarAuditoria('habitaciones', 'ACTUALIZAR'),
  putHabitacion
)

router.delete(
  '/:id',
  verificarRol('ADMIN'),
  registrarAuditoria('habitaciones', 'ELIMINAR'),
  deleteHabitacion
)

router.patch(
  '/:id/estado',
  verificarRol('ADMIN'),
  registrarAuditoria('habitaciones', 'CAMBIAR_ESTADO'),
  patchEstadoHabitacion
)

export default router