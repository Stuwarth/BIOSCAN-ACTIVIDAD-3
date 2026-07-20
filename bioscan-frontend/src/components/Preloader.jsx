import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Preloader({ onComplete }) {
  const containerRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = ''
          if (onComplete) onComplete()
        }
      })

      // 1. Dibujar el contorno de la hoja principal lentamente
      tl.fromTo(".leaf-path", 
        { strokeDasharray: 2000, strokeDashoffset: 2000, opacity: 1 },
        { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" }
      )

      // 2. Rellenar la hoja y hacerla latir (bloom)
      tl.to(".leaf-fill", { opacity: 0.15, duration: 1, ease: "power2.inOut" }, "-=0.5")
      tl.to(".preloader-leaf-container", { scale: 1.1, filter: "drop-shadow(0 0 30px rgba(22, 163, 74, 0.4))", duration: 1, ease: "sine.inOut" }, "-=0.5")

      // 3. Revelar el texto de BioScan épicamente desde la hoja
      tl.fromTo(".preloader-brand-char",
        { y: 50, opacity: 0, rotateX: -90 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1, ease: "back.out(2)", stagger: 0.05 },
        "-=0.8"
      )

      // 4. El subtítulo aparece orgánicamente
      tl.fromTo(".preloader-subtext",
        { opacity: 0, filter: "blur(10px)", scale: 0.9 },
        { opacity: 1, filter: "blur(0px)", scale: 1, duration: 1, ease: "power2.out" },
        "-=0.5"
      )

      // 5. Todo estalla en luz y se retira
      tl.to(".preloader-content", {
        scale: 1.5,
        opacity: 0,
        filter: "blur(20px)",
        duration: 0.8,
        ease: "power4.in"
      }, "+=0.8")

      // 6. El fondo se disuelve revelando la página
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut"
      })

    }, containerRef)

    return () => {
      document.body.style.overflow = ''
      ctx.revert()
    }
  }, [onComplete])

  const brand = "BioScan".split("")

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030704] text-white"
    >
      {/* Background Aurora */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="w-[60vh] h-[60vh] bg-primary/20 rounded-full blur-[100px] mix-blend-screen animate-breathe" />
      </div>

      <div className="preloader-content flex flex-col items-center relative z-10 w-full max-w-2xl px-6">
        
        {/* Giant Epic Leaf SVG */}
        <div className="preloader-leaf-container mb-12 relative w-32 h-32 md:w-48 md:h-48 text-primary">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            {/* Relleno (aparece luego) */}
            <path 
              className="leaf-fill opacity-0"
              d="M50 5 C30 5, 10 25, 10 50 C10 70, 20 85, 40 95 C45 97.5, 55 97.5, 60 95 C80 85, 90 70, 90 50 C90 25, 70 5, 50 5 Z" 
              fill="currentColor" 
            />
            {/* Contorno (se dibuja) */}
            <path 
              className="leaf-path"
              d="M50 5 C30 5, 10 25, 10 50 C10 70, 20 85, 40 95 C45 97.5, 55 97.5, 60 95 C80 85, 90 70, 90 50 C90 25, 70 5, 50 5 Z" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Nervadura central */}
            <path 
              className="leaf-path"
              d="M50 95 L50 15" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Venas laterales */}
            <path 
              className="leaf-path"
              d="M50 75 Q35 60 20 65 M50 55 Q65 40 80 45 M50 35 Q35 25 25 35 M50 25 Q60 15 70 20" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Epic Text Reveal */}
        <div className="text-6xl md:text-8xl font-black tracking-tighter mb-4 flex perspective-[1000px]">
          {brand.map((char, i) => (
            <span 
              key={i} 
              className="preloader-brand-char inline-block origin-bottom" 
              style={{ color: i < 3 ? '#ffffff' : '#16a34a' }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Subtitle */}
        <p className="preloader-subtext text-lg md:text-xl font-light text-slate-400 tracking-[0.2em] uppercase">
          Despertando el ecosistema
        </p>
        
      </div>
    </div>
  )
}
