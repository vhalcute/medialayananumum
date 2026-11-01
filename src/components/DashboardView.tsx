import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  DoorOpen,
  Car,
  Package,
  Wrench,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  Table as TableIcon,
  ChevronRight,
  Sparkles,
  AlertCircle,
  FileText,
  Building,
  Info,
  Layers,
  ArrowUpRight,
  Download,
  HelpCircle,
  Palette,
  Check,
  LayoutGrid,
  Megaphone,
  Bell,
  Printer
} from 'lucide-react';
import { BANNER_COLOR_THEMES, getBannerTheme, BannerColorTheme } from '../data/bannerThemes';
import { PerformanceAgendaTable } from './PerformanceAgendaTable';
import {
  PerformanceScheduleItem,
  TodayAgenda,
  ActiveTab,
  RoomItem,
  VehicleItem
} from '../types';

interface DashboardViewProps {
  scheduleItems: PerformanceScheduleItem[];
  onToggleScheduleItem: (id: number) => void;
  todayAgendas: TodayAgenda[];
  onNavigate: (tab: ActiveTab) => void;
  onOpenUniversalModal: (type?: 'room' | 'vehicle' | 'bmn' | 'ticket' | 'atk') => void;
  rooms: RoomItem[];
  vehicles: VehicleItem[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  scheduleItems,
  onToggleScheduleItem,
  todayAgendas,
  onNavigate,
  onOpenUniversalModal,
  rooms,
  vehicles
}) => {
  const [selectedAgendaCategory, setSelectedAgendaCategory] = useState<'all' | 'rapat' | 'kendaraan' | 'bmn'>('all');
  const [showSpreadsheetModal, setShowSpreadsheetModal] = useState(false);
  const [scheduleViewMode, setScheduleViewMode] = useState<'column' | 'table'>('table');
  const [themeId, setThemeId] = useState<string>(() => {
    return localStorage.getItem('mlu_banner_theme') || 'treasury-navy';
  });
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [customBanner, setCustomBanner] = useState<string | null>(() => {
    return localStorage.getItem('mlu_custom_banner') || null;
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      const current = localStorage.getItem('mlu_custom_banner');
      if (current !== customBanner) {
        setCustomBanner(current);
      }
      const currentTheme = localStorage.getItem('mlu_banner_theme') || 'treasury-navy';
      if (currentTheme !== themeId) {
        setThemeId(currentTheme);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, [customBanner, themeId]);

  const activeTheme = getBannerTheme(themeId);

  const handleSelectTheme = (id: string) => {
    setThemeId(id);
    localStorage.setItem('mlu_banner_theme', id);
    // When choosing a background color theme, remove custom raster image so it's pure color
    localStorage.removeItem('mlu_custom_banner');
    setCustomBanner(null);
  };

  const filteredAgendas = todayAgendas.filter(agenda => {
    if (selectedAgendaCategory === 'all') return true;
    return agenda.category === selectedAgendaCategory;
  });

  const countRapat = todayAgendas.filter(a => a.category === 'rapat').length;
  const countKendaraan = todayAgendas.filter(a => a.category === 'kendaraan').length;
  const countBmn = todayAgendas.filter(a => a.category === 'bmn').length;

  const downloadScheduleCsv = () => {
    const headers = 'No,Kegiatan,Batas Waktu,Status\n';
    const rows = scheduleItems.map(item => 
      `"${item.id}","${item.activity.replace(/"/g, '""')}","${item.deadline}","${item.isCompleted ? 'Selesai' : 'Belum Selesai'}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Perekaman_Capaian_IKI_TW3_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. HERO BANNER - Background Warna Menarik Tanpa Ada Gambar (Sesuai Screenshot image_7469f23e.png) */}
      <div className={`relative overflow-hidden rounded-2xl ${activeTheme.gradientClass} text-white p-6 md:p-8 shadow-md border border-slate-700/40 transition-all duration-500`}>
        {/* Subtle Geometric Dot Grid Pattern (Pure CSS/Code, no image) */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Subtle Vertical Accent Lines (Pure Code) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[repeating-linear-gradient(90deg,transparent,transparent_48px,rgba(255,255,255,0.06)_48px,rgba(255,255,255,0.06)_49px)]" />

        {/* Top Right: Menu Background Warna Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setShowThemeModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
            title="Buka Menu Pilihan Background Warna Menarik (Tanpa Gambar)"
          >
            <Palette className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Pilih Warna Background</span>
            <span className="sm:hidden">Warna</span>
          </button>
        </div>

        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-bold text-amber-300 tracking-wide uppercase">
              MEDIA LAYANAN UMUM - KANWIL DJPB PROV. JAMBI
            </span>
            <span className="text-slate-400 text-xs">/</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${activeTheme.accentBadgeClass}`}>
              SISTEM ONLINE | NORMAL
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight uppercase">
            SELAMAT DATANG DI MEDIA LAYANAN UMUM
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl font-normal">
            Portal Layanan Digital Terpadu Kanwil Ditjen Perbendaharaan Provinsi Jambi yang menyediakan kemudahan akses layanan Subbagian TURT, Subbagian Kepegawaian, Subbagian Penilaian Kinerja, dan Subbagian Keuangan secara transparan dan akuntabel.
          </p>

          {/* Quick Service Action Buttons matching screenshot image_7469f23e.png */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenUniversalModal('room')}
              className={`px-4 py-2.5 ${activeTheme.primaryButtonClass} rounded-xl text-xs flex items-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95`}
            >
              <DoorOpen className="w-4 h-4" />
              <span>Pinjam Ruangan</span>
            </button>
            <button
              onClick={() => onOpenUniversalModal('vehicle')}
              className={`px-4 py-2.5 ${activeTheme.secondaryButtonClass} rounded-xl text-xs flex items-center gap-2 transition-all border shadow-xs hover:shadow-sm cursor-pointer active:scale-95`}
            >
              <Car className="w-4 h-4 text-blue-300" />
              <span>Pesan Mobil Dinas</span>
            </button>
            <button
              onClick={() => onOpenUniversalModal('atk')}
              className={`px-4 py-2.5 ${activeTheme.secondaryButtonClass} rounded-xl text-xs flex items-center gap-2 transition-all border shadow-xs hover:shadow-sm cursor-pointer active:scale-95`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Minta ATK</span>
            </button>
            <button
              onClick={() => onOpenUniversalModal('ticket')}
              className={`px-4 py-2.5 ${activeTheme.secondaryButtonClass} rounded-xl text-xs flex items-center gap-2 transition-all border shadow-xs hover:shadow-sm cursor-pointer active:scale-95`}
            >
              <Wrench className="w-4 h-4 text-amber-300" />
              <span>Lapor Kerusakan</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: Menu Background Warna Menarik Tanpa Ada Gambar */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#003366] to-[#002244] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10 text-amber-300">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Menu Background Warna (Tanpa Gambar)</h3>
                  <p className="text-[11px] text-blue-100">
                    Pilih skema gradasi warna menarik untuk banner portal tanpa memerlukan file gambar.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowThemeModal(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body with Theme Grid */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {BANNER_COLOR_THEMES.map((theme) => {
                  const isSelected = theme.id === themeId;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => handleSelectTheme(theme.id)}
                      className={`group relative rounded-xl border-2 p-3.5 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#003366] bg-blue-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs'
                      }`}
                    >
                      {/* Color Preview Swatch */}
                      <div className={`h-16 rounded-lg ${theme.gradientClass} relative overflow-hidden flex items-center justify-between px-3 border border-slate-700/20 mb-2.5`}>
                        <div className="flex items-center gap-1.5 z-10">
                          {theme.previewColors.map((color, i) => (
                            <span
                              key={i}
                              className="w-4 h-4 rounded-full border border-white/50 shadow-xs"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-white text-[#003366] rounded-full p-1 shadow-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <span>{theme.name}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{theme.tagline}</p>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className={isSelected ? 'text-[#003366] font-bold' : 'text-slate-400'}>
                          {isSelected ? '✓ Tema Aktif Saat Ini' : 'Klik untuk Pilih'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectTheme(theme.id);
                          }}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#003366] text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isSelected ? 'Terpilih' : 'Terapkan'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500 font-medium">
                Pilihan warna tersimpan otomatis tanpa perlu memuat file gambar.
              </span>
              <button
                type="button"
                onClick={() => setShowThemeModal(false)}
                className="px-5 py-2 bg-[#003366] hover:bg-[#002244] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. STATS & QUICK DIRECTORY STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div 
          onClick={() => onNavigate('turt-ruangan')}
          className="bg-white p-3.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <div className="text-[11px] font-medium text-slate-500">Ruang Rapat</div>
            <div className="text-lg font-bold text-slate-800">{rooms.length} Ruangan</div>
            <div className="text-[10px] text-emerald-600 font-medium">3 Siap Digunakan Hari Ini</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <DoorOpen className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('turt-kendaraan')}
          className="bg-white p-3.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <div className="text-[11px] font-medium text-slate-500">Kendaraan Dinas</div>
            <div className="text-lg font-bold text-slate-800">{vehicles.length} Armada</div>
            <div className="text-[10px] text-blue-600 font-medium">3 Siap Berangkat</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Car className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('turt-perbaikan')}
          className="bg-white p-3.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <div className="text-[11px] font-medium text-slate-500">Helpdesk Sarpras</div>
            <div className="text-lg font-bold text-slate-800">1 Tiket Aktif</div>
            <div className="text-[10px] text-amber-600 font-medium">Sedang Dikerjakan Teknisi</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Wrench className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('pk-jadwal')}
          className="bg-white p-3.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <div className="text-[11px] font-medium text-slate-500">Perekaman IKI TW III</div>
            <div className="text-lg font-bold text-slate-800">
              {scheduleItems.filter(i => i.isCompleted).length} / {scheduleItems.length} Selesai
            </div>
            <div className="text-[10px] text-purple-600 font-medium">Batas Rekam: 9 Nov 2026</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3. PENGUMUMAN RESMI: PEREKAMAN CAPAIAN IKI TW III 2026 */}
      <section className="bg-white rounded-2xl border-2 border-blue-900/20 shadow-md overflow-hidden relative">
        {/* Top Official Announcement Broadcast Ribbon */}
        <div className="bg-gradient-to-r from-[#002244] via-[#003366] to-[#0a4a82] text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center shrink-0 shadow-inner">
              <Megaphone className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                  PENGUMUMAN PENTING
                </span>
                <span className="text-blue-200 text-xs font-semibold">
                  Subbagian Penilaian Kinerja Kanwil Ditjen Perbendaharaan
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-1">
                Perekaman Capaian IKI TW III 2026
              </h2>
              <p className="text-xs text-blue-100 mt-0.5 font-normal">
                Pemberitahuan resmi jadwal perekaman mandiri capaian realisasi IKI seluruh pegawai dan penetapan DEK/HEK.
              </p>
            </div>
          </div>

          {/* Action tools: Unduh Spreadsheet, Toggle Kolom/Tabel */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={downloadScheduleCsv}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Spreadsheet PK</span>
              <Download className="w-3 h-3 text-emerald-200" />
            </button>

            {/* View switcher */}
            <div className="bg-black/20 p-0.5 rounded-xl border border-white/20 flex items-center">
              <button
                type="button"
                onClick={() => setScheduleViewMode('column')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  scheduleViewMode === 'column'
                    ? 'bg-white text-[#003366] shadow-xs'
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Kartu</span>
              </button>
              <button
                type="button"
                onClick={() => setScheduleViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  scheduleViewMode === 'table'
                    ? 'bg-white text-[#003366] shadow-xs'
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Tabel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Highlight Banner Alert Box inside Announcement */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border-b border-amber-200 p-3.5 sm:px-6 flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold shrink-0">
            <AlertCircle className="w-4 h-4 text-slate-950" />
          </div>
          <div className="text-xs text-amber-950 font-medium leading-relaxed">
            <strong className="font-extrabold text-amber-900">PERHATIAN PENTING PADA TAHAP REKAM IKI:</strong> Pastikan pada saat melakukan perekaman capaian IKI pegawai, wajib <span className="underline decoration-amber-700 decoration-2 font-black text-amber-900">MEMILIH BULAN SEPTEMBER</span> pada aplikasi kinerja (Batas: <strong>9 November 2026</strong>).
          </div>
        </div>

        {/* TAMPILAN DALAM BENTUK PENGUMUMAN KOLOM (Kartu Pengumuman Menarik) */}
        {scheduleViewMode === 'column' && (
          <div className="p-4 sm:p-6 bg-slate-50/70">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {scheduleItems.map((item, index) => {
                const noticeStyles = [
                  {
                    stepBadge: 'TAHAP 1 · REKAM IKI',
                    stepNumber: '01',
                    badgeColor: 'bg-amber-500 text-slate-950',
                    borderCard: 'border-amber-300 ring-1 ring-amber-400/30 bg-gradient-to-b from-amber-50/50 to-white',
                    gradientLine: 'from-amber-400 via-amber-500 to-orange-500',
                    deadlineBox: 'bg-amber-100/90 text-amber-950 border-amber-300',
                    deadlineTag: 'BATAS AKHIR PEREKAMAN',
                  },
                  {
                    stepBadge: 'TAHAP 2 · VALIDASI',
                    stepNumber: '02',
                    badgeColor: 'bg-blue-600 text-white',
                    borderCard: 'border-blue-200 hover:border-blue-400 bg-white',
                    gradientLine: 'from-blue-600 to-indigo-600',
                    deadlineBox: 'bg-blue-50 text-blue-900 border-blue-200',
                    deadlineTag: 'BATAS AKHIR VALIDASI',
                  },
                  {
                    stepBadge: 'TAHAP 3 · PENETAPAN TW II',
                    stepNumber: '03',
                    badgeColor: 'bg-indigo-600 text-white',
                    borderCard: 'border-indigo-200 hover:border-indigo-400 bg-white',
                    gradientLine: 'from-indigo-600 to-purple-600',
                    deadlineBox: 'bg-indigo-50 text-indigo-900 border-indigo-200',
                    deadlineTag: 'BATAS AKHIR PENETAPAN',
                  },
                  {
                    stepBadge: 'TAHAP 4 · PENETAPAN TW III',
                    stepNumber: '04',
                    badgeColor: 'bg-purple-600 text-white',
                    borderCard: 'border-purple-200 hover:border-purple-400 bg-white',
                    gradientLine: 'from-purple-600 to-pink-600',
                    deadlineBox: 'bg-purple-50 text-purple-900 border-purple-200',
                    deadlineTag: 'JADWAL DIMULAI',
                  },
                ];

                const style = noticeStyles[index] || noticeStyles[0];
                const isItem1 = index === 0;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-lg overflow-hidden relative ${
                      item.isCompleted ? 'border-emerald-400 bg-emerald-50/10' : style.borderCard
                    }`}
                  >
                    {/* Top Accent Gradient Ribbon */}
                    <div className={`h-2 w-full bg-gradient-to-r ${style.gradientLine}`} />

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      {/* Top Bar: Badge & Step Number */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${style.badgeColor} uppercase tracking-wider shadow-2xs`}>
                            {style.stepBadge}
                          </span>
                          <span className="text-xs font-black text-slate-300 font-mono">
                            #{style.stepNumber}
                          </span>
                        </div>

                        {/* Title of Announcement Point */}
                        <h3 className="font-black text-base text-slate-900 leading-snug">
                          {item.activity}
                        </h3>

                        {/* Special Alert callout for Item 1 */}
                        {isItem1 && (
                          <div className="mt-3 p-3 rounded-xl bg-amber-100 border border-amber-300/80 shadow-2xs">
                            <div className="flex items-start gap-2">
                              <span className="text-base leading-none">⚠️</span>
                              <div className="text-[11px] font-extrabold text-amber-950 leading-tight">
                                Wajib: <span className="underline decoration-amber-700 decoration-2">pilih bulan SEPTEMBER</span> pada aplikasi kinerja.
                              </div>
                            </div>
                          </div>
                        )}

                        {!isItem1 && item.subText && (
                          <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed font-normal">
                            {item.subText}
                          </p>
                        )}
                      </div>

                      {/* Announcement Deadline Card Box */}
                      <div className="pt-3 border-t border-slate-100 space-y-2.5">
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
                          <span>{style.deadlineTag}</span>
                          <span className="text-[10px] text-slate-400">Tahun 2026</span>
                        </div>

                        <div className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-black shadow-2xs ${style.deadlineBox}`}>
                          <Clock className="w-4 h-4 shrink-0" />
                          <span className="leading-snug">{item.deadline}</span>
                        </div>

                        {/* Checkbox / Completed Indicator */}
                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() => onToggleScheduleItem(item.id)}
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                          >
                            {item.isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-slate-300 hover:border-emerald-500" />
                            )}
                            <span>{item.isCompleted ? 'Terverifikasi Selesai' : 'Tandai Selesai'}</span>
                          </button>

                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                            item.isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.isCompleted ? 'SELESAI' : 'DIJADWALKAN'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAMPILAN TABEL RESMI (Perekaman Capaian IKI TW III 2026) */}
        {scheduleViewMode === 'table' && (
          <div className="p-4 sm:p-5 bg-slate-50/60">
            <PerformanceAgendaTable
              scheduleItems={scheduleItems}
              onToggleScheduleItem={onToggleScheduleItem}
            />
          </div>
        )}

        {/* Announcement Footer Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-700 animate-pulse" />
            <div>
              <span className="font-extrabold text-slate-800">Diterbitkan oleh:</span>{' '}
              <span className="font-medium text-slate-600">Subbagian Penilaian Kinerja, Bagian Umum, Kanwil Ditjen Perbendaharaan.</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              onClick={() => onNavigate('pk-jadwal')}
              className="text-[#003366] hover:underline font-bold cursor-pointer text-[11px]"
            >
              Lihat di Modul Kinerja →
            </span>
          </div>
        </div>
      </section>

      {/* 4. AGENDA & KEGIATAN HARI INI (Matching reference screenshot) */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                AGENDA & KEGIATAN HARI INI
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                AUTOMATIC SYNC
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Jadwal otomatis kegiatan rapat, peminjaman ruangan, kendaraan dinas, dan inventaris aktif hari ini.
            </p>
          </div>

          <button
            onClick={() => onOpenUniversalModal('room')}
            className="px-3.5 py-1.5 bg-[#003366] hover:bg-[#002244] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>+ Buat Agenda Baru</span>
          </button>
        </div>

        {/* Filter Segmented Buttons (like in screenshot) */}
        <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedAgendaCategory('all')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                selectedAgendaCategory === 'all'
                  ? 'bg-[#002b49] text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Semua Agenda ({todayAgendas.length})
            </button>
            <button
              onClick={() => setSelectedAgendaCategory('rapat')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedAgendaCategory === 'rapat'
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <DoorOpen className="w-3 h-3" />
              <span>Rapat Ruangan ({countRapat})</span>
            </button>
            <button
              onClick={() => setSelectedAgendaCategory('kendaraan')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedAgendaCategory === 'kendaraan'
                  ? 'bg-indigo-700 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Car className="w-3 h-3" />
              <span>Kendaraan Dinas ({countKendaraan})</span>
            </button>
            <button
              onClick={() => setSelectedAgendaCategory('bmn')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedAgendaCategory === 'bmn'
                  ? 'bg-purple-700 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Package className="w-3 h-3" />
              <span>Inventaris Barang ({countBmn})</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            Status: <span className="text-emerald-700 font-bold">Terverifikasi Bagian Umum</span>
          </div>
        </div>

        {/* Agenda Cards Grid */}
        <div className="p-4 sm:p-5">
          {filteredAgendas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredAgendas.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-lg p-3.5 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wider text-[10px]">
                        {item.category === 'rapat' ? 'Ruang Rapat' : item.category === 'kendaraan' ? 'Mobil Dinas' : 'BMN / Sarana'}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">{item.time}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-xs line-clamp-2 mb-1.5">
                      {item.title}
                    </h3>

                    <div className="space-y-1 text-[11px] text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Info className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">PIC: {item.pic} ({item.division})</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {item.status}
                    </span>
                    <button
                      onClick={() => onNavigate(item.category === 'rapat' ? 'turt-ruangan' : item.category === 'kendaraan' ? 'turt-kendaraan' : 'turt-bmn')}
                      className="text-blue-700 hover:underline flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
                    >
                      <span>Detail</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <HelpCircle className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Belum ada agenda rapat atau peminjaman disetujui untuk kategori ini hari ini.
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Gunakan tombol "+ Buat Agenda Baru" untuk mengajukan ruangan, kendaraan, atau barang.
              </p>
              <button
                onClick={() => onOpenUniversalModal('room')}
                className="mt-4 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold cursor-pointer"
              >
                + Ajukan Sekarang
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
