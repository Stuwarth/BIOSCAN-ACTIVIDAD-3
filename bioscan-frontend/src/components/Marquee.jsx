import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Marquee({ text, speed = 1, reverse = false }) {
  const container = useRef(null)

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.to(".marquee-inner", {
        xPercent: reverse ? 50 : -50,
        ease: "none",
        duration: 20 / speed,
        repeat: -1
      })

      // Reaccionar a la velocidad del scroll
      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const velocity = self.getVelocity()
          // Acelerar la marquesina al scrollear
          const timeScale = 1 + Math.abs(velocity) / 500
          
          gsap.to(tl, {
            timeScale: self.direction === 1 ? timeScale : -timeScale,
            duration: 0.2,
            overwrite: true
          })
          
          // Volver a la velocidad normal cuando el scroll se detiene
          gsap.to(tl, {
            timeScale: 1,
            duration: 1,
            delay: 0.1,
            overwrite: true
          })
        }
      })
    }, container)

    return () => ctx.revert()
  }, [speed, reverse])

  return (
    <div ref={container} className="relative w-full overflow-hidden border-y border-white/5 py-6 lg:py-10 my-16 bg-[#030704]">
      <div className="marquee-inner flex w-max" style={{ transform: reverse ? "translateX(-50%)" : "translateX(0%)" }}>
        {/* Repetimos el contenido para que el 50% cubra al menos 100vw y no se corte */}
        <div className="flex gap-8 lg:gap-16 px-4 lg:px-8 items-center text-5xl sm:text-7xl lg:text-9xl font-black text-transparent tracking-tighter" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.05)' }}>
          {[...Array(8)].map((_, i) => (
            <span key={i} className="flex items-center gap-8 lg:gap-16">
              {text} <span className="text-primary/50 text-4xl">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
