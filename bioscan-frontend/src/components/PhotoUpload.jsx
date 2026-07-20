import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { Camera, Upload, Loader2, CheckCircle2, Leaf, BarChart3, MapPin, Shield, Scan } from 'lucide-react'
import { toast } from 'sonner'
import { identificarEspecie } from '../services/api'
import { guardarObservacion, obtenerUbicacion, crearMiniatura, limpiarObservaciones } from '../services/observaciones'
import { cn } from '../lib/utils'
import gsap from 'gsap'

const springTransition = { type: "spring", stiffness: 70, damping: 20, mass: 1.2 }

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

  // Físicas 3D para la caja de arrastre
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-200, 200], [15, -15])
  const rotateY = useTransform(mouseX, [-200, 200], [-15, 15])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  // Laser GSAP Effect
  useEffect(() => {
    if (preview && !resultado) {
      let ctx = gsap.context(() => {
        gsap.fromTo(".laser-line", 
          { y: 0 },
          { y: 310, duration: 1.5, yoyo: true, repeat: -1, ease: "sine.inOut" }
        )
      })
      return () => ctx.revert()
    }
  }, [preview, resultado])

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
      toast.success('Observación guardada', {
        description: 'Visible en Mapa y Catálogo'
      })
      setTimeout(() => setGuardadoExito(false), 5000)
    } catch (err) {
      console.error('Error guardando observación:', err)
      toast.error('Error al guardar', { description: 'Inténtalo de nuevo' })
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
    <section id="upload" className="py-24 bg-[#030704] relative">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springTransition}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tighter">
            Análisis Taxonómico Visual
          </h2>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto">
            Procesamiento de visión computacional en tiempo real para especies del Cerro San Pedro
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload zone */}
          <div>
            {!preview ? (
              <motion.div
                {...getRootProps()}
                style={{ rotateX, rotateY, transformPerspective: 1000 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative border border-dashed rounded-3xl p-8 text-center cursor-pointer transition-colors duration-300 h-80 flex flex-col items-center justify-center backdrop-blur-md shadow-2xl",
                  isDragActive
                    ? "border-primary bg-primary/10 shadow-[0_0_50px_rgba(22,163,74,0.3)]"
                    : "border-white/20 bg-white/5 hover:border-primary/50 hover:bg-white/10"
                )}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-semibold text-white mb-2">
                  {isDragActive ? 'Suelta la imagen aquí' : 'Arrastra una foto aquí'}
                </p>
                <p className="text-sm text-slate-400 mb-6">
                  o haz clic para explorar tus archivos
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <Camera className="w-4 h-4" />
                  JPG, PNG, WEBP (MAX 10MB)
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                className="relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(22,163,74,0.1)] h-80 perspective-1000"
              >
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                
                {/* Laser de Escaneo Activo */}
                {!resultado && (
                  <>
                    <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
                    <div className="laser-line absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_15px_#16a34a] z-20" />
                    <div className="absolute inset-0 border-2 border-primary/50 rounded-2xl animate-pulse pointer-events-none z-10" />
                  </>
                )}

                <button
                  onClick={handleReset}
                  className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors text-sm z-30"
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
                    <Scan className="w-5 h-5 animate-pulse" />
                    Procesando Análisis Visual...
                  </>
                ) : (
                  <>
                    <Scan className="w-5 h-5" />
                    Ejecutar Algoritmo de Visión
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
                transition={springTransition}
                className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 flex flex-col h-full"
              >
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">Análisis Completado</span>
                </div>

                <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">
                  {resultado.nombre}
                </h3>
                <p className="text-sm italic text-slate-400 mb-6 font-serif">
                  {resultado.nombre_cientifico}
                </p>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1.5 bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20">
                    <BarChart3 className="w-4 h-4" />
                    {resultado.probabilidad}% confianza
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(resultado.estado_conservacion)} bg-opacity-10 backdrop-blur-sm`}>
                    {resultado.estado_conservacion}
                  </span>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-8 flex-grow">
                  {resultado.descripcion}
                </p>

                <div className="flex gap-4 mt-auto">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-4 border border-white/20 hover:bg-white/5 text-white font-medium rounded-2xl transition-all text-sm backdrop-blur-md"
                  >
                    Nuevo Análisis
                  </button>
                  <button
                    onClick={handleIniciarGuardado}
                    disabled={guardadoExito}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-2xl shadow-lg shadow-primary/20 transition-all text-sm disabled:opacity-50"
                  >
                    <MapPin className="w-4 h-4" />
                    {guardadoExito ? 'Registro Guardado' : 'Guardar Observación'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full bg-white/5 backdrop-blur-md rounded-3xl border border-dashed border-white/10 p-8"
              >
                <Leaf className="w-12 h-12 text-slate-600 mb-4 opacity-50" />
                <p className="text-slate-500 text-center font-medium">
                  {preview
                    ? 'Ejecutando modelo de visión computacional...'
                    : 'Esperando imagen para análisis taxonómico'
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
              className="relative bg-[#030704] border border-white/10 rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center backdrop-blur-xl"
            >
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Acceso a Telemetría GPS
              </h3>
              <p className="text-sm text-slate-400 mb-8 font-light leading-relaxed">
                El sistema requiere coordenadas geográficas para procesar la observación y mapear la biodiversidad de manera precisa en la red de datos.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleRechazarPermiso}
                  className="flex-1 py-3 border border-white/20 text-slate-300 font-medium rounded-2xl hover:bg-white/5 hover:text-white transition-all text-sm"
                >
                  Denegar
                </button>
                <button
                  onClick={handleAceptarPermiso}
                  disabled={obteniendoUbi}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all text-sm disabled:opacity-50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  {obteniendoUbi ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Adquiriendo</>
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
              className="relative bg-[#030704] border border-white/10 rounded-3xl shadow-2xl max-w-md w-full p-8 backdrop-blur-xl"
            >
              <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-primary" />
                Registrar Observación
              </h3>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 backdrop-blur-sm">
                <p className="font-bold text-white text-lg">{resultado.nombre}</p>
                <p className="text-sm italic text-slate-400 font-serif mb-4">{resultado.nombre_cientifico}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full font-medium">
                    {resultado.probabilidad}% Confianza
                  </span>
                  <span className="text-xs bg-white/10 text-slate-300 border border-white/10 px-3 py-1 rounded-full capitalize font-medium">
                    {resultado.tipo}
                  </span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 backdrop-blur-sm">
                <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Coordenadas de Origen</p>
                {ubicacion ? (
                  <p className="text-sm text-slate-300 font-mono bg-black/30 p-2 rounded-lg">
                    LAT: {ubicacion.lat.toFixed(6)} | LNG: {ubicacion.lng.toFixed(6)}
                    {ubicacion.precision && ` (±${Math.round(ubicacion.precision)}m)`}
                  </p>
                ) : (
                  <p className="text-xs text-amber-500 font-medium">
                    Telemetría no disponible. Se asignará punto de referencia predeterminado.
                  </p>
                )}
              </div>

              <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl mb-8">
                <Shield className="w-6 h-6 text-amber-500 flex-shrink-0" />
                <p className="text-xs text-amber-200/80 leading-relaxed font-light">
                  Confirma que el análisis es preciso. Los metadatos formarán parte del repositorio de conservación a nivel plataforma.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 border border-white/20 text-slate-300 font-medium rounded-2xl hover:bg-white/5 hover:text-white transition-all text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarGuardado}
                  disabled={guardando}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all text-sm disabled:opacity-50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  {guardando ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  {guardando ? 'Procesando' : 'Confirmar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  )
}
