import React, { useState } from 'react';
import { 
  ExternalLink, 
  BookOpen, 
  Maximize2, 
  Sparkles, 
  FileText, 
  ChevronRight, 
  ChevronLeft,
  ShoppingBag,
  Info
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { ActiveBrand } from '../../types';
import { CountdownBanner } from './CountdownBanner';
import { getBrandTheme } from '../../utils/formatters';

interface CatalogPageMock {
  pageNumber: number;
  title: string;
  featuredCode: string;
  productName: string;
  price: number;
  imageUrl: string;
}

export const CatalogModule: React.FC = () => {
  const { campaignConfig, setIsMagazineOrderOpen, addMagazineItemToCart } = useStore();
  const [selectedBrand, setSelectedBrand] = useState<ActiveBrand>('ésika');
  const [currentPreviewPage, setCurrentPreviewPage] = useState(0);

  const brandTabs: { id: ActiveBrand; name: string; subtitle: string }[] = [
    { id: 'ésika', name: 'Ésika', subtitle: 'Perfumería Fina & Color 24H' },
    { id: 'cyzone', name: 'Cyzone', subtitle: 'Tendencias Juveniles & Maquillaje' },
    { id: 'lbel', name: "L'Bel", subtitle: 'Tratamiento Facial Francés & Alta Gama' },
  ];

  // Visual sample catalog spreads for interactive preview experience
  const catalogPagesByBrand: Record<ActiveBrand, CatalogPageMock[]> = {
    ésika: [
      {
        pageNumber: 12,
        title: 'Lanzamiento Especial: Red Power',
        featuredCode: '18492',
        productName: 'Perfume Red Power 50ml',
        price: 62000,
        imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
      },
      {
        pageNumber: 26,
        title: 'Colorfix 24H: Cero Retoques',
        featuredCode: '05432',
        productName: 'Labial Duo Tattoo 24H',
        price: 24900,
        imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
      },
      {
        pageNumber: 44,
        title: 'Mirada Impactante Mega Full Size',
        featuredCode: '09811',
        productName: 'Máscara Efecto Pestañas Postizas',
        price: 28000,
        imageUrl: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=800&q=80',
      },
    ],
    cyzone: [
      {
        pageNumber: 8,
        title: 'Sweet Black: El aroma que cautiva',
        featuredCode: '14210',
        productName: 'Perfume Sweet Black 50ml',
        price: 39900,
        imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      },
      {
        pageNumber: 18,
        title: 'Studio Look: Acabado Mate 16H',
        featuredCode: '07541',
        productName: 'Labial Studio Look No Transfer',
        price: 19900,
        imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
      },
      {
        pageNumber: 30,
        title: 'Skin First: Tu piel radiante',
        featuredCode: '06810',
        productName: 'Gel Limpiador Botánico Skin First',
        price: 22000,
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      },
    ],
    lbel: [
      {
        pageNumber: 4,
        title: "Liasson: Máxima Sofisticación Francesa",
        featuredCode: '19041',
        productName: "Perfume Liasson L'Bel 50ml",
        price: 99000,
        imageUrl: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
      },
      {
        pageNumber: 16,
        title: "Concentré Total: 10 Beneficios Rejuvenecedores",
        featuredCode: '02188',
        productName: "Tratamiento Global Concentré Total",
        price: 118000,
        imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      },
      {
        pageNumber: 22,
        title: "Hyaluronic Complex 3D de L'Bel",
        featuredCode: '03411',
        productName: "Sérum Hidratación Profunda 3D",
        price: 85000,
        imageUrl: 'https://images.unsplash.com/photo-1608248597350-9366d0c75cbe?auto=format&fit=crop&w=800&q=80',
      },
    ],
  };

  const currentCatalogUrl = campaignConfig.catalogUrls[selectedBrand];
  const currentPages = catalogPagesByBrand[selectedBrand];
  const currentPageData = currentPages[currentPreviewPage % currentPages.length];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Countdown Banner */}
      <CountdownBanner />

      {/* 2. Brand Tabs Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-neutral-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Catálogos Oficiales de Campaña {campaignConfig.campaignNumber}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mt-1">
              Explora las Revistas Digitales
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Hojea las páginas oficiales y anota los códigos de tus productos favoritos para pedirlos con tu pedido de campaña.
            </p>
          </div>

          <button
            onClick={() => setIsMagazineOrderOpen(true)}
            className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Ingresar Código de Revista</span>
          </button>
        </div>

        {/* Brand Selector Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {brandTabs.map((tab) => {
            const isSelected = selectedBrand === tab.id;
            const theme = getBrandTheme(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedBrand(tab.id);
                  setCurrentPreviewPage(0);
                }}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? `border-transparent ring-2 ring-neutral-900 ${theme.bg} shadow-md`
                    : 'border-neutral-200 bg-white hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-base font-bold font-serif ${isSelected ? theme.text : 'text-neutral-800'}`}>
                    Revista {tab.name}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${theme.badge}`}>
                    {tab.id.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 line-clamp-1">{tab.subtitle}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Interactive Catalog Spread Preview & Direct Magazine Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Interactive Page Preview with Direct Add Code */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-neutral-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Página destacada de la revista
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700">
                Página {currentPageData.pageNumber}
              </span>
            </div>

            {/* Catalog Page Visual Card */}
            <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-neutral-100 mb-4 group shadow-inner">
              <img
                src={currentPageData.imageUrl}
                alt={currentPageData.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300">
                  {selectedBrand.toUpperCase()} • OFERTA DE CAMPAÑA
                </span>
                <h4 className="text-base sm:text-lg font-bold font-serif">{currentPageData.title}</h4>
                <p className="text-xs text-neutral-200 mt-0.5">{currentPageData.productName}</p>
              </div>

              {/* Tag with product code */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md text-neutral-900 text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Cód: {currentPageData.featuredCode}</span>
              </div>
            </div>

            {/* Quick action for highlighted page */}
            <div className="bg-neutral-50 rounded-2xl p-3.5 border border-neutral-200 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs text-neutral-500 block">Precio Revista:</span>
                <span className="text-base font-bold text-neutral-900">
                  ${currentPageData.price.toLocaleString('es-CO')} COP
                </span>
              </div>
              <button
                onClick={() => {
                  addMagazineItemToCart(
                    selectedBrand,
                    currentPageData.featuredCode,
                    currentPageData.productName,
                    currentPageData.price,
                    String(currentPageData.pageNumber),
                    `Destacado de revista ${selectedBrand}`
                  );
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Pedir este código</span>
              </button>
            </div>
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-100">
            <button
              onClick={() =>
                setCurrentPreviewPage((p) => (p === 0 ? currentPages.length - 1 : p - 1))
              }
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-xs font-medium text-neutral-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <span className="text-xs font-medium text-neutral-500">
              {currentPreviewPage + 1} de {currentPages.length} destacadas
            </span>

            <button
              onClick={() =>
                setCurrentPreviewPage((p) => (p + 1) % currentPages.length)
              }
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-xs font-medium text-neutral-700 transition-colors"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Embed / Full Catalog Frame Viewer */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-neutral-200 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="font-bold text-sm sm:text-base text-neutral-900 font-serif">
                  Visor Oficial de Revista Digital {selectedBrand.toUpperCase()}
                </h3>
              </div>

              <a
                href={currentCatalogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pantalla Completa</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Interactive Embed Frame / Live Viewer */}
            <div className="relative w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-900 shadow-inner group">
              <iframe
                title={`Catálogo Digital ${selectedBrand}`}
                src={currentCatalogUrl}
                className="w-full h-full border-0"
                allow="fullscreen"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />

              {/* Floating Fallback / Direct Launch Overlay at the bottom */}
              <div className="absolute bottom-3 left-3 right-3 bg-neutral-900/90 backdrop-blur-md text-white p-3 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-lg">
                <div className="flex items-center gap-2 text-xs">
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-neutral-300">
                    ¿La revista no carga en tu navegador por bloqueos de seguridad?
                  </span>
                </div>
                <a
                  href={currentCatalogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-white text-neutral-900 hover:bg-neutral-100 text-xs font-bold transition-all text-center shrink-0 flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir Catálogo Oficial</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom helper tip */}
          <div className="pt-4 mt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
            <span>💡 Pasa las hojas digitales, copia el código de 5 o 6 dígitos y usa nuestro botón rápido.</span>
            <button
              onClick={() => setIsMagazineOrderOpen(true)}
              className="text-rose-600 font-bold hover:underline shrink-0"
            >
              + Añadir código de esta revista
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
