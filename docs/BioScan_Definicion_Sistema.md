# BioScan Cochabamba — Definición del Sistema

## 1. Organización

| Integrante | Rol |
|---|---|
| Dylan | Líder de Proyecto / Frontend Engineer |
| Miguel | Backend Engineer / Integración IA |
| Gabo | Investigación de Datos / Base Taxonómica |
| Aron | QA / Documentación / Pitch |

- **Universidad:** UPDS — Universidad Privada Domingo Savio, Sede Cochabamba.
- **Carrera:** Ingeniería en Sistemas e Informática.
- **Origen del proyecto:** Tech4Future Hack 2026 (Hub Boliviano de IA × Microsoft Learn Student Ambassadors).
- **Resultado:** Primer lugar en la competencia.

---

## 2. Problema

### 2.1 Contexto geográfico y ecológico

El Cerro San Pedro es el último gran pulmón ecológico de la zona metropolitana de Cochabamba. Estudios recientes realizados por el Centro de Biodiversidad y Genética de la Universidad Mayor de San Simón (UMSS), junto con ONGs como FAUNAGUA y WWF Bolivia, han documentado que este cerro alberga una riqueza biológica significativa que persiste a pesar de la presión urbana:

- **Flora:** Más de 266 especies vegetales documentadas, incluyendo 19 endémicas. Destacan los remanentes del bosque seco de Soto (*Schinopsis haenkeana*), además de cactáceas y bromeliáceas únicas de la región.
- **Fauna:** Entre 13 y 18 especies de mamíferos nativos (zorro andino, gato montés, hurón), 117 taxones de avifauna, 9 especies de murciélagos insectívoros, 7 reptiles y 4 anfibios amenazados.

### 2.2 Amenazas identificadas

1. **Infraestructura vial:** La construcción del túnel de El Abra y la ampliación de avenidas ha fragmentado el hábitat natural del cerro, cortando el libre tránsito de fauna silvestre y generando contaminación por escombros.
2. **Expansión urbana no regulada:** Asentamientos ilegales en las laderas del cerro destruyen cobertura vegetal nativa y desplazan a las especies.
3. **Incendios forestales antrópicos:** Quemas provocadas para habilitar terrenos causan pérdida masiva de biomasa y destrucción de ecosistemas que tardaron décadas en formarse.
4. **Contaminación:** Sonora, lumínica y por residuos sólidos (basurales clandestinos en zonas aledañas a las obras).
5. **Introducción de flora invasora:** Especies no endémicas que desplazan a las nativas.

### 2.3 Problema central

**No existe una infraestructura tecnológica accesible** que permita a ciudadanos, investigadores o autoridades municipales documentar, identificar, mapear y monitorear la biodiversidad del Cerro San Pedro en tiempo real. Sin datos actualizados y georreferenciados, las decisiones de conservación se toman sin evidencia suficiente, y las especies amenazadas continúan desapareciendo sin registro.

---

## 3. Usuarios

| Tipo de usuario | Descripción | Necesidad principal |
|---|---|---|
| **Ciudadano** | Habitante de Cochabamba interesado en la naturaleza y la conservación (ciencia ciudadana). | Identificar especies que encuentra en el cerro y contribuir al registro colectivo. |
| **Investigador / Biólogo** | Profesional o estudiante de la UMSS u otras instituciones académicas. | Consultar datos taxonómicos verificados y visualizar distribución geoespacial de especies. |
| **Autoridad municipal** | Funcionario de la Alcaldía de Cochabamba o del gobierno departamental. | Obtener evidencia científica para la toma de decisiones sobre infraestructura y conservación. |
| **ONG ambiental** | Organizaciones como WWF, FAUNAGUA, grupos ciudadanos (Proyecto Parada Cero, ATUQ). | Monitorear el estado de conservación de especies y justificar proyectos de reforestación o corredores biológicos. |
| **Estudiante universitario** | Estudiante de biología, ingeniería ambiental o carreras afines. | Aprender sobre la biodiversidad local y realizar consultas rápidas sin buscar en múltiples fuentes. |

