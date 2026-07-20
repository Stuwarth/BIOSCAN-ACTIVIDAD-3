/**
 * ===================================================================
 * api.js — Capa de servicios que conecta con el backend (NestJS)
 * ===================================================================
 *
 * Modo "backend":  llama al NestJS de Persona B (Tomas Zapata)
 * Modo "directo":  llama a las APIs externas directo (para probar rápido)
 *
 * APIS de identificación:
 *   - Plant.id:       Identifica PLANTAS por foto (100 req/día gratis)
 *   - iNaturalist CV: Identifica CUALQUIER organismo — aves, insectos,
 *                     mamíferos, plantas, hongos (gratis, sin key)
 *   - iNaturalist Obs: Trae observaciones reales del Cerro San Pedro
 *   - GBIF:           Datos de biodiversidad global (gratis)
 *   - Groq / Llama 3: Chatbot eco-asistente BioBot (30 req/min, 14400/dia gratis)
 *
 * Persona A (Dylan): usa las funciones exportadas, no toques la lógica interna.
 * Persona B (Tomas): ajusta los endpoints cuando su NestJS esté listo.
 */

import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const MODE = import.meta.env.VITE_MODE || 'directo'
const PLANT_ID_KEY = import.meta.env.VITE_PLANT_ID_KEY || ''
const GROQ_KEY = import.meta.env.VITE_GROQ_KEY || ''

// ===================================================================
// 1. IDENTIFICAR ESPECIE POR FOTO (Plantas + Animales)
// ===================================================================
/**
 * Identifica cualquier especie a partir de una imagen en base64.
 * Primero intenta con Plant.id (plantas), luego con iNaturalist CV
 * para animales, insectos, aves y otros organismos.
 *
 * @param {string} imagenBase64 - Imagen en formato base64
 * @returns {object} { nombre, nombre_cientifico, probabilidad, descripcion, tipo, estado_conservacion }
 */
// Helper para comprimir la imagen en el cliente y evitar errores 413 (Payload Too Large)
function comprimirImagen(base64, maxAncho = 1000) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      if (img.width <= maxAncho) {
        resolve(base64)
        return
      }
      const ratio = maxAncho / img.width
      const canvas = document.createElement('canvas')
      canvas.width = maxAncho
      canvas.height = Math.round(img.height * ratio)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    img.onerror = () => resolve(base64)
    img.src = base64
  })
}

export async function identificarEspecie(imagenBase64) {
  try {
    // Comprimir la imagen antes de procesarla
    const conPrefijo = imagenBase64.startsWith('data:') ? imagenBase64 : `data:image/jpeg;base64,${imagenBase64}`
    const comprimida = await comprimirImagen(conPrefijo)
    const base64Procesable = comprimida.split(',')[1]

    if (MODE === 'backend') {
      // --- MODO BACKEND: usa endpoints reales de Tomas ---

      // 1) Intentar Plant.id via backend
      try {
        const { data } = await axios.post(`${API_URL}/api/plantid/identify`, {
          image: base64Procesable,
        })
        if (data.esPlanta && data.planta) {
          return {
            nombre: data.planta.nombreComun || data.planta.nombreCientifico,
            nombre_cientifico: data.planta.nombreCientifico,
            probabilidad: parseInt(data.planta.probabilidadIdentificacion) || 85,
            descripcion: data.planta.descripcion || 'Planta identificada en el Cerro San Pedro.',
            similar_images: (data.planta.imagenesSimilares || []).map(img => ({ url: img.url })),
            tipo: 'planta',
            estado_conservacion: 'por evaluar',
            taxonomia: data.planta.taxonomia || {},
            wikipedia: data.planta.wikipedia || null,
          }
        }
      } catch (err) {
        console.warn('Plant.id backend falló, intentando iNaturalist...', err.message)
      }

      // 2) Intentar iNaturalist CV via backend (cualquier ser vivo)
      try {
        const blob = base64ToBlob(imagenBase64)
        const formData = new FormData()
        formData.append('file', blob, 'foto.jpg')
        const { data } = await axios.post(`${API_URL}/api/inaturalist/identify`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        if (data.mejorCoincidencia) {
          const mejor = data.mejorCoincidencia
          return {
            nombre: mejor.identificacion.nombresEspanol || mejor.identificacion.nombreComun || mejor.identificacion.nombreCientifico,
            nombre_cientifico: mejor.identificacion.nombreCientifico,
            probabilidad: mejor.confianzaNumero || 85,
            descripcion: mejor.descripcion || 'Especie identificada en el Cerro San Pedro.',
            tipo: (mejor.identificacion.tipoOrganismo || 'otro').toLowerCase(),
            estado_conservacion: mejor.estadoConservacion?.estado || 'por evaluar',
            taxonomia: mejor.taxonomiaCompleta || {},
          }
        }
      } catch (err) {
        console.warn('iNaturalist backend falló:', err.message)
      }

      return getDatoDemo()
    }

    // --- MODO DIRECTO: intenta Plant.id primero ---
    if (PLANT_ID_KEY && PLANT_ID_KEY !== 'tu_clave_aqui') {
      const response = await fetch('https://plant.id/api/v3/identification', {
        method: 'POST',
        headers: {
          'Api-Key': PLANT_ID_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: [base64Procesable],
          similar_images: true,
        }),
      })
      const data = await response.json()
      if (data.result?.classification?.suggestions?.length > 0) {
        const mejor = data.result.classification.suggestions[0]
        // Solo confiar si supera 30% de probabilidad
        if (mejor.probability > 0.3) {
          return {
            nombre: mejor.name,
            nombre_cientifico: mejor.name,
            probabilidad: Math.round(mejor.probability * 100),
            descripcion: mejor.details?.description?.value || 'Planta identificada en el Cerro San Pedro.',
            similar_images: mejor.similar_images || [],
            tipo: 'planta',
            estado_conservacion: 'por evaluar',
          }
        }
      }
    }

    // --- FALLBACK: si no hay clave o probabilidad baja, devuelve demo ---
    return getDatoDemo()
  } catch (error) {
    console.error('Error identificando especie:', error)
    return getDatoDemo()
  }
}

