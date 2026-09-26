import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, Sparkles, FileText } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CountdownBanner: React.FC = () => {
  const { campaignConfig, setIsMagazineOrderOpen } = useStore();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const closing = new Date(campaignConfig.closingDate).getTime();
      const now = new Date().getTime();
      const difference = closing - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [campaignConfig.closingDate]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-900 via-rose-950 to-neutral-900 text-white p-4 sm:p-6 shadow-xl border border-rose-900/30">
      {/* Decorative ambient glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Campaign Label & Details */}
        <div className="text-center md:text-left space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cierre de Campaña {campaignConfig.campaignNumber}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center justify-center md:justify-start gap-2">
            <Clock className="w-5 h-5 text-rose-400" />
            <span>¡Haz tu pedido antes del cierre!</span>
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg">
            Anota los códigos de las revistas Ésika, Cyzone o L'Bel y recíbelos en el próximo despacho de campaña.
          </p>
        </div>

        {/* Countdown Timer Blocks */}
        <div className="flex items-center gap-2 sm:gap-3">
          {timeLeft.isExpired ? (
            <div className="flex items-center gap-2 bg-rose-900/60 px-4 py-2 rounded-xl border border-rose-700 text-rose-200 text-sm font-semibold">
              <AlertCircle className="w-4 h-4" />
              <span>Campaña Cerrada (Revisa con tu asesora)</span>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 min-w-[52px]">
                <span className="text-xl sm:text-2xl font-black font-mono text-rose-400">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400">Días</span>
              </div>
              <span className="text-xl font-bold text-rose-400/80 -mt-3">:</span>
              <div className="flex flex-col items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 min-w-[52px]">
                <span className="text-xl sm:text-2xl font-black font-mono text-white">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400">Hrs</span>
              </div>
              <span className="text-xl font-bold text-rose-400/80 -mt-3">:</span>
              <div className="flex flex-col items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 min-w-[52px]">
                <span className="text-xl sm:text-2xl font-black font-mono text-white">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400">Min</span>
              </div>
              <span className="text-xl font-bold text-rose-400/80 -mt-3">:</span>
              <div className="flex flex-col items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 min-w-[52px]">
                <span className="text-xl sm:text-2xl font-black font-mono text-rose-400 animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400">Seg</span>
              </div>
            </>
          )}
        </div>

        {/* CTA Button */}
        <div>
          <button
            onClick={() => setIsMagazineOrderOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg hover:shadow-rose-500/25 transition-all transform active:scale-95 shrink-0"
          >
            <FileText className="w-4 h-4" />
            <span>Pedir por Código</span>
          </button>
        </div>

      </div>
    </div>
  );
};