---

## 4. Objetivos

### 4.1 Objetivo General

Desarrollar una plataforma web de ciencia ciudadana impulsada por inteligencia artificial (visión computacional) para la identificación, geolocalización y monitoreo de la biodiversidad del Cerro San Pedro en Cochabamba, Bolivia.

### 4.2 Objetivos Específicos

| ID | Objetivo |
|---|---|
| OE-01 | Implementar un módulo de identificación de especies mediante análisis de fotografías utilizando la API de Plant.id (Kindwise) y datos de iNaturalist. |
| OE-02 | Desarrollar un mapa interactivo geoespacial con Leaflet.js para visualizar los puntos de avistamiento documentados por los usuarios. |
| OE-03 | Construir un catálogo taxonómico digital consultable con datos validados por investigaciones de la UMSS y la base de datos global GBIF. |
| OE-04 | Integrar un eco-asistente conversacional con IA (Groq / Llama 3) especializado en biodiversidad del Cerro San Pedro. |
| OE-05 | Generar datos abiertos y georreferenciados que sirvan como evidencia científica para la toma de decisiones de conservación por parte de autoridades y ONGs. |

---

## 5. Alcance

### 5.1 Dentro del alcance (MVP)

- Módulo de escaneo e identificación de especies por fotografía (plantas y aves).
- Catálogo taxonómico digital con filtros por tipo de especie, estado de conservación y nombre.
- Mapa interactivo con marcadores geolocalizados de observaciones.
- Chatbot eco-asistente con conocimiento contextualizado del Cerro San Pedro.
- Dashboard de estadísticas generales (conteo de especies, distribución por tipo).
- Interfaz web responsiva (desktop y móvil).

### 5.2 Fuera del alcance (Versiones futuras)

- Aplicación móvil nativa (Android/iOS).
- Integración con sensores IoT para monitoreo ambiental automatizado.
- Conexión directa con bases de datos gubernamentales o del SERNAP.
- Sistema de moderación avanzada de contenido generado por usuarios.
- Identificación de mamíferos, reptiles y anfibios (requiere modelos de IA especializados adicionales).
- Modo offline para zonas sin conectividad en el cerro.

---

## 6. Requerimientos Funcionales

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-01 | El sistema debe permitir al usuario subir una fotografía de una especie (JPG, PNG, WEBP, máx. 10 MB) y obtener su identificación taxonómica mediante el motor de visión computacional. | Alta |
| RF-02 | El sistema debe solicitar permisos de geolocalización al navegador para asociar coordenadas GPS (latitud, longitud, precisión) a cada observación registrada. | Alta |
| RF-03 | El sistema debe mostrar un mapa interactivo (Leaflet.js) con marcadores que representen los puntos de avistamiento registrados, permitiendo hacer clic en cada marcador para ver los detalles de la observación. | Alta |
| RF-04 | El sistema debe mantener un catálogo taxonómico consultable con filtros por: tipo de especie (ave, planta, mamífero, reptil, anfibio, insecto), estado de conservación (en peligro, vulnerable, preocupación menor, no evaluado) y búsqueda por nombre común o científico. | Alta |
| RF-05 | El sistema debe ofrecer un chatbot eco-asistente (Groq / Llama 3) capaz de responder consultas en lenguaje natural sobre biodiversidad del Cerro San Pedro, usando contexto científico inyectado. | Media |
| RF-06 | El sistema debe permitir guardar observaciones en un repositorio persistente (localStorage / Supabase), incluyendo: nombre de la especie, nombre científico, tipo, estado de conservación, descripción, coordenadas, imagen miniatura y porcentaje de confianza de la IA. | Alta |
| RF-07 | El sistema debe mostrar un dashboard con estadísticas de las especies registradas: total de observaciones, distribución por tipo y conteo por estado de conservación. | Media |

