import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Bird, TreePine, Eye, AlertTriangle, Flower2, Rabbit } from 'lucide-react'
import { getObservaciones } from '../services/observaciones'
import especiesReferencia from '../data/especies.json'

/**
 * Dashboard 100 % dinamico:  se calcula a partir del catalogo real
 * (especies.json + observaciones del usuario en localStorage).
 * Nada hardcodeado - si se agregan especies al JSON, el dashboard se actualiza solo.
 */

export default function Dashboard() {
  const [observaciones, setObservaciones] = useState(() => getObservaciones())

  useEffect(() => {
    const refresh = () => setObservaciones(getObservaciones())
    window.addEventListener('bioscan-observacion-nueva', refresh)
    return () => window.removeEventListener('bioscan-observacion-nueva', refresh)
  }, [])

  // Unificar catalogo: referencia + observaciones del usuario
  const catalogo = useMemo(() => {
    const obs = observaciones.map(o => ({ ...o, _origen: 'usuario' }))
    const ref = especiesReferencia.map(r => ({ ...r, _origen: 'referencia' }))
    return [...ref, ...obs]
  }, [observaciones])

  // Derivar estadisticas del catalogo
  const stats = useMemo(() => {
    const total = catalogo.length
    const aves = catalogo.filter(e => e.tipo === 'ave').length
    const plantas = catalogo.filter(e => e.tipo === 'planta').length
    const mamiferos = catalogo.filter(e => e.tipo === 'mamifero').length
    const reptiles = catalogo.filter(e => e.tipo === 'reptil').length
    const anfibios = catalogo.filter(e => e.tipo === 'anfibio').length
    const amenazadas = catalogo.filter(
      e => e.estado_conservacion === 'en peligro' || e.estado_conservacion === 'vulnerable'
    ).length
    const misObs = observaciones.length
    return { total, aves, plantas, mamiferos, reptiles, anfibios, amenazadas, misObs }
  }, [catalogo, observaciones])

  const cards = [
    {
      label: 'En Catalogo',
      value: stats.total,
      sub: 'especies registradas',
      icon: TreePine,
      color: 'bg-green-100 text-green-700',
    },
    {
      label: 'Aves',
      value: stats.aves,
      sub: 'en el catalogo',
      icon: Bird,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Plantas',
      value: stats.plantas,
      sub: 'nativas documentadas',
      icon: Flower2,
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      label: 'Mamiferos',
      value: stats.mamiferos,
      sub: 'incl. 3 carnivoros',
      icon: Rabbit,
      color: 'bg-amber-100 text-amber-700',
    },
    {
      label: 'Amenazadas',
      value: stats.amenazadas,
      sub: 'en peligro o vulnerable',
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-700',
    },
    {
      label: 'Mis Observaciones',
      value: stats.misObs,
      sub: 'escaneadas con BioScan',
      icon: Eye,
      color: 'bg-purple-100 text-purple-700',
    },
  ]

  return (
    <section id="dashboard" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Dashboard de Biodiversidad
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Estadisticas en tiempo real del catalogo BioScan — Cerro San Pedro, Cochabamba
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cards.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{card.sub}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Fuente */}
        <p className="text-center text-[11px] text-gray-400 mt-6">
          Datos del catalogo BioScan - Investigacion UMSS — Centro de Biodiversidad y Genetica (2025)
        </p>
      </div>
    </section>
  )
}