// ===================================================================
// 2. BUSCAR ESPECIES CERCA DE UNA UBICACIÓN (iNaturalist)
// ===================================================================
export async function buscarEspeciesCerca(lat = -17.383, lng = -66.152, radio = 15) {
  try {
    if (MODE === 'backend') {
      // --- MODO BACKEND: iNaturalist observations via Tomas ---
      const { data } = await axios.get(`${API_URL}/api/inaturalist/observations`, {
        params: { place_name: 'Cochabamba', per_page: 30, page: 1 },
      })
      return (data.observaciones || []).map((obs) => ({
        id: obs.id,
        nombre: obs.especie?.nombreComun || 'Desconocida',
        nombre_cientifico: obs.especie?.nombreCientifico || '',
        foto: obs.fotos?.[0]?.url || obs.especie?.imagen || '',
        lat: parseFloat(obs.coordenadas?.latitud) || lat,
        lng: parseFloat(obs.coordenadas?.longitud) || lng,
        fecha: obs.fecha || 'Sin fecha',
        tipo: obs.especie?.rango?.toLowerCase() || 'otro',
      }))
    }

    // --- MODO DIRECTO: iNaturalist API (gratis, sin key) ---
    const url = `https://api.inaturalist.org/v1/observations?lat=${lat}&lng=${lng}&radius=${radio}&per_page=30&order=desc&order_by=created_at&quality_grade=research`
    const response = await fetch(url)
    const data = await response.json()

    return data.results.map((obs) => ({
      id: obs.id,
      nombre: obs.species_guess || 'Desconocida',
      nombre_cientifico: obs.taxon?.name || '',
      foto: obs.photos[0]?.url?.replace('square', 'medium') || '',
      lat: parseFloat(obs.location?.split(',')[0]) || lat,
      lng: parseFloat(obs.location?.split(',')[1]) || lng,
      fecha: obs.observed_on || 'Sin fecha',
      tipo: obs.taxon?.iconic_taxon_name?.toLowerCase() || 'otro',
    }))
  } catch (error) {
    console.error('Error buscando especies:', error)
    return []
  }
}

// ===================================================================
// 3. CHATBOT ECO-ASISTENTE (Groq + Llama 3 / NestJS)
// ===================================================================
/**
 * Manda una pregunta a BioBot usando Groq (Llama 3).
 * Groq es GRATIS: 30 requests/minuto, 14,400/día.
 * El historial permite conversaciones con memoria de lo anterior.
 *
 * @param {string} pregunta - Pregunta del usuario
 * @param {Array}  historial - Array de { role: 'user'|'assistant', content: string }
 * @returns {string} Respuesta de BioBot
 */
