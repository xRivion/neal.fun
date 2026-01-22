import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomFact } from '../services/geminiService';
import { Fact } from '../types';

const CATEGORIES = [
  { id: 'Aleatorio', icon: '🎲', color: 'bg-gray-600', border: 'border-gray-200', text: 'text-gray-600', bgHover: 'hover:bg-gray-50' },
  { id: 'Historia', icon: '📜', color: 'bg-amber-600', border: 'border-amber-200', text: 'text-amber-600', bgHover: 'hover:bg-amber-50' },
  { id: 'Ciencia', icon: '🧪', color: 'bg-emerald-600', border: 'border-emerald-200', text: 'text-emerald-600', bgHover: 'hover:bg-emerald-50' },
  { id: 'Animales', icon: '🐾', color: 'bg-orange-500', border: 'border-orange-200', text: 'text-orange-500', bgHover: 'hover:bg-orange-50' },
  { id: 'Espacio', icon: '🌌', color: 'bg-indigo-900', border: 'border-indigo-200', text: 'text-indigo-900', bgHover: 'hover:bg-indigo-50' },
  { id: 'Geografía', icon: '🌍', color: 'bg-blue-500', border: 'border-blue-200', text: 'text-blue-500', bgHover: 'hover:bg-blue-50' },
  { id: 'Matemáticas', icon: '🔢', color: 'bg-red-500', border: 'border-red-200', text: 'text-red-500', bgHover: 'hover:bg-red-50' },
  { id: 'Tecnología', icon: '💻', color: 'bg-zinc-700', border: 'border-zinc-200', text: 'text-zinc-700', bgHover: 'hover:bg-zinc-50' },
  { id: 'Cuerpo Humano', icon: '🧠', color: 'bg-pink-500', border: 'border-pink-200', text: 'text-pink-500', bgHover: 'hover:bg-pink-50' },
];

export const RandomFacts: React.FC = () => {
  const [fact, setFact] = useState<Fact | null>(null);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0); // To force re-render animation
  const [category, setCategory] = useState('Aleatorio');
  
  // Initialize history from localStorage to persist data across sessions
  const [history, setHistory] = useState<string[]>(() => {
    try {
        const saved = localStorage.getItem('neal_clone_facts_history');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
  });

  const loadFact = async (selectedCategory: string = category) => {
    setLoading(true);
    
    // Pass the last 20 facts to the service to avoid repetition (optimizing token usage)
    const contextHistory = history.slice(-20);
    const data = await getRandomFact(selectedCategory, contextHistory);
    
    setFact(data);
    
    // Update history state and localStorage
    setHistory(prev => {
        const newHistory = [...prev, data.content];
        localStorage.setItem('neal_clone_facts_history', JSON.stringify(newHistory));
        return newHistory;
    });
    
    setLoading(false);
    setKey(prev => prev + 1);
  };

  useEffect(() => {
    // Only load if we don't have a fact yet (first render)
    if (!fact) {
        loadFact();
    }
  }, []);

  const handleCategoryChange = (newCat: string) => {
    if (category === newCat) return;
    setCategory(newCat);
    loadFact(newCat);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Content (Title, Card, Button) - Expanded to col-span-9 */}
        <div className="lg:col-span-9 flex flex-col justify-start items-center lg:items-start gap-8 order-2 lg:order-1">
            
            <div className="text-center lg:text-left w-full">
                <h2 className="text-4xl md:text-6xl font-black text-gray-800 tracking-tight">
                    ¿Sabías que...?
                </h2>
                <p className="text-xl text-gray-500 mt-2 font-medium">
                    Curiosidades sobre <span className={`font-bold transition-colors duration-300 ${CATEGORIES.find(c => c.id === category)?.text}`}>{category}</span>.
                </p>
            </div>

            <div className="w-full min-h-[400px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-80 bg-white rounded-[2.5rem] shadow-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center"
                    >
                        <div className="text-7xl mb-6 animate-bounce opacity-50">
                            {CATEGORIES.find(c => c.id === category)?.icon || '💡'}
                        </div>
                        <p className="text-gray-400 font-bold text-lg animate-pulse">Consultando la enciclopedia...</p>
                    </motion.div>
                ) : fact && (
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        className="w-full bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col items-center justify-center p-10 md:p-16 text-center relative overflow-hidden group min-h-[400px]"
                    >
                        {/* Background Decoration */}
                        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-20 -mt-20 opacity-20 transition-colors duration-500 ${CATEGORIES.find(c => c.id === category)?.color.replace('bg-', 'bg-')}`}></div>
                        <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl -ml-20 -mb-20 opacity-20 transition-colors duration-500 ${CATEGORIES.find(c => c.id === category)?.color.replace('bg-', 'bg-')}`}></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <span className={`inline-block px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest mb-8 border transition-colors duration-300 bg-white shadow-sm ${CATEGORIES.find(c => c.id === category)?.text} ${CATEGORIES.find(c => c.id === category)?.border}`}>
                                {fact.topic}
                            </span>
                            
                            <h3 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight mb-10">
                                "{fact.content}"
                            </h3>

                            <div className="flex gap-3 justify-center opacity-30">
                                <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                                <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                                <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                            </div>
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => loadFact()}
                disabled={loading}
                className="w-full md:w-auto px-12 py-6 bg-gray-900 text-white text-2xl font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
                <span className="group-hover:rotate-180 transition-transform duration-500">🔄</span>
                Siguiente Dato
            </motion.button>
        </div>

        {/* RIGHT COLUMN: Compact Category List - Reduced to col-span-3 */}
        <div className="lg:col-span-3 flex flex-col gap-4 order-1 lg:order-2 justify-start">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1 hidden lg:block text-right">Categorías</h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-3 w-full">
                {CATEGORIES.map((cat) => {
                    const isActive = category === cat.id;
                    return (
                        <motion.button
                            key={cat.id}
                            whileHover={{ scale: 1.02, x: -3 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`
                                relative overflow-hidden flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-2 lg:gap-4 p-3 lg:px-4 rounded-2xl transition-all duration-200 border w-full h-24 lg:h-16
                                ${isActive 
                                    ? `${cat.color} text-white shadow-md ring-2 ring-offset-2 ring-gray-100 border-transparent z-10` 
                                    : `bg-white ${cat.text} ${cat.border} ${cat.bgHover} shadow-sm hover:shadow-md`
                                }
                            `}
                        >
                            {/* Icon */}
                            <span className="text-3xl lg:text-2xl filter drop-shadow-sm z-10">{cat.icon}</span>
                            
                            {/* Text */}
                            <span className="font-bold text-xs lg:text-sm z-10 text-center lg:text-left leading-none">{cat.id}</span>
                            
                            {/* Active Arrow (Desktop only) */}
                            {isActive && (
                                <div className="hidden lg:block absolute right-3 opacity-50">
                                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>

      </div>
    </div>
  );
};
