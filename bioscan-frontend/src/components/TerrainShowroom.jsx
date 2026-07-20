import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, ZoomIn, ZoomOut, RotateCcw, Bird, Leaf, Landmark } from 'lucide-react'

// Zonas del showroom interactivo
const ZONAS_SHOWROOM = [
  {
    id: 'cuspide',
    titulo: 'Cúspide de la Concordia',
    altura: '2,743 m.s.n.m.',
    clima: 'Árido y Ventoso',
    descripcion: 'Punto más alto del Cerro San Pedro, presidido por el monumento de la Concordia. Ecosistema de matorral xerófilo donde abundan las cactáceas columnares y lagartijas nativas.',
    coordenadas: { r: 17, c: 17 }, // centro del mapa
    especies: [
      { nombre: 'Cactus San Pedro', cientifico: 'Trichocereus bridgesii', tipo: 'Planta' },
      { nombre: 'Lagartija de los Valles', cientifico: 'Liolaemus sp.', tipo: 'Reptil' },
      { nombre: 'Culebra Andina', cientifico: 'Tachymenis peruviana', tipo: 'Reptil' }
    ]
  },
  {
    id: 'polylepis',
    titulo: 'Bosques de Polylepis (Quewiña)',
    altura: '2,680 m.s.n.m.',
    clima: 'Microclima Húmedo Relictual',
    descripcion: 'Laderas protegidas orientadas al sur que albergan bosques relictos de Quewiña. Es el hábitat crítico más vulnerable del cerro, indispensable para la anidación y alimentación de aves endémicas.',
    coordenadas: { r: 11, c: 21 },
    especies: [
      { nombre: 'Monterita de Cochabamba', cientifico: 'Poospiza garleppi', tipo: 'Ave (En Peligro)' },
      { nombre: 'Quewiña', cientifico: 'Polylepis tomentella', tipo: 'Planta (Vulnerable)' },
      { nombre: 'Colibrí Estrella Andina', cientifico: 'Oreotrochilus adela', tipo: 'Ave (Casi Amenazada)' }
    ]
  },
  {
    id: 'faldas',
    titulo: 'Faldas y Corredor Urbano',
    altura: '2,570 m.s.n.m.',
    clima: 'Semidesértico templado',
    descripcion: 'Zona de amortiguamiento que colinda con el área urbana de Cochabamba. Presenta vegetación introducida y nativa como Molles, actuando como zona de paso para mamíferos nocturnos.',
    coordenadas: { r: 23, c: 12 },
    especies: [
      { nombre: 'Zorro Andino', cientifico: 'Lycalopex culpaeus', tipo: 'Mamífero' },
      { nombre: 'Molle', cientifico: 'Schinus molle', tipo: 'Planta' },
      { nombre: 'Gato Montés', cientifico: 'Leopardus geoffroyi', tipo: 'Mamífero' }
    ]
  }
]

