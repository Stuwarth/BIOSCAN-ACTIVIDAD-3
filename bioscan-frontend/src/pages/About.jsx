import { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { Leaf, Target, Users, Code, Shield, GraduationCap, Globe, Bird, BookOpen, Github, Linkedin } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const tecnologias = [
  { nombre: 'React 19 + Vite 6', desc: 'Frontend moderno, rápido y responsive', icon: Code },
  { nombre: 'Tailwind CSS v4', desc: 'Estilos utilitarios con diseño profesional', icon: Code },
  { nombre: 'NestJS (TypeScript)', desc: 'Backend profesional, escalable y tipado', icon: Code },
  { nombre: 'Plant.id API', desc: 'Modelos de visión para identificar plantas por foto', icon: Code },
  { nombre: 'iNaturalist API', desc: 'Base de datos real de biodiversidad global', icon: Code },
  { nombre: 'GBIF API', desc: 'Datos de biodiversidad a escala mundial', icon: Code },
  { nombre: 'Groq / Llama 3', desc: 'Motor de inferencia avanzado', icon: Code },
  { nombre: 'Leaflet.js', desc: 'Mapas geoespaciales interactivos', icon: Code },
  { nombre: 'GSAP + Lenis', desc: 'Motor de animaciones y físicas fluidas', icon: Code },
]

const ods = [
  {
    num: 15,
    titulo: 'Vida de Ecosistemas Terrestres',
    desc: 'Proteger, restaurar y promover el uso sostenible de los ecosistemas terrestres y detener la pérdida de biodiversidad.',
    color: 'bg-green-500/10 border-green-500/20 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)]',
  },
  {
    num: 13,
    titulo: 'Acción por el Clima',
    desc: 'Adoptar medidas urgentes para combatir el cambio climático y sus efectos sobre el planeta.',
    color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]',
  },
  {
    num: 11,
    titulo: 'Ciudades Sostenibles',
    desc: 'Hacer que las ciudades sean inclusivas, seguras, resilientes y sostenibles, preservando sus áreas verdes.',
    color: 'bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]',
  },
  {
    num: 17,
    titulo: 'Alianzas para los Objetivos',
    desc: 'Fortalecer los medios de implementación mediante alianzas entre gobierno, sociedad civil y sector privado.',
    color: 'bg-white/5 border-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]',
  },
]

