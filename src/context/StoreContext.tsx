import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Product, 
  Brand, 
  ProductCategory, 
  CartItem, 
  CampaignConfig, 
  NavigationTab,
  ActiveBrand
} from '../types';
import { initialProducts, initialCampaignConfig } from '../data/mockData';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface StoreContextType {
  products: Product[];
  campaignConfig: CampaignConfig;
  cart: CartItem[];
  activeBrand: Brand;
  activeCategory: ProductCategory;
  searchQuery: string;
  currentTab: NavigationTab;
  isCartOpen: boolean;
  isMagazineOrderOpen: boolean;
  selectedProduct: Product | null;
  toasts: ToastState[];
  
  // Navigation & Filters
  setActiveBrand: (brand: Brand) => void;
  setActiveCategory: (cat: ProductCategory) => void;
  setSearchQuery: (query: string) => void;
  setCurrentTab: (tab: NavigationTab) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsMagazineOrderOpen: (open: boolean) => void;
  setSelectedProduct: (product: Product | null) => void;
  
  // Cart Actions
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  addMagazineItemToCart: (brand: ActiveBrand, code: string, name: string, price: number, page?: string, notes?: string, quantity?: number) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotalCount: number;
  
  // Admin Product Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  clearAllProducts: () => void;
  updateCampaignConfig: (config: Partial<CampaignConfig>) => void;
  resetToDefaults: () => void;
  
  // Toast notifications
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'lausser_products_v1',
  CAMPAIGN: 'lausser_campaign_v1',
  CART: 'lausser_cart_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products from localStorage or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load products from storage', e);
    }
    return initialProducts;
  });

  // Load campaign config
  const [campaignConfig, setCampaignConfig] = useState<CampaignConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CAMPAIGN);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load campaign config', e);
    }
    return initialCampaignConfig;
  });

  // Load cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load cart', e);
    }
    return [];
  });

  // UI state
  const [activeBrand, setActiveBrand] = useState<Brand>('all');
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<NavigationTab>('inmediata');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isMagazineOrderOpen, setIsMagazineOrderOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CAMPAIGN, JSON.stringify(campaignConfig));
    } catch (e) {
      console.error(e);
    }
  }, [campaignConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Toast handler
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (itemData: Omit<CartItem, 'id'>) => {
    setCart((prev) => {
      // Check if item already exists (same type, product ID or magazine code)
      const existingIndex = prev.findIndex((item) => {
        if (itemData.type === 'stock' && item.type === 'stock') {
          return item.productId === itemData.productId;
        }
        if (itemData.type === 'campaign' && item.type === 'campaign') {
          return item.magazineCode === itemData.magazineCode && item.brand === itemData.brand;
        }
        return false;
      });

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + itemData.quantity,
        };
        return updated;
      }

      const newItem: CartItem = {
        ...itemData,
        id: 'cart-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      };
      return [...prev, newItem];
    });

    showToast(`"${itemData.name}" añadido al carrito`, 'success');
  };

  const addMagazineItemToCart = (
    brand: ActiveBrand,
    code: string,
    name: string,
    price: number,
    page?: string,
    notes?: string,
    quantity: number = 1
  ) => {
    addToCart({
      type: 'campaign',
      name: name || `Producto Cód: ${code}`,
      brand,
      price: price > 0 ? price : 0,
      quantity,
      magazineCode: code,
      magazinePage: page,
      notes,
    });
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Producto eliminado del carrito', 'info');
  };

  const clearCart = () => {
    setCart([]);
    showToast('Carrito vaciado', 'info');
  };

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Admin operations
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Producto "${newProduct.name}" agregado con éxito`, 'success');
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Producto actualizado`, 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Producto retirado del catálogo', 'info');
  };

  const clearAllProducts = () => {
    setProducts([]);
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
    } catch (e) {
      console.error(e);
    }
    showToast('Catálogo vaciado completamente', 'info');
  };

  const updateCampaignConfig = (updated: Partial<CampaignConfig>) => {
    setCampaignConfig((prev) => ({ ...prev, ...updated }));
    showToast('Configuración de campaña actualizada', 'success');
  };

  const resetToDefaults = () => {
    setProducts(initialProducts);
    setCampaignConfig(initialCampaignConfig);
    setCart([]);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CAMPAIGN);
    localStorage.removeItem(STORAGE_KEYS.CART);
    showToast('Datos reiniciados a los valores de prueba', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        campaignConfig,
        cart,
        activeBrand,
        activeCategory,
        searchQuery,
        currentTab,
        isCartOpen,
        isMagazineOrderOpen,
        selectedProduct,
        toasts,
        setActiveBrand,
        setActiveCategory,
        setSearchQuery,
        setCurrentTab,
        setIsCartOpen,
        setIsMagazineOrderOpen,
        setSelectedProduct,
        addToCart,
        addMagazineItemToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalCount,
        addProduct,
        updateProduct,
        deleteProduct,
        clearAllProducts,
        updateCampaignConfig,
        resetToDefaults,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