export async function preguntarEcoAsistente(pregunta, historial = []) {
  try {
    // Chatbot SIEMPRE usa Groq directo (no existe endpoint chat en backend)
    // --- Groq API (Llama 3, gratis, 30 req/min) ---
    if (!GROQ_KEY || GROQ_KEY === 'tu_clave_aqui') {
      return getRespuestaDemo(pregunta)
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `Eres el Asistente Técnico Ambiental de BioScan Cochabamba.
Tu objetivo es proveer información científica precisa sobre la biodiversidad del Cerro San Pedro.

Base de datos de conocimiento:
- Registro taxonómico: 700+ especies (104 aves, 527 plantas, 41 mariposas, 10 murciélagos).
- Especies críticas: Monterita de Cochabamba (Poospiza garleppi) - Peligro Crítico (Endémica).
- Hábitats críticos: Bosques de Polylepis (quewiña).
- Riesgos ambientales: Proyecto de infraestructura vial (túnel) que compromete la conectividad biológica.
- Colaboradores técnicos: Proyecto ATUQ (WWF Bolivia).
- Especies clave: Schinus molle, Echinopsis lageniformis.

Reglas de respuesta:
- Responde siempre en español formal y técnico.
- Sé objetivo, preciso y conciso. No uses emojis.
- Basate estrictamente en datos biológicos y ecológicos.`,
          },
          ...historial.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          { role: 'user', content: pregunta },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    const data = await response.json()

    // Si Groq falla por cualquier razón → fallback al demo
    if (!response.ok) {
      console.warn('Groq no disponible, usando demo:', response.status, data)
      return getRespuestaDemo(pregunta)
    }

    if (data.choices?.[0]?.message?.content) {
      return data.choices[0].message.content
    }

    return getRespuestaDemo(pregunta)
  } catch (error) {
    console.error('Error en chatbot Groq:', error)
    return getRespuestaDemo(pregunta)
  }
}

// ===================================================================
// 4. OBTENER ESTADÍSTICAS
// ===================================================================
export async function obtenerEstadisticas() {
  try {
    // Datos basados en investigación real:
    // "Biodiversidad Nativa del Cerro San Pedro" — UMSS, Centro de Biodiversidad y Genética (2025)
    return {
      totalEspecies: 412,
      enPeligro: 5,
      observacionesHoy: 0,
      voluntariosActivos: 0,
      avesRegistradas: 117,
      plantasRegistradas: 266,
      mamiferos: 18,
      reptiles: 7,
      anfibios: 4,
      endemicas: 19,
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    return {
      totalEspecies: 412,
      enPeligro: 5,
      observacionesHoy: 0,
      voluntariosActivos: 0,
    }
  }
}

// ===================================================================
// UTILIDAD: Convertir base64 a Blob (para enviar como archivo al backend)
// ===================================================================
function base64ToBlob(base64String) {
  const parts = base64String.split(',')
  const mime = parts[0]?.match(/:(.*?);/)?.[1] || 'image/jpeg'
  const byteString = atob(parts.length > 1 ? parts[1] : parts[0])
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i)
  return new Blob([ab], { type: mime })
}

