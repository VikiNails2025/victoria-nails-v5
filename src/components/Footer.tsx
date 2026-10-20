import React from 'react';
import { StudioSettings } from '../types';
import {
  Clock,
  ExternalLink,
  Facebook,
  Instagram,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface FooterProps {
  settings: StudioSettings;
  onOpenBooking: () => void;
  onOpenLookup: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenBooking,
  onOpenLookup,
}) => {
  const getInstagramUrl = (val?: string) => {
    if (!val) return '';
    if (val.startsWith('http')) return val;
    return `https://instagram.com/${val.replace(/^@/, '')}`;
  };

  const getFacebookUrl = (val?: string) => {
    if (!val) return '';
    if (val.startsWith('http')) return val;
    return `https://facebook.com/${val}`;
  };

  const instagramUrl = getInstagramUrl(settings.instagram);
  const facebookUrl = getFacebookUrl(settings.facebook);

  const mapsQuery = settings.mapsQuery || `${settings.address}, ${settings.city}, Tucuman, Argentina`;

  return (
    <footer id="donde-estamos" className="bg-[#120a1c] text-purple-100/90 pt-16 pb-12 border-t border-purple-900/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* ================= SECCIÓN MAPS INTERACTIVO TIPO GOOGLE MAPS ================= */}
        <div className="mb-14 bg-gradient-to-br from-[#1c0e2c] to-[#12071f] rounded-3xl p-5 sm:p-7 border border-purple-800/60 shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row items-stretch gap-6">
            
            {/* Left Card: Details & Route */}
            <div className="lg:w-5/12 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-pink-400 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-4 h-4 text-pink-400" />
                  <span>Ubicación del Estudio · Google Maps</span>
                </span>
                <h3 className="font-display text-2xl sm:text-3xl text-white">
                  Vení a visitarnos
                </h3>
                <p className="text-purple-200/75 text-xs sm:text-sm mt-2 leading-relaxed">
                  Te esperamos en <strong>{settings.address}, {settings.city}</strong>. Un espacio íntimo, moderno y relajante creado exclusivamente para cuidar la salud y belleza de tus uñas.
                </p>
              </div>

              {/* Working Hours summary based on settings */}
              <div className="bg-purple-950/70 border border-purple-800/40 p-4 rounded-2xl text-xs space-y-2">
                <span className="font-bold text-pink-300 block text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-pink-400" />
                  <span>Días y Horarios de Atención</span>
                </span>
                <div className="space-y-1 text-purple-200/80">
                  {settings.weeklySchedule && settings.weeklySchedule.length > 0 ? (
                    settings.weeklySchedule.filter((d) => d.enabled).map((d) => (
                      <div key={d.dayOfWeek} className="flex justify-between items-center text-[11px]">
                        <span className="font-medium text-white">{d.dayName}:</span>
                        <span className="font-mono text-purple-300">
                          {d.openTime} a {d.closeTime} hs
                          {d.hasBreak && ` (pausa ${d.breakStart}-${d.breakEnd})`}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>Lunes a Sábados: {settings.openingTime} a {settings.closingTime} hs</p>
                  )}
                  <p className="pt-1.5 text-[10px] text-pink-300/80 italic border-t border-purple-900/40">
                    Atención exclusiva con turno reservado previamente.
                  </p>
                </div>
              </div>

              {/* Action Buttons to open in Google Maps / Directions */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 pt-1">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-102 active:scale-98"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Abrir en Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors border border-white/10"
                >
                  <MapPin className="w-4 h-4 text-pink-400" />
                  <span>Cómo llegar con GPS</span>
                </a>
              </div>
            </div>

            {/* Right: Embedded Interactive Google Maps Container */}
            <div className="lg:w-7/12 min-h-[300px] sm:min-h-[360px] rounded-2xl overflow-hidden border border-purple-700/50 relative shadow-inner bg-neutral-900 group">
              <iframe
                title="Ubicación de Victoria Nails en Google Maps"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapsQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0 min-h-[300px] sm:min-h-[360px]"
                loading="lazy"
                allowFullScreen
              />
              
              {/* Badge Overlay */}
              <div className="absolute top-3 right-3 bg-[#120a1c]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-pink-500/30 text-white text-[11px] font-semibold flex items-center gap-2 shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{settings.name}</span>
              </div>

              <div className="absolute bottom-3 left-3 bg-[#120a1c]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-purple-700/60 text-white text-[11px] flex items-center gap-2 shadow-lg">
                <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
                <span className="font-medium">{settings.address}, {settings.city}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-purple-900/40 text-xs">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <span className="text-xl">✦</span>
              <span className="font-display text-xl text-white">
                {settings.name}
              </span>
            </h3>
            <p className="text-purple-200/70 max-w-sm leading-relaxed">
              {settings.about}
            </p>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Seguinos en Instagram"
                  className="w-8 h-8 rounded-full bg-purple-900/50 border border-purple-700/60 hover:border-pink-400 text-pink-300 hover:text-white flex items-center justify-center transition-all hover:scale-105"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}

              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Seguinos en Facebook"
                  className="w-8 h-8 rounded-full bg-purple-900/50 border border-purple-700/60 hover:border-blue-400 text-blue-300 hover:text-white flex items-center justify-center transition-all hover:scale-105"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}

              <a
                href={`https://wa.me/${settings.ownerWhatsapp.replace(/\D/g, '')}?text=Hola%20Victoria!%20Tengo%20una%20consulta`}
                target="_blank"
                rel="noreferrer"
                title="Escribinos por WhatsApp"
                className="w-8 h-8 rounded-full bg-purple-900/50 border border-purple-700/60 hover:border-emerald-400 text-emerald-300 hover:text-white flex items-center justify-center transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-pink-300">
              Dónde Estamos
            </h4>
            <div className="space-y-2 text-purple-200/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                <span>{settings.address}, {settings.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span>+{settings.ownerWhatsapp}</span>
              </div>
            </div>
          </div>

          {/* Working hours & Policy */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-pink-300">
              Atención al Cliente
            </h4>
            <div className="space-y-1 text-purple-200/70">
              <p>Turnos programados de Lunes a Sábados</p>
              <p className="pt-2 text-[11px] text-purple-400/80">
                Seña del {settings.depositPercent}% por transferencia para confirmar tu lugar.
              </p>
            </div>
          </div>

          {/* Quick links & Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-pink-300">
              Turnos & Consultas
            </h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={onOpenBooking}
                className="text-left text-pink-300 hover:text-white font-medium transition-colors"
              >
                → Reservar nuevo turno online
              </button>
              <button
                onClick={onOpenLookup}
                className="text-left text-purple-200/70 hover:text-white transition-colors"
              >
                → Consultar mi turno existente
              </button>

              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-300/80 hover:text-pink-200 transition-colors flex items-center gap-1.5 pt-1"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram del estudio</span>
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Bottom copyright & payment disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-purple-300/60">
          <div>
            © {new Date().getFullYear()} Victoria Nails · Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-3">
            <span>Alias: <strong className="text-pink-300 font-mono">{settings.paymentAlias}</strong></span>
            <span>·</span>
            <span>Titular: <strong className="text-purple-200">{settings.paymentTitular}</strong></span>
          </div>
        </div>

      </div>
    </footer>
  );
};
