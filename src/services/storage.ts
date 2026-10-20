import { Booking, BookingStatus, DaySchedule, GalleryPhoto, PaymentMethod, Service, StudioSettings } from '../types';

import heroImg from '../assets/images/hero_nails_studio_1792274570559.jpg';
import esculpidasImg from '../assets/images/nail_service_esculpidas_1792274570344.jpg';
import semiImg from '../assets/images/nail_service_semipermanente_1792274570900.jpg';
import kappingImg from '../assets/images/nail_service_kapping_1792274572208.jpg';
import pedicureImg from '../assets/images/nail_service_pedicure_1792274571626.jpg';

const STORAGE_KEYS = {
  SETTINGS: 'nails_studio_settings_v2',
  SERVICES: 'nails_studio_services_v2',
  BOOKINGS: 'nails_studio_bookings_v2',
  GALLERY: 'nails_studio_gallery_v2',
  ADMIN_AUTH: 'nails_studio_admin_session',
};

export const DEFAULT_WEEKLY_SCHEDULE: DaySchedule[] = [
  { dayOfWeek: 1, dayName: 'Lunes', enabled: true, openTime: '09:00', closeTime: '19:00' },
  { dayOfWeek: 2, dayName: 'Martes', enabled: true, openTime: '09:00', closeTime: '19:00' },
  { dayOfWeek: 3, dayName: 'Miércoles', enabled: true, openTime: '09:00', closeTime: '19:00' },
  { dayOfWeek: 4, dayName: 'Jueves', enabled: true, openTime: '09:00', closeTime: '19:00' },
  { dayOfWeek: 5, dayName: 'Viernes', enabled: true, openTime: '09:00', closeTime: '19:00' },
  { dayOfWeek: 6, dayName: 'Sábado', enabled: true, openTime: '09:00', closeTime: '15:00' },
  { dayOfWeek: 0, dayName: 'Domingo', enabled: false, openTime: '09:00', closeTime: '13:00' },
];

export const DEFAULT_SETTINGS: StudioSettings = {
  name: 'Victoria Nails',
  tagline: 'Uñas que cuentan tu historia',
  about: 'Diseños a medida, productos de primera y un espacio pensado para que te relajes. Reservá tu turno online en un minuto.',
  address: 'Juan Bautista Alberdi',
  city: 'Tucumán',
  ownerWhatsapp: '5493865206322',
  paymentAlias: 'vic.cordoba02',
  paymentCvu: '0000003100015097159874',
  paymentTitular: 'Victoria Fern Cordoba Gallego',
  paymentLink: 'https://mpago.la/2evh28x',
  depositPercent: 30,
  advanceDays: 30,
  openingTime: '09:00',
  closingTime: '19:00',
  slotIntervalMinutes: 30,
  policy: 'Para garantizar tu lugar en la agenda se solicita abonar la seña (30% o total) dentro de las 2 horas de reservado. Podés reprogramar con al menos 24 hs de anticipación.',
  instagram: 'https://instagram.com/vico.nailsstudio',
  facebook: 'https://facebook.com/victorianails',
  weeklySchedule: DEFAULT_WEEKLY_SCHEDULE,
  mapsQuery: 'Juan Bautista Alberdi, Tucuman, Argentina',
  adminPassword: 'vicofergalle123',
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'svc-esculpidas',
    name: 'Esculpidas en Acrílico',
    description: 'Extensión y esculpido artesanal en acrílico con molde. Incluye manicuría rusa previa, largo a elección y esmaltado liso o baby boomer.',
    duration: 120,
    price: 28000,
    category: 'esculpidas',
    imageUrl: esculpidasImg,
    active: true,
    isPopular: true,
  },
  {
    id: 'svc-kapping',
    name: 'Kapping Gel con Nivelación',
    description: 'Refuerzo con gel o acrigel sobre tu uña natural para evitar roturas y permitir el crecimiento parejo. Acabado natural y resistente.',
    duration: 90,
    price: 20000,
    category: 'kapping',
    imageUrl: kappingImg,
    active: true,
    isPopular: true,
  },
  {
    id: 'svc-semi',
    name: 'Esmaltado Semipermanente Glazed / Pearl',
    description: 'Manicuría profunda con torno y esmaltado semipermanente de alta durabilidad (hasta 21 días) con brillo espejo o efecto glazed donut.',
    duration: 60,
    price: 16000,
    category: 'semi',
    imageUrl: semiImg,
    active: true,
  },
  {
    id: 'svc-pedicure',
    name: 'Spa Pedicure & Belleza de Pies',
    description: 'Baño de sales aromáticas, exfoliación, limado y retiro de durezas, tratamiento de cutículas y esmaltado semipermanente.',
    duration: 75,
    price: 19000,
    category: 'pies',
    imageUrl: pedicureImg,
    active: true,
  },
  {
    id: 'svc-softgel',
    name: 'Soft Gel Tips Press-On',
    description: 'Extensión de uñas con cápsulas de gel flexibles que se adhieren directamente a la uña natural. Ligeras, perfectas y resistentes.',
    duration: 105,
    price: 24000,
    category: 'esculpidas',
    imageUrl: esculpidasImg,
    active: true,
  },
  {
    id: 'svc-combo-manos-pies',
    name: 'Combo Manos Semipermanente + Spa Pedicure',
    description: 'Sesión integral para renovar manos y pies en un solo turno. Máximo relax y acabado uniforme en ambos.',
    duration: 135,
    price: 32000,
    category: 'combos',
    imageUrl: heroImg,
    active: true,
    isPopular: true,
  },
];

