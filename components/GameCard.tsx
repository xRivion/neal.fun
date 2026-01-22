import React from 'react';
import { GameCardProps } from '../types';
import { motion } from 'framer-motion';

export const GameCard: React.FC<GameCardProps> = ({ id, title, description, color, icon, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className={`relative overflow-hidden rounded-2xl p-6 cursor-pointer shadow-lg transition-shadow hover:shadow-2xl bg-white h-64 flex flex-col justify-between group`}
      onClick={() => onClick(id)}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-10 -mt-10 opacity-20 ${color}`}></div>
      
      <div className="z-10">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${color} text-white`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
      
      <div className="flex justify-end">
        <span className="text-sm font-semibold text-gray-400 group-hover:text-gray-800 flex items-center gap-1">
          Jugar 
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </span>
      </div>
    </motion.div>
  );
};
