/**
 * ===================================================================
 * observaciones.js — Servicio de observaciones ciudadanas
 * ===================================================================
 *
 * Almacena las especies escaneadas y confirmadas por los usuarios.
 * Usa localStorage como almacén local (en producción sería una BD).
 *
 * Cada observación incluye:
 *   - Datos de la especie identificada por IA
 *   - Geolocalización del dispositivo
 *   - Fecha y hora del registro
 *   - Miniatura de la foto original
 */

const STORAGE_KEY = 'bioscan_observaciones'

// ── Leer todas las observaciones ─────────────────────────────────
export function getObservaciones() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

// ── Guardar una nueva observación ────────────────────────────────
export function guardarObservacion(observacion) {
  const obs = getObservaciones()
  const nueva = {
    id: Date.now(),
    nombre_comun: observacion.nombre,
    nombre_cientifico: observacion.nombre_cientifico,
    tipo: observacion.tipo || 'otro',
    estado_conservacion: observacion.estado_conservacion || 'no evaluado',
    descripcion: observacion.descripcion || '',
    latitud: observacion.latitud,
    longitud: observacion.longitud,
    imagen: observacion.imagen || null,
    probabilidad: observacion.probabilidad || 0,
    fecha: new Date().toISOString().split('T')[0],
    fuente: 'bioscan',
  }
  obs.unshift(nueva) // más reciente primero
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obs))

  // Notificar a todos los componentes que escuchen
  window.dispatchEvent(new Event('bioscan-observacion-nueva'))

  return nueva
}

// ── Eliminar una observación ─────────────────────────────────────
export function eliminarObservacion(id) {
  const obs = getObservaciones().filter((o) => o.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obs))
  window.dispatchEvent(new Event('bioscan-observacion-nueva'))
}

// ── Limpiar todas las observaciones ──────────────────────────────
export function limpiarObservaciones() {
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event('bioscan-observacion-nueva'))
}

// ── Obtener geolocalización del dispositivo ──────────────────────
export function obtenerUbicacion() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          precision: pos.coords.accuracy,
        }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })
}

// ── Crear miniatura para almacenamiento eficiente ────────────────
// Redimensiona la imagen a max 400px de ancho, compresión JPEG 70%
// Esto evita llenar localStorage con imágenes grandes
export function crearMiniatura(base64, maxAncho = 400) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const ratio = maxAncho / img.width
      const canvas = document.createElement('canvas')
      canvas.width = maxAncho
      canvas.height = Math.round(img.height * ratio)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.onerror = () => resolve(null)
    img.src = base64
  })
}
