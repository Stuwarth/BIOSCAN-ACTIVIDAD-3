import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { motion } from 'framer-motion'
import { MapPin, Loader2 } from 'lucide-react'
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

// Custom marker icons by type
const createIcon = (color) =>
  new L.DivIcon({
    className: '',
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center">
      <div style="width:8px;height:8px;background:white;border-radius:50%"></div>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  })

const tipoColor = {
  ave: '#3b82f6',
  mamifero: '#f59e0b',
  planta: '#16a34a',
  reptil: '#8b5cf6',
  anfibio: '#06b6d4',
  insecto: '#f97316',
  otro: '#6b7280',
}

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
    // Incluir especies de referencia documentadas por UMSS
    const ref = especiesReferencia.map((e, i) => ({ ...e, id: `ref-${i}`, fuente: e.fuente || 'UMSS-CBG' }))
    return [...obs, ...ref]
  })
  const [filtro, setFiltro] = useState('todos')
  const [loading, setLoading] = useState(false)

  // Refrescar observaciones cuando se guarda una nueva
  useEffect(() => {
    const refresh = () => {
      const obs = getObservaciones()
      const ref = especiesReferencia.map((e, i) => ({ ...e, id: `ref-${i}`, fuente: e.fuente || 'UMSS-CBG' }))
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

          {filtradas.map((esp) => (
            <Marker
              key={esp.id}
              position={[esp.latitud || esp.lat, esp.longitud || esp.lng]}
              icon={createIcon(tipoColor[esp.tipo] || tipoColor.otro)}
            >
              <Popup>
                <div className="text-center min-w-[180px]">
                  {esp.imagen && (
                    <img
                      src={esp.imagen}
                      alt={esp.nombre_comun}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  )}
                  <p className="font-bold text-sm">{esp.nombre_comun}</p>
                  <p className="text-xs italic text-gray-500">{esp.nombre_cientifico}</p>
                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full
                    ${esp.estado_conservacion === 'en peligro' ? 'bg-red-500/20 text-red-500' :
                      esp.estado_conservacion === 'vulnerable' ? 'bg-amber-500/20 text-amber-500' :
                      'bg-primary/20 text-primary'}`}
                  >
                    {esp.estado_conservacion}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
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
