import { useState } from 'react'
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'
import { ReactLenis } from 'lenis/react'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import CustomCursor from './components/CustomCursor'
import PageTransition from './components/PageTransition'
import GlobalErrorBoundary from './components/GlobalErrorBoundary'
import NotFound from './pages/NotFound'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import Preloader from './components/Preloader'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import MapPage from './pages/MapPage'
import About from './pages/About'
import PocBioMapa3D from './pages/PocBioMapa3D'

function MainLayout() {
  const location = useLocation()
  return (
    <>
      <Navbar />
      <main className="flex-1 relative z-10 bg-[#030704] w-full">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/catalogo" element={<PageTransition><Catalog /></PageTransition>} />
            <Route path="/mapa" element={<PageTransition><MapPage /></PageTransition>} />
            <Route path="/nosotros" element={<PageTransition><About /></PageTransition>} />
            <Route path="/poc-3d" element={<PageTransition><PocBioMapa3D /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Chatbot />
      <Footer />
    </>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)

  return (
    <ReactLenis root>
      <HelmetProvider>
        <GlobalErrorBoundary>
          {loading && <Preloader onComplete={() => setLoading(false)} />}
          <CustomCursor />
          <div className="min-h-screen flex flex-col bg-[#030704] text-slate-200 w-full relative">
            <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: '#030704', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' } }} />
            <MainLayout />
          </div>
        </GlobalErrorBoundary>
      </HelmetProvider>
    </ReactLenis>
  )
}
