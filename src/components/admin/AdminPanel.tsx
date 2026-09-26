import React, { useState } from 'react';
import { 
  Plus, 
  Settings, 
  Save, 
  Trash2, 
  RefreshCw, 
  Image as ImageIcon, 
  Zap, 
  BookOpen, 
  Package, 
  Phone,
  LogOut,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { ActiveBrand, ProductCategory } from '../../types';
import { formatCurrency, getBrandTheme } from '../../utils/formatters';

export const AdminPanel: React.FC = () => {
  const { 
    products, 
    addProduct, 
    deleteProduct, 
    clearAllProducts,
    updateProduct,
    campaignConfig, 
    updateCampaignConfig,
    resetToDefaults,
    setCurrentTab,
    logoutAdmin,
    changeAdminPassword,
    resetAdminPassword,
    defaultAdminPassword
  } = useStore();

  const [activeAdminTab, setActiveAdminTab] = useState<'nuevo' | 'inventario' | 'campana' | 'seguridad'>('nuevo');

  // Security / Password form state
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Quick product form state
  const [name, setName] = useState('');
  const [brand, setBrand] = useState<ActiveBrand>('ésika');
  const [category, setCategory] = useState<ProductCategory>('perfumeria');
  const [code, setCode] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('5');
  const [imageUrl, setImageUrl] = useState('');
  const [volumeOrSize, setVolumeOrSize] = useState('');
  const [description, setDescription] = useState('');

  // Campaign config form state
  const [campaignNumber, setCampaignNumber] = useState(campaignConfig.campaignNumber);
  const [closingDate, setClosingDate] = useState(() => {
    try {
      const d = new Date(campaignConfig.closingDate);
      return d.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  });
  const [whatsappNumber, setWhatsappNumber] = useState(campaignConfig.whatsappNumber);
  const [consultantName, setConsultantName] = useState(campaignConfig.consultantName);
  const [esikaUrl, setEsikaUrl] = useState(campaignConfig.catalogUrls.ésika);
  const [cyzoneUrl, setCyzoneUrl] = useState(campaignConfig.catalogUrls.cyzone);
  const [lbelUrl, setLbelUrl] = useState(campaignConfig.catalogUrls.lbel);

  // Quick preset images for beauty products
  const imagePresets = [
    { label: 'Perfume Elegante', url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=700&q=80' },
    { label: 'Labial Mate', url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80' },
    { label: 'Sérum Facial', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80' },
    { label: 'Máscara Pestañas', url: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=700&q=80' },
    { label: 'Crema Corporal', url: 'https://images.unsplash.com/photo-1608248597359-52e6945037d4?auto=format&fit=crop&w=700&q=80' },
    { label: 'Perfume Masculino', url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=700&q=80' },
  ];

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      alert('Ingresa al menos el nombre y precio del producto');
      return;
    }

    const regularPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
    const specialPrice = discountPrice ? parseFloat(discountPrice.replace(/[^0-9.]/g, '')) : undefined;
    const stockQty = parseInt(stock) || 1;

    addProduct({
      name: name.trim(),
      brand,
      category,
      code: code.trim() || undefined,
      price: regularPrice,
      discountPrice: specialPrice && specialPrice > 0 ? specialPrice : undefined,
      stock: stockQty,
      imageUrl: imageUrl.trim() || imagePresets[0].url,
      volumeOrSize: volumeOrSize.trim() || undefined,
      description: description.trim() || 'Producto original disponible en stock para entrega inmediata.',
      rating: 4.9,
    });

    // Reset form
    setName('');
    setCode('');
    setPrice('');
    setDiscountPrice('');
    setVolumeOrSize('');
    setDescription('');
    setImageUrl('');
    setActiveAdminTab('inventario');
  };

  const handleCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCampaignConfig({
      campaignNumber,
      closingDate: new Date(closingDate).toISOString(),
      whatsappNumber,
      consultantName,
      catalogUrls: {
        ésika: esikaUrl,
        cyzone: cyzoneUrl,
        lbel: lbelUrl,
      },
    });
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (!currentPassInput) {
      setPasswordFeedback({ type: 'error', message: 'Por favor ingresa tu contraseña actual.' });
      return;
    }

    if (newPassInput.length < 6) {
      setPasswordFeedback({ type: 'error', message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    if (newPassInput !== confirmPassInput) {
      setPasswordFeedback({ type: 'error', message: 'Las contraseñas nuevas no coinciden entre sí.' });
      return;
    }

    const result = changeAdminPassword(currentPassInput, newPassInput);
    if (result.success) {
      setCurrentPassInput('');
      setNewPassInput('');
      setConfirmPassInput('');
      setPasswordFeedback({ type: 'success', message: '¡Contraseña actualizada con éxito! Se guardó en tu navegador.' });
    } else {
      setPasswordFeedback({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Admin Header */}
      <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white mb-2">
            <Settings className="w-3.5 h-3.5 text-rose-400" />
            <span>Panel de Administración Lausser</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">
            Gestión de Inventario y Catálogos
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Sube nuevos productos en stock para entrega inmediata, actualiza los enlaces de catálogos y configura tu clave.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setCurrentTab('inmediata')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Volver a la Tienda
          </button>
          
          <button
            onClick={logoutAdmin}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            title="Cerrar sesión de administradora"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveAdminTab('nuevo')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'nuevo'
              ? 'border-rose-600 text-rose-600 bg-rose-50/50 rounded-t-xl'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Subir Producto en Stock</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('inventario')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'inventario'
              ? 'border-rose-600 text-rose-600 bg-rose-50/50 rounded-t-xl'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Inventario Actual ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('campana')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'campana'
              ? 'border-rose-600 text-rose-600 bg-rose-50/50 rounded-t-xl'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Catálogos y Campaña</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('seguridad')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'seguridad'
              ? 'border-rose-600 text-rose-600 bg-rose-50/50 rounded-t-xl'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Seguridad y Contraseña</span>
        </button>
      </div>

      {/* TAB 1: FORMULARIO RÁPIDO PARA SUBIR PRODUCTO */}
      {activeAdminTab === 'nuevo' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm max-w-3xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold font-serif text-neutral-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Registrar Producto para Entrega Inmediata</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Los productos que agregues aquí aparecerán instantáneamente en la pestaña "Entrega Inmediata".
            </p>
          </div>

          <form onSubmit={handleProductSubmit} className="space-y-4">
            
            {/* Brand & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">
                  Marca *
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value as ActiveBrand)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-500 focus:outline-none bg-white font-medium"
                >
                  <option value="ésika">Ésika</option>
                  <option value="cyzone">Cyzone</option>
                  <option value="lbel">L'Bel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">
                  Categoría *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-500 focus:outline-none bg-white font-medium"
                >
                  <option value="perfumeria">Perfumería</option>
                  <option value="maquillaje">Maquillaje</option>
                  <option value="cuidado_facial">Cuidado Facial</option>
                  <option value="cuidado_personal">Cuidado Personal</option>
                  <option value="moda_accesorios">Moda y Joyería</option>
                </select>
              </div>
            </div>

            {/* Name & Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Perfume Mithyka 50ml"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">
                  Código (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. 09142"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Prices & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">
                  Precio Regular ($ COP) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="Ej. 75000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">
                  Precio Oferta Lausser ($ COP)
                </label>
                <input
                  type="number"
                  placeholder="Ej. 52000 (Opcional)"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">
                  Stock Disponible *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Presentation/Size & Photo URL */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">
                  Tono o Tamaño
                </label>
                <input
                  type="text"
                  placeholder="Ej. 50 ml o Tono Nude"
                  value={volumeOrSize}
                  onChange={(e) => setVolumeOrSize(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">
                  URL de Foto del Producto
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick photo presets */}
            <div>
              <span className="text-[11px] font-semibold text-neutral-500 block mb-1.5">
                Fotos de muestra rápidas (haz clic para usar):
              </span>
              <div className="flex flex-wrap gap-2">
                {imagePresets.map((preset, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className="text-xs px-2.5 py-1 bg-neutral-100 hover:bg-rose-50 hover:text-rose-600 rounded-lg border border-neutral-200 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <ImageIcon className="w-3 h-3 text-neutral-400" />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">
                Descripción Corta del Producto
              </label>
              <textarea
                rows={2}
                placeholder="Beneficios, notas de salida, tipo de fijación o cómo usar..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-500 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span>Guardar Producto en Stock Inmediato</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TAB 2: INVENTARIO ACTUAL Y GESTIÓN */}
      {activeAdminTab === 'inventario' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
            <div>
              <h2 className="text-xl font-bold font-serif text-neutral-900">
                Productos en Stock ({products.length})
              </h2>
              <p className="text-xs text-neutral-500">
                Ajusta el stock o elimina productos directamente.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {products.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('¿Deseas eliminar TODOS los productos para dejar el catálogo limpio y listo para tus productos reales?')) {
                      clearAllProducts();
                    }
                  }}
                  className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Borrar todos los productos demo</span>
                </button>
              )}

              <button
                type="button"
                onClick={resetToDefaults}
                className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 border border-neutral-200 px-3 py-1.5 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restablecer demo</span>
              </button>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <Package className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-neutral-900">El catálogo está limpio y sin productos</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Has borrado los productos demo con éxito. El inventario está listo para registrar tus productos reales con entrega inmediata.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveAdminTab('nuevo')}
                  className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
                >
                  + Subir mi primer producto real
                </button>
                <button
                  onClick={resetToDefaults}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs font-semibold rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Recargar datos demo
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {products.map((product) => {
                const theme = getBrandTheme(product.brand);
                return (
                  <div key={product.id} className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-xl border border-neutral-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.2 rounded-full ${theme.badge}`}>
                            {product.brand}
                          </span>
                          <span className="text-xs text-neutral-400 capitalize">
                            {product.category.replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-neutral-900">{product.name}</h4>
                        <div className="text-xs text-neutral-500 flex items-center gap-2">
                          <span className="font-bold text-neutral-800">
                            {formatCurrency(product.discountPrice || product.price)}
                          </span>
                          {product.discountPrice && (
                            <span className="line-through text-neutral-400">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                          {product.volumeOrSize && <span>• {product.volumeOrSize}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Stock adjuster & delete */}
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
                        <span className="text-xs font-semibold text-neutral-500 px-2">Stock:</span>
                        <button
                          onClick={() =>
                            updateProduct({
                              ...product,
                              stock: Math.max(0, product.stock - 1),
                            })
                          }
                          className="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-neutral-700 hover:bg-neutral-200 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-neutral-900">
                          {product.stock}
                        </span>
                        <button
                          onClick={() =>
                            updateProduct({
                              ...product,
                              stock: product.stock + 1,
                            })
                          }
                          className="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-neutral-700 hover:bg-neutral-200 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-neutral-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GESTIÓN DE CATÁLOGOS Y CAMPAÑA */}
      {activeAdminTab === 'campana' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm max-w-3xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold font-serif text-neutral-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-rose-600" />
              <span>Configuración de Campaña y Revistas Digitales</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Define la fecha límite de cierre de la campaña actual y los enlaces a los catálogos en línea de cada marca.
            </p>
          </div>

          <form onSubmit={handleCampaignSubmit} className="space-y-4">
            
            {/* Campaign info & closing date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">
                  Número de Campaña
                </label>
                <input
                  type="text"
                  required
                  value={campaignNumber}
                  onChange={(e) => setCampaignNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">
                  Fecha y Hora de Cierre (Cuenta Regresiva)
                </label>
                <input
                  type="datetime-local"
                  required
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* WhatsApp business number & consultant name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp de Recepción de Pedidos *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 573001234567"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-500 focus:outline-none"
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Incluye el código de país sin el signo '+' (Ej: 57 para Colombia).
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">
                  Nombre de Asesora / Consultora
                </label>
                <input
                  type="text"
                  required
                  value={consultantName}
                  onChange={(e) => setConsultantName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Catalog URLs */}
            <div className="pt-2 space-y-3">
              <span className="text-xs font-bold text-neutral-700 uppercase block">
                Enlaces Oficiales a las Revistas Digitales (Embed / Visor)
              </span>

              <div>
                <label className="block text-xs font-semibold text-rose-700 mb-1">
                  Revista Digital Ésika
                </label>
                <input
                  type="url"
                  required
                  value={esikaUrl}
                  onChange={(e) => setEsikaUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-fuchsia-700 mb-1">
                  Revista Digital Cyzone
                </label>
                <input
                  type="url"
                  required
                  value={cyzoneUrl}
                  onChange={(e) => setCyzoneUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-800 mb-1">
                  Revista Digital L'Bel
                </label>
                <input
                  type="url"
                  required
                  value={lbelUrl}
                  onChange={(e) => setLbelUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-5 h-5" />
                <span>Guardar Cambios de Campaña</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TAB 4: SEGURIDAD Y CONFIGURACIÓN DE CONTRASEÑA */}
      {activeAdminTab === 'seguridad' && (
        <div className="space-y-6 max-w-2xl">
          
          {/* Main Change Password Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold font-serif text-neutral-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-rose-600" />
                <span>Cambiar Contraseña del Panel</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Actualiza la contraseña necesaria para ingresar al panel de administración y editar el stock o catálogos.
              </p>
            </div>

            {/* Feedback alert banner */}
            {passwordFeedback && (
              <div
                className={`p-4 rounded-2xl flex items-start gap-3 text-xs font-medium animate-in fade-in duration-200 ${
                  passwordFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {passwordFeedback.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <span className="text-sm shrink-0">⚠️</span>
                )}
                <span>{passwordFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
              
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">
                  Contraseña Actual *
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    placeholder="Ingresa la contraseña actual..."
                    value={currentPassInput}
                    onChange={(e) => setCurrentPassInput(e.target.value)}
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
                    aria-label={showCurrentPass ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">
                  Nueva Contraseña *
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres..."
                    value={newPassInput}
                    onChange={(e) => setNewPassInput(e.target.value)}
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
                    aria-label={showNewPass ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Recomendado: combina letras, números y símbolos para mayor seguridad.
                </span>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">
                  Confirmar Nueva Contraseña *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Repite la nueva contraseña..."
                    value={confirmPassInput}
                    onChange={(e) => setConfirmPassInput(e.target.value)}
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-rose-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
                    aria-label={showConfirmPass ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Nueva Contraseña</span>
                </button>
              </div>

            </form>
          </div>

          {/* Default Password & Reset Info Box */}
          <div className="bg-neutral-50 rounded-3xl p-6 border border-neutral-200/80 space-y-3">
            <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Contraseña Predeterminada de Fábrica</span>
            </div>
            
            <p className="text-xs text-neutral-600 leading-relaxed">
              La contraseña por defecto configurada para el sistema es: <code className="bg-white border border-neutral-200 px-2 py-0.5 rounded font-mono font-bold text-neutral-900">{defaultAdminPassword}</code>. 
              Si olvidas tu clave personalizada, puedes restablecerla a la clave original haciendo clic abajo:
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`¿Segura que deseas restablecer la contraseña a la clave de fábrica ("${defaultAdminPassword}")?`)) {
                    resetAdminPassword();
                    setCurrentPassInput('');
                    setNewPassInput('');
                    setConfirmPassInput('');
                    setPasswordFeedback({
                      type: 'success',
                      message: `Contraseña restablecida exitosamente a la de fábrica: "${defaultAdminPassword}".`
                    });
                  }
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Restablecer contraseña a la de fábrica ({defaultAdminPassword})</span>
              </button>
            </div>
          </div>

          {/* Active Session Management */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-neutral-800">Sesión Administrativa Activa</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Al salir o cerrar la ventana se mantendrá tu sesión protegida.
              </p>
            </div>

            <button
              type="button"
              onClick={logoutAdmin}
              className="px-4 py-2 bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-red-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 border border-neutral-200 hover:border-red-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión Ahora</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
