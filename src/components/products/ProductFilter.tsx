import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Smile, 
  Heart, 
  Sparkle, 
  Layers
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { ProductCategory } from '../../types';

export const ProductFilter: React.FC = () => {
  const { activeCategory, setActiveCategory } = useStore();

  const categories: { id: ProductCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'todos', label: 'Todos los productos', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'perfumeria', label: 'Perfumería', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'maquillaje', label: 'Maquillaje', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'cuidado_facial', label: 'Cuidado Facial', icon: <Smile className="w-3.5 h-3.5" /> },
    { id: 'cuidado_personal', label: 'Cuidado Personal', icon: <Heart className="w-3.5 h-3.5" /> },
    { id: 'moda_accesorios', label: 'Moda y Joyería', icon: <Sparkle className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
      {categories.map((cat) => {
        const isSelected = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              isSelected
                ? 'bg-neutral-900 text-white shadow-md'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
