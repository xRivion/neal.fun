import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Upgrade {
  id: string;
  name: string;
  cost: number;
  multiplier: number;
  autoClick: number;
  description: string;
  icon: string;
}

const UPGRADES: Upgrade[] = [
  { id: 'cursor', name: 'Dedo Biónico', cost: 25, multiplier: 2, autoClick: 0, description: 'Tus clicks son el doble de efectivos.', icon: '👆' },
  { id: 'bot', name: 'Auto-Clicker v1.0', cost: 150, multiplier: 1, autoClick: 5, description: '5 puntos/seg. Empieza la automatización.', icon: '🤖' },
  { id: 'confetti', name: 'Fiesta Eterna', cost: 1000, multiplier: 1.2, autoClick: 15, description: 'Más confeti con cada nivel.', icon: '🎉' }, 
  { id: 'vhs', name: 'Filtro VHS 1995', cost: 5000, multiplier: 1.5, autoClick: 40, description: 'Añade scanlines y nostalgia.', icon: '📼' },
  { id: 'shake', name: 'Bajos Potentes', cost: 20000, multiplier: 2, autoClick: 0, description: 'La pantalla tiembla con tu poder.', icon: '🔊' },
  { id: 'matrix', name: 'Hackeo del Sistema', cost: 100000, multiplier: 3, autoClick: 200, description: 'Entra en la Matrix.', icon: '💻' },
  { id: 'rainbow', name: 'Modo Gamer RGB', cost: 500000, multiplier: 4, autoClick: 500, description: 'Más FPS, más colores, más velocidad.', icon: '🌈' },
  { id: 'invert', name: 'Mundo Invertido', cost: 2000000, multiplier: 5, autoClick: 1500, description: 'Invierte la realidad (y los colores).', icon: '🙃' },
  { id: 'emojis', name: 'Lluvia Capitalista', cost: 10000000, multiplier: 8, autoClick: 4000, description: 'El dinero cae del cielo.', icon: '💸' },
  { id: 'video', name: 'Túnel del Tiempo', cost: 50000000, multiplier: 10, autoClick: 10000, description: 'Un viaje hipnótico sin fin.', icon: '🌀' },
  { id: 'ascension', name: 'Ascensión Divina', cost: 250000000, multiplier: 20, autoClick: 50000, description: 'Conviértete en un ser de luz.', icon: '👼' },
  { id: 'chaos', name: 'LA SINGULARIDAD', cost: 1000000000, multiplier: 50, autoClick: 200000, description: 'ROMPE LA SIMULACIÓN.', icon: '👁️' },
];

interface Particle {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  scale: number;
}

