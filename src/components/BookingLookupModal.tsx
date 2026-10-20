import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  MessageCircle,
  Phone,
  Search,
  X,
  AlertCircle
} from 'lucide-react';
import { Booking, StudioSettings } from '../types';
import { StorageService, formatLongDate, formatMoney } from '../services/storage';

interface BookingLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StudioSettings;
}

export const BookingLookupModal: React.FC<BookingLookupModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Booking[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim().toUpperCase().replace(/[^\w]/g, '');
    if (!cleanQuery) return;

    const allBookings = StorageService.getBookings();
    const found = allBookings.filter((b) => {
      const codeClean = b.code.toUpperCase().replace(/[^\w]/g, '');
      const phoneClean = b.phone.replace(/\D/g, '');
      const queryDigits = query.replace(/\D/g, '');

      return (
        codeClean.includes(cleanQuery) ||
        (queryDigits.length >= 4 && phoneClean.includes(queryDigits)) ||
        b.name.toLowerCase().includes(query.trim().toLowerCase())
      );
    });

    setResults(found);
    setHasSearched(true);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Turno Confirmado</span>
          </span>
        );
      case 'transfer_reported':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-900 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            <span>Comprobante enviado · Verificando</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-200 text-neutral-700">
            <span>Cancelado</span>
          </span>
        );
      case 'pending_transfer':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-pink-100 text-pink-900">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Pendiente de seña</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-purple-950/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl max-w-lg w-full border border-pink-200 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-pink-100 flex items-center justify-between bg-gradient-to-r from-pink-50 via-purple-50/60 to-fuchsia-50">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-purple-600" />
            <h2 className="text-lg font-display text-[#1f1625]">
              Consultar el estado de mi turno
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-purple-900 rounded-lg hover:bg-pink-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-5 sm:p-6 space-y-4">
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-xs font-semibold text-purple-950">
              Ingresá tu número de teléfono o código de reserva (Ej: VIC-4821)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Teléfono o código VIC-..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-3 py-2.5 text-xs sm:text-sm border border-pink-200 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-400 focus:outline-hidden bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2.5 btn-gradient-beauty text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Results list */}
          {hasSearched && results && (
            <div className="space-y-4 pt-2">
              {results.length === 0 ? (
                <div className="text-center py-6 text-xs text-neutral-600 bg-pink-50/40 rounded-xl border border-pink-200">
                  No encontramos turnos con esos datos. Verificá el número de teléfono o código ingresado.
                </div>
              ) : (
                results.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 rounded-xl border border-pink-200/90 bg-white shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-purple-950 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                        {booking.code}
                      </span>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="font-bold text-neutral-900 text-sm">
                        {booking.serviceName}
                      </div>
                      <div className="text-neutral-600 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-pink-500" />
                        <span>{formatLongDate(booking.date)}</span>
                        <span>·</span>
                        <Clock className="w-3.5 h-3.5 text-purple-500" />
                        <span>{booking.start} a {booking.end} hs</span>
                      </div>
                      <div className="text-neutral-500">
                        Titular: {booking.name} ({booking.phone})
                      </div>
                      <div className="flex justify-between pt-1 font-medium">
                        <span className="text-purple-950">Seña requerida:</span>
                        <strong className="text-pink-600 font-mono font-bold">{formatMoney(booking.deposit)}</strong>
                      </div>
                    </div>

                    {/* If pending transfer or reported, show quick transfer info */}
                    {booking.status !== 'confirmed' && (
                      <div className="pt-2 border-t border-pink-100 space-y-2">
                        <div className="p-2.5 bg-gradient-to-r from-pink-50/60 to-purple-50/60 rounded-lg border border-pink-200 text-xs flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-purple-900/70 font-semibold block">Alias para transferir:</span>
                            <span className="font-mono font-bold text-purple-950">{booking.paymentInfo.alias}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyText(booking.paymentInfo.alias, booking.id)}
                            className="px-2.5 py-1 bg-white hover:bg-pink-100 text-[11px] font-bold rounded-md text-purple-900 border border-pink-200 transition-colors"
                          >
                            {copiedId === booking.id ? '¡Copiado!' : 'Copiar Alias'}
                          </button>
                        </div>

                        <a
                          href={StorageService.createOwnerWhatsAppLink(booking)}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Enviar comprobante por WhatsApp</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
