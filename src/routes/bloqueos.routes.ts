import { Router } from 'express'
import { verificarToken } from '../middlewares/auth.middleware'
import { obtenerTodosBloqueos, habitacionEstaBloqueada } from '../sockets/bloqueos'

const router = Router()

router.use(verificarToken)

// Consultar todos los bloqueos activos
router.get('/', (_req, res) => {
  const bloqueos = obtenerTodosBloqueos().map(b => ({
    habitacionId: b.habitacionId,
    usuarioNombre: b.usuarioNombre,
    expiraEn: b.expiraEn
  }))
  res.json({ ok: true, data: bloqueos })
})

// Consultar si una habitación específica está bloqueada
router.get('/:habitacionId', (req, res) => {
  const bloqueada = habitacionEstaBloqueada(req.params.habitacionId)
  const bloqueo = bloqueada
    ? obtenerTodosBloqueos().find(b => b.habitacionId === req.params.habitacionId)
    : null

  res.json({
    ok: true,
    data: {
      bloqueada,
      ...(bloqueo ? { usuarioNombre: bloqueo.usuarioNombre, expiraEn: bloqueo.expiraEn } : {})
    }
  })
})

export default router