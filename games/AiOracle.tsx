import React, { useState } from 'react';
import { askOracle } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AiOracle: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const currentQ = query;
    setQuery('');
    setLoading(true);

    // Add user message
    setHistory(prev => [...prev, { role: 'user', text: currentQ }]);

    // Get response
    const answer = await askOracle(currentQ);
    
    setHistory(prev => [...prev, { role: 'model', text: answer }]);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden mt-4">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white text-center">
        <h2 className="text-2xl font-bold mb-1">El Oráculo del Absurdo</h2>
        <p className="opacity-80 text-sm">Pregunta cualquier cosa ridícula. La IA responderá.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {history.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <div className="text-6xl mb-4">🔮</div>
            <p>Pregunta algo como...</p>
            <p className="italic mt-2">"¿Qué pasaría si las nubes fueran de algodón de azúcar?"</p>
            <p className="italic">"¿Cuántos pollos se necesitan para cocinar un pollo de una cachetada?"</p>
          </div>
        )}
        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white border border-gray-200 text-gray-800 shadow-sm rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-gray-200 p-4 rounded-2xl rounded-bl-none text-gray-500">
              Consultando a los astros...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleAsk} className="p-4 bg-white border-t flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Escribe tu pregunta absurda aquí..."
          className="flex-1 p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        <button 
          type="submit" 
          disabled={!query.trim() || loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Preguntar
        </button>
      </form>
    </div>
  );
};