export const INITIAL_GALLERY: GalleryPhoto[] = [
  {
    id: 'gal-1',
    url: esculpidasImg,
    caption: 'Esculpidas baby boomer almond con acabado satinado',
    category: 'Esculpidas',
  },
  {
    id: 'gal-2',
    url: semiImg,
    caption: 'Semipermanente con efecto chrome perla tornasolado',
    category: 'Semipermanente',
  },
  {
    id: 'gal-3',
    url: kappingImg,
    caption: 'Kapping gel nude lechoso para uña natural saludable',
    category: 'Kapping Gel',
  },
  {
    id: 'gal-4',
    url: pedicureImg,
    caption: 'Spa de pies completo con esmaltado clásico soft rose',
    category: 'Pedicure',
  },
  {
    id: 'gal-5',
    url: heroImg,
    caption: 'Atención personalizada en nuestro espacio de trabajo',
    category: 'Studio',
  },
];

// Helper to format currency
export function formatMoney(amount: number): string {
  return '$' + Math.round(amount).toLocaleString('es-AR');
}

// Helper to format long date in Spanish
export function formatLongDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(date);
}

// Generate human readable random booking code
function generateCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = 'VIC-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Calculate end time given start time and duration in minutes
export function calculateEndTime(start: string, durationMinutes: number): string {
  const [hours, minutes] = start.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60);
  const endMins = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
}

// Compress and read image file from folder/picker (max 1000px, 0.85 jpeg quality)
export async function readFileAsCompressedDataUrl(file: File, maxDim = 1000, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo seleccionado'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Formato de imagen inválido'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// Cross-tab and in-tab real-time event synchronization
const syncChannel =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel('victoria_nails_channel')
    : null;

export function notifyDataChanged(entity: string = 'all') {
  if (typeof window === 'undefined') return;
  try {
    syncChannel?.postMessage({ type: 'DATA_CHANGED', entity, timestamp: Date.now() });
  } catch {}
  try {
    window.dispatchEvent(
      new CustomEvent('victoria_nails_sync', { detail: { entity, timestamp: Date.now() } })
    );
  } catch {}
  try {
    localStorage.setItem('victoria_nails_last_sync', Date.now().toString());
  } catch {}
}

async function syncToServer(endpoint: string, payload: any) {
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    // Graceful fallback to local storage
    console.warn(`Sync to server (${endpoint}) failed, keeping local cache:`, err);
  }
}

