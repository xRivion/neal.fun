import React, { useState, useEffect } from 'react';
import { differenceInSeconds, differenceInDays, differenceInYears } from 'date-fns';

export const LifeStats: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>('');
  const [stats, setStats] = useState({
    seconds: 0,
    breaths: 0,
    heartbeats: 0,
    blinks: 0,
    asleep: 0, // hours
  });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;

    if (isActive && birthDate) {
      interval = setInterval(() => {
        const now = new Date();
        const birth = new Date(birthDate);
        
        const totalSeconds = differenceInSeconds(now, birth);
        const totalMinutes = totalSeconds / 60;
        
        setStats({
          seconds: totalSeconds,
          breaths: Math.floor(totalMinutes * 16), // Avg 16 breaths/min
          heartbeats: Math.floor(totalMinutes * 80), // Avg 80 bpm
          blinks: Math.floor(totalMinutes * 15), // Avg 15 blinks/min
          asleep: Math.floor(differenceInDays(now, birth) * 8), // Avg 8 hours/day
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isActive, birthDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(birthDate) setIsActive(true);
  };

  if (!isActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center animate-fade-in">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Estadísticas de Vida</h2>
            <p className="text-gray-500 mb-8">Ingresa tu fecha de nacimiento para ver estadísticas curiosas en tiempo real.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
                type="date" 
                required
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-xl text-center focus:border-purple-500 focus:outline-none transition-colors"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
            />
            <button 
                type="submit"
                className="w-full py-4 bg-purple-600 text-white font-bold text-xl rounded-xl hover:bg-purple-700 transform hover:scale-[1.02] transition-all"
            >
                Comenzar
            </button>
            </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-700">Tus Estadísticas en Vivo</h2>
        <button onClick={() => setIsActive(false)} className="text-gray-400 hover:text-gray-800">Cambiar fecha</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Segundos vividos" value={stats.seconds} color="bg-blue-500" />
        <StatCard title="Latidos del corazón" value={stats.heartbeats} color="bg-red-500" />
        <StatCard title="Respiraciones" value={stats.breaths} color="bg-teal-500" />
        <StatCard title="Parpadeos" value={stats.blinks} color="bg-yellow-500" />
        <StatCard title="Horas durmiendo" value={stats.asleep} color="bg-indigo-500" />
      </div>
    </div>
  );
};

const StatCard: React.FC<{title: string, value: number, color: string}> = ({ title, value, color }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
    <div className={`w-3 h-3 rounded-full ${color} mb-4`}></div>
    <div className="text-4xl font-mono font-bold text-gray-900 mb-2 tabular-nums tracking-tight">
      {new Intl.NumberFormat('es-ES').format(value)}
    </div>
    <div className="text-gray-500 uppercase tracking-wide text-sm font-semibold">{title}</div>
  </div>
);