import React from 'react';
import { Zap, BookOpen, FileText, ShoppingBag, Settings } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MobileNav: React.FC = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    setIsCartOpen, 
    setIsMagazineOrderOpen, 
    cartTotalCount,
    isAdminAuthenticated,
    setIsAdminLoginOpen 
  } = useStore();

  const handleAdminClick = () => {
    if (currentTab === 'admin') {
      setCurrentTab('inmediata');
    } else if (isAdminAuthenticated) {
      setCurrentTab('admin');
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-neutral-200 px-3 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around">
        {/* Stock / Inmediata */}
        <button
          onClick={() => setCurrentTab('inmediata')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
            currentTab === 'inmediata' ? 'text-rose-600 font-bold' : 'text-neutral-500'
          }`}
        >
          <Zap className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Stock Hoy</span>
        </button>

        {/* Catálogos */}
        <button
          onClick={() => setCurrentTab('catalogos')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
            currentTab === 'catalogos' ? 'text-rose-600 font-bold' : 'text-neutral-500'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Catálogos</span>
        </button>

        {/* Pedir por Código */}
        <button
          onClick={() => setIsMagazineOrderOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 text-rose-700 bg-rose-50 rounded-xl border border-rose-200 shadow-xs"
        >
          <FileText className="w-5 h-5 mb-0.5 text-rose-600" />
          <span className="text-[10px] font-bold">Por Código</span>
        </button>

        {/* Carrito */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 px-2 rounded-lg text-neutral-500"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {cartTotalCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartTotalCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Carrito</span>
        </button>

        {/* Admin */}
        <button
          onClick={handleAdminClick}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors cursor-pointer ${
            currentTab === 'admin' ? 'text-neutral-900 font-bold' : 'text-neutral-400'
          }`}
        >
          <Settings className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Admin</span>
        </button>
      </div>
    </nav>
  );
};
