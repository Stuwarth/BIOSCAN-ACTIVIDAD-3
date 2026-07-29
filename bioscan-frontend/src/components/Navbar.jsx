import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Leaf, Menu, X, Map, BookOpen, Users, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { to: '/', label: 'Inicio', icon: Leaf },
  { to: '/catalogo', label: 'Catálogo', icon: BookOpen },
  { to: '/mapa', label: 'Mapa', icon: Map },
  { to: '/poc-3d', label: 'PoC 3D', icon: Sparkles },
  { to: '/nosotros', label: 'Nosotros', icon: Users },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navRef = useRef(null)

  // Scroll-aware: navbar se compacta y se vuelve más translúcida
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav 
      ref={navRef}
      className={`fixed top-0 w-full z-50 transition-all duration-700 ease-out border-b ${
        scrolled 
          ? 'bg-[#030704]/85 backdrop-blur-2xl border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]' 
          : 'bg-[#030704]/60 backdrop-blur-xl border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-14' : 'h-16'}`}>
          {/* Logo con micro-animación orgánica */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div 
              className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Leaf className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-white tracking-tight">BioScan</span>
          </Link>

          {/* Desktop links con indicador deslizante */}
          <div className="hidden md:flex items-center gap-2 relative">
            {links.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                    ${isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <Icon className={`w-4 h-4 relative z-10 transition-colors duration-300 ${isActive ? 'text-emerald-400' : ''}`} />
                  <span className="relative z-10">{label}</span>
                  
                  {/* Indicador líquido bioluminiscente */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full"
                      style={{ boxShadow: '0 0 10px rgba(52, 211, 153, 0.8), 0 0 20px rgba(52, 211, 153, 0.4)' }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Mobile toggle */}
          <motion.button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile menu con reveal orgánico */}
        <AnimatePresence>
          {open && (
            <motion.div 
              className="md:hidden pb-4 space-y-1 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {links.map(({ to, label, icon: Icon }, i) => (
                <motion.div
                  key={to}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.06, duration: 0.3, ease: "easeOut" }}
                >
                  <Link
                    to={to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                      ${location.pathname === to
                        ? 'bg-white/10 text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <Icon className={`w-5 h-5 ${location.pathname === to ? 'text-primary' : ''}`} />
                    {label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
