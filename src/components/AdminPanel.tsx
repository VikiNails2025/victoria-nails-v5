import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Ban,
  Calendar,
  Check,
  CheckCircle,
  CheckCircle2,
  Clock,
  Coins,
  Copy,
  CreditCard,
  DollarSign,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  FolderOpen,
  Image as ImageIcon,
  Lock,
  LogOut,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Receipt,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Settings as SettingsIcon,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  Upload,
  User,
  Wallet,
  X
} from 'lucide-react';
import { Booking, DaySchedule, GalleryPhoto, PaymentMethod, Service, StudioSettings } from '../types';
import {
  StorageService,
  DEFAULT_WEEKLY_SCHEDULE,
  formatLongDate,
  formatMoney,
  calculateEndTime,
  readFileAsCompressedDataUrl,
  localDateStr
} from '../services/storage';

interface AdminPanelProps {
  onBackToPublicSite: () => void;
  settings: StudioSettings;
  onUpdateSettings: (newSettings: StudioSettings) => void;
  services: Service[];
  onUpdateServices: (services: Service[]) => void;
  gallery: GalleryPhoto[];
  onUpdateGallery: (gallery: GalleryPhoto[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBackToPublicSite,
  settings,
  onUpdateSettings,
  services,
  onUpdateServices,
  gallery,
  onUpdateGallery,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('nails_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'cash_register' | 'pending_balances' | 'bookings' | 'schedule' | 'manual_booking' | 'services' | 'gallery' | 'blocked_dates' | 'settings'
  >('cash_register');

  // Bookings filter
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Financial / Cash register selected date
  const [cashRegisterDate, setCashRegisterDate] = useState<string>(() => {
    return localDateStr();
  });
  const [cashRegisterPeriod, setCashRegisterPeriod] = useState<'day' | 'all'>('day');

  // Balance Payment Modal
  const [payingBalanceBooking, setPayingBalanceBooking] = useState<Booking | null>(null);
  const [balanceMethod, setBalanceMethod] = useState<PaymentMethod>('efectivo');
  const [balanceNotesInput, setBalanceNotesInput] = useState<string>('');
  const [balanceSuccessToast, setBalanceSuccessToast] = useState<string | null>(null);

  // Visor de comprobantes (capturas que adjuntan las clientas)
  const [viewingReceipt, setViewingReceipt] = useState<{ url: string; name: string; code: string } | null>(null);

  // Reschedule state modal
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  // Settings & Weekly Schedule state
  const [settingsForm, setSettingsForm] = useState<StudioSettings>(settings);
  const [scheduleList, setScheduleList] = useState<DaySchedule[]>(() => {
    return settings.weeklySchedule && settings.weeklySchedule.length > 0
      ? settings.weeklySchedule
      : DEFAULT_WEEKLY_SCHEDULE;
  });
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);
  const [scheduleSavedMsg, setScheduleSavedMsg] = useState(false);

  useEffect(() => {
    setSettingsForm(settings);
    if (settings.weeklySchedule && settings.weeklySchedule.length > 0) {
      setScheduleList(settings.weeklySchedule);
    }
  }, [settings]);

  // Manual booking form
  const [manualSvcId, setManualSvcId] = useState(services[0]?.id || '');
  const [manualDate, setManualDate] = useState(() => localDateStr());
  const [manualStart, setManualStart] = useState('15:00');
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualNotes, setManualNotes] = useState('');
  const [manualIsDepositPaid, setManualIsDepositPaid] = useState(true);
  const [manualIsBalancePaid, setManualIsBalancePaid] = useState(false);
  const [manualBalanceMethod, setManualBalanceMethod] = useState<PaymentMethod>('efectivo');
  const [manualSuccessMsg, setManualSuccessMsg] = useState(false);

  // Service CRUD form modal
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
  const [serviceForm, setServiceForm] = useState<Omit<Service, 'id'>>({
    name: '',
    description: '',
    duration: 90,
    price: 20000,
    category: 'semi',
    imageUrl: services[0]?.imageUrl || '',
    active: true,
    isPopular: false,
  });
  const [serviceFileLoading, setServiceFileLoading] = useState(false);

  // Gallery CRUD form
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState('Esculpidas');
  const [gallerySuccessMsg, setGallerySuccessMsg] = useState(false);
  const [galleryFileLoading, setGalleryFileLoading] = useState(false);

  // Blocked Date input
  const [newBlockedDate, setNewBlockedDate] = useState('');

  // Day Agenda Copy notification
  const [copiedScheduleMsg, setCopiedScheduleMsg] = useState(false);
  const [copiedCashSummaryMsg, setCopiedCashSummaryMsg] = useState(false);
  const [copiedLinkMsg, setCopiedLinkMsg] = useState(false);
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Private direct link generator
  const getPrivateAdminLink = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${window.location.pathname}#admin`;
    }
    return 'https://.../#admin';
  };

  const handleCopyPrivateLink = () => {
    navigator.clipboard.writeText(getPrivateAdminLink());
    setCopiedLinkMsg(true);
    setTimeout(() => setCopiedLinkMsg(false), 3000);
  };

  // Refresh trigger
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const correctPassword = settings.adminPassword || 'vicofergalle123';
    if (passwordInput === correctPassword || passwordInput === 'vicofergalle123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('nails_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Contraseña incorrecta. Verificá tu clave secreta de dueña.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('nails_admin_auth');
    sessionStorage.removeItem('nails_admin_active_view');
    onBackToPublicSite();
  };

  const bookings = StorageService.getBookings();

  // Balance payment handler
  const handleConfirmBalancePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingBalanceBooking) return;

    StorageService.recordBalancePayment(
      payingBalanceBooking.id,
      balanceMethod,
      balanceNotesInput.trim() || undefined
    );

    const clientName = payingBalanceBooking.name;
    const amount = formatMoney(payingBalanceBooking.price - payingBalanceBooking.deposit);

    setPayingBalanceBooking(null);
    setBalanceNotesInput('');
    setRefreshKey((k) => k + 1);

    setBalanceSuccessToast(`✓ ¡Cobro de saldo registrado exitosamente (${amount} - ${clientName})!`);
    setTimeout(() => setBalanceSuccessToast(null), 3500);
  };

  const handleUndoBalancePayment = (id: string, name: string) => {
    if (window.confirm(`¿Revertir el cobro de saldo para ${name}? Volverá a quedar pendiente.`)) {
      StorageService.undoBalancePayment(id);
      setRefreshKey((k) => k + 1);
      setBalanceSuccessToast(`Saldo revertido a pendiente.`);
      setTimeout(() => setBalanceSuccessToast(null), 3000);
    }
  };

  // Filtered Bookings for the Agenda tab
  const filteredBookings = bookings
    .filter((b) => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'today') {
        const todayStr = localDateStr();
        return b.date === todayStr;
      }
      if (statusFilter === 'pending_balance') {
        return b.status !== 'cancelled' && !b.balancePaid;
      }
      if (statusFilter === 'balance_paid') {
        return b.balancePaid === true;
      }
      return b.status === statusFilter;
    })
    .filter((b) => {
      if (!dateFilter) return true;
      return b.date === dateFilter;
    })
    .filter((b) => {
      if (!searchFilter.trim()) return true;
      const q = searchFilter.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.phone.includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.serviceName.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return b.start.localeCompare(a.start);
    });

  // Bookings with pending balance (active, not cancelled, balance not paid)
  const bookingsWithPendingBalance = bookings
    .filter((b) => b.status !== 'cancelled' && !b.balancePaid)
    .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start));

  // Cash Register / Financial calculations for selected date or period
  const cashDateBookings = bookings.filter((b) => {
    if (cashRegisterPeriod === 'all') return b.status !== 'cancelled';
    return b.date === cashRegisterDate && b.status !== 'cancelled';
  });

  // Calculate numbers for Cash Register:
  // 1. Total deposits confirmed
  const cashDepositsCollected = cashDateBookings
    .filter((b) => b.status === 'confirmed' || b.balancePaid)
    .reduce((sum, b) => sum + b.deposit, 0);

  // 2. Total balances collected at salon
  const cashBalancesCollected = cashDateBookings
    .filter((b) => b.balancePaid)
    .reduce((sum, b) => sum + (b.price - b.deposit), 0);

  // 3. Real money collected (Deposits confirmed + Balances paid)
  const cashTotalCollectedReal = cashDepositsCollected + cashBalancesCollected;

  // 4. Pending balances still to collect for this date
  const cashPendingBalances = cashDateBookings
    .filter((b) => !b.balancePaid)
    .reduce((sum, b) => sum + (b.price - b.deposit), 0);

  // 5. Total Billed Potential (full price of services in that date)
  const cashTotalBilledPotential = cashDateBookings.reduce((sum, b) => sum + b.price, 0);

  // Breakdown by payment method for balances collected in this date
  const balancesByMethod = cashDateBookings
    .filter((b) => b.balancePaid && b.balancePaymentMethod)
    .reduce((acc, b) => {
      const m = b.balancePaymentMethod || 'efectivo';
      acc[m] = (acc[m] || 0) + (b.price - b.deposit);
      return acc;
    }, {} as Record<PaymentMethod, number>);

  // Global KPIs
  const totalBookingsCount = bookings.length;
  const pendingTransferCount = bookings.filter((b) => b.status === 'pending_transfer').length;
  const transferReportedCount = bookings.filter((b) => b.status === 'transfer_reported').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const totalPendingBalancesCount = bookingsWithPendingBalance.length;
  const totalPendingBalancesAmount = bookingsWithPendingBalance.reduce(
    (sum, b) => sum + (b.price - b.deposit),
    0
  );

  const handleConfirmBooking = (id: string) => {
    StorageService.updateBookingStatus(id, 'confirmed');
    setRefreshKey((k) => k + 1);
  };

  const handleCancelBooking = (id: string) => {
    if (window.confirm('¿Deseás marcar este turno como CANCELADO?')) {
      StorageService.updateBookingStatus(id, 'cancelled');
      setRefreshKey((k) => k + 1);
    }
  };

  const handleDeleteBooking = (id: string) => {
    if (window.confirm('¿Eliminar definitivamente este registro del sistema?')) {
      StorageService.deleteBooking(id);
      setRefreshKey((k) => k + 1);
    }
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingBooking || !rescheduleDate || !rescheduleTime) return;

    StorageService.rescheduleBooking(reschedulingBooking.id, rescheduleDate, rescheduleTime);
    setReschedulingBooking(null);
    setRefreshKey((k) => k + 1);
  };

  // Save General Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...settingsForm,
      weeklySchedule: scheduleList,
    };
    StorageService.saveSettings(updated);
    onUpdateSettings(updated);
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 2500);
  };

  // Schedule management handlers
  const handleToggleDay = (dayOfWeek: number) => {
    setScheduleList((prev) =>
      prev.map((item) =>
        item.dayOfWeek === dayOfWeek ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const handleUpdateDayTime = (
    dayOfWeek: number,
    field: 'openTime' | 'closeTime' | 'breakStart' | 'breakEnd',
    value: string
  ) => {
    setScheduleList((prev) =>
      prev.map((item) =>
        item.dayOfWeek === dayOfWeek ? { ...item, [field]: value } : item
      )
    );
  };

  const handleToggleDayBreak = (dayOfWeek: number) => {
    setScheduleList((prev) =>
      prev.map((item) => {
        if (item.dayOfWeek === dayOfWeek) {
          const nextVal = !item.hasBreak;
          return {
            ...item,
            hasBreak: nextVal,
            breakStart: item.breakStart || '13:00',
            breakEnd: item.breakEnd || '16:00',
          };
        }
        return item;
      })
    );
  };

  const handleSaveSchedule = () => {
    const updatedSettings = {
      ...settingsForm,
      weeklySchedule: scheduleList,
    };
    StorageService.saveSettings(updatedSettings);
    onUpdateSettings(updatedSettings);
    setSettingsForm(updatedSettings);
    setScheduleSavedMsg(true);
    setTimeout(() => setScheduleSavedMsg(false), 2500);
  };

  const handleApplyMondayToWeekdays = () => {
    const monday = scheduleList.find((s) => s.dayOfWeek === 1);
    if (!monday) return;
    setScheduleList((prev) =>
      prev.map((item) => {
        if (item.dayOfWeek >= 1 && item.dayOfWeek <= 5) {
          return {
            ...item,
            enabled: monday.enabled,
            openTime: monday.openTime,
            closeTime: monday.closeTime,
            hasBreak: monday.hasBreak,
            breakStart: monday.breakStart,
            breakEnd: monday.breakEnd,
          };
        }
        return item;
      })
    );
  };

  // Manual Booking Creation
  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const svc = services.find((s) => s.id === manualSvcId);
    if (!svc || !manualName.trim() || !manualPhone.trim()) return;

    const b = StorageService.createBooking({
      service: svc,
      date: manualDate,
      start: manualStart,
      name: manualName,
      phone: manualPhone,
      notes: manualNotes + ' (Cargado manualmente por administradora)',
    });

    if (manualIsDepositPaid) {
      StorageService.updateBookingStatus(b.id, 'confirmed');
    }

    if (manualIsBalancePaid) {
      StorageService.recordBalancePayment(b.id, manualBalanceMethod, 'Cobrado al registrar');
    }

    setManualSuccessMsg(true);
    setTimeout(() => {
      setManualSuccessMsg(false);
      setActiveTab('cash_register');
    }, 1500);

    setManualName('');
    setManualPhone('');
    setManualNotes('');
    setRefreshKey((k) => k + 1);
  };

  // File Upload Handlers (Folder/File Picker)
  const handleServiceImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setServiceFileLoading(true);
    try {
      const dataUrl = await readFileAsCompressedDataUrl(file);
      setServiceForm((prev) => ({ ...prev, imageUrl: dataUrl }));
    } catch {
      alert('Error al leer la imagen seleccionada desde tu carpeta.');
    } finally {
      setServiceFileLoading(false);
    }
  };

  const handleGalleryImageFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setGalleryFileLoading(true);
    try {
      if (files.length === 1) {
        const dataUrl = await readFileAsCompressedDataUrl(files[0]);
        setNewPhotoUrl(dataUrl);
      } else {
        for (let i = 0; i < files.length; i++) {
          const dataUrl = await readFileAsCompressedDataUrl(files[i]);
          StorageService.addGalleryPhoto({
            url: dataUrl,
            caption: newPhotoCaption.trim() || `Trabajo realizado en Victoria Nails`,
            category: newPhotoCategory,
          });
        }
        const updated = StorageService.getGallery();
        onUpdateGallery(updated);
        setGallerySuccessMsg(true);
        setTimeout(() => setGallerySuccessMsg(false), 2500);
      }
    } catch {
      alert('Error al cargar la(s) foto(s) desde tu dispositivo.');
    } finally {
      setGalleryFileLoading(false);
    }
  };

  // Service Management
  const handleOpenNewService = () => {
    setEditingService(null);
    setServiceForm({
      name: '',
      description: '',
      duration: 90,
      price: 20000,
      category: 'semi',
      imageUrl: services[0]?.imageUrl || '',
      active: true,
      isPopular: false,
    });
    setIsNewServiceModalOpen(true);
  };

  const handleOpenEditService = (svc: Service) => {
    setEditingService(svc);
    setServiceForm({
      name: svc.name,
      description: svc.description,
      duration: svc.duration,
      price: svc.price,
      category: svc.category,
      imageUrl: svc.imageUrl,
      active: svc.active,
      isPopular: !!svc.isPopular,
    });
    setIsNewServiceModalOpen(true);
  };

  const handleSaveServiceForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      const updated: Service = {
        ...editingService,
        ...serviceForm,
      };
      StorageService.updateService(updated);
      const all = StorageService.getServices();
      onUpdateServices(all);
    } else {
      StorageService.addService(serviceForm);
      const all = StorageService.getServices();
      onUpdateServices(all);
    }
    setIsNewServiceModalOpen(false);
    setEditingService(null);
  };

  const handleDeleteService = (id: string, name: string) => {
    if (window.confirm(`¿Segura de eliminar el servicio "${name}"?`)) {
      StorageService.deleteService(id);
      const all = StorageService.getServices();
      onUpdateServices(all);
    }
  };

  // Gallery Management
  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim() || !newPhotoCaption.trim()) return;

    StorageService.addGalleryPhoto({
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim(),
      category: newPhotoCategory,
    });
    const updated = StorageService.getGallery();
    onUpdateGallery(updated);

    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setGallerySuccessMsg(true);
    setTimeout(() => setGallerySuccessMsg(false), 2500);
  };

  const handleDeletePhoto = (id: string) => {
    if (window.confirm('¿Eliminar esta foto de la galería?')) {
      StorageService.deleteGalleryPhoto(id);
      const updated = StorageService.getGallery();
      onUpdateGallery(updated);
    }
  };

  // Blocked Dates
  const handleToggleBlockedDate = (dateStr: string) => {
    const updated = StorageService.toggleBlockedDate(dateStr);
    const newSettings = { ...settings, blockedDates: updated };
    onUpdateSettings(newSettings);
    setSettingsForm(newSettings);
  };

  const handleAddBlockedDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedDate) return;
    handleToggleBlockedDate(newBlockedDate);
    setNewBlockedDate('');
  };

  // Copy today's schedule for WhatsApp
  const handleCopyTodaySchedule = () => {
    const todayStr = localDateStr();
    const todayBookings = bookings
      .filter((b) => b.date === todayStr && b.status !== 'cancelled')
      .sort((a, b) => a.start.localeCompare(b.start));

    let text = `💅 *AGENDA DE HOY (${formatLongDate(todayStr)}) - VICTORIA NAILS*\n\n`;
    if (todayBookings.length === 0) {
      text += 'No hay turnos agendados para el día de hoy.';
    } else {
      todayBookings.forEach((b, idx) => {
        const statusIcon = b.status === 'confirmed' ? '✅' : '⏳';
        const balanceState = b.balancePaid ? '💵 Saldo Pagado' : `Resta cobrar: ${formatMoney(b.price - b.deposit)}`;
        text += `${idx + 1}. *${b.start} a ${b.end} hs* - ${b.name} (${statusIcon})\n`;
        text += `   ✦ *Servicio:* ${b.serviceName}\n`;
        text += `   ✦ *WhatsApp:* ${b.phone}\n`;
        text += `   ✦ *Estado Pago:* ${balanceState}\n\n`;
      });
      text += `Total turnos: ${todayBookings.length}`;
    }

    navigator.clipboard.writeText(text);
    setCopiedScheduleMsg(true);
    setTimeout(() => setCopiedScheduleMsg(false), 3000);
  };

  // Copy cash summary for WhatsApp
  const handleCopyCashSummary = () => {
    const periodLabel = cashRegisterPeriod === 'day' ? formatLongDate(cashRegisterDate) : 'Histórico Completo';
    let text = `📊 *CIERRE DE CAJA Y RECAUDACIÓN - VICTORIA NAILS*\n`;
    text += `📅 *Período:* ${periodLabel}\n\n`;
    text += `💰 *Total Recaudado Real:* ${formatMoney(cashTotalCollectedReal)}\n`;
    text += `   • Señas Cobradas: ${formatMoney(cashDepositsCollected)}\n`;
    text += `   • Saldos Cobrados en Local: ${formatMoney(cashBalancesCollected)}\n\n`;
    text += `⏳ *Saldos Pendientes por Cobrar:* ${formatMoney(cashPendingBalances)}\n`;
    text += `📈 *Total Facturado Potencial:* ${formatMoney(cashTotalBilledPotential)}\n`;
    text += `👥 *Turnos en este período:* ${cashDateBookings.length}\n\n`;
    text += `💳 *Desglose de Saldos por Medio de Pago:*\n`;
    text += `   • Efectivo: ${formatMoney(balancesByMethod['efectivo'] || 0)}\n`;
    text += `   • Transferencia: ${formatMoney(balancesByMethod['transferencia'] || 0)}\n`;
    text += `   • Mercado Pago: ${formatMoney(balancesByMethod['mercado_pago'] || 0)}\n`;
    text += `   • Tarjeta: ${formatMoney(balancesByMethod['tarjeta'] || 0)}\n`;

    navigator.clipboard.writeText(text);
    setCopiedCashSummaryMsg(true);
    setTimeout(() => setCopiedCashSummaryMsg(false), 3000);
  };

  // If not authenticated, render the dedicated Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#12071f] via-[#1a0c2c] to-[#250d3d] text-white flex flex-col items-center justify-center p-4">
        {/* Back to site link on top */}
        <div className="w-full max-w-md flex justify-between items-center mb-6">
          <button
            onClick={onBackToPublicSite}
            className="flex items-center gap-1.5 text-xs text-pink-300 hover:text-white transition-colors bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Volver al Sitio Web Público</span>
          </button>
          <span className="text-[11px] text-purple-300/70 font-medium">Victoria Nails · Acceso Seguro</span>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-7 sm:p-8 max-w-md w-full shadow-2xl border border-pink-400/40 text-neutral-900 space-y-5">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-800 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div className="text-center space-y-1.5">
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-[11px] font-bold uppercase tracking-wider">
              Acceso Exclusivo de Dueña
            </span>
            <h2 className="text-2xl font-bold font-serif-brand text-purple-950">
              Panel de Administradora
            </h2>
            <p className="text-xs text-neutral-600 leading-relaxed pt-1">
              Este panel está protegido y <strong>oculto para tus clientas</strong>. Solo vos podés ingresar con tu enlace privado y tu clave de seguridad.
            </p>
          </div>

          <form onSubmit={(e) => handleLogin(e)} className="space-y-3.5 pt-1">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 text-left">
                Ingresá tu clave secreta:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tu contraseña de administradora"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 pr-10 text-sm border border-neutral-300 rounded-xl focus:border-pink-600 focus:outline-hidden text-center bg-white font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-700 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <p className="text-xs text-rose-600 font-semibold text-center bg-rose-50 border border-rose-200 py-2 rounded-xl">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-900 via-purple-950 to-pink-600 hover:from-purple-950 hover:to-pink-700 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-98"
            >
              Ingresar al Panel de Control
            </button>

            {/* Direct Link Copier for Owner to bookmark */}
            <div className="pt-3 border-t border-neutral-200/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-neutral-600">
                <span className="font-semibold text-purple-950">Tu enlace privado directo:</span>
                <button
                  type="button"
                  onClick={handleCopyPrivateLink}
                  className="text-pink-600 hover:text-pink-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedLinkMsg ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLinkMsg ? '¡Copiado!' : 'Copiar Link'}</span>
                </button>
              </div>
              <div className="p-2 bg-neutral-100 rounded-lg text-[10px] font-mono text-neutral-600 truncate border border-neutral-200">
                {getPrivateAdminLink()}
              </div>
              <p className="text-[10px] text-neutral-400 leading-tight">
                💡 Guardá este enlace en tus favoritos de Chrome o Safari en tu celular para entrar siempre directamente sin buscarlo.
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ---------- Navegación del panel (menú lateral) ----------
  type AdminTabId = typeof activeTab;
  const navItems: { id: AdminTabId; label: string; icon: React.ReactNode; badge?: number; count?: number; group: string }[] = [
    { id: 'cash_register', label: 'Caja diaria', icon: <Receipt className="w-4 h-4" />, group: 'Dinero' },
    { id: 'pending_balances', label: 'Cobro de saldos', icon: <Wallet className="w-4 h-4" />, badge: totalPendingBalancesCount, group: 'Dinero' },
    { id: 'bookings', label: 'Agenda de turnos', icon: <Calendar className="w-4 h-4" />, count: bookings.length, group: 'Turnos' },
    { id: 'manual_booking', label: 'Cargar turno', icon: <Plus className="w-4 h-4" />, group: 'Turnos' },
    { id: 'schedule', label: 'Días y horarios', icon: <Clock className="w-4 h-4" />, group: 'Turnos' },
    { id: 'blocked_dates', label: 'Feriados', icon: <Ban className="w-4 h-4" />, group: 'Turnos' },
    { id: 'services', label: 'Servicios y precios', icon: <Sparkles className="w-4 h-4" />, count: services.length, group: 'Web' },
    { id: 'gallery', label: 'Fotos galería', icon: <ImageIcon className="w-4 h-4" />, count: gallery.length, group: 'Web' },
    { id: 'settings', label: 'Pagos y Maps', icon: <SettingsIcon className="w-4 h-4" />, group: 'Web' },
  ];

  const tabTitles: Record<AdminTabId, { title: string; subtitle: string }> = {
    cash_register: { title: 'Caja diaria y recaudación', subtitle: 'Lo cobrado, lo pendiente y el desglose por medio de pago' },
    pending_balances: { title: 'Cobro de saldos', subtitle: 'Registrá lo que cada clienta abona en el local' },
    bookings: { title: 'Agenda de turnos', subtitle: 'Confirmá señas, cobrá saldos y avisá por WhatsApp' },
    manual_booking: { title: 'Cargar turno manual', subtitle: 'Para reservas por llamada, WhatsApp o en persona' },
    schedule: { title: 'Días y horarios de trabajo', subtitle: 'Las clientas solo pueden reservar en estos horarios' },
    blocked_dates: { title: 'Feriados y vacaciones', subtitle: 'Bloqueá fechas puntuales' },
    services: { title: 'Servicios y precios', subtitle: 'Catálogo que ven las clientas en la web' },
    gallery: { title: 'Galería de trabajos', subtitle: 'Fotos que se publican en la web' },
    settings: { title: 'Pagos y ubicación', subtitle: 'Alias, CVU, porcentaje de seña y Google Maps' },
  };

  const navGroups = ['Dinero', 'Turnos', 'Web'];
  const todayLabel = formatLongDate(localDateStr());

  // ================= STANDALONE FULL-SCREEN DASHBOARD =================
  return (
    <div className="min-h-screen w-full bg-[#0d0716] text-neutral-100 flex flex-col lg:flex-row font-sans selection:bg-pink-500 selection:text-white">

      {/* ---------- SIDEBAR (escritorio) ---------- */}
      <aside className="hidden lg:flex w-64 shrink-0 sticky top-0 h-screen flex-col bg-gradient-to-b from-[#1a0b2b] via-[#160a24] to-[#12071f] border-r border-purple-900/50">
        <div className="px-5 pt-6 pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-display text-lg leading-none text-white">Victoria Nails</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-pink-300/80 mt-1">Panel de dueña</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {navGroups.map((group) => (
            <div key={group} className="space-y-1">
              <p className="px-3 text-[10px] uppercase tracking-widest text-purple-400/60 font-bold">{group}</p>
              {navItems.filter((n) => n.group === group).map((item) => {
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all relative ${
                      active
                        ? 'bg-gradient-to-r from-pink-500/90 to-purple-600/90 text-white shadow-md'
                        : 'text-purple-200/75 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <span className={active ? 'text-white' : 'text-pink-300/80'}>{item.icon}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge ? (
                      <span className="min-w-5 h-5 px-1.5 rounded-full bg-amber-500/90 text-[#1a0b2b] text-[10px] font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    ) : item.count !== undefined ? (
                      <span className={`text-[10px] font-bold ${active ? 'text-white/80' : 'text-purple-300/50'}`}>{item.count}</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="px-3 pb-4 pt-3 space-y-1 border-t border-white/10">
          <button
            type="button"
            onClick={handleCopyPrivateLink}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-purple-200/80 hover:text-white hover:bg-white/8 transition-colors"
            title="Copiar el link directo #admin a tu portapapeles"
          >
            {copiedLinkMsg ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLinkMsg ? '¡Enlace copiado!' : 'Copiar mi enlace secreto'}</span>
          </button>
          <button
            onClick={onBackToPublicSite}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-purple-200/80 hover:text-white hover:bg-white/8 transition-colors"
            title="Volver a la vista del cliente / sitio web principal"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ver sitio web público</span>
          </button>
          <button
            onClick={handleLogout}
            title="Cerrar sesión de administradora"
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-purple-200/80 hover:text-white hover:bg-white/8 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* ---------- HEADER + MENÚ (celular / tablet) ---------- */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#160a24]/95 backdrop-blur-md border-b border-purple-900/60 shadow-lg">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-display text-base leading-none text-white">Victoria Nails</p>
              <p className="text-[9px] uppercase tracking-[0.18em] text-pink-300/80 mt-0.5">Panel de dueña</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopyPrivateLink}
              title="Copiar mi enlace secreto (#admin)"
              className="p-2 rounded-lg text-purple-200 hover:bg-white/10"
            >
              {copiedLinkMsg ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onBackToPublicSite}
              title="Ver sitio web público"
              className="p-2 rounded-lg text-pink-200 bg-white/10 hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              title="Cerrar sesión de administradora"
              className="p-2 rounded-lg text-purple-200 hover:bg-white/10"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
        <nav className="flex items-center gap-1.5 px-3 pb-3 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  active
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                    : 'bg-white/8 text-purple-200/85 hover:bg-white/15'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="min-w-4 h-4 px-1 rounded-full bg-amber-500 text-[#1a0b2b] text-[9px] flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </header>

      {/* ---------- CONTENIDO ---------- */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Título de la sección + resumen rápido */}
        <div className="px-4 sm:px-6 lg:px-8 pt-5 lg:pt-7 max-w-7xl w-full mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl text-white leading-tight">{tabTitles[activeTab].title}</h1>
              <p className="text-xs sm:text-sm text-purple-300/70 mt-1">{tabTitles[activeTab].subtitle}</p>
            </div>
            <p className="text-[11px] text-purple-300/60 capitalize">{todayLabel}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <button
              onClick={() => setActiveTab('pending_balances')}
              className="text-left p-3 rounded-2xl bg-[#180d28] border border-amber-500/30 hover:border-amber-400/60 transition-colors"
            >
              <span className="text-[11px] text-amber-300 font-semibold block">💵 Saldos por cobrar</span>
              <span className="font-mono font-bold text-lg text-amber-200">{formatMoney(totalPendingBalancesAmount)}</span>
              <span className="block text-[10px] text-purple-300/60">{totalPendingBalancesCount} {totalPendingBalancesCount === 1 ? 'turno' : 'turnos'}</span>
            </button>
            <button
              onClick={() => {
                setStatusFilter('transfer_reported');
                setActiveTab('bookings');
              }}
              className="text-left p-3 rounded-2xl bg-[#180d28] border border-blue-500/30 hover:border-blue-400/60 transition-colors"
            >
              <span className="text-[11px] text-blue-300 font-semibold block">🔔 Por verificar</span>
              <span className="font-mono font-bold text-lg text-blue-200">{transferReportedCount}</span>
              <span className="block text-[10px] text-purple-300/60">transferencias informadas</span>
            </button>
            <button
              onClick={() => {
                setStatusFilter('pending_transfer');
                setActiveTab('bookings');
              }}
              className="text-left p-3 rounded-2xl bg-[#180d28] border border-purple-700/40 hover:border-purple-500/60 transition-colors"
            >
              <span className="text-[11px] text-purple-300 font-semibold block">⏳ Esperando seña</span>
              <span className="font-mono font-bold text-lg text-white">{pendingTransferCount}</span>
              <span className="block text-[10px] text-purple-300/60">sin transferir aún</span>
            </button>
            <button
              onClick={() => {
                setStatusFilter('confirmed');
                setActiveTab('bookings');
              }}
              className="text-left p-3 rounded-2xl bg-[#180d28] border border-emerald-500/30 hover:border-emerald-400/60 transition-colors"
            >
              <span className="text-[11px] text-emerald-300 font-semibold block">✅ Confirmados</span>
              <span className="font-mono font-bold text-lg text-emerald-200">{confirmedCount}</span>
              <span className="block text-[10px] text-purple-300/60">de {totalBookingsCount} reservas</span>
            </button>
          </div>
        </div>

      {/* Visor de comprobante adjunto */}
      {viewingReceipt && (
        <div
          className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setViewingReceipt(null)}
        >
          <div className="max-w-lg w-full space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between text-white text-sm">
              <span className="font-semibold">
                Comprobante de {viewingReceipt.name} <span className="font-mono text-pink-300">({viewingReceipt.code})</span>
              </span>
              <button
                onClick={() => setViewingReceipt(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"
                title="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={viewingReceipt.url}
              alt="Comprobante de transferencia"
              className="w-full max-h-[80vh] object-contain rounded-xl bg-white"
            />
          </div>
        </div>
      )}

      {/* Success Notification Toast */}
      {balanceSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-950/90 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{balanceSuccessToast}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">

        {/* ================= TAB: CAJA DIARIA & RECAUDACIÓN ================= */}
        {activeTab === 'cash_register' && (
          <div className="space-y-6">
            
            {/* Header & Date Controls */}
            <div className="bg-[#180d28] border border-purple-800/50 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-pink-400 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <Receipt className="w-4 h-4" />
                  <span>Control Financiero & Facturación</span>
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Caja Diaria & Recaudación
                </h2>
                <p className="text-xs text-purple-200/70 mt-1">
                  Consultá el total facturado, las señas cobradas, los saldos percibidos en el local y lo pendiente de cobrar.
                </p>
              </div>

              {/* Date Selector and Fast Filters */}
              <div className="flex flex-wrap items-center gap-2 bg-[#12071f] p-2 rounded-2xl border border-purple-900/60 text-xs">
                <button
                  onClick={() => {
                    setCashRegisterDate(localDateStr());
                    setCashRegisterPeriod('day');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                    cashRegisterPeriod === 'day' && cashRegisterDate === localDateStr()
                      ? 'bg-pink-600 text-white'
                      : 'text-purple-200/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Hoy
                </button>

                <button
                  onClick={() => {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    setCashRegisterDate(localDateStr(yesterday));
                    setCashRegisterPeriod('day');
                  }}
                  className="px-3 py-1.5 rounded-xl text-purple-200/70 hover:text-white hover:bg-white/5 font-medium transition-colors"
                >
                  Ayer
                </button>

                <button
                  onClick={() => setCashRegisterPeriod('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                    cashRegisterPeriod === 'all'
                      ? 'bg-purple-700 text-white'
                      : 'text-purple-200/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Histórico Total
                </button>

                {cashRegisterPeriod === 'day' && (
                  <div className="flex items-center gap-1 pl-2 border-l border-purple-900/60">
                    <span className="text-[11px] text-purple-300">Fecha:</span>
                    <input
                      type="date"
                      value={cashRegisterDate}
                      onChange={(e) => {
                        setCashRegisterDate(e.target.value);
                        setCashRegisterPeriod('day');
                      }}
                      className="bg-purple-950/80 border border-purple-700/60 text-white rounded-lg px-2 py-1 text-xs font-mono"
                    />
                  </div>
                )}

                <button
                  onClick={handleCopyCashSummary}
                  className="ml-auto px-3 py-1.5 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  title="Copiar resumen del cierre de caja para enviar por WhatsApp"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Cierre de Caja</span>
                </button>
              </div>
            </div>

            {copiedCashSummaryMsg && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-2xl text-center text-xs font-bold animate-in fade-in">
                ✓ ¡Resumen de caja copiado! Ya podés pegarlo en tu chat de WhatsApp o notas.
              </div>
            )}

            {/* Financial Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Real Money Collected */}
              <div className="bg-[#180d28] border border-emerald-500/40 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-2">
                  <span>Total Recaudado Real</span>
                  <Coins className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-300">
                  {formatMoney(cashTotalCollectedReal)}
                </div>
                <p className="text-[11px] text-neutral-400 mt-2 flex items-center gap-2">
                  <span>Señas: {formatMoney(cashDepositsCollected)}</span>
                  <span>·</span>
                  <span>Saldos: {formatMoney(cashBalancesCollected)}</span>
                </p>
              </div>

              {/* Card 2: Pending Balances to Collect */}
              <div className="bg-[#180d28] border border-amber-500/40 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
                <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-2">
                  <span>Saldos Pendientes de Cobro</span>
                  <Wallet className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-300">
                  {formatMoney(cashPendingBalances)}
                </div>
                <p className="text-[11px] text-neutral-400 mt-2">
                  Resta cobrar en el salón a las clientas de esta fecha
                </p>
              </div>

              {/* Card 3: Total Billed Potential */}
              <div className="bg-[#180d28] border border-purple-500/40 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
                <div className="flex items-center justify-between text-xs text-purple-300 font-semibold mb-2">
                  <span>Total Facturado Potencial</span>
                  <TrendingUp className="w-5 h-5 text-pink-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                  {formatMoney(cashTotalBilledPotential)}
                </div>
                <p className="text-[11px] text-neutral-400 mt-2">
                  Valor total de los servicios reservados ({cashDateBookings.length} turnos)
                </p>
              </div>

              {/* Card 4: Total Bookings Status */}
              <div className="bg-[#180d28] border border-blue-500/40 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                <div className="flex items-center justify-between text-xs text-blue-300 font-semibold mb-2">
                  <span>Turnos de la Fecha</span>
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                  {cashDateBookings.length}
                </div>
                <p className="text-[11px] text-neutral-400 mt-2">
                  {cashDateBookings.filter((b) => b.balancePaid).length} saldos cobrados · {cashDateBookings.filter((b) => !b.balancePaid).length} por cobrar
                </p>
              </div>

            </div>

            {/* Methods Breakdown Strip */}
            <div className="bg-[#180d28] border border-purple-800/40 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-pink-400" />
                <span>Desglose de Cobro de Saldos por Medio de Pago ({cashRegisterPeriod === 'day' ? formatLongDate(cashRegisterDate) : 'Histórico'})</span>
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#12071f] p-3.5 rounded-xl border border-purple-900/60">
                  <span className="text-neutral-400 block text-[11px]">💵 Efectivo en Local</span>
                  <span className="text-base font-bold font-mono text-emerald-400 mt-0.5 block">
                    {formatMoney(balancesByMethod['efectivo'] || 0)}
                  </span>
                </div>

                <div className="bg-[#12071f] p-3.5 rounded-xl border border-purple-900/60">
                  <span className="text-neutral-400 block text-[11px]">🏦 Transferencia (Alias/CVU)</span>
                  <span className="text-base font-bold font-mono text-blue-400 mt-0.5 block">
                    {formatMoney(balancesByMethod['transferencia'] || 0)}
                  </span>
                </div>

                <div className="bg-[#12071f] p-3.5 rounded-xl border border-purple-900/60">
                  <span className="text-neutral-400 block text-[11px]">📱 Mercado Pago</span>
                  <span className="text-base font-bold font-mono text-sky-400 mt-0.5 block">
                    {formatMoney(balancesByMethod['mercado_pago'] || 0)}
                  </span>
                </div>

                <div className="bg-[#12071f] p-3.5 rounded-xl border border-purple-900/60">
                  <span className="text-neutral-400 block text-[11px]">💳 Tarjeta Débito/Crédito</span>
                  <span className="text-base font-bold font-mono text-purple-400 mt-0.5 block">
                    {formatMoney(balancesByMethod['tarjeta'] || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Table of Bookings and Collections for the Date */}
            <div className="bg-[#180d28] border border-purple-800/40 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-900/40 pb-3">
                <h3 className="font-bold text-sm text-white">
                  Detalle de Clientas y Recaudación ({cashDateBookings.length} turnos)
                </h3>
                <span className="text-xs text-purple-300/70">
                  Registrá el cobro del saldo con 1 clic al finalizar cada sesión
                </span>
              </div>

              {cashDateBookings.length === 0 ? (
                <div className="p-10 text-center text-xs text-neutral-400 bg-[#12071f] rounded-xl border border-purple-900/40 space-y-2">
                  <Receipt className="w-8 h-8 mx-auto text-purple-400 opacity-60" />
                  <p className="font-semibold text-neutral-300">No hay turnos registrados en esta fecha</p>
                  <p>Seleccioná otra fecha arriba para consultar la recaudación.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cashDateBookings.map((b) => {
                    const balanceAmount = b.price - b.deposit;
                    return (
                      <div
                        key={b.id}
                        className="bg-[#140822] border border-purple-900/60 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-pink-500/40 transition-colors"
                      >
                        {/* Info Client */}
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-bold text-neutral-200 bg-purple-950 px-2 py-0.5 rounded border border-purple-800/60 text-[11px]">
                              {b.code}
                            </span>

                            <span className="font-semibold text-pink-300 text-sm">
                              {b.start} a {b.end} hs
                            </span>

                            {b.balancePaid ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50 flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                <span>100% Cobrado ({b.balancePaymentMethod?.toUpperCase()})</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-500/50 flex items-center gap-1 animate-pulse">
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                <span>Saldo Pendiente: {formatMoney(balanceAmount)}</span>
                              </span>
                            )}
                          </div>

                          <div className="font-bold text-white text-sm flex items-center gap-2">
                            <span>{b.name}</span>
                            <span className="text-neutral-400 text-xs font-normal">· {b.serviceName}</span>
                          </div>

                          <div className="text-neutral-400 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
                            <span>Tel: <a href={`https://wa.me/${b.phone}`} className="text-emerald-400 hover:underline">+{b.phone}</a></span>
                            <span>Total Servicio: <strong className="text-white font-mono">{formatMoney(b.price)}</strong></span>
                            <span>Seña: <strong className="text-pink-300 font-mono">{formatMoney(b.deposit)}</strong></span>
                            <span>Saldo en salón: <strong className="text-amber-300 font-mono">{formatMoney(balanceAmount)}</strong></span>
                          </div>

                          {b.balanceNotes && (
                            <p className="text-[11px] text-neutral-400 italic bg-purple-950/60 p-1.5 rounded">
                              Nota de pago: {b.balanceNotes}
                            </p>
                          )}
                        </div>

                        {/* Action: Register Balance Collection */}
                        <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0">
                          {!b.balancePaid ? (
                            <button
                              onClick={() => {
                                setPayingBalanceBooking(b);
                                setBalanceMethod('efectivo');
                                setBalanceNotesInput('');
                              }}
                              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                            >
                              <Coins className="w-4 h-4" />
                              <span>Registrar Cobro ({formatMoney(balanceAmount)})</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUndoBalancePayment(b.id, b.name)}
                              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors"
                              title="Revertir cobro de saldo a pendiente si te equivocaste"
                            >
                              <RotateCcw className="w-3 h-3 text-neutral-400" />
                              <span>Revertir a Pendiente</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ================= TAB: COBRO DE SALDOS PENDIENTES ================= */}
        {activeTab === 'pending_balances' && (
          <div className="space-y-6">
            <div className="bg-[#180d28] border border-purple-800/50 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <Wallet className="w-4 h-4" />
                  <span>Cobranzas en el Salón</span>
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Saldos Pendientes por Cobrar
                </h2>
                <p className="text-xs text-purple-200/70 mt-1">
                  Listado exclusivo de clientas que ya pagaron seña pero aún deben abonar el resto al atenderse en el local.
                </p>
              </div>

              <div className="bg-[#12071f] px-5 py-3 rounded-2xl border border-amber-500/40 text-right">
                <span className="text-[11px] text-amber-300/80 block">Total Pendiente en Calle:</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-amber-300">
                  {formatMoney(totalPendingBalancesAmount)}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  ({totalPendingBalancesCount} clientas pendientes)
                </span>
              </div>
            </div>

            {bookingsWithPendingBalance.length === 0 ? (
              <div className="p-12 text-center text-xs text-neutral-400 bg-[#180d28] rounded-2xl border border-purple-900/40 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">¡No hay saldos pendientes por cobrar!</h3>
                <p>Todos los turnos agendados están 100% cobrados o cancelados.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookingsWithPendingBalance.map((b) => {
                  const balanceAmount = b.price - b.deposit;
                  return (
                    <div
                      key={b.id}
                      className="bg-[#180d28] border border-purple-800/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between gap-4 text-xs hover:border-pink-500/40 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-white bg-purple-950 px-2.5 py-0.5 rounded border border-purple-800 text-[11px]">
                            {b.code}
                          </span>
                          <span className="text-pink-300 font-semibold text-[11px] bg-pink-950/60 px-2.5 py-0.5 rounded-full border border-pink-500/30">
                            {formatLongDate(b.date)} · {b.start} hs
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-white text-base">{b.name}</h4>
                          <p className="text-purple-200/80">{b.serviceName} ({b.duration} min)</p>
                        </div>

                        <div className="p-3 bg-[#12071f] rounded-xl border border-purple-900/60 space-y-1">
                          <div className="flex justify-between text-neutral-300">
                            <span>Precio Total:</span>
                            <span className="font-mono font-bold text-white">{formatMoney(b.price)}</span>
                          </div>
                          <div className="flex justify-between text-pink-300">
                            <span>Seña Pagada:</span>
                            <span className="font-mono font-bold text-pink-400">-{formatMoney(b.deposit)}</span>
                          </div>
                          <div className="flex justify-between text-amber-300 font-bold border-t border-purple-900/60 pt-1 text-sm">
                            <span>Saldo Restante a Cobrar:</span>
                            <span className="font-mono text-amber-400 text-base">{formatMoney(balanceAmount)}</span>
                          </div>
                        </div>

                        {b.notes && (
                          <p className="text-[11px] text-neutral-400 italic">
                            Nota: {b.notes}
                          </p>
                        )}

                        {b.receiptImage && (
                          <button
                            type="button"
                            onClick={() => setViewingReceipt({ url: b.receiptImage!, name: b.name, code: b.code })}
                            className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-blue-500/10 border border-blue-400/30 hover:bg-blue-500/20 transition-colors w-fit"
                            title="Ver la captura del comprobante que adjuntó la clienta"
                          >
                            <img src={b.receiptImage} alt="Comprobante" className="w-10 h-10 rounded-md object-cover border border-white/10" />
                            <span className="text-[11px] font-semibold text-blue-200">Ver comprobante adjunto</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2 border-t border-purple-900/60 pt-3">
                        <button
                          onClick={() => {
                            setPayingBalanceBooking(b);
                            setBalanceMethod('efectivo');
                            setBalanceNotesInput('');
                          }}
                          className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                        >
                          <Coins className="w-4 h-4" />
                          <span>Cobrar Saldo ({formatMoney(balanceAmount)})</span>
                        </button>

                        <a
                          href={`https://wa.me/${b.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(b.name)}!%20Te%20recuerdo%20que%20tu%20turno%20es%20el%20${encodeURIComponent(b.date)}%20a%20las%20${b.start}%20hs.`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 bg-white/10 hover:bg-white/20 text-emerald-400 rounded-xl transition-colors"
                          title="Enviar WhatsApp recordatorio"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: AGENDA DE TURNOS ================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-4 text-xs">
            {/* Top Bar with Search, Filters and WhatsApp Schedule Export */}
            <div className="bg-[#180d28] p-4 rounded-2xl border border-purple-800/40 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Buscar clienta, teléfono o código (ej: VIC-4821)..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-purple-800/60 rounded-xl bg-[#12071f] text-white focus:outline-hidden focus:border-pink-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    title="Filtrar por fecha específica"
                    className="px-2.5 py-2 text-xs border border-purple-800/60 rounded-xl bg-[#12071f] text-white"
                  />
                  {dateFilter && (
                    <button
                      onClick={() => setDateFilter('')}
                      className="text-xs text-neutral-400 hover:text-white p-1"
                      title="Limpiar filtro de fecha"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={handleCopyTodaySchedule}
                    className="px-3 py-2 text-xs font-semibold bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
                    title="Copiar lista de turnos de hoy para enviártela por WhatsApp"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Agenda de Hoy</span>
                  </button>
                </div>
              </div>

              {copiedScheduleMsg && (
                <div className="p-2 bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-medium rounded-xl text-center animate-in fade-in">
                  ✓ ¡Agenda de hoy copiada al portapapeles! Ya podés pegarla en tu WhatsApp.
                </div>
              )}

              {/* Status Pill Filters */}
              <div className="flex items-center gap-1.5 text-xs overflow-x-auto pt-1">
                <span className="text-purple-300/70 mr-1 text-[11px] font-medium">Estado:</span>
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-pink-600 text-white font-bold'
                      : 'bg-white/10 text-purple-200 hover:bg-white/15'
                  }`}
                >
                  Todos ({bookings.length})
                </button>
                <button
                  onClick={() => setStatusFilter('transfer_reported')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors flex items-center gap-1 ${
                    statusFilter === 'transfer_reported'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-blue-950/50 text-blue-300 border border-blue-800'
                  }`}
                >
                  <span>🔔 Por Verificar</span>
                  <span className="font-bold">({transferReportedCount})</span>
                </button>
                <button
                  onClick={() => setStatusFilter('pending_transfer')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors flex items-center gap-1 ${
                    statusFilter === 'pending_transfer'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-amber-950/50 text-amber-300 border border-amber-800'
                  }`}
                >
                  <span>⏳ Esperando Seña</span>
                  <span className="font-bold">({pendingTransferCount})</span>
                </button>
                <button
                  onClick={() => setStatusFilter('confirmed')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors flex items-center gap-1 ${
                    statusFilter === 'confirmed'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-emerald-950/50 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  <span>✅ Seña Confirmada</span>
                  <span className="font-bold">({confirmedCount})</span>
                </button>
                <button
                  onClick={() => setStatusFilter('pending_balance')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors flex items-center gap-1 ${
                    statusFilter === 'pending_balance'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-amber-950/50 text-amber-300 border border-amber-800'
                  }`}
                >
                  <span>💵 Resta Cobrar Saldo ({totalPendingBalancesCount})</span>
                </button>
                <button
                  onClick={() => setStatusFilter('today')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                    statusFilter === 'today'
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-purple-950/50 text-purple-300 border border-purple-800'
                  }`}
                >
                  📆 Solo Turnos de Hoy
                </button>
              </div>
            </div>

            {/* List */}
            {filteredBookings.length === 0 ? (
              <div className="p-10 text-center text-xs text-neutral-400 bg-[#180d28] rounded-2xl border border-purple-900/40 space-y-2">
                <Calendar className="w-8 h-8 mx-auto text-purple-400 opacity-60" />
                <p className="font-semibold text-neutral-300">No se encontraron turnos con este filtro</p>
                <p>Probá cambiando el estado o la fecha seleccionada.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBookings.map((b) => {
                  const balanceAmount = b.price - b.deposit;
                  return (
                    <div
                      key={b.id}
                      className="p-4 bg-[#180d28] border border-purple-800/40 rounded-2xl hover:border-pink-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-neutral-200 bg-purple-950 border border-purple-800 px-2.5 py-0.5 rounded-md text-[11px]">
                            {b.code}
                          </span>

                          {b.status === 'confirmed' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/50 flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Seña Confirmada</span>
                            </span>
                          )}
                          {b.status === 'transfer_reported' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-950 text-blue-300 border border-blue-500 animate-pulse flex items-center gap-1">
                              <span>🔔</span>
                              <span>Clienta informó transferencia</span>
                            </span>
                          )}
                          {b.status === 'pending_transfer' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-950 text-amber-300 border border-amber-500/40">
                              ⏳ Esperando seña
                            </span>
                          )}
                          {b.status === 'cancelled' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-neutral-800 text-neutral-400">
                              Cancelado
                            </span>
                          )}

                          {b.balancePaid ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                              <Coins className="w-3 h-3" />
                              <span>Saldo 100% Cobrado</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-950/60 text-amber-300 border border-amber-500/30">
                              Saldo pendiente: {formatMoney(balanceAmount)}
                            </span>
                          )}
                        </div>

                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          <span>{b.serviceName}</span>
                          <span className="text-[11px] font-normal text-purple-300/70">({b.duration} min)</span>
                        </div>

                        <div className="text-neutral-300 flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="flex items-center gap-1.5 font-semibold text-pink-300 bg-pink-950/40 px-2 py-0.5 rounded">
                            <Calendar className="w-3.5 h-3.5 text-pink-400" />
                            {formatLongDate(b.date)} · {b.start} a {b.end} hs
                          </span>
                          <span className="flex items-center gap-1 font-medium text-white">
                            <User className="w-3.5 h-3.5 text-purple-400" />
                            {b.name}
                          </span>
                          <a
                            href={`https://wa.me/${b.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-emerald-400 font-semibold hover:underline"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                            +{b.phone}
                          </a>
                        </div>

                        {b.notes && (
                          <div className="text-neutral-300 italic bg-[#12071f] border border-purple-900/60 p-2 rounded-lg text-[11px]">
                            <strong>Nota:</strong> {b.notes}
                          </div>
                        )}

                        {b.receiptImage && (
                          <button
                            type="button"
                            onClick={() => setViewingReceipt({ url: b.receiptImage!, name: b.name, code: b.code })}
                            className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-blue-500/10 border border-blue-400/30 hover:bg-blue-500/20 transition-colors w-fit"
                            title="Ver la captura del comprobante que adjuntó la clienta"
                          >
                            <img src={b.receiptImage} alt="Comprobante" className="w-10 h-10 rounded-md object-cover border border-white/10" />
                            <span className="text-[11px] font-semibold text-blue-200">Ver comprobante adjunto</span>
                          </button>
                        )}

                        <div className="text-neutral-400 pt-1 flex flex-wrap items-center gap-3">
                          <span>Total: <strong className="font-mono text-white">{formatMoney(b.price)}</strong></span>
                          <span>·</span>
                          <span>Seña: <strong className="font-mono text-pink-400">{formatMoney(b.deposit)}</strong></span>
                          <span>·</span>
                          <span className="bg-purple-950/80 text-amber-300 px-2 py-0.5 rounded font-medium border border-purple-800/60">
                            Resta en local: <strong className="font-mono">{formatMoney(balanceAmount)}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                        {/* Balance Collection Button */}
                        {!b.balancePaid ? (
                          <button
                            onClick={() => {
                              setPayingBalanceBooking(b);
                              setBalanceMethod('efectivo');
                              setBalanceNotesInput('');
                            }}
                            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-all"
                          >
                            <Coins className="w-4 h-4" />
                            <span>Cobrar Saldo</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                            ✓ Saldo Cobrado ({b.balancePaymentMethod})
                          </span>
                        )}

                        {b.status !== 'confirmed' && (
                          <button
                            onClick={() => handleConfirmBooking(b.id)}
                            className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs"
                          >
                            <Check className="w-4 h-4" />
                            <span>Confirmar Seña</span>
                          </button>
                        )}

                        <a
                          href={StorageService.createClientConfirmationWhatsAppLink(b)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-emerald-300 border border-emerald-500/30 rounded-xl font-semibold flex items-center gap-1.5 transition-colors"
                          title="Enviar mensaje por WhatsApp a la clienta"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => {
                            setReschedulingBooking(b);
                            setRescheduleDate(b.date);
                            setRescheduleTime(b.start);
                          }}
                          className="px-3 py-1 bg-white/5 hover:bg-white/15 text-neutral-300 rounded-lg font-medium flex items-center gap-1 text-[11px]"
                        >
                          <Clock className="w-3 h-3 text-neutral-400" />
                          <span>Reprogramar</span>
                        </button>

                        <div className="flex items-center gap-2 pt-1">
                          {b.status !== 'cancelled' && (
                            <button
                              onClick={() => handleCancelBooking(b.id)}
                              className="text-neutral-400 hover:text-rose-400 hover:bg-rose-950/40 px-2 py-1 rounded text-[11px] transition-colors"
                            >
                              Cancelar
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            title="Eliminar registro"
                            className="text-neutral-500 hover:text-rose-400 p-1 rounded hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: DÍAS Y HORARIOS ================= */}
        {activeTab === 'schedule' && (
          <div className="max-w-4xl mx-auto space-y-4 text-xs">
            <div className="bg-[#180d28] p-6 rounded-3xl border border-purple-800/40 shadow-xl space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-pink-400" />
                    <span>Configuración de Días y Horarios Laborales</span>
                  </h3>
                  <p className="text-purple-200/70 mt-1">
                    Definí qué días atendés, a qué hora abrís y cerrás cada día, y si hacés pausa al mediodía. Las clientas solo podrán reservar en estos horarios.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleApplyMondayToWeekdays}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium text-[11px] transition-colors border border-white/10"
                    title="Copiar horario del Lunes a Martes, Miércoles, Jueves y Viernes"
                  >
                    Copiar Lun a Vie
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {scheduleList.map((day) => (
                <div
                  key={day.dayOfWeek}
                  className={`p-4 rounded-2xl border transition-all ${
                    day.enabled
                      ? 'bg-[#180d28] border-purple-800/60 shadow-lg'
                      : 'bg-[#12071f]/60 border-purple-950/40 opacity-50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={day.enabled}
                          onChange={() => handleToggleDay(day.dayOfWeek)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-neutral-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-600"></div>
                      </label>
                      <div>
                        <span className="font-bold text-sm text-white block">
                          {day.dayName}
                        </span>
                        <span className="text-[11px] font-medium text-purple-300/70">
                          {day.enabled ? 'Atención activa' : 'Cerrado / No laborable'}
                        </span>
                      </div>
                    </div>

                    {day.enabled ? (
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-400 text-[11px]">Desde:</span>
                          <input
                            type="time"
                            value={day.openTime}
                            onChange={(e) =>
                              handleUpdateDayTime(day.dayOfWeek, 'openTime', e.target.value)
                            }
                            className="p-1.5 border border-purple-700/60 rounded-xl bg-[#12071f] text-white font-mono text-xs font-semibold"
                          />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-400 text-[11px]">Hasta:</span>
                          <input
                            type="time"
                            value={day.closeTime}
                            onChange={(e) =>
                              handleUpdateDayTime(day.dayOfWeek, 'closeTime', e.target.value)
                            }
                            className="p-1.5 border border-purple-700/60 rounded-xl bg-[#12071f] text-white font-mono text-xs font-semibold"
                          />
                        </div>

                        <div className="flex items-center gap-1.5 pl-2 border-l border-purple-900/60">
                          <label className="flex items-center gap-1 cursor-pointer text-[11px] text-pink-300 font-medium">
                            <input
                              type="checkbox"
                              checked={!!day.hasBreak}
                              onChange={() => handleToggleDayBreak(day.dayOfWeek)}
                              className="w-3.5 h-3.5 text-pink-600 rounded"
                            />
                            <span>Pausa</span>
                          </label>
                          {day.hasBreak && (
                            <div className="flex items-center gap-1 font-mono text-[11px]">
                              <input
                                type="time"
                                value={day.breakStart || '13:00'}
                                onChange={(e) =>
                                  handleUpdateDayTime(day.dayOfWeek, 'breakStart', e.target.value)
                                }
                                className="p-1 border border-purple-700/60 rounded bg-[#12071f] text-white text-[11px]"
                              />
                              <span className="text-neutral-400">a</span>
                              <input
                                type="time"
                                value={day.breakEnd || '16:00'}
                                onChange={(e) =>
                                  handleUpdateDayTime(day.dayOfWeek, 'breakEnd', e.target.value)
                                }
                                className="p-1 border border-purple-700/60 rounded bg-[#12071f] text-white text-[11px]"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-500 italic">
                        Las clientas no podrán agendar turnos los {day.dayName}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {scheduleSavedMsg && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl text-center font-bold animate-in fade-in">
                ✓ ¡Días y horarios laborales guardados exitosamente!
              </div>
            )}

            <button
              onClick={handleSaveSchedule}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Días y Horarios de Trabajo</span>
            </button>
          </div>
        )}

        {/* ================= TAB: MANUAL BOOKING ================= */}
        {activeTab === 'manual_booking' && (
          <div className="max-w-xl mx-auto bg-[#180d28] p-6 sm:p-8 border border-purple-800/40 rounded-3xl shadow-xl space-y-4 text-xs">
            <div className="border-b border-purple-900/60 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-pink-400" />
                <span>Registrar Turno Manual</span>
              </h3>
              <p className="text-purple-200/70 mt-1">
                Agendá turnos de clientas que te reservaron por llamada, mensaje de WhatsApp o en el local.
              </p>
            </div>

            <form onSubmit={handleCreateManualBooking} className="space-y-4">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Servicio *</label>
                <select
                  value={manualSvcId}
                  onChange={(e) => setManualSvcId(e.target.value)}
                  className="w-full p-2.5 text-xs border border-purple-800/60 rounded-xl bg-[#12071f] text-white font-medium focus:border-pink-500 focus:outline-hidden"
                >
                  {services.filter((s) => s.active).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.duration} min) - {formatMoney(s.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Fecha del turno *</label>
                  <input
                    type="date"
                    required
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full p-2.5 text-xs border border-purple-800/60 rounded-xl bg-[#12071f] text-white focus:border-pink-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Hora de inicio *</label>
                  <input
                    type="time"
                    required
                    value={manualStart}
                    onChange={(e) => setManualStart(e.target.value)}
                    className="w-full p-2.5 text-xs border border-purple-800/60 rounded-xl bg-[#12071f] text-white focus:border-pink-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Nombre y Apellido de la Clienta *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Sofía Herrera"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full p-2.5 text-xs border border-purple-800/60 rounded-xl bg-[#12071f] text-white focus:border-pink-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Teléfono WhatsApp de la Clienta *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. 3865 998877"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  className="w-full p-2.5 text-xs border border-purple-800/60 rounded-xl bg-[#12071f] text-white focus:border-pink-500 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Notas internas (opcional)</label>
                <input
                  type="text"
                  placeholder="Ej. Traer diseño de Pinterest, abonó seña en mano..."
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full p-2.5 text-xs border border-purple-800/60 rounded-xl bg-[#12071f] text-white focus:border-pink-500 focus:outline-hidden"
                />
              </div>

              {/* Payment toggles */}
              <div className="space-y-2 pt-2 border-t border-purple-900/60">
                <div className="p-3 bg-purple-950/60 border border-purple-800/60 rounded-xl flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="depositPaid"
                    checked={manualIsDepositPaid}
                    onChange={(e) => setManualIsDepositPaid(e.target.checked)}
                    className="w-4 h-4 text-pink-600 rounded"
                  />
                  <label htmlFor="depositPaid" className="text-xs text-neutral-200 font-medium cursor-pointer">
                    Marcar seña como ya abonada (Confirmar turno)
                  </label>
                </div>

                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="balancePaid"
                      checked={manualIsBalancePaid}
                      onChange={(e) => setManualIsBalancePaid(e.target.checked)}
                      className="w-4 h-4 text-emerald-500 rounded"
                    />
                    <label htmlFor="balancePaid" className="text-xs text-emerald-200 font-bold cursor-pointer">
                      Marcar saldo restante como 100% cobrado en este momento
                    </label>
                  </div>

                  {manualIsBalancePaid && (
                    <div className="flex items-center gap-2 pt-1 pl-6">
                      <span className="text-neutral-400 text-[11px]">Medio de pago:</span>
                      <select
                        value={manualBalanceMethod}
                        onChange={(e) => setManualBalanceMethod(e.target.value as PaymentMethod)}
                        className="bg-[#12071f] border border-purple-700/60 text-white rounded-lg p-1 text-xs"
                      >
                        <option value="efectivo">Efectivo</option>
                        <option value="transferencia">Transferencia</option>
                        <option value="mercado_pago">Mercado Pago</option>
                        <option value="tarjeta">Tarjeta</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {manualSuccessMsg && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl text-center font-bold">
                  ✓ Turno manual registrado y agendado con éxito.
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-98"
              >
                Guardar Turno en la Agenda
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB: SERVICES CRUD ================= */}
        {activeTab === 'services' && (
          <div className="space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#180d28] p-5 rounded-3xl border border-purple-800/40 shadow-xl">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Catálogo de Servicios & Precios
                </h3>
                <p className="text-purple-200/70">
                  Podés crear nuevos servicios y cargar las fotos abriendo la carpeta de tu computadora o celular.
                </p>
              </div>

              <button
                onClick={handleOpenNewService}
                className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nuevo Servicio</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className={`p-5 bg-[#180d28] border rounded-2xl flex flex-col justify-between gap-3 shadow-lg transition-all ${
                    svc.active ? 'border-purple-800/60 hover:border-pink-500/50' : 'border-purple-950 bg-[#12071f]/50 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={svc.imageUrl}
                      alt=""
                      className="w-20 h-20 rounded-2xl object-cover bg-neutral-900 border border-purple-800/60 shrink-0"
                    />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-white text-base">{svc.name}</h4>
                        <span className="font-mono font-bold text-pink-400 text-base">
                          {formatMoney(svc.price)}
                        </span>
                      </div>
                      <p className="text-neutral-300 text-xs line-clamp-2 leading-relaxed">
                        {svc.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                        <span className="bg-purple-950 px-2 py-0.5 rounded font-medium text-purple-200">
                          ⏱ {svc.duration} min
                        </span>
                        <span className="bg-purple-900/60 text-pink-300 px-2 py-0.5 rounded font-medium">
                          Cat: {svc.category}
                        </span>
                        {svc.isPopular && (
                          <span className="bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded font-bold text-[10px]">
                            ★ Popular
                          </span>
                        )}
                        {!svc.active && (
                          <span className="bg-rose-950 text-rose-300 px-2 py-0.5 rounded font-bold text-[10px]">
                            Pausado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-purple-900/50 pt-3">
                    <span className="text-[11px] text-neutral-400">
                      Seña ({settings.depositPercent}%): <strong className="font-mono text-pink-400">{formatMoney(Math.round((svc.price * settings.depositPercent) / 100))}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditService(svc)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium flex items-center gap-1 transition-colors"
                      >
                        <Edit2 className="w-3 h-3 text-pink-300" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleDeleteService(svc.id, svc.name)}
                        title="Eliminar servicio"
                        className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: GALLERY CRUD ================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-4 text-xs">
            <div className="bg-[#180d28] p-6 rounded-3xl border border-purple-800/40 shadow-xl space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-pink-400" />
                  <span>Agregar Fotos a la Galería de Trabajos</span>
                </h3>
                <p className="text-purple-200/70 mt-1">
                  Podés abrir tu carpeta y elegir una o varias fotos desde tu dispositivo (computadora o celular). Se publican de inmediato en la web.
                </p>
              </div>

              {/* Folder Picker Box */}
              <div className="p-6 bg-gradient-to-r from-purple-950/40 via-pink-950/30 to-purple-950/40 border-2 border-dashed border-pink-500/40 rounded-3xl flex flex-col items-center justify-center text-center gap-3 hover:border-pink-400 transition-colors">
                <div className="w-14 h-14 bg-pink-500/20 border border-pink-500/40 rounded-full flex items-center justify-center text-pink-300 shadow-md">
                  <FolderOpen className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-bold text-white text-base">
                    Abrir carpeta y elegir fotos de tus trabajos
                  </p>
                  <p className="text-xs text-purple-300/70">
                    Seleccioná imágenes JPG, PNG o WebP desde tu disco o carrete de fotos
                  </p>
                </div>

                <label className="cursor-pointer px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>{galleryFileLoading ? 'Procesando fotos...' : 'Elegir fotos desde tu carpeta'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImageFiles}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Preview Single */}
              {newPhotoUrl && (
                <div className="p-4 bg-[#12071f] rounded-2xl border border-pink-500/40 space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-4">
                    <img
                      src={newPhotoUrl}
                      alt="Vista previa"
                      className="w-20 h-20 rounded-xl object-cover border border-purple-800 shadow-md shrink-0"
                    />
                    <div className="space-y-2 flex-1">
                      <span className="font-bold text-emerald-400 text-xs flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Foto cargada lista para publicar
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Epígrafe (ej. Uñas acrílicas con baby boomer)"
                          value={newPhotoCaption}
                          onChange={(e) => setNewPhotoCaption(e.target.value)}
                          className="p-2 border border-purple-800/60 rounded-xl bg-[#180d28] text-white text-xs"
                        />
                        <select
                          value={newPhotoCategory}
                          onChange={(e) => setNewPhotoCategory(e.target.value)}
                          className="p-2 border border-purple-800/60 rounded-xl bg-[#180d28] text-white text-xs"
                        >
                          <option value="Esculpidas">Esculpidas</option>
                          <option value="Kapping Gel">Kapping Gel</option>
                          <option value="Semipermanente">Semipermanente</option>
                          <option value="Pedicure">Pedicure</option>
                          <option value="Studio">Studio / Espacio</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setNewPhotoUrl('')}
                      className="px-3 py-1.5 text-neutral-400 hover:text-white rounded-lg"
                    >
                      Descartar
                    </button>
                    <button
                      type="button"
                      onClick={handleAddPhoto}
                      className="px-4 py-1.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl"
                    >
                      Publicar Esta Foto
                    </button>
                  </div>
                </div>
              )}

              {gallerySuccessMsg && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl font-bold text-center">
                  ✓ Foto(s) agregada(s) exitosamente a la galería de la web.
                </div>
              )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#180d28] border border-purple-800/40 rounded-2xl overflow-hidden shadow-lg group flex flex-col justify-between"
                >
                  <div className="relative aspect-square overflow-hidden bg-neutral-900">
                    <img
                      src={item.url}
                      alt={item.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-[#12071f]/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-800/40">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <p className="text-[11px] text-neutral-300 font-medium line-clamp-2">
                      {item.caption}
                    </p>
                    <button
                      onClick={() => handleDeletePhoto(item.id)}
                      className="w-full py-1.5 text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-800/40 rounded-xl font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: BLOCKED DATES ================= */}
        {activeTab === 'blocked_dates' && (
          <div className="max-w-xl mx-auto space-y-4 text-xs">
            <div className="bg-[#180d28] p-6 rounded-3xl border border-purple-800/40 shadow-xl space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Ban className="w-5 h-5 text-rose-400" />
                <span>Bloquear Fechas Específicas (Feriados / Vacaciones)</span>
              </h3>
              <p className="text-purple-200/70 leading-relaxed">
                Si bloqueás un día puntual, el sistema no permitirá reservar turnos en esa fecha.
              </p>

              <form onSubmit={handleAddBlockedDateSubmit} className="flex items-center gap-2 pt-2">
                <input
                  type="date"
                  required
                  value={newBlockedDate}
                  onChange={(e) => setNewBlockedDate(e.target.value)}
                  className="flex-1 p-2.5 border border-purple-800/60 rounded-xl bg-[#12071f] text-white text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors whitespace-nowrap shadow-md"
                >
                  Bloquear Esta Fecha
                </button>
              </form>
            </div>

            <div className="bg-[#180d28] p-6 rounded-3xl border border-purple-800/40 shadow-xl space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-pink-300">
                Fechas Actualmente Bloqueadas ({(settings.blockedDates || []).length})
              </h4>

              {(!settings.blockedDates || settings.blockedDates.length === 0) ? (
                <p className="text-neutral-500 italic py-2">
                  No hay ninguna fecha bloqueada.
                </p>
              ) : (
                <div className="space-y-2">
                  {settings.blockedDates.map((dateStr) => (
                    <div
                      key={dateStr}
                      className="p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-center justify-between"
                    >
                      <span className="font-semibold text-rose-200 flex items-center gap-2">
                        <Ban className="w-3.5 h-3.5 text-rose-400" />
                        <span>{formatLongDate(dateStr)} ({dateStr})</span>
                      </span>
                      <button
                        onClick={() => handleToggleBlockedDate(dateStr)}
                        className="px-3 py-1 text-[11px] bg-white/10 hover:bg-rose-900 text-rose-200 border border-rose-500/40 rounded-lg font-bold transition-colors"
                      >
                        Desbloquear día
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB: SETTINGS & MAPS ================= */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="max-w-2xl mx-auto space-y-5 text-xs">
            {/* Owner Security and Private Link Section */}
            <div className="p-6 bg-gradient-to-br from-[#200e35] to-[#160a25] rounded-3xl border border-pink-500/50 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 border border-pink-500/30">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      Seguridad & Enlace Privado de la Dueña
                    </h4>
                    <p className="text-[11px] text-purple-200/70">
                      Acceso exclusivo para Victoria Córdoba sin botones en la página de clientes.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyPrivateLink}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
                >
                  {copiedLinkMsg ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLinkMsg ? '¡Copiado!' : 'Copiar Mi Link Privado'}</span>
                </button>
              </div>

              <div className="p-3 bg-[#10071c] rounded-2xl border border-purple-900/60 flex items-center justify-between gap-3 font-mono text-[11px] text-pink-300">
                <span className="truncate">{getPrivateAdminLink()}</span>
                <span className="text-[10px] text-pink-400/80 uppercase tracking-wider font-semibold shrink-0">Solo vos</span>
              </div>

              <div>
                <label className="block font-semibold text-neutral-200 mb-1">
                  Contraseña de Administradora (Clave de Dueña) *
                </label>
                <div className="relative">
                  <input
                    type={showAdminPass ? 'text' : 'password'}
                    required
                    value={settingsForm.adminPassword || 'vicofergalle123'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, adminPassword: e.target.value })}
                    className="w-full p-2.5 pr-10 font-mono text-sm border border-purple-800/60 rounded-xl bg-[#12071f] text-white focus:border-pink-500"
                    placeholder="Tu clave secreta..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPass(!showAdminPass)}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-white p-1 cursor-pointer"
                    title={showAdminPass ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-purple-300/60 mt-1">
                  Esta es la clave para ingresar al panel. Podés modificarla y presionar "Guardar Todos los Cambios" abajo.
                </p>
              </div>
            </div>

            <div className="p-6 bg-[#180d28] rounded-3xl border border-purple-800/40 shadow-xl space-y-2">
              <h3 className="text-lg font-bold text-white mb-1">
                Configuración de Pagos por Transferencia & Ubicación tipo Maps
              </h3>
              <p className="text-purple-200/70">
                Datos de cuenta bancaria/Mercado Pago, porcentaje de seña y dirección para el mapa interactivo.
              </p>
            </div>

            <div className="space-y-4 bg-[#180d28] p-6 sm:p-8 border border-purple-800/40 rounded-3xl shadow-xl">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Alias para transferencias *
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.paymentAlias}
                  onChange={(e) => setSettingsForm({ ...settingsForm, paymentAlias: e.target.value })}
                  className="w-full p-2.5 font-mono text-sm border border-purple-800/60 rounded-xl bg-[#12071f] text-white focus:border-pink-500"
                  placeholder="Ej. vic.cordoba02"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  CVU o CBU completo (22 dígitos) *
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.paymentCvu}
                  onChange={(e) => setSettingsForm({ ...settingsForm, paymentCvu: e.target.value })}
                  className="w-full p-2.5 font-mono text-sm border border-purple-800/60 rounded-xl bg-[#12071f] text-white focus:border-pink-500"
                  placeholder="Ej. 0000003100015097159874"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Titular de la cuenta bancaria / Mercado Pago *
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.paymentTitular}
                  onChange={(e) => setSettingsForm({ ...settingsForm, paymentTitular: e.target.value })}
                  className="w-full p-2.5 text-sm border border-purple-800/60 rounded-xl bg-[#12071f] text-white focus:border-pink-500"
                  placeholder="Ej. Victoria Fern Cordoba Gallego"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Link de Pago directo de Mercado Pago (opcional)
                </label>
                <input
                  type="url"
                  value={settingsForm.paymentLink}
                  onChange={(e) => setSettingsForm({ ...settingsForm, paymentLink: e.target.value })}
                  className="w-full p-2.5 text-sm border border-purple-800/60 rounded-xl bg-[#12071f] text-white focus:border-pink-500"
                  placeholder="Ej. https://mpago.la/2evh28x"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">
                    Porcentaje de Seña a solicitar (%) *
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={settingsForm.depositPercent}
                    onChange={(e) => setSettingsForm({ ...settingsForm, depositPercent: Number(e.target.value) })}
                    className="w-full p-2.5 border border-purple-800/60 rounded-xl bg-[#12071f] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">
                    WhatsApp de la dueña *
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.ownerWhatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ownerWhatsapp: e.target.value })}
                    className="w-full p-2.5 border border-purple-800/60 rounded-xl bg-[#12071f] text-white font-mono"
                    placeholder="5493865206322"
                  />
                </div>
              </div>

              {/* Maps Location Config */}
              <div className="pt-3 border-t border-purple-900/60 space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-pink-400" />
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                    Ubicación y Google Maps
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Dirección del Estudio *</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="w-full p-2.5 border border-purple-800/60 rounded-xl bg-[#12071f] text-white"
                      placeholder="Ej. Juan Bautista Alberdi"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Ciudad / Localidad *</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.city}
                      onChange={(e) => setSettingsForm({ ...settingsForm, city: e.target.value })}
                      className="w-full p-2.5 border border-purple-800/60 rounded-xl bg-[#12071f] text-white"
                      placeholder="Ej. Tucumán"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">
                    Búsqueda de Google Maps (dirección o coordenadas)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.mapsQuery || `${settingsForm.address}, ${settingsForm.city}, Tucuman, Argentina`}
                    onChange={(e) => setSettingsForm({ ...settingsForm, mapsQuery: e.target.value })}
                    className="w-full p-2.5 border border-purple-800/60 rounded-xl bg-[#12071f] text-white text-xs font-mono"
                    placeholder="Ej. Juan Bautista Alberdi, Tucuman, Argentina"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-purple-900/60">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">
                    Enlace de Instagram
                  </label>
                  <input
                    type="text"
                    value={settingsForm.instagram || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                    className="w-full p-2.5 text-xs border border-purple-800/60 rounded-xl bg-[#12071f] text-white focus:border-pink-500"
                    placeholder="https://instagram.com/vico.nailsstudio"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">
                    Enlace de Facebook
                  </label>
                  <input
                    type="text"
                    value={settingsForm.facebook || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, facebook: e.target.value })}
                    className="w-full p-2.5 text-xs border border-purple-800/60 rounded-xl bg-[#12071f] text-white focus:border-pink-500"
                    placeholder="https://facebook.com/victorianails"
                  />
                </div>
              </div>
            </div>

            {settingsSavedMessage && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl text-center font-bold">
                ✓ Configuración guardada con éxito
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Todos los Cambios</span>
            </button>
          </form>
        )}

      </main>
      </div>

      {/* ================= MODAL: REGISTRAR COBRO DE SALDO ================= */}
      {payingBalanceBooking && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#180d28] border border-emerald-500/60 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs text-white">
            <div className="flex items-center justify-between border-b border-purple-900/60 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-400" />
                <span>Registrar Cobro de Saldo Restante</span>
              </h3>
              <button
                onClick={() => setPayingBalanceBooking(null)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-[#12071f] rounded-2xl border border-purple-900/60 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-400">Clienta:</span>
                <span className="font-bold text-white">{payingBalanceBooking.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Servicio:</span>
                <span className="text-purple-200">{payingBalanceBooking.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Total del Servicio:</span>
                <span className="font-mono">{formatMoney(payingBalanceBooking.price)}</span>
              </div>
              <div className="flex justify-between text-pink-300">
                <span>Seña Abonada:</span>
                <span className="font-mono">-{formatMoney(payingBalanceBooking.deposit)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold border-t border-purple-900/60 pt-1 text-sm">
                <span>Saldo a Cobrar Ahora:</span>
                <span className="font-mono text-base">{formatMoney(payingBalanceBooking.price - payingBalanceBooking.deposit)}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmBalancePayment} className="space-y-4">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1.5">
                  ¿Cómo abonó la clienta el saldo? *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'efectivo', label: '💵 Efectivo' },
                    { id: 'transferencia', label: '🏦 Transferencia' },
                    { id: 'mercado_pago', label: '📱 Mercado Pago' },
                    { id: 'tarjeta', label: '💳 Tarjeta' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setBalanceMethod(m.id as PaymentMethod)}
                      className={`p-2.5 rounded-xl border text-center font-bold transition-all text-xs ${
                        balanceMethod === m.id
                          ? 'bg-emerald-600 border-emerald-400 text-white shadow-sm'
                          : 'bg-[#12071f] border-purple-800/60 text-neutral-300 hover:border-purple-600'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Notas de cobro (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Pagó justo en billetes, o comprobante #9482..."
                  value={balanceNotesInput}
                  onChange={(e) => setBalanceNotesInput(e.target.value)}
                  className="w-full p-2.5 border border-purple-800/60 rounded-xl bg-[#12071f] text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-900/60">
                <button
                  type="button"
                  onClick={() => setPayingBalanceBooking(null)}
                  className="px-3.5 py-2 text-neutral-400 hover:text-white rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  Confirmar Cobro ({formatMoney(payingBalanceBooking.price - payingBalanceBooking.deposit)})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: RESCHEDULE BOOKING ================= */}
      {reschedulingBooking && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#180d28] border border-purple-700/60 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl text-xs text-white">
            <div className="flex items-center justify-between border-b border-purple-900/60 pb-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Reprogramar Turno ({reschedulingBooking.code})</span>
              </h3>
              <button
                onClick={() => setReschedulingBooking(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-neutral-300">
              Clienta: <strong className="text-white">{reschedulingBooking.name}</strong><br />
              Servicio: <strong>{reschedulingBooking.serviceName}</strong> ({reschedulingBooking.duration} min)
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Nueva Fecha</label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full p-2 border border-purple-800/60 rounded-xl bg-[#12071f] text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Nueva Hora de Inicio</label>
                <input
                  type="time"
                  required
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full p-2 border border-purple-800/60 rounded-xl bg-[#12071f] text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReschedulingBooking(null)}
                  className="px-3 py-1.5 text-neutral-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl shadow-xs"
                >
                  Confirmar Reprogramación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE / EDIT SERVICE ================= */}
      {isNewServiceModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#180d28] border border-purple-700/60 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-purple-900/60 pb-2">
              <h3 className="font-bold text-white text-base">
                {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h3>
              <button
                onClick={() => setIsNewServiceModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveServiceForm} className="space-y-3">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Nombre del Servicio *</label>
                <input
                  type="text"
                  required
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  className="w-full p-2 border border-purple-800/60 rounded-xl bg-[#12071f] text-white"
                  placeholder="Ej. Uñas Esculpidas XL"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Descripción *</label>
                <textarea
                  required
                  rows={2}
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full p-2 border border-purple-800/60 rounded-xl bg-[#12071f] text-white"
                  placeholder="Detalle de qué incluye el tratamiento..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Duración (minutos) *</label>
                  <select
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: Number(e.target.value) })}
                    className="w-full p-2 border border-purple-800/60 rounded-xl bg-[#12071f] text-white"
                  >
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min (1 h)</option>
                    <option value={75}>75 min</option>
                    <option value={90}>90 min (1:30 h)</option>
                    <option value={105}>105 min</option>
                    <option value={120}>120 min (2 hs)</option>
                    <option value={150}>150 min (2:30 hs)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Precio Total ($) *</label>
                  <input
                    type="number"
                    min={1000}
                    step={500}
                    required
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: Number(e.target.value) })}
                    className="w-full p-2 border border-purple-800/60 rounded-xl bg-[#12071f] text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Categoría</label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value as any })}
                    className="w-full p-2 border border-purple-800/60 rounded-xl bg-[#12071f] text-white"
                  >
                    <option value="esculpidas">Esculpidas</option>
                    <option value="kapping">Kapping</option>
                    <option value="semi">Semipermanente</option>
                    <option value="pies">Pies / Pedicure</option>
                    <option value="combos">Combos</option>
                    <option value="extras">Extras / Retiro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Destacado</label>
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPopular"
                      checked={serviceForm.isPopular}
                      onChange={(e) => setServiceForm({ ...serviceForm, isPopular: e.target.checked })}
                      className="w-4 h-4 text-pink-600 rounded"
                    />
                    <label htmlFor="isPopular" className="text-neutral-300 cursor-pointer">
                      Marcar como popular ★
                    </label>
                  </div>
                </div>
              </div>

              {/* Folder file picker for service photo */}
              <div className="space-y-2 pt-1 border-t border-purple-900/60">
                <label className="block font-semibold text-neutral-300">
                  Foto del Servicio (Elegir desde tu dispositivo)
                </label>
                
                <div className="flex items-center gap-3">
                  {serviceForm.imageUrl && (
                    <img
                      src={serviceForm.imageUrl}
                      alt="Vista previa"
                      className="w-16 h-16 rounded-xl object-cover border border-purple-800 shrink-0 bg-neutral-900"
                    />
                  )}
                  
                  <label className="flex-1 cursor-pointer p-3 border-2 border-dashed border-pink-500/40 hover:border-pink-400 rounded-xl bg-purple-950/40 hover:bg-purple-950/70 transition-colors flex items-center justify-center gap-2 text-pink-300 font-bold text-center">
                    <FolderOpen className="w-4 h-4 text-pink-400" />
                    <span>{serviceFileLoading ? 'Cargando imagen...' : 'Abrir carpeta y elegir foto'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleServiceImageFile}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="pt-1">
                  <span className="text-[10px] text-neutral-500 block mb-0.5">O pegar enlace de foto directamente:</span>
                  <input
                    type="text"
                    value={serviceForm.imageUrl}
                    onChange={(e) => setServiceForm({ ...serviceForm, imageUrl: e.target.value })}
                    className="w-full p-2 border border-purple-800/60 rounded-xl bg-[#12071f] text-white text-xs font-mono"
                    placeholder="https://... o ruta de imagen"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="svcActive"
                  checked={serviceForm.active}
                  onChange={(e) => setServiceForm({ ...serviceForm, active: e.target.checked })}
                  className="w-4 h-4 text-pink-600 rounded"
                />
                <label htmlFor="svcActive" className="text-neutral-300 cursor-pointer font-medium">
                  Servicio activo (visible para reservas)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-purple-900/60">
                <button
                  type="button"
                  onClick={() => setIsNewServiceModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-md"
                >
                  Guardar Servicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
