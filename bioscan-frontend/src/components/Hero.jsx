import { useEffect, useRef } from 'react'
import { Camera, Shield, Leaf, Target, ArrowRight } from 'lucide-react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '../lib/utils'
import MagneticButton from './MagneticButton'

// Genera partículas de esporas/polen para el fondo orgánico
function FloatingSpores() {
  const spores = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    top: `${5 + Math.random() * 90}%`,
    size: 2 + Math.random() * 3,
    duration: 8 + Math.random() * 10,
    delay: Math.random() * 6,
    dx: `${(Math.random() - 0.5) * 80}px`,
    dy: `${-40 - Math.random() * 100}px`,
    dx2: `${(Math.random() - 0.5) * 50}px`,
    dy2: `${-80 - Math.random() * 140}px`,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {spores.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full bg-primary/30"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animation: `spore-float ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
            '--dx': s.dx,
            '--dy': s.dy,
            '--dx2': s.dx2,
            '--dy2': s.dy2,
          }}
        />
      ))}
    </div>
  )
}

// Framer Motion variants for organic entry
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay } },
})

const charReveal = (delay = 0) => ({
  initial: { opacity: 0, y: 80, rotateX: 40 },
  animate: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay } },
})

const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.6, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 15, delay } },
})

const bentoReveal = (delay = 0) => ({
  initial: { opacity: 0, y: 100, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay } },
})

