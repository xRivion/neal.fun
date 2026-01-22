import React, { useState, useEffect } from 'react';
import { Product } from '../types';

const INITIAL_MONEY = 100000000000; // 100 Billion

const PRODUCTS: Product[] = [
  { id: 1, name: "Hamburguesa", price: 5, image: "🍔" },
  { id: 2, name: "Netflix (1 año)", price: 150, image: "📺" },
  { id: 3, name: "Iphone 15 Pro", price: 1200, image: "📱" },
  { id: 4, name: "Rolex", price: 15000, image: "⌚" },
  { id: 5, name: "Tesla Model S", price: 90000, image: "🚗" },
  { id: 6, name: "Lingote de Oro", price: 650000, image: "🧈" },
  { id: 7, name: "McDonalds (Franquicia)", price: 1500000, image: "🍟" },
  { id: 8, name: "Yate de Lujo", price: 15000000, image: "🛥️" },
  { id: 9, name: "Mansion en LA", price: 50000000, image: "🏰" },
  { id: 10, name: "Cohete Falcon 9", price: 65000000, image: "🚀" },
  { id: 11, name: "Equipo de la NBA", price: 3000000000, image: "🏀" },
  { id: 12, name: "Mona Lisa", price: 860000000, image: "🖼️" },
];

export const SpendMoney: React.FC = () => {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [balance, setBalance] = useState(INITIAL_MONEY);

  useEffect(() => {
    let spent = 0;
    PRODUCTS.forEach(p => {
      spent += (cart[p.id] || 0) * p.price;
    });
    setBalance(INITIAL_MONEY - spent);
  }, [cart]);

  const buy = (id: number) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const sell = (id: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      if (current <= 0) return prev;
      return { ...prev, [id]: current - 1 };
    });
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 pb-24">
      <div className="sticky top-4 z-40 bg-gradient-to-r from-green-400 to-emerald-600 text-white text-center py-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-3xl md:text-5xl font-extrabold">{formatMoney(balance)}</h2>
        <p className="opacity-90 mt-1 font-medium">Dinero restante de Bill Gates</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {PRODUCTS.map(product => (
          <div key={product.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition-shadow">
            <div className="text-6xl mb-4">{product.image}</div>
            <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
            <p className="text-green-600 font-bold mb-4">{formatMoney(product.price)}</p>
            
            <div className="flex items-center gap-4 w-full justify-between mt-auto bg-gray-100 p-2 rounded-lg">
              <button 
                onClick={() => sell(product.id)}
                disabled={!cart[product.id]}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-md font-bold disabled:opacity-30 hover:bg-red-200 transition-colors"
              >
                Vender
              </button>
              <span className="font-bold text-xl">{cart[product.id] || 0}</span>
              <button 
                onClick={() => buy(product.id)}
                disabled={balance < product.price}
                className="px-4 py-2 bg-green-100 text-green-600 rounded-md font-bold disabled:opacity-30 hover:bg-green-200 transition-colors"
              >
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>

      {Object.values(cart).reduce((a, b) => a + b, 0) > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-up-lg flex justify-center z-50">
          <div className="max-w-xl w-full text-center">
            <h3 className="font-bold text-gray-500 mb-2">Recibo</h3>
            <div className="flex gap-2 justify-center flex-wrap">
                {Object.entries(cart).map(([id, qty]) => {
                    if (qty === 0) return null;
                    const p = PRODUCTS.find(prod => prod.id === Number(id));
                    return (
                        <span key={id} className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                           {p?.name} x{qty}
                        </span>
                    )
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