---

## 7. Requerimientos No Funcionales

| ID | Requerimiento | Categoría |
|---|---|---|
| RNF-01 | La interfaz debe cargar completamente en menos de 3 segundos en conexiones estándar (4G / WiFi). | Rendimiento |
| RNF-02 | La identificación por IA debe devolver resultados en menos de 10 segundos desde el envío de la imagen. | Rendimiento |
| RNF-03 | El diseño debe ser completamente responsivo, adaptándose a pantallas de escritorio (1920x1080), tabletas (768x1024) y móviles (375x812). | Usabilidad |
| RNF-04 | El sistema debe funcionar correctamente en los navegadores modernos: Google Chrome, Mozilla Firefox y Microsoft Edge (últimas 2 versiones). | Compatibilidad |
| RNF-05 | La arquitectura debe seguir el patrón Cliente-Servidor con separación en capas (NestJS en backend), permitiendo escalabilidad horizontal futura. | Arquitectura |
| RNF-06 | Los datos de biodiversidad deben provenir exclusivamente de fuentes verificadas: investigaciones de la UMSS, iNaturalist API y GBIF API. | Confiabilidad |
| RNF-07 | La interfaz debe cumplir con principios de accesibilidad básica: contraste de texto adecuado, navegación por teclado y etiquetas semánticas HTML5. | Accesibilidad |

---

## 8. Casos de Uso

### CU-01: Identificar especie por fotografía
- **Actor:** Ciudadano / Investigador
- **Precondición:** El usuario tiene una foto de una especie del Cerro San Pedro.
- **Flujo principal:**
  1. El usuario accede a la sección de identificación.
  2. Arrastra o selecciona una fotografía.
  3. El sistema solicita permiso de geolocalización.
  4. El usuario acepta o rechaza el permiso.
  5. El usuario presiona "Ejecutar Algoritmo de Visión".
  6. El sistema envía la imagen al motor de IA y muestra los resultados (nombre, nombre científico, probabilidad, estado de conservación, descripción).
- **Postcondición:** El usuario puede guardar la observación o hacer un nuevo análisis.

### CU-02: Consultar catálogo taxonómico
- **Actor:** Investigador / Estudiante
- **Precondición:** Existen registros en la base de datos.
- **Flujo principal:**
  1. El usuario navega a la sección Catálogo.
  2. El sistema muestra todas las especies registradas.
  3. El usuario aplica filtros (tipo, estado, búsqueda textual).
  4. El sistema actualiza la vista con los resultados filtrados.
- **Postcondición:** El usuario visualiza las especies que coinciden con sus criterios.

### CU-03: Visualizar mapa de avistamientos
- **Actor:** Autoridad municipal / ONG / Ciudadano
- **Precondición:** Existen observaciones geolocalizadas.
- **Flujo principal:**
  1. El usuario accede a la sección Mapa.
  2. El sistema muestra un mapa interactivo con marcadores.
  3. El usuario hace clic en un marcador.
  4. El sistema muestra el detalle de esa observación (especie, fecha, coordenadas, imagen).
- **Postcondición:** El usuario comprende la distribución espacial de las especies en el cerro.

### CU-04: Guardar observación con geolocalización
- **Actor:** Ciudadano / Investigador
- **Precondición:** El usuario ha completado una identificación exitosa (CU-01).
- **Flujo principal:**
  1. El usuario presiona "Guardar Observación".
  2. El sistema muestra un modal de confirmación con los datos taxonómicos y las coordenadas.
  3. El usuario confirma el guardado.
  4. El sistema persiste la observación y dispara una notificación de confirmación.
- **Postcondición:** La observación aparece en el Catálogo y en el Mapa.