export default function About() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // Hero Text Reveal
      gsap.fromTo(".about-hero-title",
        { y: 100, opacity: 0, rotateX: -30 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.2, ease: "power4.out", stagger: 0.1 }
      )
      
      gsap.fromTo(".about-hero-subtitle",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.5 }
      )

      // Secciones animadas al scrollear
      gsap.utils.toArray('.gsap-section').forEach((section) => {
        gsap.fromTo(section,
          { opacity: 0, y: 100 },
          {
            opacity: 1, y: 0, duration: 1, ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        )
      })

      // Staggering cards (ODS, Stats, Tech)
      gsap.utils.toArray('.gsap-stagger-container').forEach((container) => {
        const cards = container.querySelectorAll('.gsap-card')
        gsap.fromTo(cards,
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)", stagger: 0.1,
            scrollTrigger: {
              trigger: container,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        )
      })

      // Parallax background
      gsap.to(".parallax-bg", {
        y: "20%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      })

      // Scrollytelling anims
      gsap.utils.toArray('.scrolly-step').forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => {
            gsap.to(".scrolly-bg", { opacity: 0, duration: 0.8 });
            gsap.to(`.scrolly-bg-${i + 1}`, { opacity: 1, duration: 0.8 });
          },
          onEnterBack: () => {
            gsap.to(".scrolly-bg", { opacity: 0, duration: 0.8 });
            gsap.to(`.scrolly-bg-${i + 1}`, { opacity: 1, duration: 0.8 });
          }
        });
      });

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030704] relative">
      <Helmet>
        <title>Sobre Nosotros | BioScan</title>
        <meta name="description" content="Conoce la arquitectura tecnológica y el equipo detrás de BioScan Cochabamba." />
      </Helmet>

      {/* Cinematic Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="parallax-bg absolute top-0 right-0 w-[120vw] h-[120vh] bg-primary/10 rounded-full blur-[150px] opacity-60 translate-x-1/4 -translate-y-1/4" />
        <div className="parallax-bg absolute bottom-0 left-0 w-[100vw] h-[100vh] bg-emerald-900/30 rounded-full blur-[150px] opacity-50 -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <div className="pt-32 pb-24 border-b border-white/10 relative overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')]">
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10" style={{ perspective: "1000px" }}>
            <div className="about-hero-title inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest text-slate-300 mb-8 backdrop-blur-md">
              <Shield className="w-4 h-4 text-primary" />
              Tech4Future Hack 2026 — Cochabamba
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-6 tracking-tighter leading-tight overflow-hidden">
              <div className="about-hero-title">Ingeniería Aplicada a la</div>
              <div className="about-hero-title text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400 pb-2">Conservación</div>
            </h1>
            <p className="about-hero-subtitle text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
              Plataforma de análisis taxonómico impulsada por inteligencia artificial, diseñada para proteger el ecosistema endémico de Cochabamba.
            </p>
          </div>
        </div>

        {/* Scrollytelling - El Problema */}
        <section className="relative w-full bg-black border-y border-white/10">
          
          {/* Sticky Backgrounds */}
          <div className="sticky top-0 h-screen w-full overflow-hidden z-0">
            {/* Base Backgrounds */}
            <div className="scrolly-bg scrolly-bg-1 absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[10s] hover:scale-105 opacity-100" style={{ backgroundImage: "url('/images/scrollytelling/cerro.jpg')" }} />
            <div className="scrolly-bg scrolly-bg-2 absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[10s] hover:scale-105 opacity-0" style={{ backgroundImage: "url('/images/scrollytelling/fire.jpg')" }} />
            <div className="scrolly-bg scrolly-bg-3 absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[10s] hover:scale-105 opacity-0" style={{ backgroundImage: "url('/images/scrollytelling/bird.jpg')" }} />
            
            {/* Dark Overlays para mejorar la legibilidad del texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
            
            {/* Título pegajoso sutil */}
            <div className="absolute top-24 left-8 flex items-center gap-2 opacity-50 z-10 hidden md:flex">
              <Target className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-mono tracking-widest uppercase text-white">Contexto Operativo</span>
            </div>
          </div>

          {/* Scrolling Text Content */}
          <div className="relative z-10 -mt-[100vh]">
            
            {/* Step 1 */}
            <div className="scrolly-step h-[120vh] flex items-center justify-center px-4">
              <div className="bg-black/60 backdrop-blur-xl p-8 md:p-12 rounded-3xl max-w-2xl text-center border border-white/10 shadow-2xl">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
                  El Pulmón de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Cochabamba</span>
                </h2>
                <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed mb-8">
                  El Cerro San Pedro constituye un área de preservación crítica en el ecosistema seco interandino. Según investigaciones de la UMSS, alberga más de 400 taxones documentados.
                </p>
                <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                  <div>
                    <p className="text-3xl font-bold text-white">266</p>
                    <p className="text-xs text-slate-400 uppercase tracking-widest">Flora</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">117</p>
                    <p className="text-xs text-slate-400 uppercase tracking-widest">Avifauna</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">29</p>
                    <p className="text-xs text-slate-400 uppercase tracking-widest">Fauna</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="scrolly-step h-[120vh] flex items-center justify-center px-4">
              <div className="bg-red-950/60 backdrop-blur-xl p-8 md:p-12 rounded-3xl max-w-2xl text-center border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
                  Bajo <span className="text-red-400">Amenaza</span> Constante
                </h2>
                <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed mb-8">
                  Muchos de estos taxones enfrentan amenazas sistemáticas. La pérdida de biomasa es irreversible si no actuamos pronto.
                </p>
                <ul className="text-left space-y-4 text-slate-300 font-medium bg-black/40 p-6 rounded-2xl">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" /> Fragmentación de hábitat por urbanización.
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" /> Incendios forestales antrópicos (provocados).
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0" /> Introducción de flora invasora que desplaza la nativa.
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="scrolly-step h-[120vh] flex items-center justify-center px-4">
              <div className="bg-emerald-950/60 backdrop-blur-xl p-8 md:p-12 rounded-3xl max-w-2xl text-center border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
                  Nuestra Misión con BioScan
                </h2>
                <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed">
                  Ante la ausencia de infraestructura tecnológica para el monitoreo de conservación, nace BioScan.
                  Utilizamos Inteligencia Artificial para empoderar a los ciudadanos a monitorear y proteger la biodiversidad que nos queda.
                </p>
              </div>
            </div>
            
          </div>
        </section>

        {/* Respaldo Científico */}
        <section className="gsap-section py-24 border-y border-white/10 bg-white/5">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-extrabold text-white mb-8 tracking-tighter flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-500" />
              Literatura Científica Base
            </h2>
            <div className="bg-[#030704] rounded-3xl p-8 border border-white/10 backdrop-blur-xl transform transition-transform hover:scale-[1.02] duration-500">
              <div className="flex items-start gap-5 mb-6">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-white text-lg">Investigación Académica UMSS</p>
                  <p className="text-sm text-slate-400 mt-1">Centro de Biodiversidad y Genética (2025)</p>
                  <p className="text-xs text-blue-400 mt-2 font-mono uppercase tracking-wider">Validación de Datos</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-6 font-light">
                La arquitectura de datos de esta plataforma integra la base taxonómica del estudio de la UMSS,
                garantizando rigurosidad científica en la identificación de flora vascular y avifauna.
              </p>
            </div>
          </div>
        </section>

        {/* La solución */}
        <section className="gsap-section py-24">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-extrabold text-white mb-8 tracking-tighter flex items-center gap-3">
              <Leaf className="w-8 h-8 text-primary" />
              Arquitectura de Solución
            </h2>
            <div className="gsap-stagger-container grid sm:grid-cols-2 gap-6">
              {[
                { icon: Target, title: 'Visión Computacional', desc: 'Análisis de imágenes en tiempo real para clasificación de taxones.' },
                { icon: Globe, title: 'Sistemas SIG', desc: 'Cartografía digital interactiva para rastreo de avistamientos.' },
                { icon: Code, title: 'Modelos de Lenguaje (LLM)', desc: 'Motor NLP para procesamiento de procesamiento de consultas biológicas complejas.' },
                { icon: Shield, title: 'Telemetría de Datos', desc: 'Dashboard analítico para control de estados de conservación.' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="gsap-card p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-primary/30 transition-colors duration-500">
                    <Icon className="w-8 h-8 text-primary mb-4" />
                    <p className="font-bold text-white mb-2">{item.title}</p>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ODS */}
        <section className="gsap-section py-24 border-y border-white/10 bg-white/5 overflow-hidden">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tighter">
                Objetivos de Desarrollo Sostenible
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto font-light">
                Despliegue tecnológico estructurado bajo los lineamientos de la Agenda 2030 de la ONU.
              </p>
            </div>
            <div className="gsap-stagger-container grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ods.map((o) => (
                <div
                  key={o.num}
                  className={`gsap-card ${o.color} rounded-3xl p-6 shadow-2xl hover:scale-105 transition-transform duration-500 cursor-default`}
                >
                  <div className="mb-4">
                    <p className="text-3xl font-black text-white/50 tracking-tighter">ODS {o.num}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-3 text-lg leading-tight">{o.titulo}</h3>
                    <p className="text-sm text-white/70 leading-relaxed font-light">{o.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tecnologías */}
        <section className="gsap-section py-24">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-white mb-4 flex items-center justify-center gap-3 tracking-tighter">
                <Code className="w-8 h-8 text-secondary" />
                Stack Tecnológico
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto font-light">
                Arquitectura de software moderna, escalable y optimizada para alto rendimiento.
              </p>
            </div>
            <div className="gsap-stagger-container grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tecnologias.map((tech, i) => {
                const Icon = tech.icon
                return (
                  <div
                    key={tech.nombre}
                    className="gsap-card bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-500 group backdrop-blur-sm"
                  >
                    <Icon className="w-6 h-6 text-slate-500 mb-4 group-hover:text-primary transition-colors" />
                    <p className="font-bold text-white text-base group-hover:text-primary transition-colors mb-1">{tech.nombre}</p>
                    <p className="text-sm text-slate-400 leading-relaxed font-light">{tech.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Equipo */}
        <section className="gsap-section py-24 border-t border-white/10 bg-white/5">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tighter">
                Desarrolladores Core
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto font-light">
                Equipo técnico enfocado en ingeniería de software, arquitectura de datos y diseño UI/UX.
              </p>
            </div>

            <div className="gsap-stagger-container grid sm:grid-cols-3 gap-8">
              {/* Dylan - Frontend */}
              <div className="gsap-card bg-[#050B07]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/5 hover:border-emerald-500/30 hover:shadow-[0_15px_40px_rgba(16,185,129,0.15)] transition-all duration-500 text-center group">
                <div className="w-20 h-20 bg-emerald-900/20 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Code className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="font-bold text-white text-xl tracking-tight mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-emerald-300 transition-colors">Dylan Stuwarth</p>
                <p className="text-emerald-400/50 text-sm font-mono uppercase tracking-widest mb-6">Camacho Bustamante</p>
                <div className="inline-flex items-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                  Frontend Engineer
                </div>
                <div className="space-y-2 text-left">
                  <p className="text-sm text-slate-400 font-light border-b border-white/5 pb-2">Frontend Architecture</p>
                  <p className="text-sm text-slate-400 font-light border-b border-white/5 pb-2">UI/UX Design Systems</p>
                  <p className="text-sm text-slate-400 font-light">API Integrations</p>
                </div>
                <div className="flex justify-center gap-4 mt-6 pt-4 border-t border-white/5">
                  <a href="https://github.com/DylanStuwarth" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer" title="GitHub">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="https://linkedin.com/in/dylanstuwarth" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer" title="LinkedIn">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Tomas - Backend */}
              <div className="gsap-card bg-[#050B07]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/5 hover:border-blue-500/30 hover:shadow-[0_15px_40px_rgba(59,130,246,0.15)] transition-all duration-500 text-center group">
                <div className="w-20 h-20 bg-blue-900/20 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <p className="font-bold text-white text-xl tracking-tight mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-300 transition-colors">Tomas Zapata</p>
                <p className="text-blue-400/50 text-sm font-mono uppercase tracking-widest mb-6">Ortiz</p>
                <div className="inline-flex items-center bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                  Backend Engineer
                </div>
                <div className="space-y-2 text-left">
                  <p className="text-sm text-slate-400 font-light border-b border-white/5 pb-2">NestJS Framework</p>
                  <p className="text-sm text-slate-400 font-light border-b border-white/5 pb-2">Database Architecture</p>
                  <p className="text-sm text-slate-400 font-light">System Scalability</p>
                </div>
                <div className="flex justify-center gap-4 mt-6 pt-4 border-t border-white/5">
                  <a href="https://github.com/TomasZapata" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors cursor-pointer" title="GitHub">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="https://linkedin.com/in/tomaszapata" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors cursor-pointer" title="LinkedIn">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Jhunior - Datos */}
              <div className="gsap-card bg-[#050B07]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/5 hover:border-amber-500/30 hover:shadow-[0_15px_40px_rgba(245,158,11,0.15)] transition-all duration-500 text-center group">
                <div className="w-20 h-20 bg-amber-900/20 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Target className="w-8 h-8 text-amber-400" />
                </div>
                <p className="font-bold text-white text-xl tracking-tight mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-amber-300 transition-colors">Jhunior Danilo</p>
                <p className="text-amber-400/50 text-sm font-mono uppercase tracking-widest mb-6">Sonco Canaza</p>
                <div className="inline-flex items-center bg-amber-500/10 text-amber-400 border border-amber-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                  Data Analyst
                </div>
                <div className="space-y-2 text-left">
                  <p className="text-sm text-slate-400 font-light border-b border-white/5 pb-2">Data Research</p>
                  <p className="text-sm text-slate-400 font-light border-b border-white/5 pb-2">Project Management</p>
                  <p className="text-sm text-slate-400 font-light">Technical Pitching</p>
                </div>
                <div className="flex justify-center gap-4 mt-6 pt-4 border-t border-white/5">
                  <a href="https://github.com/JhuniorDanilo" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer" title="GitHub">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="https://linkedin.com/in/jhuniordanilo" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer" title="LinkedIn">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Universidad badge */}
            <div className="gsap-card mt-16 bg-white/5 border border-white/10 rounded-3xl p-10 text-center backdrop-blur-xl hover:bg-white/10 transition-colors duration-500">
              <div className="flex items-center justify-center gap-3 mb-3">
                <GraduationCap className="w-8 h-8" />
                <h3 className="text-2xl font-bold">UPDS — Universidad Privada Domingo Savio</h3>
              </div>
              <p className="text-green-100 max-w-2xl mx-auto">
                Sede Cochabamba, Bolivia. Ingeniería en Sistemas e Informática.
                Este proyecto es una demostración de que los estudiantes bolivianos pueden crear
                soluciones tecnológicas de impacto real para los problemas de su entorno.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <span className="bg-white/15 border border-white/20 px-4 py-1.5 rounded-full text-sm backdrop-blur-sm">
                  Tech4Future Hack 2026
                </span>
                <span className="bg-white/15 border border-white/20 px-4 py-1.5 rounded-full text-sm backdrop-blur-sm">
                  Hub Boliviano de IA
                </span>
                <span className="bg-white/15 border border-white/20 px-4 py-1.5 rounded-full text-sm backdrop-blur-sm">
                  Microsoft Learn Student Ambassadors
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Misión final */}
        <section className="gsap-section py-32">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <Globe className="w-16 h-16 text-primary mx-auto mb-8 opacity-50" />
            <h2 className="text-4xl font-extrabold text-white mb-6 tracking-tighter">
              Declaración de Visión
            </h2>
            <p className="text-slate-400 text-xl leading-relaxed font-light mb-8">
              BioScan Cochabamba establece un nuevo estándar en el cruce entre ingeniería de software y conservación ambiental.
              Desplegado en 48 horas, este sistema demuestra la capacidad analítica y técnica para mitigar problemas ecológicos reales.
            </p>
            <p className="text-primary font-bold text-xl tracking-tight">
              Ingeniería al servicio de la biodiversidad local.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
