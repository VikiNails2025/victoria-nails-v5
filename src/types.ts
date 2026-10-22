export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: 'esculpidas' | 'kapping' | 'semi' | 'pies' | 'combos' | 'extras';
  imageUrl: string;
  active: boolean;
  isPopular?: boolean;
}

export type BookingStatus = 'pending_transfer' | 'transfer_reported' | 'confirmed' | 'cancelled' | 'completed';

export type PaymentMethod = 'efectivo' | 'transferencia' | 'tarjeta' | 'mercado_pago';

export interface Booking {
  id: string;
  token: string;
  code: string; // Friendly 6-char code like VIC-842
  serviceId: string;
  serviceName: string;
  duration: number;
  price: number;
  deposit: number;
  date: string; // YYYY-MM-DD
  start: string; // HH:mm
  end: string; // HH:mm
  name: string;
  phone: string;
  notes?: string;
  status: BookingStatus;
  createdAt: number;
  paymentInfo: {
    alias: string;
    cvu: string;
    titular: string;
    link: string;
  };
  transferReportedAt?: number;
  confirmedAt?: number;
  // Balance collection at the salon (cobro de saldo restante)
  balancePaid?: boolean;
  balancePaidAt?: number;
  balancePaymentMethod?: PaymentMethod;
  balanceNotes?: string;
  // Captura del comprobante de transferencia adjuntada por la clienta (imagen comprimida, data URL)
  receiptImage?: string;
}

export interface DaySchedule {
  dayOfWeek: number; // 0 = Domingo, 1 = Lunes, 2 = Martes, 3 = Miércoles, 4 = Jueves, 5 = Viernes, 6 = Sábado
  dayName: string; // 'Lunes', 'Martes', etc.
  enabled: boolean; // ¿Trabaja este día?
  openTime: string; // "09:00"
  closeTime: string; // "19:00"
  hasBreak?: boolean; // ¿Pausa al mediodía?
  breakStart?: string; // "13:00"
  breakEnd?: string; // "16:00"
}

export interface StudioSettings {
  name: string;
  tagline: string;
  about: string;
  address: string;
  city: string;
  ownerWhatsapp: string;
  paymentAlias: string;
  paymentCvu: string;
  paymentTitular: string;
  paymentLink: string;
  depositPercent: number; // e.g. 30
  advanceDays: number;
  openingTime: string; // "09:00"
  closingTime: string; // "19:00"
  slotIntervalMinutes: number; // 30
  policy: string;
  instagram: string;
  facebook: string;
  blockedDates?: string[]; // Array of YYYY-MM-DD strings
  weeklySchedule?: DaySchedule[];
  mapsQuery?: string; // Query or coordinates for Google Maps
  adminPassword?: string; // Password to access admin panel
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  category: string;
}
