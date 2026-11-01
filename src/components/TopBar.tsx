import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Clock, 
  Search, 
  Bell, 
  CheckCircle2, 
  UserCheck, 
  Sparkles, 
  ExternalLink,
  ChevronDown,
  Printer,
  LogOut
} from 'lucide-react';
import { ActiveTab, AppRole } from '../types';

interface TopBarProps {
  activeRole: AppRole;
  setActiveRole: (role: AppRole) => void;
  onNavigate: (tab: ActiveTab) => void;
  pendingCount: number;
  onOpenUniversalModal: () => void;
  onLogout?: (type: 'admin' | 'pegawai' | AppRole) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeRole,
  setActiveRole,
  onNavigate,
  pendingCount,
  onOpenUniversalModal,
  onLogout
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    return localStorage.getItem('mlu_custom_logo') || null;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const current = localStorage.getItem('mlu_custom_logo');
      if (current !== customLogo) {
        setCustomLogo(current);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [customLogo]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Jakarta'
      };
      setCurrentTime(new Intl.DateTimeFormat('id-ID', options).format(now) + ' WIB');
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const isRoleKppn = activeRole === 'KPPN';

  const generalSearchItems = [
    { label: 'Peminjaman Aula Rangkayo Hitam', tab: 'turt-ruangan' as ActiveTab, category: 'TURT Ruangan' },
    { label: 'Peminjaman Ruang Rapat Utama', tab: 'turt-ruangan' as ActiveTab, category: 'TURT Ruangan' },
    { label: 'Peminjaman Mobil Innova Reborn (BH 1024 ZQ)', tab: 'turt-kendaraan' as ActiveTab, category: 'TURT Kendaraan' },
    { label: 'Peminjaman Toyota Avanza (BH 1588 ZQ)', tab: 'turt-kendaraan' as ActiveTab, category: 'TURT Kendaraan' },
    { label: 'Katalog Barang Persediaan (ATK)', tab: 'turt-atk' as ActiveTab, category: 'TURT ATK' },
    { label: 'Lapor Kerusakan AC & Listrik (Helpdesk)', tab: 'turt-perbaikan' as ActiveTab, category: 'TURT Sarpras' },
    { label: 'Pinjam Kamera Humas & Proyektor BMN', tab: 'turt-bmn' as ActiveTab, category: 'TURT BMN' },
    { label: 'Informasi Perekaman Capaian IKI TW III', tab: 'pk-jadwal' as ActiveTab, category: 'Penilaian Kinerja' },
    { label: 'Monitoring Capaian IKU Kanwil Jambi', tab: 'pk-monitoring' as ActiveTab, category: 'Penilaian Kinerja' },
    { label: 'Realisasi Anggaran Lembur 2026', tab: 'keu-realisasi' as ActiveTab, category: 'Keuangan' },
    { label: 'Informasi GKM (Gugus Kendali Mutu)', tab: 'kepeg-gkm' as ActiveTab, category: 'Kepegawaian' },
    { label: 'Cek Seribu Berkas Kepegawaian', tab: 'kepeg-seribu' as ActiveTab, category: 'Kepegawaian' },
    { label: 'Monitoring Pengisian Employee Advocacy', tab: 'info-advocacy' as ActiveTab, category: 'Employee Advocacy' },
    { label: 'Pengajuan Cuti Online (T-LEGO)', tab: 'kepeg-tlego' as ActiveTab, category: 'Kepegawaian' },
  ];

  const kppnSearchItems = [
    { label: 'Informasi Perekaman Capaian IKI TW III 2026', tab: 'pk-jadwal' as ActiveTab, category: 'Penilaian Kinerja' },
    { label: 'Cek Seribu Berkas Kepegawaian', tab: 'kepeg-seribu' as ActiveTab, category: 'Kepegawaian' },
    { label: 'Monitoring Pengisian Employee Advocacy EA 11', tab: 'info-advocacy' as ActiveTab, category: 'Employee Advocacy' },
  ];

  const activeSearchList = isRoleKppn ? kppnSearchItems : generalSearchItems;

