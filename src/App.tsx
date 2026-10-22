import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesCatalog } from './components/ServicesCatalog';
import { GallerySection } from './components/GallerySection';
import { HowItWorks } from './components/HowItWorks';
import { PoliciesSection } from './components/PoliciesSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { BookingLookupModal } from './components/BookingLookupModal';
import { AdminPanel } from './components/AdminPanel';
import { StorageService, formatMoney } from './services/storage';
import { Booking, GalleryPhoto, Service, StudioSettings } from './types';
import { CheckCircle2, MessageCircle, X } from 'lucide-react';

export default function App() {
  const [settings, setSettings] = useState<StudioSettings>(() => StorageService.getSettings());
  const [services, setServices] = useState<Service[]>(() => StorageService.getServices());
  const [gallery, setGallery] = useState<GalleryPhoto[]>(() => StorageService.getGallery());

  // Helper to check if current URL is the owner's private link (#admin, #duena, #administradora, ?admin)
  const isPrivateAdminUrl = () => {
    if (typeof window === 'undefined') return false;
    const hash = window.location.hash.toLowerCase();
    const isHashAdmin =
      hash === '#admin' ||
      hash === '#duena' ||
      hash === '#administradora' ||
      hash === '#panel';
    const isQueryAdmin = new URLSearchParams(window.location.search).has('admin');
    const isPathAdmin = window.location.pathname.endsWith('/admin') || window.location.pathname === '/admin';
    return isHashAdmin || isQueryAdmin || isPathAdmin;
  };

  // View state: 'public' for customer landing page, 'admin' only accessible via private URL (#admin)
  const [currentView, setCurrentView] = useState<'public' | 'admin'>(() => {
    return isPrivateAdminUrl() ? 'admin' : 'public';
  });

  // Re-fetch all data from storage to keep public site 100% updated with admin modifications
  const refreshAllData = () => {
    setSettings(StorageService.getSettings());
    setServices(StorageService.getServices());
    setGallery(StorageService.getGallery());
  };

  // Synchronize hash / URL changes, BroadcastChannel, and server sync
  useEffect(() => {
    // 1. Initial backend server synchronization
    StorageService.initSync().then((updated) => {
      if (updated) refreshAllData();
    });

    const handleUrlChange = () => {
      const isNowAdmin = isPrivateAdminUrl();
      if (isNowAdmin) {
        setCurrentView('admin');
      } else {
        setCurrentView('public');
        refreshAllData();
      }
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);

    // 2. Real-time in-tab and cross-tab update listeners
    const handleSyncEvent = () => {
      refreshAllData();
    };

    window.addEventListener('victoria_nails_sync', handleSyncEvent);
    window.addEventListener('storage', handleSyncEvent);
    window.addEventListener('focus', handleSyncEvent);

    // BroadcastChannel for cross-tab communication (e.g., admin in one tab, client in another tab)
    let channel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel('victoria_nails_channel');
        channel.onmessage = () => {
          refreshAllData();
        };
      } catch {}
    }

    // Optional secret desktop shortcut for owner: Alt + A or Ctrl + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        window.location.hash = 'admin';
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('victoria_nails_sync', handleSyncEvent);
      window.removeEventListener('storage', handleSyncEvent);
      window.removeEventListener('focus', handleSyncEvent);
      window.removeEventListener('keydown', handleKeyDown);
      channel?.close();
    };
  }, []);

  const handleBackToPublicView = () => {
    // Immediately pull latest data saved in admin panel
    refreshAllData();
    setCurrentView('public');
    // Clear admin hash and path without reload
    if (window.location.hash) {
      window.location.hash = '';
    }
    if (window.location.pathname.endsWith('/admin')) {
      window.history.replaceState(null, '', '/');
    }
    sessionStorage.removeItem('nails_admin_active_view');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  // Modals state for public website
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  // Success toast for newly created bookings
  const [lastCreatedBooking, setLastCreatedBooking] = useState<Booking | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Smooth scroll handler
  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBookingWithService = (service: Service) => {
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  const handleOpenBookingGeneral = () => {
    setSelectedService(null);
    setIsBookingOpen(true);
  };

  const handleBookingCreated = (booking: Booking) => {
    setLastCreatedBooking(booking);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 8000);
  };

  // If in 'admin' view: render the FULL-SCREEN STANDALONE Admin Dashboard completely separated from public page!
  // Only accessible through private link /#admin
  if (currentView === 'admin') {
    return (
      <AdminPanel
        onBackToPublicSite={handleBackToPublicView}
        settings={settings}
        onUpdateSettings={setSettings}
        services={services}
        onUpdateServices={setServices}
        gallery={gallery}
        onUpdateGallery={setGallery}
      />
    );
  }

  // ================= PUBLIC CLIENT WEBSITE =================
  // Completely free of any admin buttons, badges or public access points!
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf2f8] via-[#faf5ff]/40 to-[#ffffff] bg-ambient-beauty flex flex-col text-neutral-900 relative selection:bg-pink-200 selection:text-neutral-900">
      
      {/* Navigation matching reference image - client only */}
      <Navbar
        onOpenBooking={handleOpenBookingGeneral}
        onOpenLookup={() => setIsLookupOpen(true)}
        onScrollTo={handleScrollTo}
      />

      {/* Main Content */}
      <main className="flex-1">
        <Hero
          settings={settings}
          onOpenBooking={handleOpenBookingGeneral}
          onScrollTo={handleScrollTo}
        />

        <ServicesCatalog
          services={services}
          settings={settings}
          onSelectService={handleOpenBookingWithService}
        />

        <GallerySection gallery={gallery} />

        <HowItWorks
          settings={settings}
          onOpenBooking={handleOpenBookingGeneral}
        />

        <PoliciesSection settings={settings} />
      </main>

      {/* Footer / Dónde estamos con Google Maps - client only */}
      <Footer
        settings={settings}
        onOpenBooking={handleOpenBookingGeneral}
        onOpenLookup={() => setIsLookupOpen(true)}
      />

      {/* Booking Modal (with Alias / CVU / Link Payment step) */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedService={selectedService}
        services={services}
        settings={settings}
        onBookingCreated={handleBookingCreated}
      />

      {/* Booking Status Lookup Modal */}
      <BookingLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        settings={settings}
      />

      {/* Success Notification Toast */}
      {showToast && lastCreatedBooking && (
        <div className="fixed bottom-24 right-5 z-50 max-w-sm w-full bg-[#180e28]/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-pink-400/50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <span>💅</span>
                  <span>¡Pre-reserva guardada ({lastCreatedBooking.code})!</span>
                </p>
                <p className="text-purple-200/80">
                  Recordá transferir la seña de {formatMoney(lastCreatedBooking.deposit)} al Alias{' '}
                  <strong className="text-pink-300 font-mono font-bold">{settings.paymentAlias}</strong> y enviar el comprobante.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-purple-300 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button on bottom-right matching reference image */}
      <a
        href={`https://wa.me/${settings.ownerWhatsapp.replace(/\D/g, '')}?text=Hola%20Victoria!%20Quiero%20hacerte%20una%20consulta%20por%20un%20turno`}
        target="_blank"
        rel="noreferrer"
        aria-label="Contactar por WhatsApp a Victoria"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba59] text-white w-14 h-14 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
      >
        <MessageCircle className="w-7 h-7 fill-white stroke-none text-[#25D366]" />
      </a>

    </div>
  );
}
