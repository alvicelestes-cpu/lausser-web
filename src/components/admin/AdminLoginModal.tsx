import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminLoginModal: React.FC = () => {
  const { 
    isAdminLoginOpen, 
    setIsAdminLoginOpen, 
    loginAdmin, 
    setCurrentTab, 
    showToast,
    defaultAdminPassword 
  } = useStore();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isAdminLoginOpen) return null;

  const handleClose = () => {
    setPassword('');
    setError('');
    setShowPassword(false);
    setIsAdminLoginOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Por favor ingresa tu contraseña.');
      return;
    }

    const success = loginAdmin(password);
    if (success) {
      setPassword('');
      setError('');
      setShowPassword(false);
      setIsAdminLoginOpen(false);
      setCurrentTab('admin');
      showToast('Bienvenida al Panel de Administración', 'success');
    } else {
      setError('Contraseña incorrecta. Por favor verifica e inténtalo de nuevo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-neutral-100 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-rose-500 to-pink-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-rose-200">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold font-serif text-neutral-900">
            Acceso Administrativo
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
            Ingresa tu contraseña para gestionar el inventario, precios y enlaces de los catálogos.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">
              Contraseña de Acceso
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                placeholder="Ingresa la contraseña..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className={`w-full pl-4 pr-11 py-3 text-sm rounded-xl border bg-neutral-50 focus:bg-white focus:outline-none transition-all ${
                  error
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-neutral-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1 rounded-md"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="text-xs font-medium text-red-600 mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {error}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Ingresar al Panel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Security badge and hint */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Área restringida para administradoras de Lausser</span>
          </div>
          <p className="text-[11px] text-neutral-400">
            Contraseña inicial de prueba: <code className="bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded font-mono text-[10px]">{defaultAdminPassword}</code>
          </p>
        </div>

      </div>
    </div>
  );
};
