import React, { useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Heart,
  Image as ImageIcon,
  ShieldAlert,
  Sparkles,
  UserX,
  X,
  ZoomIn
} from 'lucide-react';
import { StudioSettings } from '../types';

interface StudioPoliciesProps {
  settings: StudioSettings;
  onOpenBooking: () => void;
}

export const StudioPolicies: React.FC<StudioPoliciesProps> = ({ settings, onOpenBooking }) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const policiesImg = '/assets/aistudio/image_d9dcf083.png';

  const policyItems = [
    {
      title: `Los turnos se reservan únicamente con seña del ${settings.depositPercent}%`,
      subtitle: 'La seña congela tu lugar en la agenda.',
      icon: <CheckCircle2 className="w-5 h-5 text-[#db2777]" />,
      highlight: true,
    },
    {
      title: 'Sin seña, el turno no queda confirmado',
      subtitle: 'No se reservan turnos de palabra sin el envío previo del comprobante.',
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      highlight: false,
    },
    {
      title: 'En caso de no asistir, la seña no es reembolsable',
      subtitle: 'El tiempo de atención queda reservado exclusivamente para vos.',
      icon: <ShieldAlert className="w-5 h-5 text-rose-500" />,
      highlight: false,
    },
    {
      title: 'Cancelaciones o reprogramaciones con 24 hs de anticipación',
      subtitle: 'Permite reasignar el horario a otra clienta que esté en lista de espera.',
      icon: <Clock className="w-5 h-5 text-purple-600" />,
      highlight: false,
    },
    {
      title: 'Si tenés trabajo previo para retirar, debés avisar y enviar foto antes del turno',
      subtitle: 'Necesitamos preparar el torno, fresas y tiempos específicos de retiro.',
      icon: <Sparkles className="w-5 h-5 text-pink-500" />,
      highlight: false,
    },
    {
      title: 'El tiempo destinado para retiro está incluido dentro del turno',
      subtitle: 'Avisar con anticipación garantiza terminar el diseño completo sin demoras.',
      icon: <Clock className="w-5 h-5 text-neutral-600" />,
      highlight: false,
    },
    {
      title: 'La tolerancia de espera es de 15 minutos',
      subtitle: 'Pasados los 15 minutos, el turno se pierde y no podré atender.',
      icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
      highlight: true,
    },
    {
      title: 'El resto del pago se abona el día del servicio',
      subtitle: 'Podés abonar el 50% restante en efectivo o transferencia en el estudio.',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      highlight: false,
    },
  ];

  return (
    <section id="politicas" className="py-16 sm:py-20 border-t border-pink-100/90 relative bg-gradient-to-b from-white via-[#fdf2f8]/40 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 bg-[#fce7f3] text-[#db2777] font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Condiciones de Atención</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#1f1625] tracking-tight">
            Políticas de Citas del Estudio
          </h2>
          <p className="text-sm text-neutral-600 mt-2.5 max-w-lg mx-auto">
            Para garantizar la máxima puntualidad, calidad y cuidado en cada trabajo, te pedimos leer nuestras pautas oficiales antes de reservar.
          </p>
        </div>

        {/* Content Grid: Reference Policy Image + Bullet Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Official Poster Reference from Studio */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm group">
              {/* Decorative pinned note backdrop */}
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-3xl blur-md group-hover:blur-lg transition-all opacity-70"></div>
              
              <div
                onClick={() => setIsZoomOpen(true)}
                className="relative cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white hover:scale-[1.01] transition-transform duration-300"
              >
                <img
                  src={policiesImg}
                  alt="Políticas de citas del estudio Victoria Nails"
                  className="w-full h-auto object-cover"
                />
                
                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-neutral-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <span className="bg-white/95 text-neutral-900 font-bold text-xs px-3.5 py-2 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-xs">
                    <ZoomIn className="w-4 h-4 text-[#db2777]" />
                    <span>Ver imagen en tamaño completo</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsZoomOpen(true)}
              className="mt-3 text-xs text-neutral-500 hover:text-[#db2777] font-medium flex items-center gap-1.5 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5 text-[#db2777]" />
              <span>Hacé clic en la imagen para ampliar</span>
            </button>
          </div>

          {/* Right Column: Key Rules Breakdown */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Rules list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {policyItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start gap-3 shadow-2xs ${
                    item.highlight
                      ? 'bg-gradient-to-br from-[#fdf2f8] to-white border-pink-200 ring-1 ring-pink-300/40'
                      : 'bg-white border-pink-100/90 hover:border-pink-200'
                  }`}
                >
                  <div className="p-1.5 rounded-xl bg-[#fdf2f8] shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs sm:text-[13px] font-bold text-[#1f1625] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-neutral-600 leading-normal">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Special Highlight: ASISTIR SIN ACOMPAÑANTE 🫶 */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#fce7f3] via-pink-100/80 to-[#faf5ff] border-2 border-pink-300/70 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white shadow-2xs flex items-center justify-center text-lg shrink-0">
                  🫶
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-[#1f1625] uppercase tracking-wide flex items-center gap-1.5">
                    <span>* ASISTIR SIN ACOMPAÑANTE *</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 mt-0.5">
                    Por comodidad, bioseguridad y concentración en cada detalle del diseño, el turno es individual.
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline-block text-xs font-bold text-[#db2777] bg-white px-3 py-1 rounded-full shrink-0 shadow-2xs">
                ¡Gracias por tu comprensión!
              </span>
            </div>

            {/* Direct CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-pink-100">
              <div className="text-center sm:text-left">
                <span className="text-xs font-bold text-[#1f1625] block">
                  ¿Lista para agendar tu cita?
                </span>
                <span className="text-[11px] text-neutral-500">
                  Elegí diseño, día y hora. Enviás la seña del {settings.depositPercent}% y confirmamos en minutos.
                </span>
              </div>

              <button
                onClick={onOpenBooking}
                className="btn-pink-pill px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-xs whitespace-nowrap shrink-0 w-full sm:w-auto text-center"
              >
                Reservar turno ahora →
              </button>
            </div>

          </div>

        </div>

        {/* Modal Zoom for Policy Image */}
        {isZoomOpen && (
          <div
            className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
            onClick={() => setIsZoomOpen(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-pink-100">
                <span className="text-xs font-bold text-neutral-800">Políticas oficiales del estudio</span>
                <button
                  onClick={() => setIsZoomOpen(false)}
                  className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2 max-h-[80vh] overflow-y-auto">
                <img
                  src={policiesImg}
                  alt="Políticas de citas ampliadas"
                  className="w-full h-auto rounded-xl object-contain mx-auto"
                />
              </div>

              <div className="p-3 border-t border-pink-100 text-center">
                <button
                  onClick={() => {
                    setIsZoomOpen(false);
                    onOpenBooking();
                  }}
                  className="btn-pink-pill px-6 py-2 text-xs font-bold"
                >
                  Entendido, quiero reservar mi turno →
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
