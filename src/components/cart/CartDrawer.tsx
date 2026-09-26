import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Zap, 
  BookOpen, 
  ShoppingBag, 
  MessageCircle, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { CustomerOrderInfo } from '../../types';
import { formatCurrency, getBrandTheme, normalizeCOP } from '../../utils/formatters';
import { generateWhatsAppLink } from '../../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    campaignConfig 
  } = useStore();

  const [customer, setCustomer] = useState<CustomerOrderInfo>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    paymentMethod: 'contra_entrega',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!isCartOpen) return null;

  const stockItems = cart.filter((item) => item.type === 'stock');
  const campaignItems = cart.filter((item) => item.type === 'campaign');

  const stockSubtotal = stockItems.reduce((acc, item) => acc + normalizeCOP(item.price) * item.quantity, 0);
  const campaignSubtotal = campaignItems.reduce((acc, item) => acc + normalizeCOP(item.price) * item.quantity, 0);
  const total = stockSubtotal + campaignSubtotal;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!customer.fullName.trim()) {
      errors.fullName = 'Por favor escribe tu nombre completo';
    }
    if (!customer.phone.trim()) {
      errors.phone = 'Por favor ingresa tu número de contacto';
    }
    if (!customer.address.trim()) {
      errors.address = 'Por favor ingresa tu dirección de entrega';
    }
    if (!customer.city.trim()) {
      errors.city = 'Por favor ingresa tu ciudad o barrio';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;
    if (!validateForm()) {
      // Scroll form into view
      const formElement = document.getElementById('checkout-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    const whatsappUrl = generateWhatsAppLink({
      items: cart,
      customer,
      whatsappNumber: campaignConfig.whatsappNumber,
      campaignNumber: campaignConfig.campaignNumber,
    });

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col justify-between overflow-hidden">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-neutral-900">
                  Tu Carrito de Compras
                </h2>
                <span className="text-xs text-neutral-500 font-medium">
                  {cart.length} tipo{cart.length === 1 ? '' : 's'} de producto en orden
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-neutral-400 hover:text-red-500 transition-colors p-1"
                  title="Vaciar carrito"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3">
                <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-lg text-neutral-800">
                  Tu carrito está vacío
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Explora nuestros productos en stock con entrega inmediata o pide por código desde las revistas oficiales.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
                >
                  <span>Ver Productos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                {/* 1. SEPARADOR: ENTREGA INMEDIATA */}
                {stockItems.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                        <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                          Entrega Inmediata (Stock Hoy)
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-amber-900">
                        {formatCurrency(stockSubtotal)}
                      </span>
                    </div>

                    <div className="divide-y divide-neutral-100">
                      {stockItems.map((item) => {
                        const theme = getBrandTheme(item.brand);
                        return (
                          <div key={item.id} className="py-3 flex items-start gap-3">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-14 h-14 object-cover rounded-xl border border-neutral-200 shrink-0"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs font-bold">
                                FOTO
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.2 rounded-full ${theme.badge}`}>
                                  {item.brand}
                                </span>
                              </div>
                              <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-1">
                                {item.name}
                              </h4>
                              {item.notes && (
                                <p className="text-[11px] text-neutral-400">{item.notes}</p>
                              )}
                              <span className="text-xs font-bold text-neutral-800 mt-1 block">
                                {formatCurrency(item.price)}
                              </span>
                            </div>

                            {/* Quantity Controls & Remove */}
                            <div className="flex flex-col items-end gap-1.5">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-neutral-300 hover:text-red-500 p-1 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                                <button
                                  onClick={() => updateCartQuantity(item.id, -1)}
                                  className="p-1 hover:bg-neutral-200 text-neutral-600 transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-xs font-bold text-neutral-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateCartQuantity(item.id, 1)}
                                  className="p-1 hover:bg-neutral-200 text-neutral-600 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. SEPARADOR: PEDIDO DE CAMPAÑA */}
                {campaignItems.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between bg-rose-50 px-3.5 py-2 rounded-xl border border-rose-200">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-rose-600" />
                        <span className="text-xs font-bold text-rose-900 uppercase tracking-wide">
                          Pedido Campaña {campaignConfig.campaignNumber}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-rose-900">
                        {formatCurrency(campaignSubtotal)}
                      </span>
                    </div>

                    <div className="divide-y divide-neutral-100">
                      {campaignItems.map((item) => {
                        const theme = getBrandTheme(item.brand);
                        return (
                          <div key={item.id} className="py-3 flex items-start gap-3">
                            <div className="w-14 h-14 rounded-xl bg-rose-100/70 text-rose-700 flex flex-col items-center justify-center shrink-0 border border-rose-200 text-center p-1">
                              <span className="text-[9px] uppercase font-bold">CÓDIGO</span>
                              <span className="text-xs font-mono font-bold leading-tight">
                                {item.magazineCode || 'REVISTA'}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.2 rounded-full ${theme.badge}`}>
                                  {item.brand}
                                </span>
                                {item.magazinePage && (
                                  <span className="text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.2 rounded">
                                    Pág. {item.magazinePage}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-1">
                                {item.name}
                              </h4>
                              {item.notes && (
                                <p className="text-[11px] text-neutral-500 italic">
                                  Nota: {item.notes}
                                </p>
                              )}
                              <span className="text-xs font-bold text-neutral-800 mt-1 block">
                                {item.price > 0 ? formatCurrency(item.price) : 'Precio a confirmar'}
                              </span>
                            </div>

                            <div className="flex flex-col items-end gap-1.5">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-neutral-300 hover:text-red-500 p-1 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                                <button
                                  onClick={() => updateCartQuantity(item.id, -1)}
                                  className="p-1 hover:bg-neutral-200 text-neutral-600 transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-xs font-bold text-neutral-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateCartQuantity(item.id, 1)}
                                  className="p-1 hover:bg-neutral-200 text-neutral-600 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. FORMULARIO DE CHECKOUT Y DATOS */}
                <div id="checkout-form" className="pt-4 border-t border-neutral-200 space-y-3">
                  <h3 className="font-serif font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Datos para Despacho y WhatsApp</span>
                  </h3>

                  <div className="space-y-2.5">
                    <div>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Nombre completo *"
                        value={customer.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 text-xs rounded-xl border ${
                          formErrors.fullName ? 'border-red-500 bg-red-50' : 'border-neutral-200 focus:border-rose-500'
                        }`}
                      />
                      {formErrors.fullName && (
                        <p className="text-[10px] text-red-500 mt-0.5">{formErrors.fullName}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="WhatsApp de contacto *"
                          value={customer.phone}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 text-xs rounded-xl border ${
                            formErrors.phone ? 'border-red-500 bg-red-50' : 'border-neutral-200 focus:border-rose-500'
                          }`}
                        />
                        {formErrors.phone && (
                          <p className="text-[10px] text-red-500 mt-0.5">{formErrors.phone}</p>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          name="city"
                          placeholder="Ciudad / Barrio *"
                          value={customer.city}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 text-xs rounded-xl border ${
                            formErrors.city ? 'border-red-500 bg-red-50' : 'border-neutral-200 focus:border-rose-500'
                          }`}
                        />
                        {formErrors.city && (
                          <p className="text-[10px] text-red-500 mt-0.5">{formErrors.city}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        name="address"
                        placeholder="Dirección exacta de entrega (Calle, Casa, Apto) *"
                        value={customer.address}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 text-xs rounded-xl border ${
                          formErrors.address ? 'border-red-500 bg-red-50' : 'border-neutral-200 focus:border-rose-500'
                        }`}
                      />
                      {formErrors.address && (
                        <p className="text-[10px] text-red-500 mt-0.5">{formErrors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <select
                          name="paymentMethod"
                          value={customer.paymentMethod}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white"
                        >
                          <option value="contra_entrega">Pago contra entrega</option>
                          <option value="transferencia">Nequi / Daviplata / Bancolombia</option>
                          <option value="efectivo">Efectivo exacto</option>
                        </select>
                      </div>

                      <div>
                        <input
                          type="text"
                          name="notes"
                          placeholder="Indicaciones adicionales (opcional)"
                          value={customer.notes}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:border-rose-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Summary & WhatsApp Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50/90 backdrop-blur-md space-y-3">
              <div className="space-y-1 text-xs">
                {stockItems.length > 0 && (
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal Entrega Inmediata:</span>
                    <span className="font-semibold">{formatCurrency(stockSubtotal)}</span>
                  </div>
                )}
                {campaignItems.length > 0 && (
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal Pedido Campaña:</span>
                    <span className="font-semibold">{formatCurrency(campaignSubtotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-neutral-900 pt-1 border-t border-neutral-200">
                  <span>Total Estimado:</span>
                  <span className="text-lg font-black text-rose-600">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckoutWhatsApp}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-sm shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                <span>Confirmar Pedido por WhatsApp</span>
              </button>

              <p className="text-[10px] text-center text-neutral-400">
                Al hacer clic, se abrirá WhatsApp con el mensaje estructurado para tu asesora.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
