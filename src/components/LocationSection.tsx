import React, { useState } from 'react';
import { StudioSettings } from '../types';
import { Check, Copy, ExternalLink, MapPin, Clock, Sparkles, MessageCircle } from 'lucide-react';

interface LocationSectionProps {
  settings: StudioSettings;
  onOpenBooking: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ settings, onOpenBooking }) => {
  const [copied, setCopied] = useState(false);

  const fullAddress = `${settings.address}, ${settings.city}`;
  
  // Google Maps embed URL: use custom if provided, otherwise auto-generate from address and city
  const mapEmbedUrl = settings.mapsEmbedUrl && settings.mapsEmbedUrl.trim().length > 0
    ? settings.mapsEmbedUrl
    : `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress + ', Argentina')}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  // External link for navigation / directions
  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress + ', Argentina')}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappUrl = `https://wa.me/${settings.ownerWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hola Victoria! Te escribo para consultar sobre la ubicación del estudio en ${settings.address}, ${settings.city}.`
  )}`;

  return (
    <section id="donde-estamos" className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-white via-pink-50/30 to-purple-50/20">
      {/* Decorative background glows */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-pink-100/80 text-[#db2777] font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ubicación & Cómo Llegar</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#1f1625] tracking-tight">
            Dónde estamos
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base mt-2">
            Te esperamos en nuestro estudio en {settings.city}. Un espacio cálido y climatizado pensado para tu confort y belleza.
          </p>
        </div>

        {/* Content Grid: Map + Location Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left / Main: Embedded Google Maps */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-sm border border-pink-100 flex-1 flex flex-col">
              
              <div className="relative w-full h-[340px] sm:h-[400px] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/70">
                <iframe
                  title="Mapa de ubicación de Victoria Nails"
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              {/* Map Actions Bar */}
              <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-neutral-600">
                  <MapPin className="w-4 h-4 text-[#db2777] shrink-0" />
                  <span className="font-medium text-neutral-800">{settings.address}, {settings.city}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-pink-50 hover:text-[#db2777] text-neutral-700 font-medium transition-colors"
                    title="Copiar dirección"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar dirección</span>
                      </>
                    )}
                  </button>

                  <a
                    href={googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1f1625] hover:bg-neutral-800 text-white font-medium transition-colors shadow-xs"
                  >
                    <span>Abrir en Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Studio Location Details Card */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-pink-100 space-y-6">
            
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-2xl text-[#1f1625]">
                  {settings.name} Studio
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Atención exclusiva en salón privado
                </p>
              </div>

              {/* Detail 1: Address */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-pink-50/50 border border-pink-100/60">
                <div className="w-9 h-9 rounded-xl bg-pink-100 text-[#db2777] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Dirección
                  </h4>
                  <p className="text-sm font-semibold text-neutral-900 mt-0.5">
                    {settings.address}
                  </p>
                  <p className="text-xs text-neutral-600">
                    {settings.city}, Tucumán · Argentina
                  </p>
                </div>
              </div>

              {/* Detail 2: Hours */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100/60">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Días y Horarios
                  </h4>
                  <p className="text-sm font-semibold text-neutral-900 mt-0.5">
                    Lunes a Sábados: {settings.openingTime} a {settings.closingTime} hs
                  </p>
                  <p className="text-xs text-neutral-500">
                    Domingos y feriados cerrado
                  </p>
                </div>
              </div>

              {/* Detail 3: Studio policy reminder */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100">
                <div className="w-9 h-9 rounded-xl bg-neutral-200/70 text-neutral-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Modalidad del servicio
                  </h4>
                  <p className="text-xs text-neutral-700 mt-0.5 leading-relaxed">
                    Atención únicamente con <strong>turno previo confirmado</strong>. Tolerancia máxima de 15 minutos de espera.
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full btn-pink-pill py-3 text-sm font-bold shadow-md shadow-pink-500/15 flex items-center justify-center gap-2"
              >
                <span>Reservar turno en este estudio</span>
                <span>→</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-full border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Consultar por WhatsApp cómo llegar</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
