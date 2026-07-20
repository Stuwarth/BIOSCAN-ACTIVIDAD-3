# Respuestas - Proyecto BioScan

## Multimedia

**¿Qué recursos multimedia incorporaron?**

En el proyecto usamos varios tipos de recursos. Primero, tenemos imágenes de fondo que se van mostrando conforme el usuario hace scroll en la sección de "Nosotros", donde contamos la problemática del Cerro San Pedro. También usamos íconos en formato SVG con la librería Lucide, porque así no se pixelan sin importar el tamaño de pantalla. Para las animaciones trabajamos con dos librerías: Framer Motion (para transiciones entre páginas y efectos al hacer hover) y GSAP con ScrollTrigger (para el efecto de scrollytelling donde el fondo cambia mientras lees). Aparte de eso, integramos un mapa interactivo con Leaflet.js donde se pueden ver las zonas de estudio, y el módulo principal del proyecto que es donde el usuario sube una foto y la IA la analiza.

**¿Las imágenes están optimizadas?**

Sí, las cuidamos bastante. Las imágenes de fondo las descargamos ya en resoluciones controladas (no son fotos de 4000x3000 sin comprimir ni nada de eso). Se aplican con CSS usando background-size cover, entonces el navegador solo renderiza lo que necesita. Los íconos al ser SVG pesan casi nada, y cuando hacemos el build de producción con Vite, él mismo se encarga de optimizar los assets automáticamente.

**¿El audio y video funcionan correctamente?**

No incluimos ni audio ni video como tal. Al principio lo consideramos, pero al final decidimos que las animaciones con GSAP y Framer Motion ya daban suficiente dinamismo a la página sin necesidad de cargar archivos pesados de video. Básicamente logramos el mismo efecto visual pero con mejor rendimiento.

**¿Existe contenido multimedia innecesario?**

No, todo lo que está tiene su razón. El Hero de inicio es para captar la atención del usuario apenas entra, el scrollytelling sirve para explicar por qué existe el proyecto (la deforestación, los incendios, etc.), las tarjetas del catálogo muestran datos reales de las especies, y el mapa ayuda a ubicar geográficamente las zonas de monitoreo. No metimos cosas solo por decorar.

---

## Código

**¿Cómo organizaron el proyecto?**

Lo organizamos en carpetas separadas por responsabilidad. En src/components están los componentes que se reutilizan en varias partes (el Navbar, las tarjetas de especies, el uploader de fotos, etc.). En src/pages están las vistas principales: Inicio, Catálogo, Mapa y Nosotros. La lógica para conectarse con las APIs externas (como Plant.id para la identificación de especies) está en src/services, separada de la interfaz. También tenemos src/data para los JSON con datos estáticos y src/lib para funciones utilitarias.

**¿Qué patrón están utilizando?**

Usamos arquitectura basada en componentes, que es el enfoque natural de React. Cada parte de la interfaz es un componente independiente con su propia lógica y estilos. Además separamos la lógica de negocio (las llamadas a la IA, el procesamiento de datos) de lo visual, poniéndola en la carpeta services. Para manejar el estado y los efectos secundarios usamos los hooks de React (useState, useEffect, useRef).

**¿Por qué eligieron esa estructura?**

Porque si mañana queremos cambiar la API de reconocimiento de especies o agregar una nueva sección, solo tocamos un archivo o una carpeta específica sin romper lo demás. Es más fácil de mantener a largo plazo. Aparte, al tener los componentes separados, si otro integrante del equipo necesita modificar el Navbar por ejemplo, no tiene que entender todo el código de la página entera, solo ese archivo.

---

## Optimización

**¿Las imágenes pesan mucho?**

No realmente. No tenemos una galería con 50 fotos cargando al mismo tiempo ni nada así. Las imágenes de fondo del scrollytelling están en resoluciones razonables y las animaciones (como el cursor personalizado, las partículas flotantes, las transiciones) están hechas con código CSS y JavaScript, no con GIFs o videos. Eso hace que la página en general sea bastante liviana.

**¿El sitio carga rápido?**

Sí, y es en gran parte por Vite. El bundler que usamos compila todo con esbuild que es muy rápido, y Tailwind CSS tiene tree-shaking incluido, o sea que en el CSS final solo quedan las clases que realmente usamos en el proyecto. No se carga CSS basura. En desarrollo la recarga es prácticamente instantánea y en producción el bundle queda bastante chico.

---

## Innovación

**¿Qué hace diferente su proyecto?**

La mayoría de páginas sobre medio ambiente son informativas nada más: texto, algunas fotos y ya. BioScan va más allá porque no solo te cuenta sobre el problema del Cerro San Pedro (con el scrollytelling, que ya de por sí es una forma distinta de presentar información), sino que te deja participar activamente. Podés arrastrar una foto de una planta o animal y la plataforma te dice qué especie es usando inteligencia artificial. Eso lo hace una herramienta útil de verdad, no solo una página bonita.

**¿Qué tecnología emergente incorporarán?**

Lo principal es la inteligencia artificial para visión por computadora. Usamos modelos de reconocimiento de imágenes que pueden identificar especies a partir de una foto. Del lado del frontend, aplicamos técnicas de animación avanzadas como las que usan páginas premiadas internacionalmente (tipo las que ganan en Awwwards): animaciones con física de resortes usando Framer Motion y narrativa interactiva con GSAP ScrollTrigger. Son tecnologías que todavía no son comunes en proyectos universitarios acá en Bolivia.
