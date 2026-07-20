import { motion } from 'framer-motion'

export default function PageTransition({ children }) {
  return (
    <>
      {/* Contenido principal de la ruta */}
      <div className="w-full">
        {children}
      </div>

      {/* 
        Cortina de ENTRADA (Slide In)
        Empieza cubriendo la pantalla (y: "0vh") y se retira hacia arriba (y: "-120vh")
        usando -120vh garantizamos que la curva SVG de 100px también salga de la pantalla.
      */}
      <motion.div
        className="fixed inset-0 z-[9999] bg-[#030704] pointer-events-none shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        initial={{ y: "0vh" }}
        animate={{ y: "-120vh" }}
        exit={{ y: "-120vh" }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      >
        <svg className="absolute top-[100%] w-full h-[100px] text-[#030704]" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M0 0 C 50 100, 50 100, 100 0 Z" fill="currentColor" />
        </svg>
      </motion.div>

      {/* 
        Cortina de SALIDA (Slide Out)
        Empieza escondida abajo (y: "120vh") y sube a cubrir la pantalla (y: "0vh").
        Con 120vh la curva superior queda totalmente invisible hasta que ocurre la transición.
      */}
      <motion.div
        className="fixed inset-0 z-[9998] bg-primary pointer-events-none"
        initial={{ y: "120vh" }}
        animate={{ y: "120vh" }}
        exit={{ y: "0vh" }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      >
        <svg className="absolute bottom-[100%] w-full h-[100px] text-primary" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M0 100 C 50 0, 50 0, 100 100 Z" fill="currentColor" />
        </svg>
      </motion.div>
    </>
  )
}