  const filteredSearch = searchQuery.trim() === '' ? [] : activeSearchList.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Running Announcement Ticker */}
      <div className="bg-[#002b49] text-amber-200 text-xs py-1.5 px-4 overflow-hidden border-b border-amber-500/20 select-none">
        <div className="flex items-center gap-3">
          <span className="shrink-0 bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
            INFO KANWIL
          </span>
          <div className="overflow-hidden whitespace-nowrap w-full">
            <div className="animate-marquee font-medium text-amber-100 flex items-center gap-8">
              <span>Selamat Datang di Portal Media Layanan Umum Kanwil DJPb Provinsi Jambi</span>
              <span>·</span>
              <span>Nilai-Nilai Kemenkeu: Integritas, Profesionalisme, Sinergi, Pelayanan, Kesempurnaan</span>
              <span>·</span>
              <span>Waktu Operasional Pelayanan: Senin - Jumat 07.30 s.d. 17.00 WIB</span>
              <span>·</span>
              <span>Layanan Kanwil DJPb Prov. Jambi Bebas Biaya & Tolak Gratifikasi (Zona Integritas WBK/WBBM)</span>
              <span>·</span>
              <span>Jadwal Pengunggahan Kinerja Triwulan III Aplikasi Intense paling lambat 28 Oktober 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Topbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-bold shadow-xs border border-slate-200 overflow-hidden p-1">
            <img 
              src={customLogo || '/assets/aistudio/Logo_Kemenkeu_eb9f3e65.png'} 
              alt="Logo Kanwil DJPb Prov. Jambi" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base tracking-tight">MEDIA LAYANAN UMUM</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-1.5 py-0.5 rounded border border-amber-300">
                KANWIL JAMBI
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Kanwil Ditjen Perbendaharaan Provinsi Jambi</p>
          </div>
        </div>

        {/* Center: Search & Status */}
        <div className="hidden md:flex items-center gap-4 flex-1 max-w-lg mx-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Cari layanan, ruangan, mobil, formulir, atau agenda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs rounded-lg border border-slate-200 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-all outline-hidden text-slate-800 placeholder-slate-400"
            />

            {/* Quick Search Dropdown */}
            {isSearchFocused && filteredSearch.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Hasil Pencarian Cepat
                </div>
                {filteredSearch.map((item, idx) => (
                  <button
                    key={idx}
                    onMouseDown={() => {
                      onNavigate(item.tab);
                      setSearchQuery('');
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between transition-colors"
                  >
                    <span className="text-xs font-medium text-slate-800">{item.label}</span>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Operational Status, Role Picker & Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Operational Status indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="font-semibold text-[11px]">Sistem Online</span>
            <span className="text-slate-300">|</span>
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <span className="font-mono text-[11px]">{currentTime || 'Memuat waktu...'}</span>
          </div>

          {/* Quick Action Button */}
          {!isRoleKppn ? (
            <button
              onClick={onOpenUniversalModal}
              className="px-3 py-2 bg-[#003366] hover:bg-[#002244] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>+ Ajukan Layanan</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('pk-jadwal')}
              className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Cek Capaian IKI</span>
            </button>
          )}

          {/* Role Switcher for Demo / Testing */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1.5 border border-slate-200 transition-colors"
              title="Ganti Mode Peran: Admin / Kanwil / KPPN"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-700" />
              <span className="capitalize hidden sm:inline font-bold">
                {activeRole}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-1 font-bold text-slate-400 text-[10px] uppercase border-b border-slate-100">
                  Simulasi Hak Akses
                </div>
                <button
                  onClick={() => { setActiveRole('Admin'); setShowRoleDropdown(false); }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 ${activeRole === 'Admin' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-700'}`}
                >
                  <div>
                    <div className="font-bold">Admin</div>
                    <div className="text-[10px] text-slate-500">Semua Layanan + Menu Pengelolaan Akses</div>
                  </div>
                  {activeRole === 'Admin' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />}
                </button>
                <button
                  onClick={() => { setActiveRole('Kanwil'); setShowRoleDropdown(false); }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 ${activeRole === 'Kanwil' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-700'}`}
                >
                  <div>
                    <div className="font-bold">Kanwil</div>
                    <div className="text-[10px] text-slate-500">Semua Layanan (Tanpa Menu Akses Admin)</div>
                  </div>
                  {activeRole === 'Kanwil' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />}
                </button>
                <button
                  onClick={() => { setActiveRole('KPPN'); setShowRoleDropdown(false); }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 ${activeRole === 'KPPN' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-700'}`}
                >
                  <div>
                    <div className="font-bold">KPPN</div>
                    <div className="text-[10px] text-slate-500">Hanya Capaian IKI, Cek Seribu, & Advocacy</div>
                  </div>
                  {activeRole === 'KPPN' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />}
                </button>

                <div className="px-3 py-1.5 font-bold text-slate-400 text-[10px] uppercase border-t border-b border-slate-100 mt-1">
                  Menu Keluar Sistem
                </div>
                <button
                  onClick={() => { setShowRoleDropdown(false); onLogout?.(activeRole); }}
                  className="w-full px-3 py-2 text-left flex items-center justify-between text-rose-700 hover:bg-rose-50 font-semibold transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    Logout / Keluar ({activeRole})
                  </span>
                  <span className="text-[9px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold">{activeRole}</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Header Logout Button */}
          <button
            onClick={() => onLogout?.(activeRole)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              activeRole === 'Admin'
                ? 'text-rose-700 hover:bg-rose-50 border-rose-200'
                : activeRole === 'KPPN'
                ? 'text-emerald-800 hover:bg-emerald-50 border-emerald-200'
                : 'text-[#003366] hover:bg-blue-50 border-blue-200'
            }`}
            title={`Logout / Keluar ${activeRole}`}
          >
            <LogOut className={`w-3.5 h-3.5 ${activeRole === 'Admin' ? 'text-rose-600' : activeRole === 'KPPN' ? 'text-emerald-700' : 'text-[#003366]'}`} />
            <span className="hidden md:inline">
              Keluar ({activeRole})
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
