import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  
  // Springs para suavidad
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  // Trail (luciérnagas)
  const trail1X = useSpring(mouseX, { damping: 30, stiffness: 150, mass: 0.8 })
  const trail1Y = useSpring(mouseY, { damping: 30, stiffness: 150, mass: 0.8 })
  const trail2X = useSpring(mouseX, { damping: 35, stiffness: 100, mass: 1.2 })
  const trail2Y = useSpring(mouseY, { damping: 35, stiffness: 100, mass: 1.2 })

  useEffect(() => {
    document.body.style.cursor = 'none'

    const moveCursor = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseOver = (e) => {
      const target = e.target
      const clickable = target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a')
      setIsHovered(!!clickable)
    }

    const handleMouseLeave = () => setIsVisible(false)

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', handleMouseOver)
    document.body.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.body.style.cursor = 'auto'
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', handleMouseOver)
      document.body.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [mouseX, mouseY, isVisible])

  if (!isVisible) return null

  return (
    <>
      {/* Trails (Luciérnagas) que se ocultan al hacer hover */}
      {!isHovered && [
        { x: trail2X, y: trail2Y, size: 4, opacity: 0.25 },
        { x: trail1X, y: trail1Y, size: 5, opacity: 0.4 },
      ].map((trail, i) => (
        <motion.div
          key={`trail-${i}`}
          className="fixed top-0 left-0 rounded-full pointer-events-none z-[9997]"
          style={{
            x: trail.x,
            y: trail.y,
            translateX: '-50%',
            translateY: '-50%',
            width: trail.size,
            height: trail.size,
            backgroundColor: `rgba(16, 185, 129, ${trail.opacity})`,
          }}
        />
      ))}

      {/* Núcleo Bioluminiscente */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 8 : 10,
          height: isHovered ? 8 : 10,
          backgroundColor: isHovered ? 'rgba(255,255,255,0.8)' : '#10b981',
          boxShadow: isHovered ? 'none' : '0 0 8px rgba(16, 185, 129, 0.6), 0 0 20px rgba(16, 185, 129, 0.2)',
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />

      {/* Aro Exterior / Fondo Magnético Glassmorphism */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 56 : 26,
          height: isHovered ? 56 : 26,
          borderRadius: 9999,
          borderWidth: isHovered ? 2 : 1,
          borderColor: isHovered ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.15)',
          backgroundColor: isHovered ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
          boxShadow: isHovered ? '0 0 30px rgba(16, 185, 129, 0.2)' : 'none',
          backdropFilter: 'none',
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      />
    </>
  )
}
