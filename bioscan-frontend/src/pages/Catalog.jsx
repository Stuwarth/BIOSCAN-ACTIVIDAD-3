import { useState, useMemo, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { Search, Filter, Leaf } from 'lucide-react'
import SpeciesCard from '../components/SpeciesCard'
import { getObservaciones } from '../services/observaciones'
import especiesReferencia from '../data/especies.json' // HMR Force Update
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const tipos = ['todos', 'ave', 'planta', 'mamifero', 'reptil', 'anfibio', 'insecto']
const estados = ['todos', 'en peligro', 'vulnerable', 'preocupacion menor', 'no evaluado']

export default function Catalog() {
  const [especies, setEspecies] = useState(() => {
    const obs = getObservaciones()
    const ref = especiesReferencia.map((e, i) => ({ ...e, id: `ref-${i}`, fuente: e.fuente || 'UMSS-CBG' }))
    return [...obs, ...ref]
  })
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('todos')

  const containerRef = useRef(null)
  const wrapperRef = useRef(null)

  // Refrescar cuando se guarda una nueva observación
  useEffect(() => {
    const refresh = () => {
      const obs = getObservaciones()
      const ref = especiesReferencia.map((e, i) => ({ ...e, id: `ref-${i}`, fuente: e.fuente || 'UMSS-CBG' }))
      setEspecies([...obs, ...ref])
    }
    window.addEventListener('bioscan-observacion-nueva', refresh)
    return () => window.removeEventListener('bioscan-observacion-nueva', refresh)
  }, [])

  const filtradas = useMemo(() => {
    return especies.filter((esp) => {
      const matchBusqueda = !busqueda ||
        esp.nombre_comun.toLowerCase().includes(busqueda.toLowerCase()) ||
        esp.nombre_cientifico.toLowerCase().includes(busqueda.toLowerCase())
      const matchTipo = filtroTipo === 'todos' || esp.tipo === filtroTipo
      const matchEstado = filtroEstado === 'todos' || esp.estado_conservacion === filtroEstado
      return matchBusqueda && matchTipo && matchEstado
    })
  }, [especies, busqueda, filtroTipo, filtroEstado])

  const conteo = useMemo(() => {
    const c = {}
    especies.forEach((e) => {
      c[e.tipo] = (c[e.tipo] || 0) + 1
    })
    return c
  }, [especies])

  useEffect(() => {
    // Timeout para permitir que React renderice las tarjetas antes de que GSAP calcule anchos
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Animaciones de entrada (Header)
        gsap.fromTo(".catalog-header", 
          { opacity: 0, y: 50, rotateX: -20 }, 
          { opacity: 1, y: 0, rotateX: 0, duration: 1.2, ease: "power4.out" }
        )
        gsap.fromTo(".catalog-filters", 
          { opacity: 0, scale: 0.95 }, 
          { opacity: 1, scale: 1, duration: 1, delay: 0.3, ease: "back.out(1.5)" }
        )

        // Lógica de Scroll Horizontal
        if (!wrapperRef.current || filtradas.length === 0) return

        // Calculamos cuánto ancho tenemos que movernos a la izquierda
        const totalWidth = wrapperRef.current.scrollWidth
        const viewportWidth = window.innerWidth
        
        // Solo animamos horizontalmente si el contenido excede la pantalla
        if (totalWidth > viewportWidth) {
          gsap.to(wrapperRef.current, {
            x: () => -(totalWidth - viewportWidth + window.innerWidth * 0.1), // padding final
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              pin: true,           // Fijar la sección
              scrub: 1,            // Suavizado del scroll vinculado (1 sec delay)
              end: () => `+=${totalWidth}`, // La altura de scroll es igual al ancho para una relación 1:1
              invalidateOnRefresh: true, // Recalcular en resize o cambio de filtros
            }
          })

          // Efecto de distorsión al hacer scroll (skewing)
          let proxy = { skew: 0 }
          let skewSetter = gsap.quickSetter(".catalog-card-wrapper", "skewX", "deg")
          let clamp = gsap.utils.clamp(-15, 15)

          ScrollTrigger.create({
            onUpdate: (self) => {
              let skew = clamp(self.getVelocity() / -100)
              if (Math.abs(skew) > Math.abs(proxy.skew)) {
                proxy.skew = skew
                gsap.to(proxy, { skew: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => skewSetter(proxy.skew) })
              }
            }
          })
          
          ScrollTrigger.refresh()
        } else {
          // Si son muy pocas tarjetas, solo entran con un stagger normal
          gsap.fromTo(".catalog-card-wrapper",
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }
          )
        }

      }, containerRef)

      return () => ctx.revert()
    }, 100) // Delay mínimo para renderizado

    return () => clearTimeout(timer)
  }, [filtradas])

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030704] relative overflow-hidden">
      <Helmet>
        <title>Catálogo Taxonómico | BioScan</title>
        <meta name="description" content="Base de datos de especies registradas y documentadas en Cochabamba." />
      </Helmet>
      
      {/* Cinematic Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-1/2 -left-1/2 w-[150vw] h-[150vh] bg-primary/10 rounded-full blur-[150px] opacity-70" />
        <div className="absolute top-1/2 right-1/4 w-[100vw] h-[100vh] bg-emerald-900/30 rounded-full blur-[120px] opacity-60" />
      </div>

      <div className="relative z-10 w-full h-screen flex flex-col pt-32">
        {/* Header y Filtros Pinned Top */}
        <div className="w-full px-6 lg:px-12 flex-shrink-0">
          <div className="catalog-header text-center lg:text-left mb-8" style={{ perspective: "1000px" }}>
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter mb-4">Archivo <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Biológico</span></h1>
            <p className="text-slate-400 text-lg lg:text-xl max-w-2xl font-light">
              Desplázate hacia abajo para navegar por el herbario digital interactivo.
            </p>
          </div>

          <div className="catalog-filters bg-white/5 backdrop-blur-xl rounded-full border border-white/10 p-3 mb-10 mx-auto lg:mx-0 max-w-5xl flex flex-col md:flex-row gap-3 shadow-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Nomenclatura o nombre común..."
                className="w-full pl-14 pr-4 py-3 bg-black/20 border border-white/5 text-white placeholder-slate-500 rounded-full text-sm outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hidden sm:flex">
                <Filter className="w-4 h-4 text-emerald-400" />
              </div>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="appearance-none px-6 py-3 bg-black/40 border border-white/5 text-white rounded-full text-sm outline-none focus:ring-1 focus:ring-emerald-500/50 capitalize cursor-pointer hover:bg-black/60 transition-colors"
              >
                {tipos.map((t) => (
                  <option key={t} value={t} className="bg-[#050B07] text-white">
                    {t === 'todos' ? 'Todos los Taxones' : `${t} (${conteo[t] || 0})`}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="appearance-none px-6 py-3 bg-black/40 border border-white/5 text-white rounded-full text-sm outline-none focus:ring-1 focus:ring-emerald-500/50 cursor-pointer hover:bg-black/60 transition-colors"
            >
              {estados.map((e) => (
                <option key={e} value={e} className="bg-[#050B07] text-white capitalize">
                  {e === 'todos' ? 'Cualquier Estado' : e}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Zona de Scroll Horizontal */}
        <div className="flex-1 flex items-center overflow-hidden">
          {filtradas.length > 0 ? (
            <div 
              ref={wrapperRef} 
              className="flex gap-8 px-6 lg:px-12 items-center h-full pb-10"
              style={{ width: "max-content" }}
            >
              {filtradas.map((esp, i) => (
                <div key={esp.id} className="catalog-card-wrapper w-[320px] md:w-[400px] flex-shrink-0 origin-bottom">
                  <SpeciesCard especie={esp} index={i} />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center text-center py-20 px-4">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-900/30 to-transparent border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                <Leaf className="w-10 h-10 text-emerald-500/50" strokeWidth={1.5} />
              </div>
              <p className="text-3xl font-black text-white mb-3 tracking-tighter">Galería en Silencio</p>
              <p className="text-slate-400 text-lg max-w-md mx-auto font-light">
                No hemos encontrado especies que coincidan con estos parámetros. Explora otras clasificaciones taxonómicas.
              </p>
            </div>
          )}
        </div>
        
        {/* Indicador de scroll */}
        {filtradas.length > 0 && (
          <div className="absolute bottom-8 right-12 text-slate-500 font-mono text-sm tracking-widest uppercase flex items-center gap-4">
            <span className="w-12 h-[1px] bg-slate-500"></span>
            Scroll para explorar
          </div>
        )}
      </div>
    </div>
  )
}
