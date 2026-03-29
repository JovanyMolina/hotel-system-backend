interface Bloqueo {
  habitacionId: string
  usuarioId: string
  usuarioNombre: string
  expiraEn: Date
  timeoutId: NodeJS.Timeout 
}

const bloqueos = new Map<string, Bloqueo>()

export function obtenerBloqueo(habitacionId: string): Bloqueo | undefined {
  const bloqueo = bloqueos.get(habitacionId)

  if (bloqueo && bloqueo.expiraEn < new Date()) {
    bloqueos.delete(habitacionId)
    return undefined
  }

  return bloqueo
}

export function crearBloqueo(
  habitacionId: string,
  usuarioId: string,
  usuarioNombre: string,
  onExpirar: (habitacionId: string) => void,
  duracionMs: number = 2 * 60 * 1000  // 2 minutos 
): Bloqueo {

    const bloqueoExistente = bloqueos.get(habitacionId)
  if (bloqueoExistente) {
    clearTimeout(bloqueoExistente.timeoutId)
  }

  const expiraEn = new Date(Date.now() + duracionMs)

  const timeoutId = setTimeout(() => {
    bloqueos.delete(habitacionId)
    onExpirar(habitacionId)
  }, duracionMs)

  const bloqueo: Bloqueo = { habitacionId, usuarioId, usuarioNombre, expiraEn, timeoutId }
  bloqueos.set(habitacionId, bloqueo)

  return bloqueo
}

export function liberarBloqueo(habitacionId: string, usuarioId: string): boolean {
  const bloqueo = bloqueos.get(habitacionId)

  if (!bloqueo || bloqueo.usuarioId !== usuarioId) return false

  clearTimeout(bloqueo.timeoutId)
  bloqueos.delete(habitacionId)
  return true
}

export function habitacionEstaBloqueada(habitacionId: string): boolean {
  return obtenerBloqueo(habitacionId) !== undefined
}

export function obtenerTodosBloqueos(): Bloqueo[] {
  return Array.from(bloqueos.values()).filter(b => b.expiraEn > new Date())
}