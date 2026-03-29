import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import authRoutes from './routes/auth.routes'
import habitacionRoutes from './routes/habitacion.routes'
import huespedRoutes from './routes/huesped.routes'
import reservaRoutes from './routes/reserva.routes'


dotenv.config()

const app = express()
const httpServer = createServer(app)

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/habitaciones', habitacionRoutes)
app.use('/api/huespedes', huespedRoutes)
app.use('/api/reservas', reservaRoutes)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Hotel System API corriendo' })
})

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT} `)
})

export { httpServer }
export default app