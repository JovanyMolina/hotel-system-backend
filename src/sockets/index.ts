import { Server as HttpServer } from 'http'
import { Server as SocketServer, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import {
  crearBloqueo,
  liberarBloqueo,
  obtenerBloqueo,
  habitacionEstaBloqueada,
  obtenerTodosBloqueos
} from './bloqueos'

interface UsuarioSocket {
  id: string
  nombre: string
  email: string
  rol: string
}

interface SocketAutenticado extends Socket {
  usuario?: UsuarioSocket
}

export function iniciarSockets(httpServer: HttpServer) {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    }
  })

  io.use((socket: SocketAutenticado, next) => {
    const token = socket.handshake.auth?.token

    if (!token) {
      return next(new Error('Token no proporcionado'))
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as UsuarioSocket
      socket.usuario = payload
      next()
    } catch {
      next(new Error('Token inválido'))
    }
  })

  io.on('connection', (socket: SocketAutenticado) => {
    console.log(`Socket conectado: ${socket.usuario?.nombre} (${socket.id})`)

    socket.emit('bloqueos:sincronizar', obtenerTodosBloqueos().map(b => ({
      habitacionId: b.habitacionId,
      usuarioNombre: b.usuarioNombre,
      expiraEn: b.expiraEn
    })))

    // EVENTO: bloquear habitación
    // El frontend emite esto cuando el usuario inicia el proceso de reserva
    socket.on('habitacion:bloquear', ({ habitacionId }: { habitacionId: string }) => {
      if (!socket.usuario) return

      const bloqueoActual = obtenerBloqueo(habitacionId)
      if (bloqueoActual && bloqueoActual.usuarioId !== socket.usuario.id) {
        socket.emit('habitacion:error', {
          habitacionId,
          mensaje: `La habitación está siendo procesada por ${bloqueoActual.usuarioNombre}`
        })
        return
      }

      const bloqueo = crearBloqueo(
        habitacionId,
        socket.usuario.id,
        socket.usuario.nombre,
        (hId) => {
          io.emit('habitacion:liberada', { habitacionId: hId, motivo: 'timeout' })
          console.log(`Bloqueo expirado: habitación ${hId}`)
        }
      )

      io.emit('habitacion:bloqueada', {
        habitacionId,
        usuarioNombre: socket.usuario.nombre,
        expiraEn: bloqueo.expiraEn
      })

      console.log(`Habitación ${habitacionId} bloqueada por ${socket.usuario.nombre}`)
    })

    // EVENTO: liberar habitación manualmente
    // El frontend emite esto cuando el usuario cancela el proceso
    socket.on('habitacion:liberar', ({ habitacionId }: { habitacionId: string }) => {
      if (!socket.usuario) return

      const liberada = liberarBloqueo(habitacionId, socket.usuario.id)

      if (liberada) {
        io.emit('habitacion:liberada', { habitacionId, motivo: 'manual' })
        console.log(`Habitación ${habitacionId} liberada por ${socket.usuario.nombre}`)
      }
    })

    //notificar reserva creada satisfactoriamente
    socket.on('reserva:completada', ({ habitacionId }: { habitacionId: string }) => {
      if (!socket.usuario) return

      liberarBloqueo(habitacionId, socket.usuario.id)

      io.emit('habitacion:confirmada', { habitacionId })
    })

    // EVENTO: desconexión 
    // Si el usuario se desconecta, liberamos sus bloqueos
    socket.on('disconnect', () => {
      if (!socket.usuario) return

      const todosBloqueos = obtenerTodosBloqueos()
      todosBloqueos.forEach(bloqueo => {
        if (bloqueo.usuarioId === socket.usuario!.id) {
          liberarBloqueo(bloqueo.habitacionId, socket.usuario!.id)
          io.emit('habitacion:liberada', {
            habitacionId: bloqueo.habitacionId,
            motivo: 'desconexion'
          })
        }
      })

      console.log(`Socket desconectado: ${socket.usuario.nombre}`)
    })
  })

  return io
}