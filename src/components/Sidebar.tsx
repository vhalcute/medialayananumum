import React, { useState } from 'react';
import {
  Search,
  MoreVertical,
  LayoutDashboard,
  DoorOpen,
  Car,
  Package,
  Wrench,
  FileSpreadsheet,
  Users,
  UserPlus,
  GraduationCap,
  Layers,
  BarChart3,
  Clock,
  Folder,
  ThumbsUp,
  Receipt,
  PiggyBank,
  PieChart,
  ClipboardCheck,
  Bell,
  Share2,
  ShieldCheck,
  KeyRound,
  LogOut
} from 'lucide-react';
import { ActiveTab, AppRole } from '../types';

interface SidebarProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  pendingRequestsCount?: {
    rooms: number;
    vehicles: number;
    tickets: number;
    atk: number;
  };
  onLogout?: (type: 'admin' | 'pegawai' | AppRole) => void;
  activeRole?: AppRole | 'pegawai' | 'kasubbag' | 'admin';
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  activeRole = 'Kanwil'
}) => {
  const [filterText, setFilterText] = useState('');

  const isRoleAdmin = activeRole === 'Admin' || activeRole === 'admin';
  const isRoleKppn = activeRole === 'KPPN' || activeRole === 'kppn';

  // Build menu sections based on role
  let menuSections: {
    title: string;
    items: { id: ActiveTab; label: string; icon: any }[];
  }[] = [];

  if (isRoleKppn) {
    // 2. User KPPN HANYA ditampilkan Informasi Capaian IKI, Cek Seribu, monitoring Employee Advocacy
    menuSections = [
      {
        title: 'LAYANAN SATKER KPPN',
        items: [
          { id: 'pk-jadwal' as ActiveTab, label: 'Informasi Capaian IKI TW III', icon: ClipboardCheck },
          { id: 'kepeg-seribu' as ActiveTab, label: 'Cek Seribu', icon: Search },
          { id: 'info-advocacy' as ActiveTab, label: 'Monitoring Employee Advocacy', icon: Share2 },
        ],
      },
    ];
  } else {
    // Kanwil and Admin general sections
    menuSections = [
      {
        title: 'SUBBAGIAN TURT',
        items: [
          { id: 'turt-ruangan' as ActiveTab, label: 'Peminjaman Ruangan', icon: DoorOpen },
          { id: 'turt-bmn' as ActiveTab, label: 'Peminjaman Barang', icon: Package },
          { id: 'turt-kendaraan' as ActiveTab, label: 'Peminjaman Kendaraan Dinas', icon: Car },
          { id: 'turt-perbaikan' as ActiveTab, label: 'Feedback Sarana Prasarana', icon: Wrench },
          { id: 'turt-atk' as ActiveTab, label: 'Permintaan Barang Persediaan', icon: FileSpreadsheet },
        ],
      },
      {
        title: 'SUBBAGIAN KEPEGAWAIAN',
        items: [
          { id: 'kepeg-gkm' as ActiveTab, label: 'Informasi GKM', icon: UserPlus },
          { id: 'kepeg-seribu' as ActiveTab, label: 'Cek Seribu', icon: Search },
          { id: 'kepeg-beasiswa' as ActiveTab, label: 'Informasi Beasiswa', icon: GraduationCap },
          { id: 'kepeg-tlego' as ActiveTab, label: 'T-LEGO', icon: Layers },
        ],
      },
      {
        title: 'SUBBAGIAN PENILAIAN KINERJA',
        items: [
          { id: 'pk-monitoring' as ActiveTab, label: 'Monitoring Kinerja', icon: BarChart3 },
          { id: 'pk-abk' as ActiveTab, label: 'Monitoring ABK', icon: Users },
          { id: 'pk-dams' as ActiveTab, label: 'Monitoring DAMS', icon: Clock },
          { id: 'pk-katalog' as ActiveTab, label: 'Katalog IKU / Katalog HKT', icon: Folder },
          { id: 'pk-feedback' as ActiveTab, label: 'Feedback Layanan Kinerja', icon: ThumbsUp },
          { id: 'pk-jadwal' as ActiveTab, label: 'Perekaman Capaian IKI TW III 2026', icon: ClipboardCheck },
        ],
      },
      {
        title: 'SUBBAGIAN KEUANGAN',
        items: [
          { id: 'keu-rencana' as ActiveTab, label: 'Rencana Lembur Tahun 2026', icon: Receipt },
          { id: 'keu-realisasi' as ActiveTab, label: 'Realisasi Anggaran Lembur', icon: PiggyBank },
          { id: 'keu-alokasi' as ActiveTab, label: 'Alokasi Lembur Per Bidang', icon: PieChart },
          { id: 'keu-realisasi-bidang' as ActiveTab, label: 'Realisasi Lembur Per Bidang', icon: BarChart3 },
        ],
      },
      {
        title: 'INFORMASI',
        items: [
          { id: 'info-advocacy' as ActiveTab, label: 'Monitoring Pengisian Employee Advocacy', icon: Share2 },
          { id: 'info-security' as ActiveTab, label: 'Pengawasan Penjagaan Security', icon: ShieldCheck },
        ],
      },
    ];

    // 1. Pengelolaan Akses Admin HANYA ditampilkan di menu admin, TIDAK untuk Kanwil dan KPPN
    if (isRoleAdmin) {
      menuSections.push({
        title: 'PENGELOLAAN AKSES ADMIN',
        items: [
          { id: 'admin-akses' as ActiveTab, label: 'Pengelolaan Akses Admin', icon: KeyRound },
        ],
      });
    }
  }

  return (
    <aside className="w-68 sm:w-72 bg-[#f8fafc] border-r border-slate-200 shrink-0 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto">
      <div className="p-3.5 space-y-3 flex-1">
        {/* 1. Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Layanan..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:border-[#003366] shadow-2xs"
          />
        </div>

        {/* 2. Dashboard Button */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`w-full rounded-xl px-3 py-2.5 flex items-center justify-between text-xs font-bold transition-all shadow-2xs cursor-pointer ${
            currentTab === 'dashboard'
              ? 'border-2 border-[#003366] bg-white text-[#003366] shadow-xs'
              : 'border border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2.5 truncate">
            <LayoutDashboard className="w-4 h-4 shrink-0 text-[#003366]" />
            <span className="truncate tracking-wide text-xs">DASHBOARD UTAMA</span>
          </div>
          <MoreVertical className="w-3.5 h-3.5 text-slate-300" />
        </button>

        {/* 3. Categorized Menu Sections */}
        {menuSections.map((section, idx) => {
          const visibleItems = section.items.filter(item =>
            filterText.trim() === '' ||
            item.label.toLowerCase().includes(filterText.toLowerCase())
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-1.5 pt-1">
              {/* Category Header */}
              <div className="text-[11px] font-bold text-slate-700 tracking-wider text-center py-1.5 uppercase">
                {section.title}
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {visibleItems.map(item => {
                  const Icon = item.icon;
                  // Handle tab mapping for aliases
                  const isActive = currentTab === item.id ||
                    (item.id === 'kepeg-gkm' && currentTab === 'kepeg-dkm') ||
                    (item.id === 'kepeg-seribu' && currentTab === 'kepeg-berkas') ||
                    (item.id === 'kepeg-tlego' && currentTab === 'kepeg-cuti') ||
                    (item.id === 'pk-abk' && currentTab === 'pk-rbk') ||
                    (item.id === 'pk-dams' && currentTab === 'pk-dsku') ||
                    (item.id === 'info-kegiatan' && currentTab === 'info-agenda') ||
                    (item.id === 'keu-realisasi-bidang' && currentTab === 'keu-alokasi');

                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full bg-white rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs transition-all shadow-2xs group cursor-pointer ${
                        isActive
                          ? 'border-2 border-[#003366] text-[#003366] font-semibold ring-1 ring-blue-900/10'
                          : 'border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-[#003366]' : 'text-slate-600 group-hover:text-slate-900'
                          }`}
                        />
                        <span className="truncate text-left text-xs font-medium">{item.label}</span>
                      </div>
                      <MoreVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 shrink-0 ml-1.5" />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* MENU LOGOUT SISTEM SESUAI KEWENANGAN */}
        <div className="pt-3 border-t border-slate-200 space-y-2 select-none">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center justify-between">
            <span>KELUAR SISTEM</span>
            <span className="text-[9px] font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded">
              Peran: {isRoleAdmin ? 'Admin' : isRoleKppn ? 'KPPN' : 'Kanwil'}
            </span>
          </div>

          {isRoleAdmin ? (
            /* Menu Logout Admin */
            <button
              onClick={() => onLogout?.('Admin')}
              className="w-full bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs text-rose-700 font-bold transition-all shadow-2xs group cursor-pointer"
              title="Logout dari akun Administrator"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4 text-rose-600 group-hover:translate-x-0.5 transition-transform" />
                <span>Logout Admin</span>
              </div>
              <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                Admin
              </span>
            </button>
          ) : isRoleKppn ? (
            /* Menu Logout KPPN */
            <button
              onClick={() => onLogout?.('KPPN')}
              className="w-full bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs text-emerald-800 font-bold transition-all shadow-2xs group cursor-pointer"
              title="Logout dari akun Satker KPPN"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                <span>Logout Satker KPPN</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                KPPN
              </span>
            </button>
          ) : (
            /* Menu Logout Kanwil */
            <button
              onClick={() => onLogout?.('Kanwil')}
              className="w-full bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs text-[#003366] font-bold transition-all shadow-2xs group cursor-pointer"
              title="Logout dari akun Pegawai Kanwil"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4 text-[#003366] group-hover:translate-x-0.5 transition-transform" />
                <span>Logout Pegawai Kanwil</span>
              </div>
              <span className="text-[10px] bg-blue-100 text-[#003366] px-2 py-0.5 rounded-full font-bold">
                Kanwil
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-200 bg-white text-[11px] text-slate-500">
        <div className="font-semibold text-slate-700">Kanwil DJPb Prov. Jambi</div>
        <p className="text-[10px] text-slate-400 mt-0.5">Media Layanan Umum</p>
      </div>
    </aside>
  );
};
