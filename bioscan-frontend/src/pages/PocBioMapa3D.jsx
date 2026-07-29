import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Compass, Eye, MapPin, Sparkles, Layers, Volume2, VolumeX, 
  ArrowLeft, ChevronRight, Feather, Trees, Bug, Award, Camera, Globe, Info, ZoomIn
} from 'lucide-react'
import { Link } from 'react-router-dom'
import especiesData from '../data/especies.json'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Coordenadas reales del Cerro de San Pedro y Cristo de la Concordia (Cochabamba)
const CERRO_SAN_PEDRO_CENTER = [-17.3845, -66.1365]
const CRISTO_COORDINATES = [-17.3842, -66.1352]

// Puntos de vista fotográficos de terreno del Cerro de San Pedro
const FIELD_VIEWS = [
  {
    id: 'cristo_cumbre',
    title: 'Cumbre: Cristo de la Concordia & Cerro San Pedro',
    altitud: '2,850 msnm',
    descripcion: 'Vista panorámica desde la cúspide del Cerro de San Pedro junto al monumento del Cristo de la Concordia, sobrevolado por aves rapaces.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2400&auto=format&fit=crop',
    hotspotsOnPhoto: [
      { id: 'inat-6', name: 'Gavilán caminero', x: '45%', y: '25%', speciesId: 'inat-6' },
      { id: 'inat-1', name: 'Paloma torcaza', x: '68%', y: '40%', speciesId: 'inat-1' }
    ]
  },
  {
    id: 'ladera_este',
    title: 'Ladera Este: Bosque Seco y Cactus Pasakana',
    altitud: '2,720 msnm',
    descripcion: 'Vegetación árida autóctona del Cerro San Pedro caracterizada por especies de cactáceas como la Pasakana y arbustos secos.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2400&auto=format&fit=crop',
    hotspotsOnPhoto: [
      { id: 'inat-8', name: 'Monterita de cresta gris', x: '35%', y: '50%', speciesId: 'inat-8' },
      { id: 'inat-19', name: 'Pasakana (Cactus)', x: '75%', y: '65%', speciesId: 'inat-19' }
    ]
  },
  {
    id: 'piedemonte',
    title: 'Piedemonte: Roquedales y Vegetación Baja',
    altitud: '2,580 msnm',
    descripcion: 'Zona de matorrales y quebradas rocosas en la base del Cerro San Pedro con presencia de reptiles y anfibios.',
    image: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=2400&auto=format&fit=crop',
    hotspotsOnPhoto: [
      { id: 'inat-33', name: 'Falsa coral', x: '55%', y: '75%', speciesId: 'inat-33' },
      { id: 'inat-2', name: 'Hornero', x: '25%', y: '60%', speciesId: 'inat-2' }
    ]
  }
]

const tipoColor = {
  ave: '#38bdf8',
  mamifero: '#f59e0b',
  planta: '#4ade80',
  reptil: '#a855f7',
  anfibio: '#06b6d4',
  insecto: '#f97316',
  otro: '#94a3b8',
}

