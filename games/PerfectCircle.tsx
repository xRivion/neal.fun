import React, { useRef, useState, useEffect } from 'react';

export const PerfectCircle: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [points, setPoints] = useState<{x: number, y: number}[]>([]);
  const [center, setCenter] = useState<{x: number, y: number} | null>(null);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setScore(null);
    setPoints([]);
    setCenter(null);
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw center point guide
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#cbd5e1';
    ctx.fill();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setPoints(prev => [...prev, { x, y }]);

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#3b82f6';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    calculateScore();
  };

  const calculateScore = () => {
    if (points.length < 50) {
      setScore(0); // Too short
      return;
    }

    const canvas = canvasRef.current;
    if(!canvas) return;
    
    // Ideal center
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Calculate distances from center
    const distances = points.map(p => Math.sqrt(Math.pow(p.x - cx, 2) + Math.pow(p.y - cy, 2)));
    const avgRadius = distances.reduce((a, b) => a + b, 0) / distances.length;

    // Calculate variance
    const variance = distances.reduce((acc, r) => acc + Math.abs(r - avgRadius), 0) / distances.length;
    
    // Calculate closure (distance between start and end)
    const start = points[0];
    const end = points[points.length - 1];
    const closureDist = Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));

    // Heuristic scoring
    let rawScore = 100 - (variance / avgRadius * 500) - (closureDist / avgRadius * 50);
    rawScore = Math.max(0, Math.min(100, rawScore));
    
    setScore(Math.round(rawScore));
    setCenter({x: cx, y: cy});
  };

  // Adjust canvas size on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
         // Draw initial center dot
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#cbd5e1';
        ctx.fill();
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[500px] w-full max-w-2xl mx-auto p-4 select-none">
        <div className="mb-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800">Dibuja un Círculo Perfecto</h2>
            <p className="text-gray-500">Trata de dibujar un círculo alrededor del punto central.</p>
        </div>

        <div className="relative w-full aspect-square bg-white rounded-2xl shadow-xl overflow-hidden cursor-crosshair touch-none border-2 border-dashed border-gray-200">
             {score !== null && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className={`text-6xl font-black ${score > 90 ? 'text-green-500' : score > 70 ? 'text-yellow-500' : 'text-red-500'} drop-shadow-lg bg-white/80 px-6 py-4 rounded-xl backdrop-blur-sm`}>
                        {score}%
                    </div>
                </div>
             )}
             
             <canvas
                ref={canvasRef}
                className="w-full h-full block"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
             />
        </div>
        
        <button 
            onClick={() => {
                const canvas = canvasRef.current;
                if(canvas) {
                     const ctx = canvas.getContext('2d');
                     ctx?.clearRect(0,0, canvas.width, canvas.height);
                     // Redraw dot
                     const centerX = canvas.width / 2;
                     const centerY = canvas.height / 2;
                     ctx?.beginPath();
                     ctx?.arc(centerX, centerY, 5, 0, 2 * Math.PI);
                     ctx!.fillStyle = '#cbd5e1';
                     ctx?.fill();
                }
                setScore(null);
            }}
            className="mt-6 px-6 py-2 bg-gray-800 text-white rounded-full font-bold hover:bg-black transition-colors"
        >
            Reiniciar
        </button>
    </div>
  );
};
