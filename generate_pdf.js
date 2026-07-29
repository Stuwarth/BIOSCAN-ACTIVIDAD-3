const puppeteer = require('./bioscan-frontend/node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

async function generatePDF() {
  const executablePath = 'C:\\Users\\stuwa\\AppData\\Local\\ms-playwright\\chromium-1234\\chrome-win64\\chrome.exe';
  
  const logoBase64 = fs.readFileSync(path.join(__dirname, 'logo_upds_real.png')).toString('base64');
  const img1Base64 = fs.readFileSync(path.join(__dirname, 'captura_1_satelital.png')).toString('base64');
  const img4Base64 = fs.readFileSync(path.join(__dirname, 'captura_4_homepage.png')).toString('base64');

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      font-family: 'Arial', sans-serif;
    }
    body {
      margin: 0;
      padding: 0;
      color: #1e293b;
      background: #ffffff;
    }
    .page {
      width: 210mm;
      height: 297mm;
      padding: 25mm 20mm;
      position: relative;
      page-break-after: always;
      background: #ffffff;
      overflow: hidden;
    }
    .page:last-child {
      page-break-after: avoid;
    }

    /* Carátula */
    .caratula {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      height: 100%;
    }
    .caratula-header {
      margin-top: 15mm;
    }
    .caratula-univ {
      font-size: 20pt;
      font-weight: bold;
      color: #1e293b;
      letter-spacing: 0.5px;
    }
    .caratula-carrera {
      font-size: 16pt;
      font-weight: bold;
      color: #334155;
      margin-top: 8px;
    }
    .logo-container {
      margin: 25mm 0;
      text-align: center;
    }
    .caratula-titulo {
      font-size: 16pt;
      font-weight: bold;
      color: #1e293b;
      letter-spacing: 1px;
    }
    .caratula-datos {
      width: 100%;
      text-align: left;
      margin-top: 20mm;
      padding-left: 10mm;
    }
    .caratula-label {
      font-size: 13pt;
      font-weight: bold;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .caratula-val {
      font-size: 12pt;
      color: #334155;
      margin-bottom: 20mm;
      padding-left: 20mm;
    }
    .caratula-footer {
      font-size: 13pt;
      font-weight: bold;
      color: #0f172a;
      margin-bottom: 10mm;
    }

    /* Secciones */
    h1.sec-title {
      font-size: 15pt;
      font-weight: bold;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 4px;
      text-transform: uppercase;
    }
    p.sec-sub {
      font-size: 11pt;
      color: #475569;
      margin-top: 0;
      margin-bottom: 20px;
    }
    h2.num-title {
      font-size: 12pt;
      font-weight: bold;
      color: #0f172a;
      margin-top: 20px;
      margin-bottom: 10px;
      text-transform: uppercase;
    }

    /* Tablas */
    table.custom-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    table.custom-table th, table.custom-table td {
      border: 1px solid #cbd5e1;
      padding: 10px 14px;
      font-size: 10.5pt;
      text-align: left;
    }
    table.custom-table th {
      background-color: #93c5fd;
      color: #0f172a;
      font-weight: bold;
    }
    table.custom-table td.campo {
      background-color: #bfdbfe;
      font-weight: bold;
      width: 32%;
      color: #0f172a;
    }
    table.custom-table td.detalle {
      background-color: #ffffff;
      color: #1e293b;
    }

    p.body-text {
      font-size: 10.5pt;
      line-height: 1.5;
      color: #1e293b;
      margin-top: 6px;
      margin-bottom: 12px;
      text-align: justify;
    }

    ul.bullet-list {
      margin-top: 6px;
      margin-bottom: 16px;
      padding-left: 20px;
    }
    ul.bullet-list li {
      font-size: 10.5pt;
      line-height: 1.5;
      color: #1e293b;
      margin-bottom: 8px;
      text-align: justify;
    }

    /* Capturas */
    .img-box {
      width: 100%;
      margin-bottom: 16px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
    }
    .img-box img {
      width: 100%;
      height: auto;
      display: block;
    }

    /* Preguntas */
    .pregunta-block {
      margin-bottom: 16px;
    }
    .pregunta-title {
      font-size: 11pt;
      font-weight: bold;
      color: #0f172a;
      margin-bottom: 6px;
    }
    .respuesta-text {
      font-size: 10.5pt;
      line-height: 1.55;
      color: #1e293b;
      text-align: justify;
      background: #f8fafc;
      padding: 10px 14px;
      border-left: 4px solid #3b82f6;
      border-radius: 0 6px 6px 0;
    }
  </style>
</head>
<body>

  <!-- PÁGINA 1: CARÁTULA -->
  <div class="page">
    <div class="caratula">
      <div class="caratula-header">
        <div class="caratula-univ">UNIVERSIDAD PRIVADA DOMINGO SAVIO</div>
        <div class="caratula-carrera">CARRERA INGENIERÍA DE SISTEMAS</div>
      </div>

      <div class="logo-container">
        <img src="data:image/png;base64,${logoBase64}" style="width: 250px; height: auto;" alt="Universidad Privada Domingo Savio" />
      </div>

      <div style="font-size: 13pt; font-weight: bold; color: #1e293b; margin-bottom: 20px;">INFORME DE EXAMEN</div>

      <div class="caratula-datos">
        <div class="caratula-label">Docente:</div>
        <div class="caratula-val">Rojas Condori Vladimir Wilmar</div>
        
        <div class="caratula-label">Autores:</div>
        <div class="caratula-val">Dylan Stuwarth Camacho Bustamante</div>
      </div>

      <div class="caratula-footer">
        Cochabamba – Bolivia 2026
      </div>
    </div>
  </div>

  <!-- PÁGINA 2 -->
  <div class="page">
    <h1 class="sec-title">GUÍA DE DEFENSA TÉCNICA - EXAMEN MULTIMEDIA</h1>
    <p class="sec-sub">Preguntas Oficiales de Revisión y Argumentación Técnica</p>

    <h2 class="num-title">1. DATOS GENERALES DEL PROYECTO</h2>
    <table class="custom-table">
      <tr>
        <td class="campo">Proyecto / PoC:</td>
        <td class="detalle">BioScan Multimedia & Visor Satelital Fotográfico Realista HD del Cerro San Pedro</td>
      </tr>
      <tr>
        <td class="campo">Stack Tecnológico:</td>
        <td class="detalle">React, Vite, Leaflet, ESRI World Imagery HD, Three.js, Web Audio API, Tailwind CSS, Framer Motion</td>
      </tr>
      <tr>
        <td class="campo">Repositorio GitHub:</td>
        <td class="detalle">https://github.com/Stuwarth/BIOSCAN-ACTIVIDAD-3.git (Ramas: main, poc-3d)</td>
      </tr>
    </table>

    <h2 class="num-title">2. OBJETIVO</h2>
    <p class="body-text">
      Diseñar, implementar y validar una Prueba de Concepto (PoC) multimedia interactiva capaz de integrar cartografía satelital orbital de alta resolución (ESRI World Imagery HD) con coordenadas GPS reales (-17.384°, -66.136°), vistas fotográficas de campo interactivas de las distintas altitudes del Cerro de San Pedro y síntesis bioacústica de fauna nativa a través de la Web Audio API del navegador, proporcionando una experiencia geográfica e inmersiva de alta fidelidad visual sin depender de modelos 3D sintéticos tipo videojuego.
    </p>

    <h2 class="num-title">3. PROBLEMA QUE RESUELVE</h2>
    <ul class="bullet-list">
      <li>
        <strong>Representación Sintética Poco Fidedigna:</strong> Las maquetas 3D tradicionales o entornos procedimentales suelen lucir abstractos o con estética de videojuego low-poly, perdiendo el realismo fotográfico real del Cerro de San Pedro. Esta PoC utiliza fotografía satelital orbital HD e imágenes reales de campo de la cumbre y laderas.
      </li>
      <li>
        <strong>Falta de Contexto Espacial y Altitudinal:</strong> Los catálogos estáticos no permiten visualizar dónde habitan exactamente las especies (ej. Monterita de cresta gris en matorrales altos a 2,720 msnm vs. anfibios en quebradas bajas). La PoC ubica los especímenes en sus coordenadas GPS verdaderas con navegación fluida (FlyTo).
      </li>
      <li>
        <strong>Ausencia de la Dimensión Bioacústica:</strong> El usuario no puede asociar el aspecto visual de las especies con su sonido en campo. Se implementa un sintetizador bioacústico en tiempo real con cero latencia y sin cargar archivos de audio pesados.
      </li>
    </ul>
  </div>

  <!-- PÁGINA 3 -->
  <div class="page">
    <h2 class="num-title" style="margin-top: 0;">3. TECNOLOGIAS UTILIZADAS</h2>
    <table class="custom-table">
      <thead>
        <tr>
          <th>Tecnología / Librería</th>
          <th>Categoría</th>
          <th>Función en el Proyecto</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>React + Vite</strong></td>
          <td>Framework Frontend</td>
          <td>Estructura de componentes modulares, arquitectura SPA y bundle súper rápido.</td>
        </tr>
        <tr>
          <td><strong>Leaflet & ESRI HD</strong></td>
          <td>Cartografía Satelital</td>
          <td>Renderizado de teselas satelitales orbitales de alta definición del Cerro San Pedro sin API Key de pago.</td>
        </tr>
        <tr>
          <td><strong>Three.js</strong></td>
          <td>Gráficos WebGL 3D</td>
          <td>Renderizado de proyecciones esféricas y visores panorámicos de campo.</td>
        </tr>
        <tr>
          <td><strong>Web Audio API</strong></td>
          <td>Procesamiento de Audio Nativo</td>
          <td>Síntesis de osciladores, rampas de frecuencia y envolventes para cantos bioacústicos en tiempo real.</td>
        </tr>
        <tr>
          <td><strong>Tailwind CSS</strong></td>
          <td>Diseño de Interfaz (UI)</td>
          <td>Estilizado responsivo, paleta temática bioluminiscente de BioScan y componentes flotantes.</td>
        </tr>
        <tr>
          <td><strong>Framer Motion</strong></td>
          <td>Animación UX</td>
          <td>Transiciones fluidas entre tarjetas de especies, modales y botones de control.</td>
        </tr>
        <tr>
          <td><strong>React Router DOM</strong></td>
          <td>Enrutamiento SPA</td>
          <td>Navegación fluida hacia la vista <code>/poc-3d</code> sin recarga de página.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PÁGINA 4: CAPTURAS DE PANTALLA -->
  <div class="page">
    <h2 class="num-title" style="margin-top: 0;">4. CAPTURAS DE PANTALLA</h2>
    <div class="img-box">
      <img src="data:image/png;base64,${img1Base64}" alt="Visor Satelital HD Real Cerro San Pedro" />
    </div>
    <div class="img-box">
      <img src="data:image/png;base64,${img4Base64}" alt="Plataforma BioScan Homepage" />
    </div>
  </div>

  <!-- PÁGINA 5 -->
  <div class="page">
    <h2 class="num-title" style="margin-top: 0;">5. PREGUNTAS DE EVALUACIÓN Y RESPUESTAS DOCUMENTADAS</h2>

    <div class="pregunta-block">
      <div class="pregunta-title">PREGUNTA 1: ¿Cuál fue la necesidad identificada en el proyecto BioScan?</div>
      <div class="respuesta-text">
        En el Proyecto Formativo BioScan se identificó que la interacción del usuario se limitaba a fichas bidimensionales estáticas. Se detectó la necesidad de ofrecer una visualización cartográfica fotográfica realista del Cerro de San Pedro junto con el Cristo de la Concordia, permitiendo a los usuarios ubicar espacialmente las especies en sus coordenadas GPS verdaderas y experimentar su dimensión bioacústica.
      </div>
    </div>

    <div class="pregunta-block">
      <div class="pregunta-title">PREGUNTA 2: ¿Por qué decidió desarrollar esta funcionalidad específica de Visor Satelital Fotográfico Real y Módulo Bioacústico?</div>
      <div class="respuesta-text">
        Decidí desarrollar esta PoC porque sustituye los entornos procedimentales sintéticos (estética de videojuego) por fotografía orbital real sub-metro HD (ESRI World Imagery) e imágenes de campo reales. Además, la incorporación de sintetizadores de audio con Web Audio API permite generar cantos de aves e insectos de manera programática sin consumir ancho de banda por archivos MP3 pesados.
      </div>
    </div>

    <div class="pregunta-block">
      <div class="pregunta-title">PREGUNTA 3: ¿Qué tecnologías utilizó para la implementación de la PoC?</div>
      <div class="respuesta-text">
        Utilicé React junto a Vite para la arquitectura modular; Leaflet integrado con servidores de teselas satelitales ESRI HD para la cartografía real; Three.js para la proyección de panoramas; Web Audio API nativa mediante AudioContext y osciladores para el sonido; y Tailwind CSS junto a Framer Motion para la interfaz responsiva.
      </div>
    </div>

    <div class="pregunta-block">
      <div class="pregunta-title">PREGUNTA 4: ¿Qué dificultades encontró durante el desarrollo técnico y cómo las resolvió?</div>
      <div class="respuesta-text">
        <strong>Dificultad 1:</strong> Desplazamiento y solapamiento visual de los controles flotantes con la barra de navegación global (Navbar.jsx). Se resolvió ajustando los offsets top dinámicos (top-20 y top-36) con capas de z-index z-20.<br/>
        <strong>Dificultad 2:</strong> Bloqueo del AudioContext en navegadores por políticas de autostart. Se resolvió mediante un patrón de inicialización perezosa activado con el primer clic del usuario.<br/>
        <strong>Dificultad 3:</strong> Evitar el uso de mapas abstractos o APIs de pago bloqueadas. Se integró el motor de teselas satelitales ESRI World Imagery públicas, proporcionando fotografía orbital real del Cerro San Pedro.
      </div>
    </div>
  </div>

  <!-- PÁGINA 6 -->
  <div class="page">
    <div class="pregunta-block">
      <div class="pregunta-title">PREGUNTA 5: ¿Cómo se integraría esta Prueba de Concepto al proyecto principal del equipo?</div>
      <div class="respuesta-text">
        La integración es inmediata y limpia (Zero-Breaking Changes) debido a la arquitectura por componentes utilizada. Al estar encapsulada en la ruta dedicada /poc-3d en App.jsx, un enlace modular en Navbar.jsx y consumir directamente especies.json, solo requiere fusionar la rama de la PoC con la rama principal del grupo.
      </div>
    </div>

    <div class="pregunta-block">
      <div class="pregunta-title">PREGUNTA 6: ¿Qué beneficios concretos aportaría esta PoC a la solución multimedia global?</div>
      <div class="respuesta-text">
        Aporta un valor diferenciador significativo:<br/>
        1) Realismo Fotográfico 100% Fiel al mostrar el Cerro de San Pedro y sus coordenadas GPS exactamente como se ven en la realidad.<br/>
        2) Interactividad Multisensorial al combinar la visión geográfica orbital con el reconocimiento bioacústico de aves endémicas.<br/>
        3) Innovación Técnica al implementar sintetizadores de audio directo en código Web Audio API sin sobrecargar el peso ni el ancho de banda del cliente.
      </div>
    </div>

    <div class="pregunta-block">
      <div class="pregunta-title">PREGUNTA 7: ¿Qué mejoras o nuevas funcionalidades implementaría en una siguiente versión?</div>
      <div class="respuesta-text">
        En la versión 2.0 implementaría:<br/>
        1) Un analizador de espectro de frecuencia en vivo con Canvas / WebGL para visualizar los espectrogramas en tiempo real.<br/>
        2) Integración de capas de elevación 3D con datos altimétricos SRTM/DEM para sobreponer la textura satelital sobre un relieve 3D realista.<br/>
        3) Modo de Realidad Virtual (WebXR) para recorrer los senderos del cerro con gafas VR.
      </div>
    </div>
  </div>

</body>
</html>
  `;

  const htmlPath = path.join(__dirname, 'informe_temp.html');
  fs.writeFileSync(htmlPath, htmlContent);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });

  const pdfPath = path.join(__dirname, 'INFORME_EXAMEN_MULTIMEDIA_DYLAN_CAMACHO.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  fs.unlinkSync(htmlPath);

  console.log('PDF generado exitosamente en:', pdfPath);
}

generatePDF().catch(console.error);
