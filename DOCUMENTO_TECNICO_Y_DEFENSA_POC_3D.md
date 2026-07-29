# DOCUMENTO TÉCNICO Y GUÍA DE DEFENSA
## EXAMEN PRÁCTICO FINAL: PRUEBA DE CONCEPTO (PoC) MULTIMEDIA
**Proyecto Base:** BioScan - Cerro de San Pedro (Cochabamba, Bolivia)  
**Estudiante:** [Tu Nombre Completo]  
**Rol:** Ingeniero de Sistemas  

---

# PARTE 1: DOCUMENTO TÉCNICO (Entregable de 3 Páginas)

## 1. Nombre de la Funcionalidad
**BioMapa 3D Interactivo del Cerro de San Pedro y Visor de Biodiversidad Ecosistémica**

## 2. Objetivo
Desarrollar una Prueba de Concepto (PoC) multimedia interactiva basada en gráficos 3D (WebGL/Three.js), animaciones cinemáticas (GSAP) y síntesis audio-ambientes (Web Audio API) que permita a los usuarios explorar la elevación topográfica del Cerro de San Pedro, la ubicación del Cristo de la Concordia y la distribución espacial de sus especies nativas y endémicas según su hábitat y altitud.

## 3. Problema que Resuelve
En la plataforma grupal BioScan, el catálogo y mapa 2D actual representan las observaciones de forma plana o bidimensional. Esto dificulta comprender cómo la variación altitudinal, el tipo de ladera y la vegetación del Cerro de San Pedro influyen en la presencia de especies emblemáticas (como la *Monterita de cresta gris* en los matorrales altos o el *Cactus Pasakana* en laderas rocosas). 

Esta PoC resuelve la falta de **profundidad espacial e inmersión sensorial**, permitiendo una visualización 3D envolvente y bioacústica del ecosistema.

## 4. Descripción Técnica
La solución consiste en un visor 3D autocontenido construido sobre el motor de renderizado **Three.js** con las siguientes capacidades:
* **Terreno Topográfico 3D Procedural:** Generación de la malla piramidal simétrica con relieve, quebradas y microclimas del Cerro de San Pedro.
* **Monumentos y Vegetación 3D:** Modelado geométrico del monumento del Cristo de la Concordia en la cumbre y distribución de flora nativa.
* **Hotspots 3D Interactivos con Raycasting:** Marcadores pulsantes en coordenadas (x, y, z) reales del cerro que responden al clic del ratón mediante trazado de rayos (*Raycasting*).
* **Transiciones Cinemáticas con GSAP:** Al seleccionar una especie, la cámara realiza una interpolación suave (*fly-to*) hacia la ubicación 3D en el cerro.
* **Sintetizador Bioacústico (Web Audio API):** Generación de frecuencias y bio-cantos simulados en tiempo real según la especie seleccionada.
* **Iluminación Dinámica Ambiental:** Modos de iluminación para Día (Soleado), Atardecer (Glow purpúreo) y Noche (Luz estelar y faro biológico).

## 5. Tecnologías Utilizadas
* **Three.js (v0.184.0):** Motor principal de renderizado 3D WebGL, luces, sombras, materiales y geometría de terreno.
* **GSAP (GreenSock Animation Platform v3.15.0):** Interpolación cinemática fluida para los movimientos de cámara en la escena 3D.
* **Web Audio API:** Motor de sintesis sonora y reproducción bioacústica de audio ambiental en tiempo real.
* **React 19 & Tailwind CSS v4:** Interfaz de usuario declarativa para controles, capas y paneles modal.
* **Framer Motion:** Animación de menús y tarjetas multimedia emergentes.
* **Lucide React:** Iconografía vectorial estilizada.

## 6. Integración con el Proyecto Principal (BioScan)
La PoC fue diseñada para ser **100% integrable y no intrusiva**:
1. Se encuentra implementada en un componente modular autónomo (`/src/pages/PocBioMapa3D.jsx`).
2. Se conecta directamente a la estructura de datos existente (`especies.json`), reutilizando los identificadores, fotografías y descripciones verificadas.
3. En la versión final de BioScan, se integra mediante una nueva pestaña de navegación **"Explorar en 3D"** o dentro de la ficha de mapa existente como un visor alternativo 3D.

---

# PARTE 2: GUÍA DE PREGUNTAS Y RESPUESTAS PARA LA DEFENSA

### Q1: ¿Cuál fue la necesidad identificada?
> **Respuesta:** "Identifiqué que los mapas 2D convencionales no transmiten el contexto vertical y de hábitat del Cerro de San Pedro. La biodiversidad de la zona varía drásticamente según la altitud (desde los matorrales secos a 2,820 msnm donde habita la Monterita de cresta gris, hasta las laderas rocosas con cactus Pasakana). Existía la necesidad de ofrecer una herramienta inmersiva que conectara la altitud y la topografía con las especies registradas."

### Q2: ¿Por qué decidió desarrollar esta funcionalidad?
> **Respuesta:** "Decidí desarrollar el BioMapa 3D porque combina múltiples disciplinas multimedia (gráficos 3D con Three.js, animación con GSAP y audio con Web Audio API) ofreciendo una experiencia altamente educativa y moderna que destaca el icono de Cochabamba (el Cristo de la Concordia) y su biodiversidad que necesita conservación."

### Q3: ¿Qué tecnologías utilizó?
> **Respuesta:** "Utilicé Three.js para la renderización WebGL del terreno y monumentos 3D; GSAP para las interpolaciones de cámara suave (*fly-to*); Web Audio API para sintetizar los sonidos bioacústicos en tiempo real; y React con Tailwind CSS para los controles de interfaz."

### Q4: ¿Qué dificultades encontró y cómo las resolvió?
> **Respuesta:** 
> 1. *Dificultad:* Colisión de la interfaz flotante 3D con la barra de navegación global del proyecto.  
>    *Solución:* Ajusté el posicionamiento dinámico `top-20` y z-index de los controles flotantes para asegurar un flujo limpio y responsivo sin solapamiento.
> 2. *Dificultad:* Detectar clics en elementos 3D dentro del canvas de Three.js.  
>    *Solución:* Implementé *Raycaster* mapeando las coordenadas del puntero a la escena 3D para identificar con precisión qué marcador/especie seleccionó el usuario.

### Q5: ¿Cómo se integraría al proyecto del equipo?
> **Respuesta:** "Se integra de manera completamente transparente. La PoC consume la misma base de datos `especies.json` de BioScan y se monta en una ruta independiente `/poc-3d`. Para llevarla a producción solo se requiere enlazarla desde la Navbar como la opción de 'Visor 3D'."

### Q6: ¿Qué beneficios aportaría a la solución multimedia?
> **Respuesta:** "Aporta un alto valor diferenciador frente a plataformas de biología tradicionales. Incrementa el engagement del usuario mediante interactividad 3D, facilita la educación ambiental sobre el Cerro de San Pedro y brinda accesibilidad bioacústica."

### Q7: ¿Qué mejoras implementaría en una siguiente versión?
> **Respuesta:** "1. Cargar modelos 3D detallados en formato `.GLTF`/`.GLB` para cada animal y planta (usando Blender/Sketchfab).  
> 2. Integrar un simulador de clima con lluvia o niebla interactiva.  
> 3. Soporte para realidad virtual (WebXR) para recorrer el Cerro de San Pedro con gafas VR."
