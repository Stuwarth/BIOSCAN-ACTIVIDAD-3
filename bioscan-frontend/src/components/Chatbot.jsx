import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Loader2, Bot, User, Leaf } from 'lucide-react'
import { preguntarEcoAsistente } from '../services/api'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hola. Soy BioBot, tu asistente taxonómico. ¿En qué te puedo ayudar sobre el Cerro San Pedro?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const respuesta = await preguntarEcoAsistente(text, messages)
      setMessages((prev) => [...prev, { role: 'assistant', content: respuesta }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Excepción en el sistema. Intenta nuevamente.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center transition-all hover:scale-110"
        whileTap={{ scale: 0.9 }}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-[#030704]/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/50 border border-white/10 flex flex-col overflow-hidden"
            style={{ height: '520px' }}
          >
            {/* Header */}
            <div className="bg-white/5 border-b border-white/10 px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center border border-primary/20">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white font-bold text-sm tracking-wide">BioBot Core</p>
                <p className="text-primary text-xs font-mono">Asistente Taxonómico</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll bg-transparent">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 bg-primary/20 rounded-full flex-shrink-0 flex items-center justify-center mt-1 border border-primary/20">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                      ${msg.role === 'user'
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-white/10 text-slate-200 border border-white/5 shadow-sm rounded-bl-sm backdrop-blur-md'
                      }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 bg-primary/10 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10 bg-transparent">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Preguntar a BioBot..."
                  className="flex-1 px-4 py-2.5 bg-white/5 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:bg-white/10 focus:ring-1 focus:ring-primary/50 transition-all border border-transparent focus:border-white/10"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="p-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
