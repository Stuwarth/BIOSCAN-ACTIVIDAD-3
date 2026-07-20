import { Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// Borde superior ondulado — silueta de horizonte montañoso
function MountainWave() {
  return (
    <div className="absolute top-0 left-0 w-full -translate-y-[99%] overflow-hidden pointer-events-none">
        <svg 
          viewBox="0 0 1440 80" 
          className="w-full h-16 md:h-20 text-[#030704]" 
          preserveAspectRatio="none"
        >
        <path
          d="M0,80 L0,45 Q120,20 240,38 Q360,55 480,30 Q540,18 600,25 Q720,45 840,22 Q960,0 1080,28 Q1200,50 1320,35 Q1380,28 1440,32 L1440,80 Z"
          fill="currentColor"
        />
        {/* Línea de horizonte sutil */}
        <path
          d="M0,45 Q120,20 240,38 Q360,55 480,30 Q540,18 600,25 Q720,45 840,22 Q960,0 1080,28 Q1200,50 1320,35 Q1380,28 1440,32"
          fill="none"
          stroke="rgba(22, 163, 74, 0.15)"
          strokeWidth="1"
        />
      </svg>
    </div>
  )
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

export default function Footer() {
  return (
    <div className="relative h-[450px]" style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}>
      <div className="fixed bottom-0 left-0 w-full h-[450px] z-0">
        <footer className="w-full h-full bg-[#030704] text-slate-400 py-16 flex flex-col justify-end relative overflow-hidden">
          
          {/* Borde ondulado tipo horizonte montañoso */}
          <MountainWave />

          {/* Partículas de esporas sutiles en el footer */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary/20"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${30 + Math.random() * 50}%`,
                  animation: `spore-float ${10 + Math.random() * 8}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  '--dx': `${(Math.random() - 0.5) * 40}px`,
                  '--dy': `${-20 - Math.random() * 60}px`,
                  '--dx2': `${(Math.random() - 0.5) * 30}px`,
                  '--dy2': `${-50 - Math.random() * 80}px`,
                }}
              />
            ))}
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              className="grid md:grid-cols-3 gap-8 mb-8"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Brand */}
              <motion.div custom={0} variants={staggerItem}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white tracking-tight">BioScan Cochabamba</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-400 font-medium">
                  Plataforma de monitoreo de biodiversidad mediante visión computacional para proteger el Cerro San Pedro
                  y sus corredores biológicos.
                </p>
              </motion.div>

              {/* Links */}
              <motion.div custom={1} variants={staggerItem}>
                <h4 className="text-white font-semibold mb-4">Navegación</h4>
                <div className="space-y-2">
                  <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="block text-sm hover:text-primary transition-colors duration-300">Inicio</Link>
                  <Link to="/catalogo" className="block text-sm hover:text-primary transition-colors duration-300">Catálogo de Especies</Link>
                  <Link to="/mapa" className="block text-sm hover:text-primary transition-colors duration-300">Mapa Interactivo</Link>
                  <Link to="/nosotros" className="block text-sm hover:text-primary transition-colors duration-300">Sobre Nosotros</Link>
                </div>
              </motion.div>

              {/* ODS */}
              <motion.div custom={2} variants={staggerItem}>
                <h4 className="text-white font-semibold mb-4">Alineado con ODS</h4>
                <div className="space-y-2 text-sm">
                  <p>ODS 15: Vida de Ecosistemas Terrestres</p>
                  <p>ODS 13: Acción por el Clima</p>
                  <p>ODS 17: Alianzas para los Objetivos</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <p className="text-sm flex items-center gap-1.5">
                Desarrollado en Cochabamba, Bolivia
              </p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">
                Tech4Future Hack 2026 — Hub Boliviano de IA × Microsoft Learn Student Ambassadors
              </p>
            </motion.div>
          </div>
        </footer>
      </div>
    </div>
  )
}
