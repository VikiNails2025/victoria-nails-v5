import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Check,
  Clock,
  Copy,
  ExternalLink,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  X
} from 'lucide-react';
import { Booking, Service, StudioSettings } from '../types';
import {
  StorageService,
  calculateEndTime,
  formatLongDate,
  formatMoney,
} from '../services/storage';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService: Service | null;
  services: Service[];
  settings: StudioSettings;
  onBookingCreated?: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedService,
  services,
  settings,
  onBookingCreated,
}) => {
  // Step state: 1 = Service, 2 = Date & Slot, 3 = Client details, 4 = Transfer details & WhatsApp
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [currentService, setCurrentService] = useState<Service | null>(selectedService);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Created booking state
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [isCopiedAlias, setIsCopiedAlias] = useState(false);
  const [isCopiedCvu, setIsCopiedCvu] = useState(false);
  const [isCopiedAmount, setIsCopiedAmount] = useState(false);
  const [transferReported, setTransferReported] = useState(false);

  // Slots for the selected date
  const [availableSlots, setAvailableSlots] = useState<
    { time: string; available: boolean; reason?: string }[]
  >([]);

  // Initialize service when prop changes
  useEffect(() => {
    if (selectedService) {
      setCurrentService(selectedService);
      setStep(2); // Go directly to date selection if service was chosen
    } else if (services.length > 0) {
      setCurrentService(services[0]);
      setStep(1);
    }
  }, [selectedService, services]);

  // Set default date to tomorrow or next available day
  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formatted = tomorrow.toISOString().split('T')[0];
      setSelectedDate(formatted);
      setSelectedSlot('');
      setCreatedBooking(null);
      setTransferReported(false);
    }
  }, [isOpen]);

  // Calculate slots whenever date or service changes
  useEffect(() => {
    if (selectedDate && currentService) {
      const slots = StorageService.getAvailableSlots(selectedDate, currentService.duration);
      setAvailableSlots(slots);
      // If current selectedSlot is not available in new date, clear it
      const match = slots.find((s) => s.time === selectedSlot && s.available);
      if (!match) setSelectedSlot('');
    }
  }, [selectedDate, currentService, settings]);

  if (!isOpen) return null;

  // Next 14 days dates generator for convenient fast buttons
  const datesList = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + (i + 1));
    const iso = d.toISOString().split('T')[0];
    const dayName = new Intl.DateTimeFormat('es-AR', { weekday: 'short' }).format(d);
    const dayNum = d.getDate();
    const monthName = new Intl.DateTimeFormat('es-AR', { month: 'short' }).format(d);
    return { iso, dayName, dayNum, monthName };
  });

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentService || !selectedDate || !selectedSlot || !name.trim() || !phone.trim()) {
      return;
    }

    const booking = StorageService.createBooking({
      service: currentService,
      date: selectedDate,
      start: selectedSlot,
      name,
      phone,
      notes,
    });

    setCreatedBooking(booking);
    setStep(4);
    if (onBookingCreated) {
      onBookingCreated(booking);
    }
  };

  const copyToClipboard = (text: string, type: 'alias' | 'cvu' | 'amount') => {
    navigator.clipboard.writeText(text);
    if (type === 'alias') {
      setIsCopiedAlias(true);
      setTimeout(() => setIsCopiedAlias(false), 2000);
    } else if (type === 'cvu') {
      setIsCopiedCvu(true);
      setTimeout(() => setIsCopiedCvu(false), 2000);
    } else {
      setIsCopiedAmount(true);
      setTimeout(() => setIsCopiedAmount(false), 2000);
    }
  };

  const handleReportTransferDone = () => {
    if (!createdBooking) return;
    StorageService.updateBookingStatus(createdBooking.id, 'transfer_reported');
    setTransferReported(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-purple-950/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl max-w-xl w-full border border-pink-200/80 shadow-2xl overflow-hidden my-6">
        
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-pink-100 flex items-center justify-between bg-gradient-to-r from-pink-50 via-purple-50/60 to-fuchsia-50">
          <div className="flex items-center gap-2">
            {step > 1 && step < 4 && (
              <button
                onClick={() => setStep((s) => (s - 1) as any)}
                className="p-1.5 -ml-1 text-purple-900/70 hover:text-purple-950 rounded-lg hover:bg-pink-100 transition-colors"
                title="Volver"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="text-lg font-display text-[#1f1625] flex items-center gap-2">
              <span className="text-[#db2777]">✦</span>
              <span>
                {step === 1 && 'Paso 1: Seleccioná tu servicio'}
                {step === 2 && 'Paso 2: Elegí fecha y horario'}
                {step === 3 && 'Paso 3: Tus datos de contacto'}
                {step === 4 && 'Pre-reserva: Datos para transferir la seña'}
              </span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-purple-900 rounded-lg hover:bg-pink-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">

          {/* ================= STEP 1: Select Service ================= */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-600">
                Elegí el tratamiento que querés realizarte en Nails Studio:
              </p>
              <div className="space-y-2.5">
                {services.filter((s) => s.active).map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => {
                      setCurrentService(svc);
                      setStep(2);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      currentService?.id === svc.id
                        ? 'border-purple-600 bg-purple-50/50 shadow-xs ring-1 ring-purple-300'
                        : 'border-pink-200/70 hover:border-purple-300 hover:bg-pink-50/40 bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-neutral-900">{svc.name}</div>
                      <div className="text-xs text-neutral-500 flex items-center gap-2 mt-0.5">
                        <span className="text-purple-900 font-medium">{svc.duration} min</span>
                        <span>·</span>
                        <span>Seña requerida: <strong className="text-pink-600 font-mono">{formatMoney(Math.round((svc.price * settings.depositPercent) / 100))}</strong></span>
                      </div>
                    </div>
                    <div className="text-sm font-extrabold font-mono text-purple-950 shrink-0">
                      {formatMoney(svc.price)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 2: Date & Available Slots ================= */}
          {step === 2 && currentService && (
            <div className="space-y-5">
              {/* Selected service summary chip */}
              <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200/80 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-500">Servicio seleccionado: </span>
                  <strong className="text-purple-950 font-bold">{currentService.name}</strong>
                  <span className="text-purple-700/70"> ({currentService.duration} min)</span>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-pink-600 hover:text-pink-800 font-semibold"
                >
                  Cambiar
                </button>
              </div>

              {/* Date selection carousel / buttons */}
              <div>
                <label className="block text-xs font-bold text-purple-950 uppercase tracking-wider mb-2">
                  1. Seleccioná el día
                </label>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {datesList.map((d) => (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => setSelectedDate(d.iso)}
                      className={`flex flex-col items-center justify-center min-w-[70px] p-2.5 rounded-xl border text-center transition-all ${
                        selectedDate === d.iso
                          ? 'btn-gradient-beauty font-bold shadow-md'
                          : 'border-pink-200/80 hover:border-purple-300 bg-white/90 text-neutral-700 hover:bg-pink-50/50'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-semibold tracking-wider opacity-85">
                        {d.dayName}
                      </span>
                      <span className="text-base font-extrabold font-mono my-0.5">{d.dayNum}</span>
                      <span className="text-[10px] opacity-80">{d.monthName}</span>
                    </button>
                  ))}
                </div>

                {/* Or custom date picker */}
                <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
                  <span>O elegí otra fecha:</span>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border border-pink-200 rounded-lg px-2.5 py-1 text-xs text-neutral-700 bg-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Available Slots */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                    2. Seleccioná el horario disponible
                  </label>
                  {selectedDate && (
                    <span className="text-xs text-purple-700 font-medium capitalize">
                      {formatLongDate(selectedDate)}
                    </span>
                  )}
                </div>

                {availableSlots.length === 0 || (availableSlots.length === 1 && availableSlots[0].time === '--:--') ? (
                  <div className="p-6 text-center text-xs border border-pink-200 rounded-xl bg-pink-50/50 text-purple-900 space-y-1">
                    <p className="font-bold text-sm text-pink-700">
                      {availableSlots[0]?.reason || 'No hay turnos disponibles para esta fecha'}
                    </p>
                    <p className="text-neutral-500">
                      El estudio no atiende o no tiene disponibilidad en este día. Por favor seleccioná otra fecha.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableSlots.map((slot) => {
                      const endTime = calculateEndTime(slot.time, currentService.duration);
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot.time)}
                          className={`p-2.5 rounded-xl text-center border transition-all text-xs font-mono ${
                            selectedSlot === slot.time
                              ? 'btn-gradient-beauty font-bold shadow-sm'
                              : slot.available
                              ? 'border-pink-200/80 bg-white hover:border-purple-400 text-neutral-900 hover:bg-purple-50/40'
                              : 'border-neutral-100 bg-neutral-100/60 text-neutral-400 line-through cursor-not-allowed'
                          }`}
                        >
                          <div className="font-bold">{slot.time} hs</div>
                          <div className="text-[10px] opacity-75 font-sans font-normal">
                            hasta {endTime}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={!selectedSlot}
                  onClick={() => setStep(3)}
                  className="w-full py-3.5 btn-gradient-beauty text-xs sm:text-sm font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
                >
                  Continuar con mis datos
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: Client Details Form ================= */}
          {step === 3 && currentService && (
            <form onSubmit={handleCreateBooking} className="space-y-4">
              {/* Turno Recap */}
              <div className="p-3 bg-gradient-to-r from-pink-50/80 to-purple-50/80 border border-pink-200/80 rounded-xl text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Tratamiento:</span>
                  <span className="font-bold text-neutral-900">{currentService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Fecha y Hora:</span>
                  <span className="font-bold text-purple-950">
                    {formatLongDate(selectedDate)} a las {selectedSlot} hs
                  </span>
                </div>
                <div className="flex justify-between border-t border-pink-200/60 pt-1 mt-1">
                  <span className="text-neutral-600">Total / Seña requerida ({settings.depositPercent}%):</span>
                  <span className="font-semibold text-neutral-900">
                    {formatMoney(currentService.price)} / <strong className="text-pink-600 font-bold">{formatMoney(Math.round((currentService.price * settings.depositPercent) / 100))}</strong>
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">
                    Tu Nombre y Apellido *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Ej. Camila Pérez"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-pink-200 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-400 focus:outline-hidden bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">
                    Tu Teléfono / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 3865 123456 (con código de área)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-pink-200 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-400 focus:outline-hidden bg-white"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Te enviaremos los datos de la reserva y confirmación por WhatsApp a este número.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">
                    Notas o diseño deseado (opcional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej: Tengo uñas cortas, quiero forma almendra o traer foto de referencia..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 text-xs sm:text-sm border border-pink-200 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-400 focus:outline-hidden bg-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <span>
                  Al hacer clic en <strong>Confirmar Pre-reserva</strong>, se generará tu reserva y en el siguiente paso verás el <strong>Alias, CVU y link</strong> para transferir la seña.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 btn-gradient-beauty text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md"
                >
                  Confirmar Pre-reserva y Ver Datos de Pago
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 4: Transfer Details & WhatsApp confirmation ================= */}
          {step === 4 && createdBooking && (
            <div className="space-y-5 animate-in fade-in duration-300">
              
              {/* Success Badge with Pink/Violet glow */}
              <div className="text-center py-2">
                <div className="w-14 h-14 bg-gradient-to-tr from-pink-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg shadow-purple-500/20">
                  <Check className="w-7 h-7 stroke-[3]" />
                </div>
                <h3 className="text-2xl font-display text-[#1f1625] tracking-tight">
                  ¡Turno Pre-reservado con Éxito!
                </h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Código de turno: <strong className="font-mono text-purple-950 font-bold bg-pink-50 px-2 py-0.5 rounded border border-pink-200">{createdBooking.code}</strong>
                </p>
              </div>

              {/* Booking Recap */}
              <div className="p-3.5 bg-gradient-to-r from-pink-50/80 via-white to-purple-50/80 rounded-xl border border-pink-200/80 text-xs space-y-1.5 shadow-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Servicio:</span>
                  <span className="font-bold text-neutral-900">{createdBooking.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Fecha y Hora:</span>
                  <span className="font-bold text-purple-950">
                    {formatLongDate(createdBooking.date)} · {createdBooking.start} a {createdBooking.end} hs
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">A nombre de:</span>
                  <span className="font-semibold text-neutral-900">{createdBooking.name} ({createdBooking.phone})</span>
                </div>
                <div className="flex justify-between border-t border-pink-200/60 pt-1.5 font-medium">
                  <span className="text-purple-950 font-bold">Seña para confirmar (30%):</span>
                  <span className="text-sm font-black font-mono text-pink-600">
                    {formatMoney(createdBooking.deposit)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-500">
                  <span>Resta abonar en el estudio:</span>
                  <span className="font-mono font-medium">{formatMoney(createdBooking.price - createdBooking.deposit)}</span>
                </div>
              </div>

              {/* The Core Requested Feature: Bank / Wallet Transfer Box */}
              <div className="p-4 bg-white border-2 border-pink-300 rounded-2xl shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
                    <span>🏦 Datos para transferir tu seña</span>
                  </span>
                  <span className="text-xs text-pink-600 font-bold bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200">
                    Monto: {formatMoney(createdBooking.deposit)}
                  </span>
                </div>

                {/* Alias */}
                <div className="p-2.5 bg-gradient-to-r from-pink-50/60 to-purple-50/60 rounded-xl border border-pink-200 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-purple-900/70 font-semibold uppercase block">Alias Mercado Pago / Bancario</span>
                    <span className="font-mono text-sm font-bold text-purple-950 select-all">
                      {createdBooking.paymentInfo.alias}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(createdBooking.paymentInfo.alias, 'alias')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white border border-pink-300 text-xs font-bold rounded-lg hover:bg-pink-50 active:scale-95 transition-all text-purple-900 shadow-2xs shrink-0"
                  >
                    {isCopiedAlias ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        <span className="text-emerald-700 font-bold">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-pink-500" />
                        <span>Copiar Alias</span>
                      </>
                    )}
                  </button>
                </div>

                {/* CVU */}
                <div className="p-2.5 bg-gradient-to-r from-pink-50/60 to-purple-50/60 rounded-xl border border-pink-200 flex items-center justify-between gap-2">
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-purple-900/70 font-semibold uppercase block">CVU / CBU</span>
                    <span className="font-mono text-xs font-bold text-purple-950 select-all truncate block">
                      {createdBooking.paymentInfo.cvu}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(createdBooking.paymentInfo.cvu, 'cvu')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white border border-pink-300 text-xs font-bold rounded-lg hover:bg-pink-50 active:scale-95 transition-all text-purple-900 shadow-2xs shrink-0"
                  >
                    {isCopiedCvu ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        <span className="text-emerald-700 font-bold">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-purple-500" />
                        <span>Copiar CVU</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Titular */}
                <div className="text-xs text-neutral-600 px-1">
                  Titular de la cuenta: <strong className="text-purple-950 font-bold">{createdBooking.paymentInfo.titular}</strong>
                </div>

                {/* Optional Mercado Pago Link */}
                {createdBooking.paymentInfo.link && (
                  <div className="pt-2 border-t border-pink-100 flex items-center justify-between gap-2">
                    <span className="text-xs text-neutral-600">¿Preferís pagar con link?</span>
                    <a
                      href={createdBooking.paymentInfo.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-purple-700 underline"
                    >
                      <span>Abrir Link de Pago</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Next Step / WhatsApp instruction */}
              <div className="space-y-3">
                <div className="text-xs text-purple-950 bg-gradient-to-r from-pink-100/70 to-purple-100/70 border border-purple-200 p-3 rounded-xl flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                    !
                  </div>
                  <div>
                    <strong className="text-purple-950 block font-bold">Paso final para confirmar:</strong>
                    Realizá la transferencia de <strong>{formatMoney(createdBooking.deposit)}</strong> y envianos el comprobante por WhatsApp a Victoria.
                  </div>
                </div>

                {/* Main WhatsApp Button */}
                <a
                  href={StorageService.createOwnerWhatsAppLink(createdBooking)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleReportTransferDone}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Comprobante por WhatsApp a Victoria</span>
                </a>

                {/* Secondary Button: Ya transferí */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReportTransferDone}
                    disabled={transferReported}
                    className={`flex-1 py-2.5 text-xs font-semibold border rounded-xl transition-all ${
                      transferReported
                        ? 'bg-purple-100/60 border-purple-200 text-purple-700 cursor-default'
                        : 'bg-white border-pink-300 text-purple-950 hover:bg-pink-50'
                    }`}
                  >
                    {transferReported ? '✓ Transferencia notificada al estudio' : 'Ya realicé la transferencia'}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 text-xs font-semibold bg-neutral-100 hover:bg-pink-100 text-neutral-700 rounded-xl transition-colors"
                  >
                    Listo / Cerrar
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
