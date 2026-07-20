import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPinOff } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center px-4"
      >
        <MapPinOff className="w-24 h-24 text-slate-600 mx-auto mb-8 opacity-50" />
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-6 tracking-tighter">
          404
        </h1>
        <p className="text-2xl font-bold text-white mb-4">
          Territorio Inexplorado
        </p>
        <p className="text-slate-400 mb-10 max-w-md mx-auto">
          La ruta que intentas acceder no está cartografiada en nuestro sistema. 
          Vuelve a la base para continuar la exploración.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center justify-center px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-medium transition-all backdrop-blur-md"
        >
          Regresar a Inicio
        </Link>
      </motion.div>
    </div>
  )
}
