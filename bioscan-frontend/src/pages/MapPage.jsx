import { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import MapView from '../components/MapView'
import TerrainShowroom from '../components/TerrainShowroom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function MapPage() {
  const containerRef = useRef(null)
  const mapWrapperRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Título animado
      gsap.fromTo(".map-title", 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
      )

      // Clip Path Animation para el mapa (se expande desde el centro de la maqueta)
      gsap.to(mapWrapperRef.current, {
        clipPath: "circle(150% at 50% 50%)",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1
        }
      })

      ScrollTrigger.refresh()
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="bg-[#030704] relative">
      <Helmet>
        <title>Mapa de Conservación | BioScan</title>
        <meta name="description" content="Explora la maqueta tridimensional del Cerro San Pedro y visualiza los avistamientos de biodiversidad en tiempo real." />
      </Helmet>

      <div ref={containerRef} className="h-screen w-full relative flex items-center justify-center overflow-hidden">
        
        {/* Capa de fondo: Showroom 3D interactivo del Cerro San Pedro */}
        <div className="absolute inset-0 z-0 bg-[#030704]">
          <TerrainShowroom />
        </div>

        {/* Indicador de scroll para transición a mapa satelital */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[5] pointer-events-none select-none">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            Desplázate para abrir el mapa satelital
          </span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
        </div>

        {/* Capa del mapa Leaflet que se expande cubriendo el showroom */}
        <div 
          ref={mapWrapperRef} 
          className="absolute inset-0 z-10 bg-[#030704] flex items-center justify-center pointer-events-auto"
          style={{ clipPath: "circle(0% at 50% 50%)" }}
        >
          <div className="w-full h-full pt-20 px-4 pb-4 bg-white/5 backdrop-blur-xl">
             <MapView fullPage />
          </div>
        </div>
      </div>

      <div className="h-[20vh] bg-[#030704]"></div>
    </div>
  )
}