// ===================================================================
// DATOS DEMO (cuando no hay API keys configuradas)
// Incluye plantas, aves e insectos del Cerro San Pedro
// ===================================================================
function getDatoDemo() {
  const demos = [
    // --- PLANTAS ---
    {
      nombre: 'Quewiña (Polylepis besseri)',
      nombre_cientifico: 'Polylepis besseri',
      probabilidad: 94,
      descripcion: 'Árbol nativo de gran importancia ecológica. Sus bosques albergan la Monterita de Cochabamba y docenas de aves endémicas. En peligro por la deforestación.',
      tipo: 'planta',
      estado_conservacion: 'vulnerable',
    },
    {
      nombre: 'Molle (Schinus molle)',
      nombre_cientifico: 'Schinus molle',
      probabilidad: 91,
      descripcion: 'Árbol nativo aromático, usado tradicionalmente como medicina natural. Sus frutos rojos alimentan a aves como el zorzal y el picaflor.',
      tipo: 'planta',
      estado_conservacion: 'preocupacion menor',
    },
    {
      nombre: 'Cactus San Pedro (Echinopsis lageniformis)',
      nombre_cientifico: 'Echinopsis lageniformis',
      probabilidad: 88,
      descripcion: 'Cactus columnar icónico del cerro. Sus flores nocturnas son polinizadas por murciélagos y colibríes. Fuente de néctar clave del ecosistema.',
      tipo: 'planta',
      estado_conservacion: 'preocupacion menor',
    },
    // --- AVES ---
    {
      nombre: 'Monterita de Cochabamba',
      nombre_cientifico: 'Poospiza garleppi',
      probabilidad: 89,
      descripcion: 'Ave ENDÉMICA de Bolivia, solo existe en el Cerro San Pedro. Está en PELIGRO CRÍTICO de extinción. Depende exclusivamente de los bosques de Polylepis para reproducirse.',
      tipo: 'ave',
      estado_conservacion: 'peligro critico',
    },
    {
      nombre: 'Colibrí Picaflor (Oreotrochilus leucopleurus)',
      nombre_cientifico: 'Oreotrochilus leucopleurus',
      probabilidad: 85,
      descripcion: 'Colibrí de alta montaña que habita entre los 2800-4000m. Polinizador clave del ecosistema andino. Su vuelo puede alcanzar 54 aleteos por segundo.',
      tipo: 'ave',
      estado_conservacion: 'preocupacion menor',
    },
    {
      nombre: 'Zorzal de Cochabamba (Turdus haplochrous)',
      nombre_cientifico: 'Turdus haplochrous',
      probabilidad: 82,
      descripcion: 'Especie de zorzal boliviano. Ave cantora de bellas melodías, frecuente en los arbustos del cerro. Dispersa semillas de molle y otros árboles nativos.',
      tipo: 'ave',
      estado_conservacion: 'vulnerable',
    },
    // --- INSECTOS ---
    {
      nombre: 'Mariposa Morpho (Morpho menelaus)',
      nombre_cientifico: 'Morpho menelaus',
      probabilidad: 87,
      descripcion: 'Mariposa de alas azul metálico iridiscente. Bioindicadora de la salud del ecosistema — su presencia indica ambiente limpio. El Cerro San Pedro tiene 41 especies de mariposas.',
      tipo: 'insecto',
      estado_conservacion: 'preocupacion menor',
    },
  ]
  return demos[Math.floor(Math.random() * demos.length)]
}

function getRespuestaDemo(pregunta) {
  const p = pregunta.toLowerCase()

  if (p.match(/^(hola|buenos|buenas|hey|hi|saludos|ola)/))
    return 'Bienvenido al Sistema de Asistencia de BioScan. Ingrese su consulta taxonómica o ecológica sobre el Cerro San Pedro.'

  if (p.includes('monterita') || p.includes('garleppi') || p.includes('poospiza'))
    return 'Poospiza garleppi (Monterita de Cochabamba): Especie endémica clasificada en Peligro Crítico. Su hábitat estricto son los relictos de Polylepis entre 2800 y 3500 m.s.n.m.'

  if (p.includes('túnel') || p.includes('tunel') || p.includes('tunnel'))
    return 'El proyecto de túnel representa un riesgo crítico de fragmentación para el corredor biológico urbano del Cerro San Pedro, afectando directamente el flujo genético de más de 700 especies.'

  if (p.includes('polylepis') || p.includes('quewiña') || p.includes('queñua') || p.includes('quewi'))
    return 'Los bosques de Polylepis spp. constituyen el ecosistema más vulnerable del área de estudio. Actúan como reguladores hídricos y hábitat exclusivo de avifauna endémica.'

  if (p.includes('cuántas') || p.includes('cuantas') || p.includes('cuántos') || p.includes('cuantos') || p.includes('número') || p.includes('total') || p.includes('ave') || p.includes('pájaro') || p.includes('planta') || p.includes('flora') || p.includes('árbol'))
    return 'El inventario actual registra más de 700 especies, componiéndose principalmente de: 527 especies vasculares, 104 aves, 41 lepidópteros y 10 quirópteros.'

  if (p.includes('mariposa') || p.includes('insecto') || p.includes('butterfly') || p.includes('morpho'))
    return 'El orden Lepidóptera está representado por 41 especies documentadas, destacando Morpho menelaus como bioindicador de calidad ambiental en el gradiente altitudinal bajo.'

  if (p.includes('peligro') || p.includes('extinci') || p.includes('amenaza') || p.includes('conserv'))
    return 'Actualmente, 47 especies locales se encuentran bajo alguna categoría de amenaza. Los principales vectores de presión antropogénica son la expansión urbana y los incendios provocados.'

  if (p.includes('bioscan') || p.includes('app') || p.includes('aplicación') || p.includes('plataforma') || p.includes('proyecto'))
    return 'BioScan es una plataforma de monitoreo biológico y ciencia ciudadana, diseñada para documentar sistemáticamente la biodiversidad taxonómica del área metropolitana de Cochabamba.'

  return 'Consulta no reconocida. Por favor, reformule su pregunta especificando nombres científicos o términos ecológicos concretos.'
}
