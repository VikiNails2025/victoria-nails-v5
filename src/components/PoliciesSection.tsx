import React from 'react';
import {
  CalendarClock,
  CalendarX2,
  Camera,
  CreditCard,
  Hourglass,
  Timer,
  UserRound,
  Wallet,
  XCircle,
  Eraser,
} from 'lucide-react';
import { StudioSettings } from '../types';

interface PoliciesSectionProps {
  settings: StudioSettings;
}

export const PoliciesSection: React.FC<PoliciesSectionProps> = ({ settings }) => {
  const policies = [
    {
      icon: <CreditCard className="w-5 h-5" />,
      text: `Los turnos se reservan únicamente con seña del ${settings.depositPercent}%`,
    },
    {
      icon: <XCircle className="w-5 h-5" />,
      text: 'Sin seña, el turno no queda confirmado',
    },
    {
      icon: <CalendarX2 className="w-5 h-5" />,
      text: 'En caso de no asistir, la seña no es reembolsable',
    },
    {
      icon: <CalendarClock className="w-5 h-5" />,
      text: 'Cancelaciones o reprogramaciones con 24 hs de anticipación',
    },
    {
      icon: <Camera className="w-5 h-5" />,
      text: 'Si tenés trabajo previo para retirar, debés avisar y enviar foto antes del turno',
    },
    {
      icon: <Eraser className="w-5 h-5" />,
      text: 'El tiempo destinado para retiro está incluido dentro del turno',
    },
    {
      icon: <Timer className="w-5 h-5" />,
      text: 'La tolerancia de espera es de 15 minutos',
    },
    {
      icon: <Hourglass className="w-5 h-5" />,
      text: 'Pasados los 15 minutos, el turno se pierde y no podré atender',
    },
    {
      icon: <Wallet className="w-5 h-5" />,
      text: 'El resto del pago se abona el día del servicio',
    },
  ];

  return (
    <section id="politicas" className="py-16 border-t border-pink-100 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-[2rem] bg-[#ead9dc] border border-[#dcc3c8] p-4 sm:p-8 shadow-sm relative overflow-hidden">
          {/* Textura sutil tipo cuadrícula */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#e2cdd1 1px, transparent 1px), linear-gradient(90deg, #e2cdd1 1px, transparent 1px)',
              backgroundSize: '120px 120px',
            }}
          />

          <div className="relative">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="font-display text-4xl sm:text-5xl text-[#1f1625] tracking-tight leading-none">
                <span className="italic text-6xl sm:text-7xl align-[-0.12em] mr-0.5">P</span>
                <span className="uppercase font-bold" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                  olíticas de citas
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-[#6b1b34]/80 mt-3 max-w-md mx-auto">
                Leelas antes de reservar: nos ayudan a respetar el tiempo de todas las clientas.
              </p>
            </div>

            {/* Tarjeta clara con las políticas */}
            <div className="bg-[#f6ecec] rounded-3xl p-5 sm:p-8 shadow-inner">
              <ul className="space-y-3.5 sm:space-y-4">
                {policies.map((p, i) => (
                  <li key={i} className="flex items-start gap-3.5">
                    <span className="w-9 h-9 rounded-xl bg-[#7a1736]/10 text-[#7a1736] flex items-center justify-center shrink-0">
                      {p.icon}
                    </span>
                    <span className="text-[#6b0f2e] font-bold text-sm sm:text-base leading-snug pt-1.5">
                      {p.text}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5 border-t border-[#7a1736]/15 flex items-center justify-center gap-2.5 text-center">
                <UserRound className="w-5 h-5 text-[#7a1736]" />
                <p className="text-[#6b0f2e] font-extrabold uppercase tracking-wide text-sm sm:text-base">
                  Asistir sin acompañante 🙌
                </p>
              </div>
            </div>

            <p className="text-center text-[#7a1736] font-extrabold uppercase tracking-wide text-lg sm:text-2xl mt-6 sm:mt-8 leading-tight">
              Gracias por tu comprensión
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
