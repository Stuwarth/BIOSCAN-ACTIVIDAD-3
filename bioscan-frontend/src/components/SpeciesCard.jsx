import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'

export default function SpeciesCard({ especie, index = 0 }) {
  const getEstadoStyle = (estado) => {
    switch (estado) {
      case 'en peligro': 
        return 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
      case 'vulnerable': 
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
      case 'preocupacion menor': 
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
      default: 
        return 'bg-white/5 text-slate-300 border-white/10'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8 }}
      className="bg-[#050B07]/80 rounded-3xl overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all duration-500 group backdrop-blur-xl hover:shadow-[0_15px_40px_rgba(16,185,129,0.15)] flex flex-col h-full relative"
    >
      {/* Resplandor superior sutil */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 group-hover:via-emerald-400/50 to-transparent transition-colors duration-500" />

      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-[#030504]">
        {especie.imagen ? (
          <img
            src={especie.imagen}
            alt={especie.nombre_comun}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.parentElement.innerHTML = `
                <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0a120c] to-[#030704] text-emerald-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
                  <span class="mt-3 text-xs font-medium tracking-widest uppercase text-emerald-500/50">Especie por Documentar</span>
                </div>
              `
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0a120c] to-[#030704] text-emerald-500/30">
            <Leaf className="w-10 h-10 mb-3" strokeWidth={1.5} />
            <span className="text-xs font-medium tracking-widest uppercase text-emerald-500/50">Especie por Documentar</span>
          </div>
        )}

        {/* Gradiente inferior para transición suave con el texto */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#050B07]/80 to-transparent" />

        {/* Badges Flotantes */}
        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
          <div className="bg-black/40 text-white px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider backdrop-blur-md uppercase border border-white/10 shadow-lg">
            {especie.tipo}
          </div>
        </div>

        <div className="absolute top-4 right-4 flex gap-2 flex-wrap">
          <div className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider backdrop-blur-md uppercase border ${getEstadoStyle(especie.estado_conservacion)}`}>
            {especie.estado_conservacion}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col relative z-10 bg-[#050B07]/80">
        <h3 className="text-2xl font-black text-white mb-1.5 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-emerald-300 transition-colors duration-300">
          {especie.nombre_comun}
        </h3>
        <p className="text-[15px] italic text-emerald-400 mb-5 font-serif opacity-90">
          {especie.nombre_cientifico}
        </p>
        <p className="text-[15px] text-slate-400 leading-relaxed line-clamp-3 font-light">
          {especie.descripcion}
        </p>
      </div>
    </motion.div>
  )
}
