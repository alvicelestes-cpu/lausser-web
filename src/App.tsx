import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { StockModule } from './components/products/StockModule';
import { CatalogModule } from './components/catalog/CatalogModule';
import { AdminPanel } from './components/admin/AdminPanel';
import { CartDrawer } from './components/cart/CartDrawer';
import { MagazineOrderModal } from './components/catalog/MagazineOrderModal';
import { ProductDetailModal } from './components/products/ProductDetailModal';
import { ToastContainer } from './components/common/ToastContainer';

const MainContent: React.FC = () => {
  const { currentTab, setCurrentTab } = useStore();

  // Support /admin URL hash or direct routing
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        setCurrentTab('admin');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [setCurrentTab]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 sm:pb-16">
        {currentTab === 'inmediata' && <StockModule />}
        {currentTab === 'catalogos' && <CatalogModule />}
        {currentTab === 'admin' && <AdminPanel />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Navigation */}
      <MobileNav />

      {/* Global Drawers and Modals */}
      <CartDrawer />
      <MagazineOrderModal />
      <ProductDetailModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}

export default App;