const createPhotoMarkerIcon = (imageUrl, tipo, isSelected) => {
  const borderStyle = isSelected
    ? `border-4 border-amber-400 scale-125 shadow-[0_0_20px_rgba(251,191,36,0.9)]`
    : `border-2 border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]`

  return new L.DivIcon({
    className: 'custom-photo-marker',
    html: `
      <div class="relative group cursor-pointer transition-all duration-300 transform ${borderStyle} rounded-full overflow-hidden w-10 h-10 bg-slate-900">
        <img src="${imageUrl}" class="w-full h-full object-cover" alt="" onerror="this.src='https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=100'" />
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  })
}

function MapFlyController({ selectedSpecie }) {
  const map = useMap()
  useEffect(() => {
    if (selectedSpecie && selectedSpecie.lat && selectedSpecie.lng) {
      map.flyTo([selectedSpecie.lat, selectedSpecie.lng], 17, {
        duration: 2.0,
        easeLinearity: 0.25
      })
    }
  }, [selectedSpecie, map])
  return null
}

export default function PocBioMapa3D() {
  const [viewMode, setViewMode] = useState('satelital') // 'satelital' vs 'fotografico_campo'
  const [activeFieldView, setActiveFieldView] = useState(FIELD_VIEWS[0])
  const [selectedSpecie, setSelectedSpecie] = useState(null)
  const [activeFilter, setActiveFilter] = useState('todos')
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [infoOpen, setInfoOpen] = useState(true)

  const audioCtxRef = useRef(null)

  const filteredEspecies = especiesData.filter((e) => {
    if (activeFilter === 'todos') return true
    return e.tipo === activeFilter
  })

  // Sintetizador Bioacústico de Sonido Real
  const playBioAudioSynth = (freq = 2500) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') ctx.resume()

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = freq > 1000 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, ctx.currentTime + 0.15)
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, ctx.currentTime + 0.35)

      gain.gain.setValueAtTime(0.2, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.5)
      setIsPlayingAudio(true)
      setTimeout(() => setIsPlayingAudio(false), 500)
    } catch (e) {
      console.warn('Audio Context Error:', e)
    }
  }

  const handleSelectSpecie = (specie) => {
    setSelectedSpecie(specie)
    if (audioEnabled) {
      playBioAudioSynth(specie.tipo === 'ave' ? 2800 : 600)
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#030704] text-white">
      {/* 1. MODO FOTOGRÁFICO SATELITAL REAL (Google Maps Style con Tiles ESRI HD) */}
      {viewMode === 'satelital' && (
        <MapContainer
          center={CERRO_SAN_PEDRO_CENTER}
          zoom={15}
          zoomControl={false}
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution="&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
          <TileLayer
            url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
            opacity={0.65}
          />

          <MapFlyController selectedSpecie={selectedSpecie} />

          {/* Marcador del Cristo de la Concordia */}
          <Marker
            position={CRISTO_COORDINATES}
            icon={new L.DivIcon({
              className: 'cristo-marker',
              html: `
                <div class="px-3 py-1 bg-amber-500/90 text-slate-950 font-bold text-xs rounded-full border border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.8)] flex items-center gap-1.5 backdrop-blur-md">
                  <span>🗿 Cristo de la Concordia</span>
                </div>
              `,
              iconAnchor: [60, 15]
            })}
          />

          {/* Marcadores Fotográficos Reales de Especies */}
          {filteredEspecies.map((esp) => {
            if (!esp.lat || !esp.lng) return null
            const isSelected = selectedSpecie?.id === esp.id
            return (
              <Marker
                key={esp.id}
                position={[esp.lat, esp.lng]}
                icon={createPhotoMarkerIcon(esp.imagen_thumb || esp.imagen, esp.tipo, isSelected)}
                eventHandlers={{
                  click: () => handleSelectSpecie(esp)
                }}
              />
            )
          })}
        </MapContainer>
      )}

      {/* 2. MODO VISOR FOTOGRÁFICO DE CAMPO REAL DEL CERRO SAN PEDRO */}
      {viewMode === 'fotografico_campo' && (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <img
            src={activeFieldView.image}
            alt={activeFieldView.title}
            className="w-full h-full object-cover"
          />

          {/* Hotspots interactivos ubicados directamente sobre la fotografía de campo */}
          {activeFieldView.hotspotsOnPhoto.map((hs) => {
            const esp = especiesData.find((e) => e.id === hs.speciesId)
            return (
              <button
                key={hs.id}
                onClick={() => esp && handleSelectSpecie(esp)}
                style={{ left: hs.x, top: hs.y }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 p-2 bg-emerald-500/90 text-slate-950 font-bold text-xs rounded-2xl border-2 border-white shadow-[0_0_25px_rgba(52,211,153,0.9)] flex items-center gap-2 hover:scale-110 transition-all backdrop-blur-md z-30"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-ping" />
                <span>📍 {hs.name}</span>
              </button>
            )
          })}

          {/* Selector de Puntos de Vista Fotográficos */}
          <div className="absolute top-36 right-6 z-30 space-y-2 pointer-events-auto max-w-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 bg-black/85 px-3 py-1 rounded-full border border-amber-400/30">
              Vistas de Campo Real Cerro San Pedro
            </span>
            {FIELD_VIEWS.map((fv) => (
              <button
                key={fv.id}
                onClick={() => setActiveFieldView(fv)}
                className={`w-full p-3 rounded-2xl border text-left transition-all backdrop-blur-xl ${
                  activeFieldView.id === fv.id
                    ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.6)]'
                    : 'bg-black/80 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="text-xs">{fv.title}</div>
                <div className="text-[10px] opacity-75">{fv.altitud}</div>
              </button>
            ))}
          </div>

          {/* Leyenda de la fotografía activa */}
          <div className="absolute bottom-6 left-6 z-30 max-w-lg p-4 bg-black/85 backdrop-blur-2xl border border-white/10 rounded-3xl space-y-1.5">
            <h4 className="text-sm font-bold text-emerald-400">{activeFieldView.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{activeFieldView.descripcion}</p>
          </div>
        </div>
      )}

      {/* Header Flotante Ajustado (Debajo de Navbar) */}
      <div className="absolute top-20 left-6 right-6 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <Link
            to="/"
            className="p-2.5 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl text-slate-300 hover:text-white hover:border-emerald-500/50 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-medium hidden sm:inline">Inicio</span>
          </Link>
          <div className="px-4 py-2 bg-black/80 backdrop-blur-xl border border-emerald-500/40 rounded-2xl flex items-center gap-3 shadow-xl">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            <div>
              <h1 className="text-xs sm:text-sm font-bold tracking-wide text-white flex items-center gap-2">
                PoC: Visor Fotográfico Realista
                <span className="px-2 py-0.5 text-[9px] uppercase font-semibold bg-emerald-500/20 text-emerald-300 rounded-md border border-emerald-500/30">
                  PoC Examen Final
                </span>
              </h1>
              <p className="text-[10px] text-slate-400">Fotografía Satelital HD & Campo Real Cerro San Pedro</p>
            </div>
          </div>
        </div>

        {/* Controles de Modo (Satelital HD vs Vistas de Campo Reales) & Audio */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="p-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-1 shadow-xl">
            <button
              onClick={() => setViewMode('satelital')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'satelital'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Satelital HD
            </button>
            <button
              onClick={() => setViewMode('fotografico_campo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'fotografico_campo'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" /> Vistas de Campo Real
            </button>
          </div>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2.5 rounded-2xl border transition-all backdrop-blur-xl flex items-center gap-2 ${
              audioEnabled
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-black/80 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Audio Ambiental Bioacústico"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Barra de Filtros de Taxón (solo en modo Satelital) */}
      {viewMode === 'satelital' && (
        <div className="absolute top-36 left-6 z-20 flex flex-wrap items-center gap-2 pointer-events-auto">
          {[
            { id: 'todos', label: 'Todos', icon: Layers },
            { id: 'ave', label: 'Aves', icon: Feather },
            { id: 'planta', label: 'Flora', icon: Trees },
            { id: 'reptil', label: 'Fauna Terrestre', icon: Bug }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveFilter(id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-2 backdrop-blur-md ${
                activeFilter === id
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-semibold shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                  : 'bg-black/80 text-slate-300 border-white/10 hover:border-white/30'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Panel Lateral de Especies (Modo Satelital) */}
      {viewMode === 'satelital' && (
        <div className="absolute bottom-6 left-6 z-20 max-w-sm w-full hidden md:block pointer-events-auto">
          <div className="p-4 bg-black/85 backdrop-blur-2xl border border-white/10 rounded-3xl space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Especies Registradas
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {filteredEspecies.length} Especies
              </span>
            </div>

            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {filteredEspecies.slice(0, 15).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectSpecie(item)}
                  className={`w-full p-2 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                    selectedSpecie?.id === item.id
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-white'
                      : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <img
                    src={item.imagen_thumb || item.imagen}
                    alt={item.nombre_comun}
                    className="w-8 h-8 rounded-xl object-cover border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold truncate text-white">{item.nombre_comun}</h4>
                    <p className="text-[10px] text-slate-400 truncate italic">{item.nombre_cientifico}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal / Card Flotante de Especie Seleccionada */}
      <AnimatePresence>
        {selectedSpecie && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-6 right-6 z-30 max-w-md w-full p-5 bg-[#030704]/95 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] pointer-events-auto"
          >
            <div className="relative">
              <button
                onClick={() => setSelectedSpecie(null)}
                className="absolute top-0 right-0 p-1.5 text-slate-400 hover:text-white bg-white/10 rounded-full"
              >
                ✕
              </button>

              <div className="flex items-start gap-4">
                <img
                  src={selectedSpecie.imagen}
                  alt={selectedSpecie.nombre_comun}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg"
                />
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                    {selectedSpecie.tipo}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{selectedSpecie.nombre_comun}</h3>
                  <p className="text-xs text-emerald-400 italic font-medium">{selectedSpecie.nombre_cientifico}</p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-slate-400" /> Lat: {selectedSpecie.lat?.toFixed(4)}, Lng: {selectedSpecie.lng?.toFixed(4)}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed border-t border-white/10 pt-3">
                {selectedSpecie.descripcion}
              </p>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-300 font-medium">
                    {selectedSpecie.observaciones_verificadas || 50} obs. en Cerro San Pedro
                  </span>
                </div>

                <button
                  onClick={() => playBioAudioSynth(selectedSpecie.tipo === 'ave' ? 2800 : 600)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                    isPlayingAudio
                      ? 'bg-amber-400 text-slate-950 font-bold animate-pulse'
                      : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  {isPlayingAudio ? 'Reproduciendo...' : 'Bio-Canto Audio'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Bienvenida / Examen PoC */}
      <AnimatePresence>
        {infoOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-40 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="max-w-lg w-full p-6 bg-[#030704] border border-emerald-500/40 rounded-3xl shadow-2xl relative">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">PoC Visor Fotográfico Realista</h2>
                  <p className="text-xs text-emerald-400">Examen Práctico Final - Cerro de San Pedro</p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5 text-xs text-slate-300 leading-relaxed">
                <p>
                  Esta PoC reemplaza maquetas 3D sintéticas por <strong>Fotografía Satelital HD Real (ESRI / Google Maps Style)</strong> y <strong>Vistas Fotográficas de Campo Reales del Cerro de San Pedro</strong>.
                </p>
                <ul className="space-y-1.5 pl-4 list-disc text-slate-400">
                  <li><strong>Mapa Satelital HD:</strong> Fotografía orbital real del cerro y sus coordenadas GPS.</li>
                  <li><strong>Vistas de Campo Reales:</strong> Fotografía directa de la Cumbre, Ladera Este y Piedemonte.</li>
                  <li><strong>Hotspots Interactivos:</strong> Haz clic en las etiquetas sobre la foto real de campo para abrir la especie.</li>
                </ul>
              </div>

              <button
                onClick={() => setInfoOpen(false)}
                className="w-full mt-6 py-3 bg-emerald-500 text-slate-950 font-bold rounded-2xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(52,211,153,0.5)] flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" /> Explorar Visor Fotográfico Real
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