export const StorageService = {
  // Sync with persistent backend database on startup
  async initSync(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    try {
      const res = await fetch('/api/data');
      if (!res.ok) return false;
      const data = await res.json();
      let hasUpdated = false;

      if (data.settings && typeof data.settings === 'object') {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
        hasUpdated = true;
      }
      if (data.services && Array.isArray(data.services) && data.services.length > 0) {
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(data.services));
        hasUpdated = true;
      }
      if (data.gallery && Array.isArray(data.gallery) && data.gallery.length > 0) {
        localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(data.gallery));
        hasUpdated = true;
      }
      if (data.bookings && Array.isArray(data.bookings) && data.bookings.length > 0) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(data.bookings));
        hasUpdated = true;
      }

      // If server was empty, seed it with current local state
      if (!data.settings && !data.services) {
        syncToServer('/api/sync', {
          settings: this.getSettings(),
          services: this.getServices(),
          gallery: this.getGallery(),
          bookings: this.getBookings(),
        });
      }

      if (hasUpdated) {
        notifyDataChanged('all');
      }
      return true;
    } catch {
      return false;
    }
  },

  notifyChange(entity: string = 'all') {
    notifyDataChanged(entity);
  },

  getSettings(): StudioSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: StudioSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    syncToServer('/api/settings', settings);
    notifyDataChanged('settings');
  },

  getServices(): Service[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
      return INITIAL_SERVICES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SERVICES;
    }
  },

  saveServices(services: Service[]): void {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    syncToServer('/api/services', services);
    notifyDataChanged('services');
  },

  getBookings(): Booking[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      // Create a few realistic initial sample bookings so calendar is alive
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const sample: Booking[] = [
        {
          id: 'b-init-1',
          token: 'tok_' + Math.random().toString(36).substring(2),
          code: 'VIC-4821',
          serviceId: 'svc-esculpidas',
          serviceName: 'Esculpidas en Acrílico',
          duration: 120,
          price: 28000,
          deposit: 8400,
          date: tomorrowStr,
          start: '10:00',
          end: '12:00',
          name: 'Camila Giménez',
          phone: '3865449911',
          notes: 'Diseño almendra baby boomer',
          status: 'confirmed',
          createdAt: Date.now() - 3600000 * 5,
          paymentInfo: {
            alias: DEFAULT_SETTINGS.paymentAlias,
            cvu: DEFAULT_SETTINGS.paymentCvu,
            titular: DEFAULT_SETTINGS.paymentTitular,
            link: DEFAULT_SETTINGS.paymentLink,
          },
          confirmedAt: Date.now() - 3600000 * 2,
        },
        {
          id: 'b-init-2',
          token: 'tok_' + Math.random().toString(36).substring(2),
          code: 'VIC-7193',
          serviceId: 'svc-kapping',
          serviceName: 'Kapping Gel con Nivelación',
          duration: 90,
          price: 20000,
          deposit: 6000,
          date: tomorrowStr,
          start: '15:30',
          end: '17:00',
          name: 'Sofía Martínez',
          phone: '3815998822',
          notes: 'Uñas frágiles, primera vez',
          status: 'transfer_reported',
          createdAt: Date.now() - 3600000 * 1,
          paymentInfo: {
            alias: DEFAULT_SETTINGS.paymentAlias,
            cvu: DEFAULT_SETTINGS.paymentCvu,
            titular: DEFAULT_SETTINGS.paymentTitular,
            link: DEFAULT_SETTINGS.paymentLink,
          },
          transferReportedAt: Date.now() - 3600000 * 0.5,
        },
      ];
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(sample));
      return sample;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveBookings(bookings: Booking[]): void {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    syncToServer('/api/bookings', bookings);
    notifyDataChanged('bookings');
  },

  createBooking(params: {
    service: Service;
    date: string;
    start: string;
    name: string;
    phone: string;
    notes?: string;
  }): Booking {
    const settings = this.getSettings();
    const duration = params.service.duration;
    const end = calculateEndTime(params.start, duration);
    const deposit = Math.round((params.service.price * settings.depositPercent) / 100);

    const newBooking: Booking = {
      id: 'b_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      token: 'tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
      code: generateCode(),
      serviceId: params.service.id,
      serviceName: params.service.name,
      duration,
      price: params.service.price,
      deposit,
      date: params.date,
      start: params.start,
      end,
      name: params.name.trim(),
      phone: params.phone.replace(/[^\d+]/g, '').trim(),
      notes: params.notes?.trim() || '',
      status: 'pending_transfer',
      createdAt: Date.now(),
      paymentInfo: {
        alias: settings.paymentAlias,
        cvu: settings.paymentCvu,
        titular: settings.paymentTitular,
        link: settings.paymentLink,
      },
    };

    const bookings = this.getBookings();
    bookings.push(newBooking);
    this.saveBookings(bookings);
    return newBooking;
  },

  updateBookingStatus(id: string, status: BookingStatus): Booking | null {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) return null;

    bookings[index].status = status;
    if (status === 'transfer_reported') {
      bookings[index].transferReportedAt = Date.now();
    } else if (status === 'confirmed') {
      bookings[index].confirmedAt = Date.now();
    }
    this.saveBookings(bookings);
    return bookings[index];
  },

  deleteBooking(id: string): void {
    const bookings = this.getBookings().filter((b) => b.id !== id);
    this.saveBookings(bookings);
  },

  recordBalancePayment(id: string, method: PaymentMethod = 'efectivo', notes?: string): Booking | null {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) return null;

    bookings[index].balancePaid = true;
    bookings[index].balancePaidAt = Date.now();
    bookings[index].balancePaymentMethod = method;
    if (notes) {
      bookings[index].balanceNotes = notes;
    }
    // If it was waiting for transfer, automatically confirm it as paid
    if (bookings[index].status === 'pending_transfer' || bookings[index].status === 'transfer_reported') {
      bookings[index].status = 'confirmed';
      bookings[index].confirmedAt = Date.now();
    }

    this.saveBookings(bookings);
    return bookings[index];
  },

  undoBalancePayment(id: string): Booking | null {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) return null;

    bookings[index].balancePaid = false;
    delete bookings[index].balancePaidAt;
    delete bookings[index].balancePaymentMethod;
    delete bookings[index].balanceNotes;

    this.saveBookings(bookings);
    return bookings[index];
  },

  rescheduleBooking(id: string, newDate: string, newStart: string): Booking | null {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) return null;

    const booking = bookings[index];
    const newEnd = calculateEndTime(newStart, booking.duration);

    bookings[index] = {
      ...booking,
      date: newDate,
      start: newStart,
      end: newEnd,
      status: booking.status === 'cancelled' ? 'confirmed' : booking.status,
    };

    this.saveBookings(bookings);
    return bookings[index];
  },

  // Services Management CRUD
  addService(newSvc: Omit<Service, 'id'>): Service {
    const services = this.getServices();
    const created: Service = {
      ...newSvc,
      id: 'svc-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    };
    services.push(created);
    this.saveServices(services);
    return created;
  },

  updateService(updatedSvc: Service): void {
    const services = this.getServices();
    const index = services.findIndex((s) => s.id === updatedSvc.id);
    if (index !== -1) {
      services[index] = updatedSvc;
      this.saveServices(services);
    }
  },

  deleteService(id: string): void {
    const services = this.getServices().filter((s) => s.id !== id);
    this.saveServices(services);
  },

  // Gallery Management CRUD
  getGallery(): GalleryPhoto[] {
    const raw = localStorage.getItem(STORAGE_KEYS.GALLERY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(INITIAL_GALLERY));
      return INITIAL_GALLERY;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_GALLERY;
    }
  },

  saveGallery(gallery: GalleryPhoto[]): void {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
    syncToServer('/api/gallery', gallery);
    notifyDataChanged('gallery');
  },

  addGalleryPhoto(photo: Omit<GalleryPhoto, 'id'>): GalleryPhoto {
    const gallery = this.getGallery();
    const created: GalleryPhoto = {
      ...photo,
      id: 'gal-' + Date.now().toString(36),
    };
    gallery.unshift(created);
    this.saveGallery(gallery);
    return created;
  },

  deleteGalleryPhoto(id: string): void {
    const gallery = this.getGallery().filter((g) => g.id !== id);
    this.saveGallery(gallery);
  },

  // Blocked Dates management
  toggleBlockedDate(dateStr: string): string[] {
    const settings = this.getSettings();
    const current = settings.blockedDates || [];
    let updated: string[];
    if (current.includes(dateStr)) {
      updated = current.filter((d) => d !== dateStr);
    } else {
      updated = [...current, dateStr].sort();
    }
    const newSettings = { ...settings, blockedDates: updated };
    this.saveSettings(newSettings);
    return updated;
  },

  // Compute available time slots for a specific date and service duration
  getAvailableSlots(dateStr: string, serviceDurationMinutes: number): { time: string; available: boolean; reason?: string }[] {
    const settings = this.getSettings();

    // Check if the date is manually blocked by the studio owner
    if (settings.blockedDates && settings.blockedDates.includes(dateStr)) {
      return [{ time: '--:--', available: false, reason: 'Día no laboral / bloqueado por el estudio' }];
    }

    // Check day of week schedule configured by administrator (0 = Domingo, 1 = Lunes, etc.)
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    const dayOfWeek = dateObj.getUTCDay();

    const weekly = settings.weeklySchedule && settings.weeklySchedule.length > 0 ? settings.weeklySchedule : DEFAULT_WEEKLY_SCHEDULE;
    const dayConfig = weekly.find((s) => s.dayOfWeek === dayOfWeek);

    if (dayConfig && !dayConfig.enabled) {
      return [{ time: '--:--', available: false, reason: `Cerrado los días ${dayConfig.dayName}` }];
    }

    const openTimeStr = (dayConfig && dayConfig.openTime) || settings.openingTime || '09:00';
    const closeTimeStr = (dayConfig && dayConfig.closeTime) || settings.closingTime || '19:00';

    const bookings = this.getBookings().filter((b) => b.date === dateStr && b.status !== 'cancelled');

    const [openH, openM] = openTimeStr.split(':').map(Number);
    const [closeH, closeM] = closeTimeStr.split(':').map(Number);
    const openTotalMin = openH * 60 + openM;
    const closeTotalMin = closeH * 60 + closeM;

    // Optional midday break interval
    let breakStartMin = -1;
    let breakEndMin = -1;
    if (dayConfig?.hasBreak && dayConfig.breakStart && dayConfig.breakEnd) {
      const [bsh, bsm] = dayConfig.breakStart.split(':').map(Number);
      const [beh, bem] = dayConfig.breakEnd.split(':').map(Number);
      breakStartMin = bsh * 60 + bsm;
      breakEndMin = beh * 60 + bem;
    }

    const slots: { time: string; available: boolean; reason?: string }[] = [];
    const interval = settings.slotIntervalMinutes || 30;

    // Check if date is in the past
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const isToday = dateStr === todayStr;
    const currentMinutesNow = today.getHours() * 60 + today.getMinutes();

    for (let m = openTotalMin; m + serviceDurationMinutes <= closeTotalMin; m += interval) {
      const slotHour = Math.floor(m / 60);
      const slotMinute = m % 60;
      const timeStr = `${String(slotHour).padStart(2, '0')}:${String(slotMinute).padStart(2, '0')}`;
      const slotEndMin = m + serviceDurationMinutes;

      // In past today?
      if (isToday && m <= currentMinutesNow + 45) {
        slots.push({ time: timeStr, available: false, reason: 'Horario pasado' });
        continue;
      }

      // In midday break?
      if (breakStartMin !== -1 && m < breakEndMin && slotEndMin > breakStartMin) {
        slots.push({ time: timeStr, available: false, reason: 'Pausa / Descanso del salón' });
        continue;
      }

      // Check collision with existing active bookings
      let conflict = false;
      for (const b of bookings) {
        const [bStartH, bStartM] = b.start.split(':').map(Number);
        const [bEndH, bEndM] = b.end.split(':').map(Number);
        const bStartMin = bStartH * 60 + bStartM;
        const bEndMin = bEndH * 60 + bEndM;

        // Overlap condition:
        if (m < bEndMin && slotEndMin > bStartMin) {
          conflict = true;
          break;
        }
      }

      slots.push({
        time: timeStr,
        available: !conflict,
        reason: conflict ? 'Turno ocupado' : undefined,
      });
    }

    return slots;
  },

  // Generates the WhatsApp URL with prefilled text to notify Victoria (the owner)
  createOwnerWhatsAppLink(booking: Booking, customMsg?: string): string {
    const settings = this.getSettings();
    const phone = settings.ownerWhatsapp.replace(/\D/g, '');
    const longDate = formatLongDate(booking.date);
    const depositStr = formatMoney(booking.deposit);

    const text = customMsg ||
      `¡Hola Victoria! 💅 Registré mi turno en Nails Studio.\n\n` +
      `✨ *Servicio:* ${booking.serviceName}\n` +
      `📅 *Fecha:* ${longDate}\n` +
      `⏰ *Hora:* ${booking.start} a ${booking.end} hs\n` +
      `👤 *Nombre:* ${booking.name}\n` +
      `📱 *Teléfono:* ${booking.phone}\n` +
      `💰 *Seña a abonar:* ${depositStr}\n` +
      `🔖 *Código de reserva:* ${booking.code}\n\n` +
      `👉 *Te adjunto aquí el comprobante de transferencia* para confirmar mi lugar. ¡Muchas gracias!`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  },

  // Generates WhatsApp link from owner to client to confirm their reservation
  createClientConfirmationWhatsAppLink(booking: Booking): string {
    const clientPhone = booking.phone.replace(/\D/g, '');
    const longDate = formatLongDate(booking.date);

    const text =
      `¡Hola ${booking.name}! 💅✨\n\n` +
      `¡Recibimos tu comprobante de seña con éxito!\n` +
      `Tu turno para *${booking.serviceName}* el *${longDate} a las ${booking.start} hs* quedó *100% CONFIRMADO*.\n\n` +
      `📍 Te esperamos en ${this.getSettings().address}.\n` +
      `Por favor recordá llegar 5 minutitos antes. ¡Que tengas un hermoso día! 💖`;

    return `https://wa.me/${clientPhone}?text=${encodeURIComponent(text)}`;
  },
};