### CU-05: Interactuar con el eco-asistente
- **Actor:** Estudiante / Ciudadano
- **Precondición:** Ninguna.
- **Flujo principal:**
  1. El usuario abre el chatbot desde el botón flotante.
  2. Escribe una consulta en lenguaje natural (ej: "¿Qué mamíferos viven en el Cerro San Pedro?").
  3. El sistema envía la consulta al motor de IA con contexto inyectado.
  4. El eco-asistente responde con información verificada.
- **Postcondición:** El usuario obtiene información contextualizada sin buscar en múltiples fuentes.

### CU-06: Filtrar especies por estado de conservación
- **Actor:** ONG / Autoridad municipal
- **Precondición:** Existen registros en el catálogo.
- **Flujo principal:**
  1. El usuario accede al Catálogo.
  2. Selecciona el filtro "En peligro" o "Vulnerable".
  3. El sistema muestra únicamente las especies en estado crítico.
- **Postcondición:** El usuario obtiene una lista priorizada de especies que requieren atención inmediata.

---

## 9. Historias de Usuario

| ID | Historia | Criterio de aceptación |
|---|---|---|
| HU-01 | Como **ciudadano de Cochabamba**, quiero fotografiar una planta del Cerro San Pedro y saber qué especie es, para contribuir al registro de biodiversidad de mi ciudad. | La IA identifica la especie con al menos 70% de confianza y muestra nombre común, nombre científico y estado de conservación. |
| HU-02 | Como **biólogo investigador**, quiero consultar un catálogo digital de especies documentadas con datos taxonómicos verificados, para complementar mis estudios de campo. | El catálogo permite filtrar por tipo de especie, estado de conservación y búsqueda textual, mostrando datos de fuentes verificadas (UMSS, GBIF). |
| HU-03 | Como **autoridad municipal**, quiero visualizar en un mapa dónde se concentran los avistamientos de especies amenazadas, para tomar decisiones informadas antes de aprobar obras de infraestructura. | El mapa muestra marcadores geolocalizados con datos de cada observación y permite diferenciar por estado de conservación. |
| HU-04 | Como **estudiante universitario**, quiero hacerle preguntas al eco-asistente sobre la fauna del cerro, para aprender sin necesidad de buscar en múltiples fuentes académicas. | El chatbot responde preguntas en lenguaje natural con información verificada y contextualizada al Cerro San Pedro. |
| HU-05 | Como **voluntario de ONG ambiental**, quiero guardar mis observaciones de campo con ubicación GPS, para que otros investigadores puedan ver qué especies hay en cada zona del cerro. | La observación se guarda con coordenadas, imagen, datos taxonómicos y queda visible en el mapa y el catálogo. |

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite 6 |
| Estilos | Tailwind CSS v4 |
| Backend | NestJS (TypeScript) — Arquitectura en Capas |
| IA - Identificación | Plant.id API (Kindwise) |
| IA - Chatbot | Groq API (Llama 3.3-70b) |
| Datos biodiversidad | iNaturalist API + GBIF API |
| Mapas | Leaflet.js |
| Base de datos | Supabase (PostgreSQL) |
| Animaciones | GSAP + Lenis |

---

## ODS Vinculados

| ODS | Nombre | Justificación |
|---|---|---|
| 15 | Vida de Ecosistemas Terrestres | Proteger y restaurar el uso sostenible de los ecosistemas terrestres, detener la pérdida de biodiversidad. |
| 13 | Acción por el Clima | Generar datos que contribuyan a medir y combatir el impacto del cambio climático en la biodiversidad local. |
| 11 | Ciudades Sostenibles | Promover que el desarrollo urbano de Cochabamba preserve sus áreas verdes y corredores biológicos. |
| 17 | Alianzas para los Objetivos | Articular universidad, gobierno municipal, ONGs y ciudadanía mediante una plataforma tecnológica compartida. |

---

*Documento generado para la definición formal del sistema BioScan Cochabamba.*
*Equipo: Dylan, Miguel, Gabo, Aron — UPDS Cochabamba, 2026.*
