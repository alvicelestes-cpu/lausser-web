import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Search, 
  BookOpen, 
  Zap, 
  FileText, 
  Settings, 
  X,
  Menu
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { Brand } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    activeBrand, 
    setActiveBrand, 
    searchQuery, 
    setSearchQuery, 
    currentTab, 
    setCurrentTab, 
    setIsCartOpen, 
    setIsMagazineOrderOpen,
    cartTotalCount 
  } = useStore();

  const [isSearchOpenMobile, setIsSearchOpenMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const brands: { id: Brand; label: string; activeColor: string }[] = [
    { id: 'all', label: 'Todas las marcas', activeColor: 'bg-neutral-900 text-white' },
    { id: 'ésika', label: 'Ésika', activeColor: 'bg-rose-600 text-white shadow-rose-200 shadow-md' },
    { id: 'cyzone', label: 'Cyzone', activeColor: 'bg-fuchsia-600 text-white shadow-fuchsia-200 shadow-md' },
    { id: 'lbel', label: "L'Bel", activeColor: 'bg-amber-700 text-amber-50 shadow-amber-200 shadow-md' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xs transition-all">
      {/* Top micro-announcement bar */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>¡Envíos rápidos a domicilio! Productos originales <strong>Ésika</strong>, <strong>Cyzone</strong> y <strong>L'Bel</strong></span>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Brand Logo & Tagline */}
          <div 
            onClick={() => setCurrentTab('inmediata')}
            className="cursor-pointer flex items-center gap-3 select-none group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-rose-600 font-extrabold text-xl font-serif">
                L
              </div>
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-rose-600 via-pink-600 to-amber-700 bg-clip-text text-transparent">
                Lausser
              </span>
              <span className="hidden sm:block text-[11px] font-semibold text-neutral-400 uppercase tracking-widest -mt-1">
                Belleza & Cosmética
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar perfumes, labiales, cremas por nombre o código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 text-sm bg-neutral-100 hover:bg-neutral-100/80 focus:bg-white border border-transparent focus:border-rose-400 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all placeholder:text-neutral-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Mobile search toggle */}
            <button
              onClick={() => setIsSearchOpenMobile(!isSearchOpenMobile)}
              className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-full hover:bg-neutral-100"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Quick action: Pedir por Código modal */}
            <button
              onClick={() => setIsMagazineOrderOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Pedir por Código</span>
            </button>

            {/* Admin panel button */}
            <button
              onClick={() => setCurrentTab(currentTab === 'admin' ? 'inmediata' : 'admin')}
              className={`p-2 rounded-full border transition-all ${
                currentTab === 'admin'
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800 border-neutral-200 hover:bg-neutral-100'
              }`}
              title="Panel de Administración"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-3.5 sm:px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold text-sm">Carrito</span>
              {cartTotalCount > 0 && (
                <span className="flex items-center justify-center bg-white text-rose-600 font-extrabold text-xs w-5 h-5 rounded-full shadow-xs">
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Mobile Search Input Drawer */}
        {isSearchOpenMobile && (
          <div className="md:hidden pb-3 pt-1">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar perfume, labial, código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-9 py-2 text-sm bg-neutral-100 rounded-full border border-neutral-300 focus:outline-none focus:border-rose-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Brand Selector Bar & Main Navigation Tabs */}
        <div className="py-2.5 flex items-center justify-between border-t border-neutral-100 overflow-x-auto no-scrollbar gap-4">
          
          {/* Brand Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider hidden sm:inline mr-1">
              Marca:
            </span>
            {brands.map((brand) => {
              const isSelected = activeBrand === brand.id;
              return (
                <button
                  key={brand.id}
                  onClick={() => {
                    setActiveBrand(brand.id);
                    if (currentTab === 'admin') setCurrentTab('inmediata');
                  }}
                  className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? brand.activeColor
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900'
                  }`}
                >
                  {brand.label}
                </button>
              );
            })}
          </div>

          {/* Primary View Switcher */}
          <div className="flex items-center gap-1 shrink-0 bg-neutral-100 p-1 rounded-xl">
            <button
              onClick={() => setCurrentTab('inmediata')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'inmediata'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Entrega Inmediata</span>
            </button>

            <button
              onClick={() => setCurrentTab('catalogos')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'catalogos'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-rose-500" />
              <span>Catálogos Digitales</span>
            </button>
          </div>

        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-neutral-200 bg-white px-4 py-3 space-y-2 shadow-lg">
          <button
            onClick={() => {
              setCurrentTab('inmediata');
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-2.5 text-sm font-semibold rounded-lg hover:bg-neutral-100"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Entrega Inmediata (Stock)</span>
            </div>
            <span className="text-xs text-neutral-400">Ver productos</span>
          </button>
          <button
            onClick={() => {
              setCurrentTab('catalogos');
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-2.5 text-sm font-semibold rounded-lg hover:bg-neutral-100"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-rose-500" />
              <span>Catálogos Digitales</span>
            </div>
            <span className="text-xs text-neutral-400">Ésika, Cyzone, L'Bel</span>
          </button>
          <button
            onClick={() => {
              setIsMagazineOrderOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-2.5 text-sm font-semibold rounded-lg bg-rose-50 text-rose-700"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Pedir por Código de Revista</span>
            </div>
            <span className="text-xs bg-rose-200 px-2 py-0.5 rounded font-bold">Nuevo</span>
          </button>
          <button
            onClick={() => {
              setCurrentTab('admin');
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-2.5 text-sm font-semibold rounded-lg text-neutral-600 hover:bg-neutral-100"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span>Panel de Administración</span>
            </div>
            <span className="text-xs text-neutral-400">Gestionar</span>
          </button>
        </div>
      )}
    </header>
  );
};
