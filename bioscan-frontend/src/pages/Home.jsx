import { useRef, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import Hero from '../components/Hero'
import PhotoUpload from '../components/PhotoUpload'
import Dashboard from '../components/Dashboard'
import MapView from '../components/MapView'
import SpeciesCard from '../components/SpeciesCard'
import { motion } from 'framer-motion'
import { getObservaciones } from '../services/observaciones'
import especiesReferencia from '../data/especies.json'

export default function Home() {
  const uploadRef = useRef(null)
  const [observaciones, setObservaciones] = useState(() => {
    const obs = getObservaciones()
    const ref = especiesReferencia.map((e, i) => ({ ...e, id: `ref-${i}`, fuente: e.fuente || 'UMSS-CBG' }))
    return [...obs, ...ref]
  })

  useEffect(() => {
    const refresh = () => {
      const obs = getObservaciones()
      const ref = especiesReferencia.map((e, i) => ({ ...e, id: `ref-${i}`, fuente: e.fuente || 'UMSS-CBG' }))
      setObservaciones([...obs, ...ref])
    }
    window.addEventListener('bioscan-observacion-nueva', refresh)
    return () => window.removeEventListener('bioscan-observacion-nueva', refresh)
  }, [])

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const preview = observaciones.slice(0, 6)

  return (
    <>
      <Helmet>
        <title>BioScan Cochabamba | Monitoreo de Biodiversidad</title>
        <meta name="description" content="Plataforma avanzada de visión computacional para la conservación del Cerro San Pedro." />
      </Helmet>
      <Hero onScrollToUpload={scrollToUpload} />

      <div ref={uploadRef}>
        <PhotoUpload />
      </div>

      <Dashboard />

      {/* Map section */}
      <section className="py-24 relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MapView />
        </div>
      </section>

      {/* Species preview */}
      <section className="py-24 relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-200 mb-6 tracking-tighter">
              Descubrimientos Recientes
            </h2>
            <p className="text-slate-400 font-light text-xl max-w-2xl mx-auto leading-relaxed">
              {preview.length > 0
                ? `Explora la vida silvestre documentada por la comunidad en los senderos del Cerro San Pedro.`
                : 'La galería está esperando tu primera contribución. Escanea una especie para iniciar.'}
            </p>
          </motion.div>

          {preview.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {preview.map((esp, i) => (
                <SpeciesCard key={esp.id} especie={esp} index={i} />
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center py-20 bg-[#050B07]/50 rounded-[3rem] border border-white/5 backdrop-blur-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50" />
              <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-900/50 to-transparent border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                  <span className="text-4xl opacity-70 grayscale">🍃</span>
                </div>
                <p className="text-3xl font-black text-white mb-4 tracking-tighter">El ecosistema está tranquilo</p>
                <p className="text-slate-400 mb-10 font-light text-lg max-w-md mx-auto">Sé el primero en documentar la majestuosa flora y fauna que habita nuestras montañas.</p>
                <button
                  onClick={scrollToUpload}
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-full transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] relative overflow-hidden group"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  <span className="relative z-10">Iniciar Expedición Digital</span>
                </button>
              </div>
            </motion.div>
          )}

          {preview.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-20"
            >
              <a
                href="/catalogo"
                className="inline-flex items-center gap-3 bg-white/5 border border-white/10 hover:border-emerald-500/50 text-white font-bold px-10 py-5 rounded-full transition-all hover:bg-white/10 hover:scale-105 group hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
              >
                <span>Acceder a la Galería Completa</span>
                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              </a>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10 border-t border-white/10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full bg-primary/20 blur-[150px] rounded-full opacity-50" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
          >
            <h2 className="text-5xl sm:text-7xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-emerald-200">
              Sé parte del rescate ecológico
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Cada fotografía que tomas ayuda a mapear y proteger la vida silvestre amenazada de Cochabamba. Tu contribución construye el futuro de nuestra biodiversidad.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToUpload}
              className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold px-10 py-5 rounded-full shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all uppercase tracking-widest text-sm relative overflow-hidden group"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative z-10">Realizar mi primer avistamiento</span>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
