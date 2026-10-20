import React from 'react';
import { CreditCard, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import heroImg from '../assets/images/hero_nails_studio_1792274570559.jpg';
import esculpidasImg from '../assets/images/nail_service_esculpidas_1792274570344.jpg';
import semiImg from '../assets/images/nail_service_semipermanente_1792274570900.jpg';
import kappingImg from '../assets/images/nail_service_kapping_1792274572208.jpg';
import { StudioSettings } from '../types';

interface HeroProps {
  settings: StudioSettings;
  onOpenBooking: () => void;
  onScrollTo: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onOpenBooking, onScrollTo }) => {
  // Compute formatted next free date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextDateStr = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(tomorrow);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
      {/* Ambient background glow matching the reference image */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-0 w-[450px] h-[450px] bg-purple-300/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Exact Typography from Reference Image */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Kicker Badge */}
            <div className="inline-block bg-[#fce7f3] text-[#db2777] font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full">
              VICTORIA NAILS · JUAN BAUTISTA ALBERDI
            </div>

            {/* Display Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[62px] text-[#1f1625] leading-[1.08] tracking-tight">
              Uñas que cuentan <br />
              tu historia
            </h1>

            {/* Subtitle */}
            <p className="text-neutral-600 text-base sm:text-lg leading-relaxed max-w-md pt-1">
              Diseños a medida, productos de primera y un espacio pensado para que te relajes. Reservá tu turno online en un minuto.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenBooking}
                className="btn-pink-pill px-7 py-3.5 text-sm sm:text-base flex items-center gap-2 group"
              >
                <span>Reservar mi turno</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <button
                onClick={() => onScrollTo('trabajos')}
                className="bg-white border border-neutral-200 text-neutral-800 font-semibold rounded-full px-6 py-3.5 text-sm sm:text-base hover:bg-neutral-50 shadow-2xs transition-all"
              >
                Ver trabajos
              </button>
            </div>

            {/* Next Free Turn Pill */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2.5 bg-white shadow-xs border border-neutral-200/80 rounded-full px-4 py-2 text-xs text-neutral-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                <span>
                  Próximo turno libre:{' '}
                  <strong className="text-neutral-900 font-bold capitalize">
                    {nextDateStr} · 15:00 hs
                  </strong>
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Three Floating Cards & Badges Layout */}
          <div className="lg:col-span-6 relative pt-4 sm:pt-6">
            
            {/* Floating Badge 1: Agenda en vivo (Top Right) */}
            <div className="absolute top-0 right-4 sm:right-8 z-30 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2 shadow-lg border border-pink-100 text-center text-xs transform translate-y-2">
              <span className="text-neutral-600 block text-[11px]">Agenda</span>
              <span className="text-[#db2777] font-bold text-xs">en vivo</span>
            </div>

            {/* Floating Badge 2: Seña online y listo (Center Left) */}
            <div className="absolute bottom-16 -left-2 sm:left-2 z-30 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2 shadow-lg border border-pink-100 text-center text-xs">
              <span className="text-neutral-600 block text-[11px]">Seña online</span>
              <span className="text-[#db2777] font-bold text-xs">y listo ✓</span>
            </div>

            {/* Overlapping Showcase Grid */}
            <div className="relative w-full max-w-md mx-auto h-[420px] sm:h-[460px]">
              
              {/* Card 1: Top Left (-rotate-3) */}
              <div className="absolute top-2 left-2 w-52 sm:w-56 h-64 showcase-card transform -rotate-3 hover:rotate-0 transition-transform duration-300 z-10 bg-neutral-900">
                <img
                  src={semiImg}
                  alt="Uñas esculpidas y nail art"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card 2: Top Right (rotate-3) */}
              <div className="absolute top-6 right-2 w-52 sm:w-56 h-64 showcase-card transform rotate-3 hover:rotate-0 transition-transform duration-300 z-10 bg-neutral-900">
                <img
                  src={kappingImg}
                  alt="Kapping gel y esmaltado impecable"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card 3: Bottom Center (slightly overlapping) */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-64 sm:w-72 h-52 showcase-card z-20 shadow-2xl bg-neutral-900">
                <img
                  src={esculpidasImg}
                  alt="Manos cuidadas y manicuría rusa"
                  className="w-full h-full object-cover"
                />
              </div>

            </div>

          </div>

        </div>

        {/* Quick payment transfer info strip */}
        <div id="info-pago" className="mt-14 p-4 sm:p-5 bg-white/95 rounded-2xl border border-pink-100 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-[#db2777] shrink-0 font-bold">
                💳
              </div>
              <div>
                <p className="text-sm font-bold text-[#1f1625]">
                  Seña del {settings.depositPercent}% por transferencia o link
                </p>
                <p className="text-xs text-neutral-500">
                  Dejá tu nombre y teléfono para reservar tu turno y transferir por Alias o CVU
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-700 w-full md:w-auto">
              <span className="px-3.5 py-1.5 bg-neutral-100 rounded-full font-mono">
                Alias: <strong className="text-neutral-900">{settings.paymentAlias}</strong>
              </span>
              <span className="px-3.5 py-1.5 bg-neutral-100 rounded-full font-mono">
                CVU: <strong className="text-neutral-900">{settings.paymentCvu}</strong>
              </span>
              <span className="px-3.5 py-1.5 bg-[#fce7f3] text-[#db2777] rounded-full font-bold">
                Titular: {settings.paymentTitular}
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
