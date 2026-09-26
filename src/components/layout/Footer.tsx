import React from 'react';
import { Sparkles, ShieldCheck, Truck, MessageCircle, Heart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { campaignConfig, setActiveBrand, setCurrentTab } = useStore();

  const handleBrandClick = (brand: 'ésika' | 'cyzone' | 'lbel') => {
    setActiveBrand(brand);
    setCurrentTab('inmediata');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-12 pb-24 sm:pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-neutral-800 text-center sm:text-left">
          <div className="flex items-center gap-4 bg-neutral-800/40 p-4 rounded-2xl border border-neutral-800">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">100% Originales Belcorp</h4>
              <p className="text-xs text-neutral-400">Garantía directa de fábrica en Ésika, Cyzone y L'Bel.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-neutral-800/40 p-4 rounded-2xl border border-neutral-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Entrega Inmediata</h4>
              <p className="text-xs text-neutral-400">Stock disponible listo para despacho y pago contra entrega.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-neutral-800/40 p-4 rounded-2xl border border-neutral-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Atención por WhatsApp</h4>
              <p className="text-xs text-neutral-400">Confirmación rápida y personalizada con tu asesora.</p>
            </div>
          </div>
        </div>

        {/* Brand columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center text-white font-serif font-bold text-lg">
                L
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-wide">Lausser</span>
            </div>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Tu tienda online de belleza y cosméticos favorita. Disfruta de la mejor selección con entrega inmediata en stock o pide directamente desde las revistas digitales de campaña de <strong>Ésika</strong>, <strong>Cyzone</strong> y <strong>L'Bel</strong>.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${campaignConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hola Lausser, tengo una consulta sobre sus productos.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Hablar con Asesora en WhatsApp</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Marcas Belcorp</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <button onClick={() => handleBrandClick('ésika')} className="hover:text-rose-400 transition-colors">
                  Ésika (Perfumes & Color)
                </button>
              </li>
              <li>
                <button onClick={() => handleBrandClick('cyzone')} className="hover:text-fuchsia-400 transition-colors">
                  Cyzone (Juvenil & Tendencias)
                </button>
              </li>
              <li>
                <button onClick={() => handleBrandClick('lbel')} className="hover:text-amber-400 transition-colors">
                  L'Bel (Alta Cosmética & Lujo)
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Campaña Actual</h4>
            <div className="text-sm text-neutral-400 space-y-1">
              <p><strong className="text-neutral-200">Campaña:</strong> {campaignConfig.campaignNumber}</p>
              <p><strong className="text-neutral-200">Asesora:</strong> {campaignConfig.consultantName}</p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  Garantía de satisfacción
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-neutral-800 text-center text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Lausser. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Diseñado con <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> para consultoras y amantes de la belleza.
          </p>
        </div>

      </div>
    </footer>
  );
};
