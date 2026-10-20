import React from 'react';
import { Calendar, CheckCircle2, CreditCard, MessageCircle, Sparkles } from 'lucide-react';
import { StudioSettings } from '../types';

interface HowItWorksProps {
  settings: StudioSettings;
  onOpenBooking: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ settings, onOpenBooking }) => {
  const steps = [
    {
      num: '01',
      title: 'Elegí tu servicio y horario',
      desc: 'Seleccioná el tratamiento que deseás y el día y hora que mejor te quede en la agenda en vivo.',
      icon: <Calendar className="w-5 h-5 text-[#db2777]" />,
    },
    {
      num: '02',
      title: 'Dejá tu nombre y teléfono',
      desc: 'Completá tus datos de contacto para registrar la pre-reserva de tu lugar.',
      icon: <CheckCircle2 className="w-5 h-5 text-[#db2777]" />,
    },
    {
      num: '03',
      title: 'Aboná la seña por transferencia',
      desc: `Te enviamos en pantalla el Alias (${settings.paymentAlias}), CVU o link de pago para abonar la seña (${settings.depositPercent}%).`,
      icon: <CreditCard className="w-5 h-5 text-[#db2777]" />,
    },
    {
      num: '04',
      title: 'Confirmá por WhatsApp y listo',
      desc: 'Nos enviás el comprobante de transferencia con un solo clic para confirmar tu lugar.',
      icon: <MessageCircle className="w-5 h-5 text-[#db2777]" />,
    },
  ];

  return (
    <section id="como-funciona" className="py-16 border-t border-pink-100 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block bg-[#fce7f3] text-[#db2777] font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-2">
            PASO A PASO
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#1f1625] tracking-tight">
            Cómo reservar tu turno online
          </h2>
          <p className="text-sm text-neutral-600 mt-2">
            Un proceso simple y transparente para congelar tu lugar en minutos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div
              key={s.num}
              className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm hover:shadow-md hover:border-pink-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#fce7f3] flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="font-display text-2xl font-bold text-pink-300">
                    {s.num}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#1f1625] mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onOpenBooking}
            className="btn-pink-pill px-8 py-3.5 text-sm sm:text-base font-semibold shadow-md inline-flex items-center gap-2"
          >
            <span>Quiero reservar mi turno ahora</span>
            <span>→</span>
          </button>
        </div>

      </div>
    </section>
  );
};