export default function TerrainShowroom() {
  const canvasRef = useRef(null)
  const [selectedZona, setSelectedZona] = useState(null)
  const [cameraZoom, setCameraZoom] = useState(1)
  const [rotationActive, setRotationActive] = useState(true)

  // Estados de arrastre (drag-to-rotate)
  const isDraggingRef = useRef(false)
  const startMouseRef = useRef({ x: 0, y: 0 })
  const startRotRef = useRef({ yaw: 0.75, pitch: 0.65 })
  
  // Ángulos de cámara reales
  const pitchRef = useRef(0.65)
  const yawRef = useRef(0.75)
  const targetPitchRef = useRef(0.65)
  const targetYawRef = useRef(0.75)
  
  // Tiempo global para animaciones
  const timeRef = useRef(0)

  // Manejar el Zoom
  const zoomIn = () => setCameraZoom((z) => Math.min(1.6, z + 0.15))
  const zoomOut = () => setCameraZoom((z) => Math.max(0.6, z - 0.15))
  const resetCamera = () => {
    setCameraZoom(1)
    targetPitchRef.current = 0.65
    targetYawRef.current = 0.75
    setSelectedZona(null)
    setRotationActive(true)
  }

  // Interacción de mouse para rotar en 3D (Orbit Controls)
  const handleMouseDown = (e) => {
    isDraggingRef.current = true
    startMouseRef.current = { x: e.clientX, y: e.clientY }
    startRotRef.current = { yaw: yawRef.current, pitch: pitchRef.current }
  }

  const handleMouseMove = (e) => {
    if (isDraggingRef.current) {
      const dx = e.clientX - startMouseRef.current.x
      const dy = e.clientY - startMouseRef.current.y
      targetYawRef.current = startRotRef.current.yaw - dx * 0.005
      targetPitchRef.current = Math.max(0.2, Math.min(1.2, startRotRef.current.pitch + dy * 0.005))
    }
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId

    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio)
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio
    }
    window.addEventListener('resize', handleResize)

    // Parámetros de la grilla 3D
    const ROWS = 35
    const COLS = 35
    const spacing = 28 

    // Generar la matriz topográfica del Cerro San Pedro
    const points = []
    for (let r = 0; r < ROWS; r++) {
      points[r] = []
      for (let c = 0; c < COLS; c++) {
        const dx = r - ROWS / 2
        const dy = c - COLS / 2
        const distSq = dx * dx + dy * dy

        let z = 210 * Math.exp(-distSq / 75)
        z += 30 * Math.sin(r * 0.3) * Math.cos(c * 0.3)
        z += 15 * Math.sin(r * 0.7) * Math.exp(-distSq / 120)
        
        if (distSq > 150) {
          z *= Math.max(0, 1 - (distSq - 150) / 50)
        }

        points[r][c] = {
          x: (c - COLS / 2) * spacing,
          y: z,
          z: (r - ROWS / 2) * spacing,
        }
      }
    }

    // Pájaros — trayectorias curvas naturales
    const birds = Array.from({ length: 4 }, (_, i) => ({
      angle: (Math.PI * 2 / 4) * i,
      radius: 120 + i * 30,
      height: 230 + i * 15,
      speed: 0.003 + i * 0.0008,
      wingPhase: i * 1.5,
      size: 3.5 + i * 0.5,
    }))

    // Nubes de niebla
    const fogClouds = Array.from({ length: 6 }, (_, i) => ({
      x: (i - 3) * 130,
      z: (i % 3 - 1) * 100,
      y: 40 + (i % 2) * 30,
      width: 200 + i * 40,
      height: 15 + i * 3,
      speed: 0.15 + i * 0.05,
      opacity: 0.06 + (i % 3) * 0.03,
      offset: i * 100,
    }))

    // Render loop
    const render = () => {
      timeRef.current += 0.016 // ~60fps
      const time = timeRef.current
      
      ctx.clearRect(0, 0, width, height)

      // Auto-rotación sutil
      if (rotationActive && !isDraggingRef.current) {
        targetYawRef.current += 0.0005
      }

      // Suavizado de cámara (Inercia física)
      yawRef.current += (targetYawRef.current - yawRef.current) * 0.06
      pitchRef.current += (targetPitchRef.current - pitchRef.current) * 0.06

      const cosP = Math.cos(pitchRef.current)
      const sinP = Math.sin(pitchRef.current)
      const cosY = Math.cos(yawRef.current)
      const sinY = Math.sin(yawRef.current)

      // Dirección de luz solar dinámica (rota lentamente simulando paso del tiempo)
      const sunAngle = time * 0.03
      const lightDir = {
        x: Math.cos(sunAngle) * 0.8,
        y: 1.6,
        z: Math.sin(sunAngle) * 0.5 + 0.4
      }
      const lLen = Math.sqrt(lightDir.x * lightDir.x + lightDir.y * lightDir.y + lightDir.z * lightDir.z)
      lightDir.x /= lLen
      lightDir.y /= lLen
      lightDir.z /= lLen

      // Zoom y perspectiva de cámara
      const fov = 500 * cameraZoom
      const cameraDist = 800

      const project = (x, y, z) => {
        let x1 = x * cosY - z * sinY
        let z1 = x * sinY + z * cosY
        let y2 = y * cosP - z1 * sinP
        let z2 = y * sinP + z1 * cosP

        const scale = fov / (z2 + cameraDist)
        return {
          x: width / 2 + x1 * scale,
          y: height / 1.95 - y2 * scale,
          depth: z2,
          scale,
        }
      }

      // ===== RENDERIZADO DEL TERRENO =====
      for (let r = 0; r < ROWS - 1; r++) {
        for (let c = 0; c < COLS - 1; c++) {
          const p00 = points[r][c]
          const p01 = points[r][c + 1]
          const p11 = points[r + 1][c + 1]
          const p10 = points[r + 1][c]

          const pr00 = project(p00.x, p00.y, p00.z)
          const pr01 = project(p01.x, p01.y, p01.z)
          const pr11 = project(p11.x, p11.y, p11.z)
          const pr10 = project(p10.x, p10.y, p10.z)

          // Vector normal
          const ax = p01.x - p00.x, ay = p01.y - p00.y, az = p01.z - p00.z
          const bx = p10.x - p00.x, by = p10.y - p00.y, bz = p10.z - p00.z
          let nx = ay * bz - az * by
          let ny = az * bx - ax * bz
          let nz = ax * by - ay * bx
          const nLen = Math.sqrt(nx * nx + ny * ny + nz * nz)
          if (nLen > 0) { nx /= nLen; ny /= nLen; nz /= nLen; }

          // Sombreado Lambertiano difuso
          const dot = nx * lightDir.x + ny * lightDir.y + nz * lightDir.z
          const diffuse = Math.max(0.18, dot)

          // Rampa de color del Terreno
          const avgHeight = (p00.y + p01.y + p11.y + p10.y) / 4
          let baseR = 24, baseG = 58, baseB = 29
          
          // Senderos peatonales
          const dx = r - ROWS / 2
          const dy_val = c - COLS / 2
          const angle = Math.atan2(dy_val, dx)
          const dist = Math.sqrt(dx * dx + dy_val * dy_val)
          const trailDist = Math.abs(dist - (angle * 3.5 + 9))
          const isTrail = trailDist < 1.0 && avgHeight > 10 && avgHeight < 190

          if (isTrail) {
            baseR = 196; baseG = 164; baseB = 120
          } else if (avgHeight > 35 && avgHeight <= 110) {
            const t = (avgHeight - 35) / 75
            baseR = Math.round(24 + t * 50)
            baseG = Math.round(58 - t * 15)
            baseB = Math.round(29 - t * 12)
          } else if (avgHeight > 110) {
            const t = Math.min(1, (avgHeight - 110) / 100)
            baseR = Math.round(74 + t * 60)
            baseG = Math.round(43 + t * 50)
            baseB = Math.round(17 + t * 40)
          }

          const rColor = Math.round(baseR * diffuse)
          const gColor = Math.round(baseG * diffuse)
          const bColor = Math.round(baseB * diffuse)

          ctx.beginPath()
          ctx.moveTo(pr00.x, pr00.y)
          ctx.lineTo(pr01.x, pr01.y)
          ctx.lineTo(pr11.x, pr11.y)
          ctx.lineTo(pr10.x, pr10.y)
          ctx.closePath()
          ctx.fillStyle = `rgb(${rColor}, ${gColor}, ${bColor})`
          ctx.fill()
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.012)'
          ctx.lineWidth = 0.3
          ctx.stroke()

          // Vegetación pulsante en zonas de bosque (Polylepis)
          if (avgHeight > 60 && avgHeight < 130 && !isTrail && Math.random() < 0.04) {
            const vegX = (pr00.x + pr11.x) / 2
            const vegY = (pr00.y + pr11.y) / 2
            const pulse = 0.5 + 0.5 * Math.sin(time * 2 + r * 0.3 + c * 0.5)
            ctx.beginPath()
            ctx.arc(vegX, vegY, 1.5 + pulse, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(22, 163, 74, ${0.15 + pulse * 0.2})`
            ctx.fill()
          }
        }
      }

      // ===== NIEBLA VOLUMÉTRICA EN LAS LADERAS =====
      fogClouds.forEach(cloud => {
        const fogX = cloud.x + Math.sin(time * cloud.speed + cloud.offset) * 40
        const fogProj = project(fogX, cloud.y, cloud.z)
        
        const gradient = ctx.createRadialGradient(
          fogProj.x, fogProj.y, 0,
          fogProj.x, fogProj.y, cloud.width * fogProj.scale * 0.5
        )
        const fogOpacity = cloud.opacity * (0.7 + 0.3 * Math.sin(time * 0.5 + cloud.offset))
        gradient.addColorStop(0, `rgba(200, 210, 200, ${fogOpacity})`)
        gradient.addColorStop(0.5, `rgba(180, 195, 185, ${fogOpacity * 0.4})`)
        gradient.addColorStop(1, 'rgba(180, 195, 185, 0)')
        
        ctx.beginPath()
        ctx.ellipse(fogProj.x, fogProj.y, cloud.width * fogProj.scale * 0.5, cloud.height * fogProj.scale, 0, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      // ===== CRISTO DE LA CONCORDIA =====
      const peakPt = points[Math.floor(ROWS / 2)][Math.floor(COLS / 2)]
      const peakProj = project(peakPt.x, peakPt.y, peakPt.z)

      // Pedestal
      ctx.fillStyle = '#b5b5b5'
      ctx.strokeStyle = '#8a8a8a'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.rect(peakProj.x - 3.5 * cameraZoom, peakProj.y - 12 * cameraZoom, 7 * cameraZoom, 12 * cameraZoom)
      ctx.fill()
      ctx.stroke()

      // Cuerpo
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.moveTo(peakProj.x - 2 * cameraZoom, peakProj.y - 12 * cameraZoom)
      ctx.lineTo(peakProj.x - 1.5 * cameraZoom, peakProj.y - 22 * cameraZoom)
      ctx.lineTo(peakProj.x + 1.5 * cameraZoom, peakProj.y - 22 * cameraZoom)
      ctx.lineTo(peakProj.x + 2 * cameraZoom, peakProj.y - 12 * cameraZoom)
      ctx.closePath()
      ctx.fill()

      // Cabeza
      ctx.beginPath()
      ctx.arc(peakProj.x, peakProj.y - 24 * cameraZoom, 2.2 * cameraZoom, 0, Math.PI * 2)
      ctx.fill()

      // Brazos
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.6 * cameraZoom
      ctx.beginPath()
      ctx.moveTo(peakProj.x - 8 * cameraZoom, peakProj.y - 20 * cameraZoom)
      ctx.lineTo(peakProj.x + 8 * cameraZoom, peakProj.y - 20 * cameraZoom)
      ctx.stroke()

      // Label del Cristo (visible cuando hay zoom)
      if (cameraZoom > 1.1) {
        ctx.font = `${9 * cameraZoom}px Inter, sans-serif`
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.textAlign = 'center'
        ctx.fillText('Cristo de la Concordia', peakProj.x, peakProj.y - 30 * cameraZoom)
      }

      // ===== PÁJAROS VOLANDO =====
      birds.forEach(bird => {
        const bAngle = bird.angle + time * bird.speed
        const bx = Math.cos(bAngle) * bird.radius
        const bz = Math.sin(bAngle) * bird.radius
        const by = bird.height + Math.sin(time * 1.5 + bird.wingPhase) * 8

        const bProj = project(bx, by, bz)
        if (bProj.depth < -400) return // Detrás de la cámara

        // Alas con movimiento de aleteo
        const wingFlap = Math.sin(time * 6 + bird.wingPhase) * 0.4
        const s = bird.size * bProj.scale * 0.008

        ctx.strokeStyle = 'rgba(60, 60, 60, 0.7)'
        ctx.lineWidth = Math.max(0.5, s * 0.3)
        ctx.beginPath()
        // Ala izquierda
        ctx.moveTo(bProj.x - s * 3, bProj.y + wingFlap * s * 3)
        ctx.quadraticCurveTo(bProj.x - s * 1.5, bProj.y - wingFlap * s * 2, bProj.x, bProj.y)
        // Ala derecha
        ctx.quadraticCurveTo(bProj.x + s * 1.5, bProj.y - wingFlap * s * 2, bProj.x + s * 3, bProj.y + wingFlap * s * 3)
        ctx.stroke()
        
        // Cuerpo
        ctx.beginPath()
        ctx.arc(bProj.x, bProj.y, Math.max(0.5, s * 0.4), 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(50, 50, 50, 0.8)'
        ctx.fill()
      })

      // ===== HOTSPOTS DEL SHOWROOM =====
      ZONAS_SHOWROOM.forEach((zona) => {
        const pt = points[zona.coordenadas.r][zona.coordenadas.c]
        const proj = project(pt.x, pt.y, pt.z)
        const isHovered = selectedZona?.id === zona.id

        const yOffset = isHovered ? -22 : -14
        const pulseSize = isHovered ? 0 : 2 * Math.sin(time * 2) + 2
        
        // Línea vertical de conexión
        ctx.beginPath()
        ctx.moveTo(proj.x, proj.y)
        ctx.lineTo(proj.x, proj.y + yOffset)
        ctx.strokeStyle = isHovered ? 'rgba(22, 163, 74, 0.6)' : 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = 1
        ctx.stroke()

        // Cabeza del pin
        ctx.beginPath()
        ctx.arc(proj.x, proj.y + yOffset, isHovered ? 7 : 5, 0, Math.PI * 2)
        ctx.fillStyle = isHovered ? '#16a34a' : '#ffffff'
        ctx.strokeStyle = '#030704'
        ctx.lineWidth = 2
        ctx.fill()
        ctx.stroke()

        // Aro pulsante orgánico
        if (!isHovered && pulseSize > 1) {
          ctx.beginPath()
          ctx.arc(proj.x, proj.y + yOffset, 5 + pulseSize, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 - pulseSize * 0.02})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }

        // Glow cuando está seleccionado
        if (isHovered) {
          ctx.beginPath()
          ctx.arc(proj.x, proj.y + yOffset, 14, 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(22, 163, 74, 0.3)'
          ctx.lineWidth = 1
          ctx.stroke()
          
          ctx.beginPath()
          ctx.arc(proj.x, proj.y + yOffset, 20, 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(22, 163, 74, 0.1)'
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [cameraZoom, rotationActive, selectedZona])

  // Detectar clics en los hotspots del canvas
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const clickX = (e.clientX - rect.left) * window.devicePixelRatio
    const clickY = (e.clientY - rect.top) * window.devicePixelRatio

    const ROWS = 35
    const COLS = 35
    const spacing = 28

    const points = []
    for (let r = 0; r < ROWS; r++) {
      points[r] = []
      for (let c = 0; c < COLS; c++) {
        const dx = r - ROWS / 2
        const dy = c - COLS / 2
        const distSq = dx * dx + dy * dy
        let z = 210 * Math.exp(-distSq / 75)
        z += 30 * Math.sin(r * 0.3) * Math.cos(c * 0.3)
        z += 15 * Math.sin(r * 0.7) * Math.exp(-distSq / 120)
        if (distSq > 150) z *= Math.max(0, 1 - (distSq - 150) / 50)
        points[r][c] = { x: (c - COLS / 2) * spacing, y: z, z: (r - ROWS / 2) * spacing }
      }
    }

    const cosP = Math.cos(pitchRef.current)
    const sinP = Math.sin(pitchRef.current)
    const cosY = Math.cos(yawRef.current)
    const sinY = Math.sin(yawRef.current)
    const fov = 500 * cameraZoom
    const cameraDist = 800

    const project = (x, y, z) => {
      let x1 = x * cosY - z * sinY
      let z1 = x * sinY + z * cosY
      let y2 = y * cosP - z1 * sinP
      let z2 = y * sinP + z1 * cosP
      const scale = fov / (z2 + cameraDist)
      return { x: canvas.width / 2 + x1 * scale, y: canvas.height / 1.95 - y2 * scale }
    }

    let matchedZona = null
    let minDist = 30 * window.devicePixelRatio

    ZONAS_SHOWROOM.forEach((zona) => {
      const pt = points[zona.coordenadas.r][zona.coordenadas.c]
      const proj = project(pt.x, pt.y, pt.z)
      const pinY = proj.y - 14
      const dist = Math.sqrt((clickX - proj.x) ** 2 + (clickY - pinY) ** 2)
      if (dist < minDist) {
        minDist = dist
        matchedZona = zona
      }
    })

    if (matchedZona) {
      setSelectedZona(matchedZona)
      setRotationActive(false)
      
      if (matchedZona.id === 'cuspide') {
        targetYawRef.current = 0.75
        targetPitchRef.current = 0.65
      } else if (matchedZona.id === 'polylepis') {
        targetYawRef.current = 1.05
        targetPitchRef.current = 0.75
      } else if (matchedZona.id === 'faldas') {
        targetYawRef.current = 0.45
        targetPitchRef.current = 0.55
      }
    }
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none flex flex-col justify-between p-8 z-10">
      
      {/* Canvas interactivo de la Maqueta 3D */}
      <div 
        className="absolute inset-0 z-0 pointer-events-auto cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        <canvas ref={canvasRef} className="w-full h-full bg-transparent" />
      </div>

      {/* CABECERA: Presentación tipo Galería/Museo Natural */}
      <div className="flex justify-between items-start w-full z-10 select-none">
        <div className="flex flex-col text-left max-w-lg">
          <span className="text-[10px] font-mono text-primary/70 uppercase tracking-widest mb-1">
            Maqueta Tridimensional
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-none mb-2">
            Cerro San Pedro
          </h2>
          <p className="text-xs text-slate-400/80 font-light leading-relaxed">
            Cochabamba, Bolivia · Explora los microclimas y zonas críticas donde habitan las especies nativas.
          </p>
        </div>

        {/* Controles de vista */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          <div className="flex bg-white/5 border border-white/10 rounded-full p-0.5 backdrop-blur-md">
            <button
              onClick={() => setRotationActive(!rotationActive)}
              className={`p-2 rounded-full transition-all duration-300 ${
                rotationActive ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Giro Automático"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* PANEL FLOTANTE (DETALLES DE LA ZONA SELECCIONADA) */}
      <div className="absolute top-[120px] left-8 z-20 pointer-events-auto w-80 max-w-sm">
        <AnimatePresence mode="wait">
          {selectedZona ? (
            <motion.div
              key={selectedZona.id}
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-[#030704]/90 border border-white/10 p-6 rounded-3xl backdrop-blur-xl shadow-2xl text-left"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{selectedZona.titulo}</h3>
                  <span className="text-[10px] font-mono text-primary uppercase tracking-wider">{selectedZona.altura}</span>
                </div>
                <button
                  onClick={() => { setSelectedZona(null); setRotationActive(true); }}
                  className="text-slate-400 hover:text-white text-xs transition-colors duration-300 px-2 py-1 rounded-lg hover:bg-white/5"
                >
                  Cerrar
                </button>
              </div>

              <p className="text-xs text-slate-400 font-light leading-relaxed mb-5">
                {selectedZona.descripcion}
              </p>

              <div className="border-t border-white/5 pt-4">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-2">
                  Especies Clave:
                </span>
                <div className="space-y-2">
                  {selectedZona.especies.map((esp, i) => (
                    <motion.div 
                      key={esp.nombre} 
                      className="flex items-center gap-2.5 bg-white/5 border border-white/5 rounded-xl p-2.5 hover:bg-white/10 transition-colors duration-300"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                    >
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                        {esp.tipo.includes('Ave') ? (
                          <Bird className="w-3.5 h-3.5 text-blue-400" />
                        ) : esp.tipo.includes('Planta') ? (
                          <Leaf className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <Compass className="w-3.5 h-3.5 text-amber-500" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-200 leading-none">{esp.nombre}</p>
                        <p className="text-[9px] italic text-slate-500 leading-tight">{esp.cientifico}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 border border-white/5 p-4 rounded-2xl backdrop-blur-md text-left select-none"
            >
              <p className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                <Compass className="w-4 h-4 text-primary animate-breathe" />
                <span>Haz clic en un marcador para explorar las zonas del cerro.</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CONTROLES DE CÁMARA */}
      <div className="flex justify-between items-end w-full z-10">
        <div className="flex gap-2 bg-white/5 border border-white/10 rounded-full p-1 backdrop-blur-md pointer-events-auto">
          <button
            onClick={zoomIn}
            className="p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300"
            title="Acercar"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={zoomOut}
            className="p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300"
            title="Alejar"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetCamera}
            className="p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300 border-l border-white/10"
            title="Restaurar Vista"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Leyenda de alturas */}
        <div className="flex items-center gap-4 bg-[#030704]/80 border border-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md">
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Alturas:</span>
          <div className="flex items-center gap-1.5 text-[9px] text-slate-300">
            <span className="w-2.5 h-2.5 rounded bg-[#183a1d]" />
            <span>Valle</span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-slate-300">
            <span className="w-2.5 h-2.5 rounded bg-[#4b3512]" />
            <span>Ladera</span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-slate-300">
            <span className="w-2.5 h-2.5 rounded bg-[#b2975a]" />
            <span>Cúspide</span>
          </div>
        </div>
      </div>

    </div>
  )
}