export const DopamineClicker: React.FC = () => {
  const [score, setScore] = useState(0);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [particles, setParticles] = useState<Particle[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Stats Calculation
  const clickPower = 1 + UPGRADES.reduce((acc, u) => acc + (inventory[u.id] || 0) * (u.multiplier > 1 ? u.multiplier * 10 : 0), 0) + (inventory['cursor'] || 0) * 5;
  const autoClickRate = UPGRADES.reduce((acc, u) => acc + (inventory[u.id] || 0) * u.autoClick, 0);

  // Upgrade Levels (Counts)
  const confettiLevel = inventory['confetti'] || 0;
  const vhsLevel = inventory['vhs'] || 0;
  const shakeLevel = inventory['shake'] || 0;
  const matrixLevel = inventory['matrix'] || 0;
  const rainbowLevel = inventory['rainbow'] || 0;
  const invertLevel = inventory['invert'] || 0;
  const emojisLevel = inventory['emojis'] || 0;
  const videoLevel = inventory['video'] || 0;
  const ascensionLevel = inventory['ascension'] || 0;
  const chaosLevel = inventory['chaos'] || 0;

  // Flags for rendering base layers
  const hasVideo = videoLevel > 0;
  const hasVHS = vhsLevel > 0;
  const hasRainbow = rainbowLevel > 0;
  const hasInvert = invertLevel > 0;
  const hasMatrix = matrixLevel > 0;
  const hasAscension = ascensionLevel > 0;
  const hasChaos = chaosLevel > 0;
  const hasShake = shakeLevel > 0;
  const hasEmojis = emojisLevel > 0;

  // Auto-click loop & Passive Effects Spawner
  useEffect(() => {
    if (autoClickRate === 0) return;
    const interval = setInterval(() => {
      setScore(s => s + Math.ceil(autoClickRate / 10)); 
      
      // Scaling Passive Effects based on Level
      
      // Emojis: Higher level = Higher chance to spawn multiple
      if (emojisLevel > 0) {
        // Base chance 10% + 5% per level. Cap at 80% per tick.
        const spawnChance = Math.min(0.8, 0.1 + (emojisLevel * 0.05));
        if (Math.random() < spawnChance) {
             // Spawn 1 emoji, plus 1 extra for every 3 levels
             const count = 1 + Math.floor(emojisLevel / 3);
             for(let i=0; i<count; i++) spawnFallingEmoji();
        }
      }

      // Matrix: Higher level = More characters per tick
      if (matrixLevel > 0) {
          // Spawn 1 char per level (capped at 10 per tick to save CPU)
          const count = Math.min(10, Math.ceil(matrixLevel / 1.5));
          for(let i=0; i<count; i++) {
             if (Math.random() > 0.5) spawnMatrixChar();
          }
      }

    }, 100);
    return () => clearInterval(interval);
  }, [autoClickRate, emojisLevel, matrixLevel]);

  const spawnFallingEmoji = () => {
     const emojis = hasChaos ? ['👁️', '🔥', '💀', '⚛️'] : ['💎', '🚀', '💵', '💰', '✨'];
     const emoji = emojis[Math.floor(Math.random() * emojis.length)];
     const x = Math.random() * window.innerWidth;
     const id = Date.now() + Math.random();
     
     setParticles(prev => [...prev, { id, x, y: -50, text: emoji, color: '#fff', scale: 1 + Math.random() }]);
     setTimeout(() => removeParticle(id), 3000); // Falling takes longer
  }

  const spawnMatrixChar = () => {
     const chars = '01XYZ@#%';
     const char = chars[Math.floor(Math.random() * chars.length)];
     const x = Math.random() * window.innerWidth;
     const id = Date.now() + Math.random();
     setParticles(prev => [...prev, { id, x, y: Math.random() * window.innerHeight, text: char, color: '#0f0', scale: 0.8 }]);
     setTimeout(() => removeParticle(id), 1000);
  }

  const removeParticle = (id: number) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  };

  const handleClick = (e: React.MouseEvent) => {
    const earned = clickPower;
    setScore(prev => prev + earned);

    const x = e.clientX;
    const y = e.clientY;
    const id = Date.now();
    
    // Determine Color
    let color = '#fff';
    if (hasMatrix) color = '#22c55e'; // Green
    else if (hasRainbow) {
        const colors = ['#fbbf24', '#ef4444', '#3b82f6', '#10b981', '#a855f7'];
        color = colors[Math.floor(Math.random() * colors.length)];
    } else if (hasChaos) color = '#ff0000';

    // Click Number Particle
    setParticles(prev => [...prev, { id, x, y, text: `+${new Intl.NumberFormat('en', { notation: "compact" }).format(earned)}`, color, scale: 1 }]);
    setTimeout(() => removeParticle(id), 800);

    // Scaling Confetti Burst
    if (confettiLevel > 0) {
        // Base 5 particles + 3 particles per level. Cap at 60 particles per click to prevent crash.
        const particleCount = Math.min(60, 5 + (confettiLevel * 3));
        
        for(let i=0; i < particleCount; i++) {
            const pid = Date.now() + Math.random();
            const angle = Math.random() * Math.PI * 2;
            const dist = 30 + Math.random() * (50 + confettiLevel * 5); // Spread increases with level
            const cx = x + Math.cos(angle) * dist;
            const cy = y + Math.sin(angle) * dist;
            const shapes = ['●', '▲', '■', '★'];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const cColor = hasMatrix ? '#0f0' : ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'][Math.floor(Math.random()*6)];
            
            setParticles(prev => [...prev, { id: pid, x: cx, y: cy, text: shape, color: cColor, scale: 0.5 + Math.random() * 0.5 }]);
            setTimeout(() => removeParticle(pid), 600);
        }
    }
  };

  const buyUpgrade = (upgrade: Upgrade) => {
    const count = inventory[upgrade.id] || 0;
    const currentCost = Math.ceil(upgrade.cost * Math.pow(1.15, count));
    
    if (score >= currentCost) {
      setScore(prev => prev - currentCost);
      setInventory(prev => ({
        ...prev,
        [upgrade.id]: (prev[upgrade.id] || 0) + 1
      }));
    }
  };

  // --- STYLE CLASSES CALCULATIONS ---
  const containerClasses = [
    "relative w-full min-h-[85vh] overflow-hidden rounded-xl transition-all duration-700 select-none",
    hasChaos ? "bg-black" : hasMatrix ? "bg-black font-mono text-green-500" : "bg-slate-900 text-white"
  ].join(" ");

  const filterStyles: React.CSSProperties = {};
  if (hasInvert) filterStyles.filter = "invert(1) hue-rotate(180deg)";
  
  return (
    <div className={containerClasses} style={filterStyles}>
      
      {/* --- BACKGROUND LAYERS --- */}
      
      {/* 1. Rainbow Gradient - Speed scales with level */}
      {hasRainbow && (
        <div className="absolute inset-0 opacity-40" style={{
            background: 'linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3)',
            backgroundSize: '1800% 1800%',
            animation: `rainbow ${Math.max(1, 15 - rainbowLevel)}s ease infinite` // Faster animation with more levels
        }} />
      )}

      {/* 2. Video/Hypnotic Pattern */}
      {hasVideo && (
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
             <div className="absolute inset-0" style={{
                 background: 'repeating-conic-gradient(#fff 0 9deg, #000 9deg 18deg)',
                 animation: `spin ${Math.max(2, 20 - videoLevel)}s linear infinite`, // Faster spin with levels
             }}></div>
        </div>
      )}

      {/* 3. VHS Scanlines */}
      {hasVHS && (
        <div className="absolute inset-0 pointer-events-none z-0 opacity-50" style={{
            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
            backgroundSize: '100% 2px, 3px 100%'
        }}></div>
      )}

      {/* 4. Ascension Glow */}
      {hasAscension && (
          <div className="absolute inset-0 pointer-events-none animate-pulse z-0 mix-blend-screen" style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
              animation: 'pulse 4s infinite'
          }}></div>
      )}

      {/* 5. Chaos Glitch Overlay */}
      {hasChaos && (
          <div className="absolute inset-0 pointer-events-none z-0 mix-blend-exclusion animate-pulse bg-red-900/20"></div>
      )}
      
      {/* CSS Animations */}
      <style>{`
        @keyframes rainbow { 0%{background-position:0% 82%} 50%{background-position:100% 19%} 100%{background-position:0% 82%} }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes fall { 0% { transform: translateY(0); opacity:1; } 100% { transform: translateY(100vh); opacity:0; } }
      `}</style>

      <div className="relative z-10 flex flex-col md:flex-row h-full min-h-[85vh]">
        
        {/* LEFT: INTERACTION ZONE */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
          
          {/* Particles Rendering */}
          <AnimatePresence>
            {particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ x: p.x, y: p.y, opacity: 1, scale: 0 }}
                animate={{ 
                    y: p.y - (hasEmojis && p.y === -50 ? -window.innerHeight : 150), // Fall down if emoji, float up if click
                    x: hasChaos ? p.x + (Math.random() - 0.5) * 100 : p.x,
                    opacity: 0, 
                    scale: p.scale,
                    rotate: hasChaos ? Math.random() * 720 : 0
                }}
                transition={{ duration: p.y === -50 ? 3 : 0.8, ease: "easeOut" }}
                className="fixed pointer-events-none font-black z-50 whitespace-nowrap"
                style={{ 
                    color: p.color, 
                    left: 0, 
                    top: 0, 
                    position: 'fixed',
                    textShadow: hasMatrix ? '0 0 5px #0f0' : '2px 2px 0 rgba(0,0,0,0.5)',
                    fontFamily: hasMatrix ? 'monospace' : 'inherit'
                }} 
              >
                {p.text}
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="text-center mb-12 relative">
             <h2 className={`text-xl font-bold uppercase tracking-widest mb-2 ${hasMatrix ? 'text-green-600' : 'text-gray-400'}`}>
                {hasChaos ? 'REALIDAD ROTA' : hasAscension ? 'NIVEL DE DIVINIDAD' : 'DOPAMINA ACTUAL'}
             </h2>
             <motion.div 
                key={score}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className={`text-6xl md:text-8xl font-black tabular-nums 
                    ${hasChaos ? 'animate-pulse text-red-500' : hasMatrix ? 'text-green-500' : hasRainbow ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500' : hasAscension ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'text-white'}
                `}
                style={hasVHS ? { textShadow: '2px 0 red, -2px 0 blue' } : {}}
             >
                {new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(score)}
             </motion.div>
             <p className={`mt-2 font-mono ${hasMatrix ? 'text-green-700' : 'text-gray-500'}`}>
                +{new Intl.NumberFormat('en-US', { notation: "compact" }).format(autoClickRate)} / seg
             </p>
          </div>

          <motion.button
            ref={buttonRef}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClick}
            className={`w-64 h-64 rounded-full shadow-2xl flex items-center justify-center text-6xl select-none outline-none relative overflow-hidden group
                ${hasMatrix ? 'bg-black border-4 border-green-500 text-green-500 hover:bg-green-900' : 
                  hasChaos ? 'bg-white text-black animate-pulse' : 
                  hasAscension ? 'bg-white text-yellow-500 shadow-[0_0_50px_rgba(255,255,255,0.6)]' :
                  'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'}
                ${hasShake ? 'active:translate-x-2 active:translate-y-2' : ''}
            `}
            style={hasShake ? { animation: 'shake 0.1s linear infinite' } : {}}
          >
            <div className="relative z-10 filter drop-shadow-lg">
                {hasChaos ? '👁️' : hasAscension ? '🌞' : hasVideo ? '🌀' : hasMatrix ? '>_' : '✨'}
            </div>
            {/* Ripple effect on button background */}
            <div className="absolute inset-0 bg-white/20 scale-0 group-active:scale-150 rounded-full transition-transform duration-300"></div>
          </motion.button>
        </div>

        {/* RIGHT: UPGRADES SHOP */}
        <div className={`w-full md:w-96 border-l backdrop-blur-md flex flex-col max-h-[50vh] md:max-h-[85vh] overflow-hidden transition-colors
            ${hasMatrix ? 'bg-black border-green-800' : 'bg-gray-900/90 border-gray-800'}
        `}>
            <div className={`p-4 border-b z-10 ${hasMatrix ? 'bg-black border-green-800 text-green-500' : 'bg-gray-900 border-gray-800 text-white'}`}>
                <h3 className="font-bold text-xl flex items-center gap-2">
                    {hasMatrix ? '>>> SYSTEM.UPGRADE' : '🛍️ Mercado de Dopamina'}
                </h3>
            </div>
            
            <div className="overflow-y-auto flex-1 p-4 space-y-3 pb-20 no-scrollbar">
                {UPGRADES.map(upgrade => {
                    const count = inventory[upgrade.id] || 0;
                    const currentCost = Math.ceil(upgrade.cost * Math.pow(1.15, count));
                    const canAfford = score >= currentCost;

                    return (
                        <button
                            key={upgrade.id}
                            onClick={() => buyUpgrade(upgrade)}
                            disabled={!canAfford}
                            className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all duration-200 text-left border relative overflow-hidden
                                ${hasMatrix 
                                    ? (canAfford ? 'border-green-500 hover:bg-green-900/30 text-green-500' : 'border-green-900 text-green-900 opacity-50')
                                    : (canAfford 
                                        ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-500 hover:scale-[1.02] shadow-lg text-white' 
                                        : 'bg-gray-900/50 border-gray-800 opacity-60 text-gray-500 cursor-not-allowed')
                                }
                            `}
                        >
                            <div className={`text-3xl w-12 h-12 flex items-center justify-center rounded-lg ${hasMatrix ? 'bg-green-900/20' : 'bg-gray-900'}`}>
                                {upgrade.icon}
                            </div>
                            <div className="flex-1 min-w-0 z-10">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="font-bold truncate">{upgrade.name}</h4>
                                    <span className="text-xs opacity-70 font-mono">Lvl {count}</span>
                                </div>
                                <p className="text-xs opacity-70 truncate">{upgrade.description}</p>
                                <div className={`text-sm font-bold mt-1 ${canAfford ? (hasMatrix ? 'text-green-400' : 'text-green-400') : (hasMatrix ? 'text-green-900' : 'text-red-400')}`}>
                                    {new Intl.NumberFormat('en-US', { notation: "compact" }).format(currentCost)} pts
                                </div>
                            </div>
                            
                            {/* Visual Progress Bar for Cost */}
                            {canAfford && (
                                <div className="absolute bottom-0 left-0 h-1 bg-green-500/50 transition-all duration-500" style={{ width: '100%' }}></div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>

      </div>
    </div>
  );
};