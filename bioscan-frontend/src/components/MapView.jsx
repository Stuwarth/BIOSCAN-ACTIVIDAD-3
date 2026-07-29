import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { motion } from 'framer-motion'
import { MapPin, Loader2, ExternalLink } from 'lucide-react'
import { buscarEspeciesCerca } from '../services/api'
import { getObservaciones } from '../services/observaciones'
import especiesReferencia from '../data/especies.json'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet + bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Color mapping by species type
const tipoColor = {
  ave: '#3b82f6',
  mamifero: '#f59e0b',
  planta: '#16a34a',
  reptil: '#8b5cf6',
  anfibio: '#06b6d4',
  insecto: '#f97316',
  otro: '#6b7280',
}

// Create a circular photo marker icon
const createPhotoIcon = (imageUrl, tipo) => {
  const borderColor = tipoColor[tipo] || tipoColor.otro
  return new L.DivIcon({
    className: 'photo-marker',
    html: `<div class="photo-marker-inner" style="border-color:${borderColor}">
      <img src="${imageUrl}" alt="" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'color-marker-dot\\'></div>';this.parentElement.style.background='${borderColor}';this.parentElement.style.display='flex';this.parentElement.style.alignItems='center';this.parentElement.style.justifyContent='center'" />
    </div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -24],
  })
}

// Fallback color marker (when no photo available)
const createColorIcon = (color) =>
  new L.DivIcon({
    className: 'photo-marker',
    html: `<div class="color-marker-inner" style="background:${color}">
      <div class="color-marker-dot"></div>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  })

// Cerro San Pedro center
const CENTER = [-17.383, -66.152]

function FitBounds({ markers }) {
  const map = useMap()
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.latitud || m.lat, m.longitud || m.lng]))
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 })
    }
  }, [markers, map])
  return null
}

export default function MapView({ fullPage = false }) {
  const [especies, setEspecies] = useState(() => {
    const obs = getObservaciones()
    // Include reference species documented by UMSS
    const ref = especiesReferencia.map((e, i) => ({ ...e, id: e.id || `ref-${i}`, fuente: e.fuente || 'UMSS-CBG' }))
    return [...obs, ...ref]
  })
  const [filtro, setFiltro] = useState('todos')
  const [loading, setLoading] = useState(false)

  // Refresh observations when a new one is saved
  useEffect(() => {
    const refresh = () => {
      const obs = getObservaciones()
      const ref = especiesReferencia.map((e, i) => ({ ...e, id: e.id || `ref-${i}`, fuente: e.fuente || 'UMSS-CBG' }))
      setEspecies((prev) => {
        const inat = prev.filter((e) => e.fuente === 'inaturalist')
        return [...obs, ...ref, ...inat]
      })
    }
    window.addEventListener('bioscan-observacion-nueva', refresh)
    return () => window.removeEventListener('bioscan-observacion-nueva', refresh)
  }, [])

  const cargarINaturalist = async () => {
    setLoading(true)
    try {
      const data = await buscarEspeciesCerca(-17.383, -66.152, 15)
      if (data.length > 0) {
        const observaciones = getObservaciones()
        const combined = [
          ...observaciones,
          ...data.map((d, i) => ({
            id: 1000 + i,
            nombre_comun: d.nombre,
            nombre_cientifico: d.nombre_cientifico,
            tipo: d.tipo || 'otro',
            estado_conservacion: 'no evaluado',
            descripcion: `Observación de iNaturalist — ${d.fecha}`,
            latitud: d.lat,
            longitud: d.lng,
            imagen: d.foto,
            imagen_thumb: d.foto?.replace('medium', 'square'),
            fuente: 'inaturalist',
          })),
        ]
        setEspecies(combined)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtradas = filtro === 'todos' ? especies : especies.filter((e) => e.tipo === filtro)
  const tipos = ['todos', ...new Set(especies.map((e) => e.tipo).filter(Boolean))]

  // Get the best thumbnail URL for a species
  const getThumbUrl = (esp) => {
    // Prefer imagen_thumb (square), fall back to imagen (medium)
    if (esp.imagen_thumb) return esp.imagen_thumb
    if (esp.imagen) {
      // Try to convert medium URL to square
      return esp.imagen.replace('/medium.', '/square.').replace('/medium/', '/square/')
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={fullPage ? 'h-full' : ''}
    >
      {!fullPage && (
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tighter">
            Mapa de Biodiversidad
          </h2>
          <p className="text-slate-400 font-medium">
            Ubicación de las especies registradas en el Cerro San Pedro
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {tipos.map((tipo) => (
          <button
            key={tipo}
            onClick={() => setFiltro(tipo)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all capitalize border
              ${filtro === tipo
                ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(22,163,74,0.3)]'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
          >
            {tipo === 'todos' ? 'Todos' : tipo}
          </button>
        ))}

        <button
          onClick={cargarINaturalist}
          disabled={loading}
          className="ml-auto flex items-center gap-2 px-5 py-2 bg-white/10 border border-white/20 text-white rounded-full text-sm font-medium hover:bg-white/20 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
          Cargar iNaturalist
        </button>
      </div>

      {/* Map */}
      <div className={`rounded-3xl overflow-hidden shadow-2xl border border-white/10 ${fullPage ? 'h-[calc(100vh-280px)]' : 'h-[600px] relative z-10'}`}>
        <MapContainer center={CENTER} zoom={14} className="w-full h-full bg-[#030704]" scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds markers={filtradas} />

          {filtradas.map((esp) => {
            const thumbUrl = getThumbUrl(esp)
            const icon = thumbUrl
              ? createPhotoIcon(thumbUrl, esp.tipo)
              : createColorIcon(tipoColor[esp.tipo] || tipoColor.otro)

            return (
              <Marker
                key={esp.id}
                position={[esp.latitud || esp.lat, esp.longitud || esp.lng]}
                icon={icon}
              >
                <Popup>
                  <div className="text-center min-w-[200px] max-w-[260px]">
                    {esp.imagen && (
                      <img
                        src={esp.imagen}
                        alt={esp.nombre_comun}
                        className="w-full h-28 object-cover rounded-lg mb-2"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    )}
                    <p className="font-bold text-sm text-gray-900">{esp.nombre_comun}</p>
                    <p className="text-xs italic text-gray-500">{esp.nombre_cientifico}</p>
                    {esp.familia && (
                      <p className="text-[10px] text-gray-400 mt-0.5">Familia: {esp.familia}</p>
                    )}
                    <div className="flex items-center justify-center gap-1.5 mt-1.5 flex-wrap">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium
                        ${esp.estado_conservacion === 'en peligro' ? 'bg-red-500/20 text-red-600' :
                          esp.estado_conservacion === 'vulnerable' ? 'bg-amber-500/20 text-amber-600' :
                          'bg-green-500/20 text-green-600'}`}
                      >
                        {esp.estado_conservacion}
                      </span>
                      {esp.endemic && (
                        <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 font-medium">
                          Endémica
                        </span>
                      )}
                    </div>
                    {esp.observaciones_verificadas && (
                      <p className="text-[10px] text-gray-400 mt-1">
                        {esp.observaciones_verificadas} obs. verificadas
                      </p>
                    )}
                    {esp.fuente && (
                      <p className="text-[9px] text-gray-300 mt-1 opacity-70">
                        Fuente: {esp.fuente}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {Object.entries(tipoColor).filter(([k]) => k !== 'otro').map(([tipo, color]) => (
          <div key={tipo} className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-3 h-3 rounded-full shadow-sm" style={{ background: color }} />
            <span className="capitalize">{tipo}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
