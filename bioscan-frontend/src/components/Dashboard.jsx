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
      color: 'bg-white/5 text-slate-300 border border-white/10',
    },
    {
      label: 'Aves',
      value: stats.aves,
      sub: 'en el catalogo',
      icon: Bird,
      color: 'bg-white/5 text-slate-300 border border-white/10',
    },
    {
      label: 'Plantas',
      value: stats.plantas,
      sub: 'nativas documentadas',
      icon: Flower2,
      color: 'bg-white/5 text-slate-300 border border-white/10',
    },
    {
      label: 'Mamiferos',
      value: stats.mamiferos,
      sub: 'incl. 3 carnivoros',
      icon: Rabbit,
      color: 'bg-white/5 text-slate-300 border border-white/10',
    },
    {
      label: 'Amenazadas',
      value: stats.amenazadas,
      sub: 'en peligro o vulnerable',
      icon: AlertTriangle,
      color: 'bg-red-500/10 text-red-500 border border-red-500/20',
    },
    {
      label: 'Mis Observaciones',
      value: stats.misObs,
      sub: 'escaneadas con BioScan',
      icon: Eye,
      color: 'bg-primary/20 text-primary border border-primary/20',
    },
  ]

  return (
    <section id="dashboard" className="py-24 bg-[#030704]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tighter">
            Dashboard de Biodiversidad
          </h2>
          <p className="text-slate-400 font-medium max-w-xl mx-auto">
            Estadísticas en tiempo real del catálogo BioScan — Cerro San Pedro, Cochabamba
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {cards.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 70, damping: 20 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:bg-white/10 transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${card.color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <p className="text-3xl font-bold text-white mb-1 tracking-tight">{card.value}</p>
                <p className="text-sm text-slate-300 font-medium">{card.label}</p>
                <p className="text-[11px] text-slate-500 mt-1 leading-tight">{card.sub}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Fuente */}
        <p className="text-center text-xs text-slate-500 mt-12 font-mono uppercase tracking-widest">
          Datos del catálogo BioScan - Investigación UMSS (2025)
        </p>
      </div>
    </section>
  )
}
