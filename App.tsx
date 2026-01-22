import React, { useState } from 'react';
import { WouldYouRather } from './games/WouldYouRather';
import { Connect4 } from './games/Connect4';
import { RandomFacts } from './games/RandomFacts';
import { ViewState } from './types';
import { GameCard } from './components/GameCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [view, setView] = useState<ViewState>('home');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-rose-200">
      <header className="p-6 flex items-center justify-center relative bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm/50">
        {view !== 'home' && (
          <button 
            onClick={() => setView('home')}
            className="absolute left-4 md:left-8 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            ← Volver
          </button>
        )}
        <h1 
          onClick={() => setView('home')}
          className="text-2xl md:text-3xl font-black tracking-tighter select-none cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600"
        >
          neal<span className="text-rose-500">.clon</span>
        </h1>
      </header>

      <main className="container mx-auto p-4">
        <AnimatePresence mode="wait">
          {view === 'home' ? (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
            >
               <GameCard 
                id="would-you-rather"
                title="¿Qué Prefieres?"
                description="Decisiones imposibles. Ahora con categorías seleccionables."
                color="bg-rose-500"
                icon={<span className="text-2xl">⚖️</span>}
                onClick={setView}
              />
               <GameCard 
                id="connect-4"
                title="4 en Raya"
                description="El clásico juego de estrategia. Juega contra amigos o IA."
                color="bg-blue-500"
                icon={<span className="text-2xl">🔴</span>}
                onClick={setView}
              />
               <GameCard 
                id="random-facts"
                title="Datos Curiosos"
                description="Aprende algo inútil pero fascinante cada vez que entres."
                color="bg-yellow-500"
                icon={<span className="text-2xl">💡</span>}
                onClick={setView}
              />
            </motion.div>
          ) : (
            <motion.div 
              key={view} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
            >
              {view === 'would-you-rather' && <WouldYouRather />}
              {view === 'connect-4' && <Connect4 />}
              {view === 'random-facts' && <RandomFacts />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-8 text-center text-gray-400 text-sm">
        <p>Inspirado en neal.fun • Impulsado por Gemini AI</p>
      </footer>
    </div>
  );
}