export default function Hero({ onScrollToUpload }) {
  const { scrollY } = useScroll()
  const sectionRef = useRef(null)
  
  // Mouse parallax (Framer Motion)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { damping: 50, stiffness: 400, mass: 1 }
  const mouseXSpring = useSpring(mouseX, springConfig)
  const mouseYSpring = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window
      mouseX.set((e.clientX - innerWidth / 2) / innerWidth)
      mouseY.set((e.clientY - innerHeight / 2) / innerHeight)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const parallaxX1 = useTransform(mouseXSpring, [-0.5, 0.5], [-80, 80])
  const parallaxY1 = useTransform(mouseYSpring, [-0.5, 0.5], [-80, 80])
  const parallaxX2 = useTransform(mouseXSpring, [-0.5, 0.5], [80, -80])
  const parallaxY2 = useTransform(mouseYSpring, [-0.5, 0.5], [80, -80])

  // Scroll Parallax 
  const yBg = useTransform(scrollY, [0, 1000], [0, 400])
  const opacityText = useTransform(scrollY, [0, 500], [1, 0])
  const yText = useTransform(scrollY, [0, 500], [0, -100])
  
  // Físicas de parallax para bento
  const yBento1 = useTransform(scrollY, [0, 600], [0, -80])
  const yBento2 = useTransform(scrollY, [0, 600], [0, -150])
  const yBento3 = useTransform(scrollY, [0, 600], [0, -40])

  // Separar título en caracteres individuales para la animación orgánica
  const line1 = "Decodificando el"
  const line2 = "Cerro San Pedro"

  return (
    <section ref={sectionRef} className="relative min-h-[110vh] w-full overflow-hidden bg-[#030704] flex flex-col justify-start pt-24 lg:pt-32 pb-20">
      
      {/* Aurora viva que respira — orbs que pulsan orgánicamente */}
      <motion.div 
        style={{ y: yBg }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <motion.div 
          style={{ x: parallaxX1, y: parallaxY1 }} 
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-breathe" 
        />
        <motion.div 
          style={{ x: parallaxX2, y: parallaxY2, animationDelay: '3s' }} 
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/10 rounded-full blur-[150px] mix-blend-screen animate-breathe" 
        />
        <motion.div 
          style={{ x: parallaxX1, y: parallaxY2 }} 
          className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen animate-breathe"
        />
      </motion.div>

      {/* Partículas de esporas flotantes */}
      <FloatingSpores />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 w-full flex flex-col">
        
        {/* Massive Typography Section */}
        <motion.div 
          style={{ y: yText, opacity: opacityText }}
          className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20"
        >
          {/* Badge */}
          <motion.div 
            {...fadeUp(0.1)}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-slate-300 px-5 py-2 rounded-full text-sm font-medium mb-8 backdrop-blur-md"
          >
            <Shield className="w-4 h-4 text-primary" />
            <span>Plataforma de Visión Computacional</span>
          </motion.div>

          {/* Title — character by character reveal */}
          <h1 className="text-6xl sm:text-7xl lg:text-[6rem] font-bold text-white leading-[1.05] tracking-tighter mb-8 flex flex-col items-center gap-2" style={{ perspective: '600px' }}>
            <div className="flex flex-wrap justify-center gap-[0.08em]">
               {line1.split("").map((char, i) => (
                 <span key={`l1-${i}`} className="overflow-hidden inline-block">
                   <motion.span 
                     {...charReveal(0.2 + i * 0.025)}
                     className="inline-block origin-bottom"
                   >
                     {char === " " ? "\u00A0" : char}
                   </motion.span>
                 </span>
               ))}
            </div>
            <div className="flex flex-wrap justify-center gap-[0.08em]">
               {line2.split("").map((char, i) => (
                 <span key={`l2-${i}`} className="overflow-hidden inline-block py-1">
                   <motion.span 
                     {...charReveal(0.2 + (line1.length + i) * 0.025)}
                     className="inline-block origin-bottom text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-teal-300"
                   >
                     {char === " " ? "\u00A0" : char}
                   </motion.span>
                 </span>
               ))}
            </div>
          </h1>

          {/* Paragraph */}
          <motion.p 
            {...fadeUp(0.8)}
            className="text-lg lg:text-2xl text-slate-400 max-w-3xl font-light leading-relaxed mb-10"
          >
            Motor de visión computacional diseñado para clasificar taxonómicamente, mapear y proteger la biodiversidad en tiempo real.
          </motion.p>

          {/* CTA Button */}
          <motion.div {...scaleIn(1)}>
            <MagneticButton
              onClick={onScrollToUpload}
              className="group relative inline-flex items-center justify-center gap-3 bg-white text-black font-semibold px-10 py-5 rounded-full overflow-hidden text-lg animate-bio-glow"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Camera className="w-6 h-6 relative z-10 group-hover:text-white transition-colors duration-300" />
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">Iniciar Identificación</span>
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Bento Grid Layer */}
        <div className="bento-container grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20">
          
          <motion.div 
            {...bentoReveal(0)}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            style={{ y: yBento1 }}
            className={cn(
              "col-span-1 md:col-span-2 h-[300px] rounded-3xl p-8 relative overflow-hidden",
              "bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl hover:border-primary/50 transition-all duration-700 group"
            )}
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
              <Leaf className="w-32 h-32 text-primary animate-drift" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end">
              <h3 className="text-4xl font-bold text-white mb-2 tracking-tight">700+ Especies</h3>
              <p className="text-slate-400 font-medium text-lg">Vasculares, avifauna y lepidópteros catalogados científicamente.</p>
            </div>
          </motion.div>

          <motion.div 
            {...bentoReveal(0.15)}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            style={{ y: yBento2 }}
            className={cn(
              "col-span-1 h-[300px] rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between",
              "bg-primary/10 border border-primary/20 backdrop-blur-xl hover:bg-primary/20 transition-all duration-700 group"
            )}
          >
            <Target className="w-10 h-10 text-primary mb-4 group-hover:rotate-[15deg] transition-transform duration-500" />
            <div>
              <h3 className="text-6xl font-black text-white mb-2 tracking-tighter">47</h3>
              <p className="text-base text-slate-300 font-medium leading-tight">Taxones bajo amenaza requiriendo monitoreo urgente.</p>
            </div>
          </motion.div>

          <motion.div 
            {...bentoReveal(0.3)}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            style={{ y: yBento3 }}
            className={cn(
              "col-span-1 md:col-span-3 h-[180px] rounded-3xl p-8 flex items-center justify-between",
              "bg-white/5 border border-white/5 backdrop-blur-md group cursor-pointer hover:bg-white/10 transition-all duration-500"
            )}
          >
            <div>
              <h3 className="text-2xl text-white font-bold mb-2">Algoritmo de Precisión</h3>
              <p className="text-slate-400 text-base">Integración directa con modelos de visión Llama 3 y Plant.id</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-700">
              <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
