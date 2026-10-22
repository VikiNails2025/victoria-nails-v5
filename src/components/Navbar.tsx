import React from 'react';
import { Search } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenLookup: () => void;
  onScrollTo: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenLookup,
  onScrollTo,
}) => {
  return (
    <div className="sticky top-0 z-40 pt-3 sm:pt-4 px-3 sm:px-6">
      <header className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md rounded-full px-5 sm:px-6 py-2.5 sm:py-3 shadow-sm border border-pink-100/80 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand wordmark matching the reference image */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 text-left whitespace-nowrap shrink-0 group transition-all"
        >
          <span className="text-[#db2777] text-base sm:text-lg group-hover:rotate-45 transition-transform duration-300">✦</span>
          <span className="font-display text-lg sm:text-xl text-[#1f1625] tracking-tight">
            Victoria Nails
          </span>
        </button>

        {/* Zone 2: Single line text links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-neutral-600">
          <button
            onClick={() => onScrollTo('servicios')}
            className="hover:text-neutral-900 transition-colors whitespace-nowrap"
          >
            Servicios
          </button>
          <button
            onClick={() => onScrollTo('trabajos')}
            className="hover:text-neutral-900 transition-colors whitespace-nowrap"
          >
            Trabajos
          </button>
          <button
            onClick={() => onScrollTo('como-funciona')}
            className="hover:text-neutral-900 transition-colors whitespace-nowrap"
          >
            Cómo funciona
          </button>
          <button
            onClick={() => onScrollTo('politicas')}
            className="hover:text-neutral-900 transition-colors whitespace-nowrap"
          >
            Políticas
          </button>
          <button
            onClick={() => onScrollTo('donde-estamos')}
            className="hover:text-neutral-900 transition-colors whitespace-nowrap"
          >
            Dónde estamos
          </button>
        </nav>

        {/* Zone 3: Lookup Appointment + Booking CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenLookup}
            title="Consultar mi turno"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors border border-neutral-200/60"
            aria-label="Buscar mi turno"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mi turno</span>
          </button>

          <button
            onClick={onOpenBooking}
            className="btn-dark-pill px-5 sm:px-6 py-2 text-xs sm:text-sm shadow-xs whitespace-nowrap shrink-0"
          >
            Reservar turno
          </button>
        </div>

      </header>
    </div>
  );
};
