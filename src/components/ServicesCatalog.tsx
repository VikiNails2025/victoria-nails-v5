import React, { useState } from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { Service, StudioSettings } from '../types';
import { formatMoney } from '../services/storage';

interface ServicesCatalogProps {
  services: Service[];
  settings: StudioSettings;
  onSelectService: (service: Service) => void;
}

export const ServicesCatalog: React.FC<ServicesCatalogProps> = ({
  services,
  settings,
  onSelectService,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const categories = [
    { id: 'todos', label: 'Todos los servicios' },
    { id: 'esculpidas', label: 'Esculpidas & Tips' },
    { id: 'kapping', label: 'Kapping Gel' },
    { id: 'semi', label: 'Semipermanente' },
    { id: 'pies', label: 'Pies & Spa' },
    { id: 'combos', label: 'Combos' },
  ];

  const filteredServices = services
    .filter((s) => s.active)
    .filter((s) => {
      if (selectedCategory === 'todos') return true;
      return s.category === selectedCategory;
    });

  return (
    <section id="servicios" className="py-16 border-t border-pink-100/80 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-block bg-[#fce7f3] text-[#db2777] font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-2">
              CATÁLOGO DE SERVICIOS
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1f1625] tracking-tight">
              Elegí el servicio ideal para tus manos
            </h2>
            <p className="text-sm text-neutral-600 mt-1 max-w-xl">
              Todos los turnos incluyen preparación completa y manicuría rusa. La seña para reservar es del {settings.depositPercent}% y se transfiere por Alias o CVU.
            </p>
          </div>

          {/* Category Tabs with rounded pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'btn-pink-pill shadow-xs'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-pink-50 hover:border-pink-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid with Clean Rounded Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service) => {
            const depositAmount = Math.round((service.price * settings.depositPercent) / 100);

            return (
              <div
                key={service.id}
                className="bg-white rounded-3xl border border-pink-100 overflow-hidden flex flex-col group hover:shadow-lg hover:border-pink-200 transition-all duration-300"
              >
                {/* Photo */}
                <div className="relative h-52 sm:h-56 overflow-hidden bg-neutral-100">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {service.isPopular && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-[#db2777] text-white text-[11px] font-bold rounded-full flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3 text-pink-200" />
                      <span>Más pedido</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#1f1625] group-hover:text-[#db2777] transition-colors">
                      {service.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mt-2 mb-4 line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-pink-100/70 space-y-3">
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <div className="flex items-center gap-1.5 font-medium text-neutral-600">
                        <Clock className="w-3.5 h-3.5 text-[#db2777]" />
                        <span>{service.duration} minutos</span>
                      </div>
                      <div className="text-right">
                        <span className="text-neutral-500">Seña: </span>
                        <strong className="text-neutral-900 font-mono font-bold">{formatMoney(depositAmount)}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div>
                        <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">Precio Total</div>
                        <div className="text-xl font-black text-[#1f1625] font-mono tabular-nums">
                          {formatMoney(service.price)}
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectService(service)}
                        className="btn-pink-pill px-4 py-2 text-xs font-semibold shadow-xs"
                      >
                        Reservar Turno
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
