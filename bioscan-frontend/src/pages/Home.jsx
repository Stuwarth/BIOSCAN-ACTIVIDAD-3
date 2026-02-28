import { useRef, useState, useEffect } from 'react'
import Hero from '../components/Hero'
import PhotoUpload from '../components/PhotoUpload'
import Dashboard from '../components/Dashboard'
import MapView from '../components/MapView'
import SpeciesCard from '../components/SpeciesCard'
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
      <Hero onScrollToUpload={scrollToUpload} />

      <div ref={uploadRef}>
        <PhotoUpload />
      </div>

      <Dashboard />

      {/* Map section */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MapView />
        </div>
      </section>

      {/* Species preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              📋 Especies del Cerro San Pedro
            </h2>
            <p className="text-gray-500">
              {preview.length > 0
                ? `${preview.length} especies documentadas y observadas en el Cerro San Pedro`
                : 'Escanea una especie y guárdala para que aparezca aquí'}
            </p>
          </div>

          {preview.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {preview.map((esp, i) => (
                <SpeciesCard key={esp.id} especie={esp} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg font-semibold text-gray-700 mb-2">Aún no hay observaciones</p>
              <p className="text-gray-500 mb-6">Sé el primero en escanear una especie del Cerro San Pedro</p>
              <button
                onClick={scrollToUpload}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-2xl transition-all"
              >
                📸 Escanear ahora
              </button>
            </div>
          )}

          {preview.length > 0 && (
            <div className="text-center mt-10">
              <a
                href="/catalogo"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-2xl shadow-lg shadow-green-500/25 transition-all hover:scale-105"
              >
                Ver todo el catálogo →
              </a>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ayuda a proteger la biodiversidad de Cochabamba
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Cada foto que subes alimenta nuestra base de datos y ayuda a monitorear el estado del Cerro San Pedro.
            Sé parte de la ciencia ciudadana.
          </p>
          <button
            onClick={scrollToUpload}
            className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition-all"
          >
            📸 Empezar a Escanear
          </button>
        </div>
      </section>
    </>
  )
}
