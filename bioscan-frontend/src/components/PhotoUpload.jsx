import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, Loader2, CheckCircle2, Leaf, BarChart3, MapPin, Shield } from 'lucide-react'
import { identificarEspecie } from '../services/api'
import { guardarObservacion, obtenerUbicacion, crearMiniatura, limpiarObservaciones } from '../services/observaciones'

export default function PhotoUpload() {
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [ubicacion, setUbicacion] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [guardadoExito, setGuardadoExito] = useState(false)
  const [showPermiso, setShowPermiso] = useState(false)
  const [permisoAceptado, setPermisoAceptado] = useState(false)
  const [obteniendoUbi, setObteniendoUbi] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
      setResultado(null)
      setGuardadoExito(false)
      setPermisoAceptado(false)
      setUbicacion(null)
      // Mostrar diálogo de permiso de ubicación
      setShowPermiso(true)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleAceptarPermiso = async () => {
    setObteniendoUbi(true)
    const loc = await obtenerUbicacion()
    setUbicacion(loc)
    setObteniendoUbi(false)
    setPermisoAceptado(true)
    setShowPermiso(false)
  }

  const handleRechazarPermiso = () => {
    setPermisoAceptado(true)
    setShowPermiso(false)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    multiple: false,
  })

  const handleIdentificar = async () => {
    if (!preview) return
    setLoading(true)
    try {
      const base64 = preview.split(',')[1]
      const result = await identificarEspecie(base64)
      setResultado(result)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setPreview(null)
    setResultado(null)
    setUbicacion(null)
    setShowModal(false)
    setGuardadoExito(false)
    setShowPermiso(false)
    setPermisoAceptado(false)
  }

  const handleIniciarGuardado = () => {
    setShowModal(true)
  }

  const handleConfirmarGuardado = async () => {
    setGuardando(true)
    try {
      const miniatura = await crearMiniatura(preview)
      const loc = ubicacion || { lat: -17.383, lng: -66.152 }
      guardarObservacion({
        nombre: resultado.nombre,
        nombre_cientifico: resultado.nombre_cientifico,
        tipo: resultado.tipo || 'otro',
        estado_conservacion: resultado.estado_conservacion || 'no evaluado',
        descripcion: resultado.descripcion,
        latitud: loc.lat,
        longitud: loc.lng,
        imagen: miniatura,
        probabilidad: resultado.probabilidad,
      })
      setShowModal(false)
      setGuardadoExito(true)
      setTimeout(() => setGuardadoExito(false), 5000)
    } catch (err) {
      console.error('Error guardando observación:', err)
    } finally {
      setGuardando(false)
    }
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'en peligro': return 'bg-red-100 text-red-700 border-red-200'
      case 'vulnerable': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'preocupacion menor': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <>
    <section id="upload" className="py-16 bg-gradient-to-b from-white to-green-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            📸 Identifica una Especie
          </h2>
          <p className="text-gray-500">
            Sube una foto de una planta o animal del Cerro San Pedro y nuestra IA la identificará
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload zone */}
          <div>
            {!preview ? (
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all h-80 flex flex-col items-center justify-center
                  ${isDragActive
                    ? 'border-primary bg-primary/5 scale-[1.02]'
                    : 'border-gray-300 hover:border-primary/50 hover:bg-green-50/50'
                  }`}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  {isDragActive ? 'Suelta la imagen aquí' : 'Arrastra una foto aquí'}
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  o haz clic para seleccionar
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Camera className="w-4 h-4" />
                  JPG, PNG, WebP — Max 10MB
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-2xl overflow-hidden shadow-lg h-80"
              >
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleReset}
                  className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors text-sm"
                >
                  ✕
                </button>
              </motion.div>
            )}

            {/* Identify button — solo si ya respondió al permiso de ubicación */}
            {preview && !resultado && permisoAceptado && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleIdentificar}
                disabled={loading}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-2xl shadow-lg shadow-green-500/25 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Identificando con IA...
                  </>
                ) : (
                  <>
                    <Leaf className="w-5 h-5" />
                    Identificar Especie
                  </>
                )}
              </motion.button>
            )}
          </div>

          {/* Result zone */}
          <AnimatePresence mode="wait">
            {resultado ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-lg border border-green-100 p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium text-primary">Especie Identificada</span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {resultado.nombre}
                </h3>
                <p className="text-sm italic text-gray-500 mb-4">
                  {resultado.nombre_cientifico}
                </p>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    <BarChart3 className="w-4 h-4" />
                    {resultado.probabilidad}% confianza
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(resultado.estado_conservacion)}`}>
                    {resultado.estado_conservacion}
                  </span>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {resultado.descripcion}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 border-2 border-gray-200 hover:border-primary text-gray-700 hover:text-primary font-medium rounded-xl transition-all text-sm"
                  >
                    Otra foto
                  </button>
                  <button
                    onClick={handleIniciarGuardado}
                    disabled={guardadoExito}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary/10 text-primary font-medium rounded-xl hover:bg-primary/20 transition-all text-sm disabled:opacity-50"
                  >
                    <MapPin className="w-4 h-4" />
                    {guardadoExito ? '✓ Guardado' : 'Guardar Observación'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-8"
              >
                <Leaf className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-400 text-center">
                  {preview
                    ? 'Haz clic en "Identificar Especie" para ver el resultado'
                    : 'Sube una foto para empezar la identificación'
                  }
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>

      {/* Diálogo de permiso de geolocalización */}
      <AnimatePresence>
        {showPermiso && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Acceso a la Ubicación
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                BioScan necesita acceder a tu ubicación para registrar las coordenadas GPS
                de la observación. Esto permite mapear la biodiversidad del Cerro San Pedro.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleRechazarPermiso}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all text-sm"
                >
                  No permitir
                </button>
                <button
                  onClick={handleAceptarPermiso}
                  disabled={obteniendoUbi}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-all text-sm disabled:opacity-50"
                >
                  {obteniendoUbi ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Obteniendo...</>
                  ) : (
                    <><MapPin className="w-4 h-4" /> Permitir</>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de confirmación de guardado */}
      <AnimatePresence>
        {showModal && resultado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                Guardar Observación
              </h3>

              <div className="bg-green-50 rounded-xl p-4 mb-4">
                <p className="font-semibold text-gray-900">{resultado.nombre}</p>
                <p className="text-sm italic text-gray-500">{resultado.nombre_cientifico}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {resultado.probabilidad}% confianza
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                    {resultado.tipo}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">📍 Ubicación</p>
                {ubicacion ? (
                  <p className="text-xs text-gray-500">
                    Lat: {ubicacion.lat.toFixed(6)}, Lng: {ubicacion.lng.toFixed(6)}
                    {ubicacion.precision && ` (±${Math.round(ubicacion.precision)}m)`}
                  </p>
                ) : (
                  <p className="text-xs text-amber-600">
                    ⚠️ Ubicación no disponible. Se usará Cerro San Pedro como referencia.
                  </p>
                )}
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-6">
                <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  Confirma que la identificación es correcta. Los datos se guardarán como observación
                  ciudadana y aparecerán en el mapa y catálogo de BioScan.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarGuardado}
                  disabled={guardando}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-all text-sm disabled:opacity-50"
                >
                  {guardando ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {guardando ? 'Guardando...' : 'Confirmar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast de éxito */}
      <AnimatePresence>
        {guardadoExito && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium text-sm">Observación guardada — visible en Mapa y Catálogo</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
