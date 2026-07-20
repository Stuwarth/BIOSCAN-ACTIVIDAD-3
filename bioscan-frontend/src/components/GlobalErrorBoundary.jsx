import { Component } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

export default class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary atrapó un error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030704] flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-white/5 border border-red-500/20 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/50 to-red-900/50" />
            <AlertTriangle className="w-16 h-16 text-red-500 mb-6 opacity-80" />
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Fallo en el Sistema</h1>
            <p className="text-slate-400 mb-8 font-light leading-relaxed">
              La plataforma encontró un error inesperado de compilación o ejecución. 
              El equipo de ingeniería ha sido notificado.
            </p>
            
            <div className="bg-black/40 rounded-xl p-4 mb-8 overflow-auto border border-white/5">
              <p className="text-red-400 font-mono text-sm break-all">
                {this.state.error?.toString()}
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold rounded-2xl transition-all border border-red-500/20"
            >
              <RefreshCcw className="w-5 h-5" />
              Reiniciar Interfaz
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
