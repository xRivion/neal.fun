import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNextScenario } from '../services/geminiService';
import { Scenario, ScenarioCategory } from '../types';

// Updated categories with text and border colors for inactive states
const CATEGORIES: { 
    id: ScenarioCategory; 
    label: string; 
    icon: string; 
    bg: string; 
    text: string;
    border: string;
}[] = [
  { id: 'General', label: 'Aleatorio', icon: '🎲', bg: 'bg-gray-600', text: 'text-gray-600', border: 'border-gray-200' },
  { id: 'Divertidas', label: 'Divertidas', icon: '🤣', bg: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-200' },
  { id: 'Difíciles', label: 'Difíciles', icon: '🤯', bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-200' },
  { id: 'Asquerosas', label: 'Asquerosas', icon: '🤢', bg: 'bg-green-600', text: 'text-green-600', border: 'border-green-200' },
  { id: 'Filosóficas', label: 'Filosóficas', icon: '🤔', bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-200' },
  { id: 'Absurdas', label: 'Absurdas', icon: '🤪', bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-200' },
  { id: 'Curiosas', label: 'Curiosas', icon: '🧐', bg: 'bg-indigo-500', text: 'text-indigo-500', border: 'border-indigo-200' },
  { id: 'Extremas', label: 'Extremas', icon: '⚡', bg: 'bg-orange-600', text: 'text-orange-600', border: 'border-orange-200' },
];

export const WouldYouRather: React.FC = () => {
  const [category, setCategory] = useState<ScenarioCategory>('General');
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<'A' | 'B' | null>(null);
  const [nextScenario, setNextScenario] = useState<Scenario | null>(null);
  const [scenarioId, setScenarioId] = useState(0);

  // Initial load
  useEffect(() => {
    loadNewCategory(category);
  }, []);

  const loadNewCategory = async (newCat: ScenarioCategory) => {
    setLoading(true);
    setScenario(null); // Clear current to show loading state specifically for new category
    const data = await getNextScenario(newCat);
    setScenario(data);
    setLoading(false);
    // Prefetch next
    getNextScenario(newCat).then(setNextScenario);
  };

  const handleCategoryChange = (newCat: ScenarioCategory) => {
    if (category === newCat) return;
    setCategory(newCat);
    setNextScenario(null); // Clear prefetch as it's the wrong category
    loadNewCategory(newCat);
  };

  const handleChoice = (choice: 'A' | 'B') => {
    if (selected) return;
    setSelected(choice);

    setTimeout(() => {
      advanceScenario();
    }, 2500);
  };

  const advanceScenario = async () => {
    setSelected(null);
    setScenarioId(prev => prev + 1);
    
    if (nextScenario) {
      setScenario(nextScenario);
      setNextScenario(null);
      getNextScenario(category).then(setNextScenario);
    } else {
      setLoading(true);
      const data = await getNextScenario(category);
      setScenario(data);
      setLoading(false);
      getNextScenario(category).then(setNextScenario);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center py-4 md:py-8 gap-8 md:gap-12">
      
      {/* Game Area */}
      <div className="w-full flex flex-col justify-center items-center relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {(loading && !scenario) ? (
             <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-gray-400 animate-pulse absolute inset-0"
             >
                <div className="text-7xl mb-6">{CATEGORIES.find(c => c.id === category)?.icon || '🤔'}</div>
                <p className="text-2xl font-bold text-gray-600">Buscando dilema {category === 'General' ? 'aleatorio' : category.toLowerCase()}...</p>
             </motion.div>
          ) : scenario && (
            <motion.div
                key={scenarioId}
                initial={{ x: 500, opacity: 0, rotate: 5 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                exit={{ x: -500, opacity: 0, rotate: -5 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-full h-full flex flex-col justify-center px-4"
            >
                <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full relative">
                {/* Option A */}
                <OptionCard 
                    text={scenario.optionA} 
                    percent={scenario.percentageA} 
                    isSelected={selected === 'A'} 
                    isRevealed={selected !== null}
                    color="bg-rose-500"
                    onClick={() => handleChoice('A')}
                />

                <div className="flex items-center justify-center z-10 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 my-4 md:my-0">
                    <div className="bg-white rounded-full w-14 h-14 md:w-20 md:h-20 flex items-center justify-center font-black text-gray-800 shadow-2xl border-4 border-gray-100 text-2xl z-20">
                    O
                    </div>
                </div>

                {/* Option B */}
                <OptionCard 
                    text={scenario.optionB} 
                    percent={scenario.percentageB} 
                    isSelected={selected === 'B'} 
                    isRevealed={selected !== null}
                    color="bg-blue-500"
                    onClick={() => handleChoice('B')}
                />
                </div>
                
                <div className="h-20 mt-6 flex items-center justify-center px-4">
                    <AnimatePresence>
                    {selected && (
                        <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                        >
                        <p className="text-xl md:text-2xl font-medium text-gray-800 italic bg-white/80 shadow-sm px-8 py-3 rounded-2xl backdrop-blur-md border border-gray-200/50">
                            "{scenario.commentary}"
                        </p>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category Selector at Bottom */}
      <div className="w-full mt-2">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">Explorar Categorías</h3>
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-8 md:justify-center no-scrollbar snap-x">
            {CATEGORIES.map((cat) => (
                <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`
                        flex flex-col items-center justify-center gap-3 w-28 h-28 md:w-32 md:h-32 rounded-3xl transition-all snap-start flex-shrink-0 relative overflow-hidden group border-2
                        ${category === cat.id 
                            ? `${cat.bg} text-white shadow-xl ring-4 ring-offset-4 ring-offset-gray-50 ring-opacity-50 border-transparent` 
                            : `bg-white ${cat.text} ${cat.border} hover:shadow-lg`
                        }
                    `}
                >
                    <span className="text-4xl md:text-5xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                    <span className="font-bold text-sm md:text-base tracking-tight">{cat.label}</span>
                    
                    {/* Active indicator dot */}
                    {category === cat.id && (
                        <motion.div 
                            layoutId="activeDot"
                            className="absolute top-3 right-3 w-2 h-2 bg-white rounded-full shadow-sm"
                        />
                    )}
                </motion.button>
            ))}
        </div>
      </div>
    </div>
  );
};

interface OptionCardProps {
  text: string;
  percent: number;
  isSelected: boolean;
  isRevealed: boolean;
  color: string;
  onClick: () => void;
}

const OptionCard: React.FC<OptionCardProps> = ({ text, percent, isSelected, isRevealed, color, onClick }) => {
  return (
    <motion.div 
      className={`relative flex-1 rounded-[2rem] overflow-hidden cursor-pointer h-72 md:h-96 shadow-xl transform transition-all duration-300 ${!isRevealed ? 'hover:scale-[1.02] hover:shadow-2xl' : ''}`}
      onClick={onClick}
    >
      {/* Background with percentage fill */}
      <div className={`absolute inset-0 ${color} transition-all duration-500 ${isRevealed && !isSelected ? 'opacity-30 grayscale' : 'opacity-100'}`}></div>
      
      {/* Result Overlay Bar */}
      {isRevealed && (
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute bottom-0 left-0 right-0 bg-black/20 z-0"
        />
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center text-white">
        <h3 className="text-2xl md:text-4xl font-bold drop-shadow-md leading-tight select-none">{text}</h3>
        
        {isRevealed && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6"
          >
            <span className="text-6xl md:text-7xl font-black tracking-tighter drop-shadow-lg">{percent}%</span>
          </motion.div>
        )}

        {isRevealed && isSelected && (
            <div className="absolute top-6 right-6 bg-white text-gray-900 p-2 rounded-full shadow-lg animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
        )}
      </div>
    </motion.div>
  );
};
