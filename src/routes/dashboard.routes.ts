import { Router } from 'express'
import { getMetricas } from '../controllers/dashboard.controller'
import { verificarToken } from '../middlewares/auth.middleware'

const router = Router()

router.use(verificarToken)
router.get('/metricas', getMetricas)

export default router