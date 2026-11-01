import React, { useState, useEffect } from 'react';
import {
  Share2,
  ShieldCheck,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  FileSpreadsheet,
  Printer,
  X,
  AlertCircle,
  Eye,
  Camera,
  Calendar,
  UserCheck,
  ShieldAlert,
  Building,
  Check,
  ThumbsUp
} from 'lucide-react';
import { ActiveTab, EmployeeAdvocacyRecord, SecurityMonitoringRecord } from '../../types';
import { EmployeeAdvocacyMonitoringView } from './EmployeeAdvocacyMonitoringView';

interface InformasiViewProps {
  currentTab?: ActiveTab;
}

const INITIAL_ADVOCACY_DATA: EmployeeAdvocacyRecord[] = [
  {
    id: 'adv-01',
    namaPegawai: 'Abdul Hafid, S.E.',
    nip: '19890412 201212 1 001',
    bidang: 'Bidang PPA I',
    platform: 'Instagram',
    judulKampanye: 'Diseminasi APBN KiTa Regional Jambi Edisi Oktober 2026',
    linkUnggahan: 'https://instagram.com/p/DBxy123456',
    tanggalUnggah: '2026-10-28',
    statusPengisian: 'Sudah Mengisi',
    statusVerifikasi: 'Terverifikasi'
  },
  {
    id: 'adv-02',
    namaPegawai: 'Abil Fikri Audia, S.Tr.Ak.',
    nip: '19950718 201801 1 002',
    bidang: 'Bidang PAPK',
    platform: 'LinkedIn',
    judulKampanye: 'Kawal Akuntabilitas LKPD & Penguatan Regional Chief Economist',
    linkUnggahan: 'https://linkedin.com/feed/update/urn:li:share:7123984',
    tanggalUnggah: '2026-10-27',
    statusPengisian: 'Sudah Mengisi',
    statusVerifikasi: 'Terverifikasi'
  },
  {
    id: 'adv-03',
    namaPegawai: 'Achmad Djunaidi, M.Ak.',
    nip: '19841103 200602 1 003',
    bidang: 'Bagian Umum',
    platform: 'Facebook',
    judulKampanye: 'Sosialisasi Antigratifikasi & Pembangunan Zona Integritas WBBM',
    linkUnggahan: 'https://facebook.com/djpb.jambi/posts/9918237',
    tanggalUnggah: '2026-10-29',
    statusPengisian: 'Sudah Mengisi',
    statusVerifikasi: 'Terverifikasi'
  },
  {
    id: 'adv-04',
    namaPegawai: 'Ade Wahyu Susanto',
    nip: '19920315 201402 1 001',
    bidang: 'Bidang SKKI',
    platform: 'X (Twitter)',
    judulKampanye: 'Dukungan Pembiayaan UMKM Melalui KUR dan UMi Berkelanjutan',
    linkUnggahan: 'https://x.com/djpbjambi/status/1718293847',
    tanggalUnggah: '2026-10-29',
    statusPengisian: 'Sudah Mengisi',
    statusVerifikasi: 'Terverifikasi'
  },
  {
    id: 'adv-05',
    namaPegawai: 'Ahmad Nauval',
    nip: '19980621 202012 1 002',
    bidang: 'Bidang PPA II',
    platform: 'Instagram',
    judulKampanye: 'Penyaluran DAK Fisik & Dana Desa untuk Pemerataan Daerah',
    linkUnggahan: 'https://instagram.com/p/DB98234710',
    tanggalUnggah: '2026-10-30',
    statusPengisian: 'Sudah Mengisi',
    statusVerifikasi: 'Menunggu'
  },
  {
    id: 'adv-06',
    namaPegawai: 'Ahmad Triyadi',
    nip: '19870914 201012 1 002',
    bidang: 'Bagian Umum',
    platform: 'Instagram',
    judulKampanye: 'Pekan Integritas Kemenkeu Tepercaya 2026',
    linkUnggahan: '',
    tanggalUnggah: '-',
    statusPengisian: 'Belum Mengisi',
    statusVerifikasi: 'Menunggu'
  },
  {
    id: 'adv-07',
    namaPegawai: 'Ahmad Widyarma, S.E.',
    nip: '19910219 201311 1 001',
    bidang: 'Bidang PAPK',
    platform: 'LinkedIn',
    judulKampanye: 'Transformasi Digital Treasury SAKTI & SPAN Modern',
    linkUnggahan: 'https://linkedin.com/feed/update/urn:li:share:7182931',
    tanggalUnggah: '2026-10-28',
    statusPengisian: 'Sudah Mengisi',
    statusVerifikasi: 'Terverifikasi'
  },
  {
    id: 'adv-08',
    namaPegawai: 'Aidil Fajri',
    nip: '19940809 201602 1 001',
    bidang: 'Bidang PPA I',
    platform: 'Instagram',
    judulKampanye: 'Harmonisasi Kebijakan Fiskal Daerah & Spending Better',
    linkUnggahan: '',
    tanggalUnggah: '-',
    statusPengisian: 'Belum Mengisi',
    statusVerifikasi: 'Menunggu'
  }
];

const INITIAL_SECURITY_DATA: SecurityMonitoringRecord[] = [
  {
    id: 'sec-01',
    tanggal: '2026-10-31',
    shift: 'Pagi (07:00 - 15:00)',
    danru: 'M. Syahroni (Danru Regu A)',
    personelCount: 4,
    posJaga: ['Pos Gerbang Utama', 'Lobby Frontdesk', 'Parkir Barat', 'Area Server / Ruang Khusus'],
    kondisiKeamanan: 'Aman & Terkendali',
    catatanMutasi: 'Kondisi gerbang dan akses lobby tertib. Tamu kedinasan satker 14 orang terverifikasi buku tamu digital. Pengecekan genset & APAR normal.',
    cctvStatus: 'Normal (100%)',
    verifikator: 'Kasubbag TURT'
  },
  {
    id: 'sec-02',
    tanggal: '2026-10-30',
    shift: 'Malam (23:00 - 07:00)',
    danru: 'Bambang Irawan (Danru Regu C)',
    personelCount: 3,
    posJaga: ['Pos Gerbang Utama', 'Patroli Keliling Gedung', 'Ruang Server IT', 'Gudang BMN'],
    kondisiKeamanan: 'Aman & Terkendali',
    catatanMutasi: 'Patroli putaran 1 pukul 01:00 WIB, putaran 2 pukul 03:30 WIB seluruh pintu lantai 1-3 terkunci rapat. Lampu penerangan keliling menyala prima.',
    cctvStatus: 'Normal (100%)',
    verifikator: 'Kasubbag TURT'
  },
  {
    id: 'sec-03',
    tanggal: '2026-10-30',
    shift: 'Siang (15:00 - 23:00)',
    danru: 'Rian Kurniawan (Danru Regu B)',
    personelCount: 4,
    posJaga: ['Pos Gerbang Utama', 'Lobby Frontdesk', 'Area Parkir', 'Pintu Samping'],
    kondisiKeamanan: 'Aman & Terkendali',
    catatanMutasi: 'Pukul 17:30 WIB seluruh pegawai telah pulang kantor, gerbang samping ditutup. Kendaraan dinas operasional terparkir rapi dan kunci tersimpan di brankas pos jaga.',
    cctvStatus: 'Normal (100%)',
    verifikator: 'Kasubbag TURT'
  },
  {
    id: 'sec-04',
    tanggal: '2026-10-29',
    shift: 'Malam (23:00 - 07:00)',
    danru: 'M. Syahroni (Danru Regu A)',
    personelCount: 3,
    posJaga: ['Pos Gerbang Utama', 'Patroli Gedung', 'Ruang Server IT'],
    kondisiKeamanan: 'Tertib',
    catatanMutasi: 'Hujan lebat mulai pukul 02:15 WIB, saluran air dan atap diperiksa tidak ada kebocoran. Suhu ruang server 19°C (normal).',
    cctvStatus: 'Normal (100%)',
    verifikator: 'Kasubbag TURT'
  }
];

export const InformasiView: React.FC<InformasiViewProps> = ({ currentTab }) => {
  const [activeSubTab, setActiveSubTab] = useState<'advocacy' | 'security'>('advocacy');

  // Advocacy States
  const [advocacyList, setAdvocacyList] = useState<EmployeeAdvocacyRecord[]>(() => {
    const saved = localStorage.getItem('mlu_jambi_advocacy');
    return saved ? JSON.parse(saved) : INITIAL_ADVOCACY_DATA;
  });
  const [searchAdvocacy, setSearchAdvocacy] = useState('');
  const [filterStatusAdvocacy, setFilterStatusAdvocacy] = useState<string>('Semua');
  const [filterBidangAdvocacy, setFilterBidangAdvocacy] = useState<string>('Semua');
  const [isAddAdvocacyModalOpen, setIsAddAdvocacyModalOpen] = useState(false);

  // Security States
  const [securityList, setSecurityList] = useState<SecurityMonitoringRecord[]>(() => {
    const saved = localStorage.getItem('mlu_jambi_security');
    return saved ? JSON.parse(saved) : INITIAL_SECURITY_DATA;
  });
  const [searchSecurity, setSearchSecurity] = useState('');
  const [isAddSecurityModalOpen, setIsAddSecurityModalOpen] = useState(false);

  // Form New Advocacy
  const [newAdvocacy, setNewAdvocacy] = useState({
    namaPegawai: '',
    nip: '',
    bidang: 'Bagian Umum',
    platform: 'Instagram' as 'Instagram' | 'LinkedIn' | 'X (Twitter)' | 'Facebook' | 'TikTok',
    judulKampanye: 'Diseminasi APBN KiTa Regional Jambi Edisi Oktober 2026',
    linkUnggahan: ''
  });

  // Form New Security
  const [newSecurity, setNewSecurity] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    shift: 'Pagi (07:00 - 15:00)' as any,
    danru: 'M. Syahroni (Danru Regu A)',
    personelCount: 4,
    posJaga: 'Pos Gerbang Utama, Lobby Frontdesk, Parkiran, Ruang Server',
    kondisiKeamanan: 'Aman & Terkendali' as any,
    catatanMutasi: 'Kondisi lingkungan kantor aman, tertib, dan seluruh akses terkontrol.',
    cctvStatus: 'Normal (100%)' as any
  });

  // Sync sub-tab with active sidebar menu tab
  useEffect(() => {
    if (currentTab === 'info-security') {
      setActiveSubTab('security');
    } else if (currentTab === 'info-advocacy' || currentTab === 'info-evaluasi' || currentTab === 'info-kegiatan') {
      setActiveSubTab('advocacy');
    }
  }, [currentTab]);

  useEffect(() => {
    localStorage.setItem('mlu_jambi_advocacy', JSON.stringify(advocacyList));
  }, [advocacyList]);

  useEffect(() => {
    localStorage.setItem('mlu_jambi_security', JSON.stringify(securityList));
  }, [securityList]);

  // Handle Add Advocacy
  const handleAddAdvocacySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdvocacy.namaPegawai.trim() || !newAdvocacy.nip.trim()) {
      alert('Mohon isi nama pegawai dan NIP.');
      return;
    }

    const newItem: EmployeeAdvocacyRecord = {
      id: `adv-${Date.now()}`,
      namaPegawai: newAdvocacy.namaPegawai,
      nip: newAdvocacy.nip,
      bidang: newAdvocacy.bidang,
      platform: newAdvocacy.platform,
      judulKampanye: newAdvocacy.judulKampanye,
      linkUnggahan: newAdvocacy.linkUnggahan || 'https://instagram.com/djpbjambi',
      tanggalUnggah: new Date().toISOString().split('T')[0],
      statusPengisian: newAdvocacy.linkUnggahan ? 'Sudah Mengisi' : 'Belum Mengisi',
      statusVerifikasi: 'Terverifikasi'
    };

    setAdvocacyList([newItem, ...advocacyList]);
    setIsAddAdvocacyModalOpen(false);
    setNewAdvocacy({
      namaPegawai: '',
      nip: '',
      bidang: 'Bagian Umum',
      platform: 'Instagram',
      judulKampanye: 'Diseminasi APBN KiTa Regional Jambi Edisi Oktober 2026',
      linkUnggahan: ''
    });
  };

  // Handle Add Security Log
  const handleAddSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: SecurityMonitoringRecord = {
      id: `sec-${Date.now()}`,
      tanggal: newSecurity.tanggal,
      shift: newSecurity.shift,
      danru: newSecurity.danru,
      personelCount: Number(newSecurity.personelCount),
      posJaga: newSecurity.posJaga.split(',').map(s => s.trim()),
      kondisiKeamanan: newSecurity.kondisiKeamanan,
      catatanMutasi: newSecurity.catatanMutasi,
      cctvStatus: newSecurity.cctvStatus,
      verifikator: 'Kasubbag TURT'
    };

    setSecurityList([newItem, ...securityList]);
    setIsAddSecurityModalOpen(false);
  };

  // Filtered Advocacy
  const filteredAdvocacy = advocacyList.filter(item => {
    const matchSearch =
      item.namaPegawai.toLowerCase().includes(searchAdvocacy.toLowerCase()) ||
      item.nip.includes(searchAdvocacy) ||
      item.judulKampanye.toLowerCase().includes(searchAdvocacy.toLowerCase());
    const matchStatus = filterStatusAdvocacy === 'Semua' || item.statusPengisian === filterStatusAdvocacy;
    const matchBidang = filterBidangAdvocacy === 'Semua' || item.bidang === filterBidangAdvocacy;
    return matchSearch && matchStatus && matchBidang;
  });

  const totalAdvocacy = advocacyList.length;
  const sudahMengisiCount = advocacyList.filter(i => i.statusPengisian === 'Sudah Mengisi').length;
  const belumMengisiCount = totalAdvocacy - sudahMengisiCount;
  const persentasePartisipasi = totalAdvocacy > 0 ? Math.round((sudahMengisiCount / totalAdvocacy) * 100) : 0;

  return (
    <div className="space-y-6 pb-10">
      {/* Top Header & Sub-tab navigation */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700"></span>
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              INFORMASI KANWIL DJPB PROVINSI JAMBI
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Layanan Monitoring & Pengawasan Internal
          </h1>
          <p className="text-xs text-slate-500">
            Monitoring Pengisian Employee Advocacy dan Pengawasan Penjagaan Security Kantor.
          </p>
        </div>

        {/* Sub-tabs switcher buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveSubTab('advocacy')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'advocacy' ? 'bg-[#003366] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Monitoring Employee Advocacy</span>
          </button>
          <button
            onClick={() => setActiveSubTab('security')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'security' ? 'bg-[#003366] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pengawasan Penjagaan Security</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: MONITORING PENGISIAN EMPLOYEE ADVOCACY */}
      {/* ========================================================================= */}
      {activeSubTab === 'advocacy' && (
        <EmployeeAdvocacyMonitoringView />
      )}


      {/* ========================================================================= */}
      {/* SUB-TAB 2: PENGAWASAN PENJAGAAN SECURITY */}
      {/* ========================================================================= */}
      {activeSubTab === 'security' && (
        <div className="space-y-5">
          {/* Security Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Status Keamanan Kantor
              </div>
              <div className="text-2xl font-black text-emerald-800 font-mono mt-1 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span>KONDUSIF</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Laporan jaga 24 jam nihil insiden
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                Pos Jaga Terpantau
              </div>
              <div className="text-3xl font-black text-[#003366] font-mono mt-1">
                5 Pos Aktif
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Gerbang, Lobby, Server, Parkir, Gudang
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                CCTV Surveillance
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono mt-1">
                32 / 32 Online
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                100% Titik Pantau Berfungsi Normal
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Regu Jaga Aktif Hari Ini
              </div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                Regu A (Danru Syahroni)
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                4 Personel Security Siaga Penuh
              </div>
            </div>
          </div>

          {/* Table Security */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Header & Action Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                    BUKU MUTASI & PENGAWASAN PENJAGAAN SECURITY KANTOR
                  </h2>
                  <p className="text-xs text-slate-500">
                    Log harian regu pengamanan, pengecekan instalasi penting, dan ronda keliling Kanwil DJPb.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddSecurityModalOpen(true)}
                  className="px-3.5 py-2 bg-[#003366] hover:bg-[#002244] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>+ Catat Mutasi Jaga Baru</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#111827] text-white text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-3 text-center border-r border-slate-700/60 w-12">NO</th>
                    <th className="py-3 px-4 border-r border-slate-700/60">TANGGAL & SHIFT</th>
                    <th className="py-3 px-4 border-r border-slate-700/60">KOMANDAN REGU (DANRU)</th>
                    <th className="py-3 px-4 border-r border-slate-700/60">POS JAGA DIAWASI</th>
                    <th className="py-3 px-3 text-center border-r border-slate-700/60">KONDISI</th>
                    <th className="py-3 px-5 border-r border-slate-700/60">CATATAN BUKU MUTASI</th>
                    <th className="py-3 px-3 text-center">VERIFIKASI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {securityList.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 text-center font-bold text-slate-600 border-r border-slate-100">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 border-r border-slate-100">
                        <div className="font-bold text-slate-900">{row.tanggal}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{row.shift}</div>
                      </td>
                      <td className="py-3 px-4 border-r border-slate-100">
                        <div className="font-bold text-slate-900">{row.danru}</div>
                        <div className="text-[10px] text-slate-400 font-semibold">{row.personelCount} Personel Jaga</div>
                      </td>
                      <td className="py-3 px-4 border-r border-slate-100">
                        <div className="flex flex-wrap gap-1">
                          {row.posJaga.map((pos, pIdx) => (
                            <span key={pIdx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                              {pos}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center border-r border-slate-100">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {row.kondisiKeamanan}
                        </span>
                      </td>
                      <td className="py-3 px-5 border-r border-slate-100 max-w-md leading-relaxed text-slate-600">
                        {row.catatanMutasi}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-emerald-700 font-bold text-[11px] flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{row.verifikator}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Pemeriksaan fisik sarpras kantor dan ronda malam dilaksanakan minimal 3 kali setiap shift.</span>
              </div>
              <div className="font-bold text-slate-800">
                Total Catatan: {securityList.length} Mutasi Terdaftar
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Entri Bukti Advocacy */}
      {/* ========================================================================= */}
      {isAddAdvocacyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
            <div className="p-5 bg-gradient-to-r from-[#003366] to-[#002244] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Share2 className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Entri Bukti Employee Advocacy</h3>
              </div>
              <button
                onClick={() => setIsAddAdvocacyModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAdvocacySubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Nama Pegawai *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rahmat Hidayat, S.E."
                  value={newAdvocacy.namaPegawai}
                  onChange={(e) => setNewAdvocacy({ ...newAdvocacy, namaPegawai: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">NIP *</label>
                  <input
                    type="text"
                    required
                    placeholder="19880512 201012 1 002"
                    value={newAdvocacy.nip}
                    onChange={(e) => setNewAdvocacy({ ...newAdvocacy, nip: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Bagian / Bidang *</label>
                  <select
                    value={newAdvocacy.bidang}
                    onChange={(e) => setNewAdvocacy({ ...newAdvocacy, bidang: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Bagian Umum">Bagian Umum</option>
                    <option value="Bidang PPA I">Bidang PPA I</option>
                    <option value="Bidang PPA II">Bidang PPA II</option>
                    <option value="Bidang PAPK">Bidang PAPK</option>
                    <option value="Bidang SKKI">Bidang SKKI</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Judul Kampanye / Publikasi *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Diseminasi APBN KiTa Regional Jambi Edisi Oktober 2026"
                  value={newAdvocacy.judulKampanye}
                  onChange={(e) => setNewAdvocacy({ ...newAdvocacy, judulKampanye: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Platform Media Sosial *</label>
                  <select
                    value={newAdvocacy.platform}
                    onChange={(e) => setNewAdvocacy({ ...newAdvocacy, platform: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="X (Twitter)">X (Twitter)</option>
                    <option value="Facebook">Facebook</option>
                    <option value="TikTok">TikTok</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Tautan Unggahan (URL)</label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/p/..."
                    value={newAdvocacy.linkUnggahan}
                    onChange={(e) => setNewAdvocacy({ ...newAdvocacy, linkUnggahan: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAdvocacyModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#003366] hover:bg-[#002244] text-white rounded-xl font-bold"
                >
                  Simpan Bukti Advocacy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Catat Mutasi Security */}
      {/* ========================================================================= */}
      {isAddSecurityModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Catat Buku Mutasi & Penjagaan Security</h3>
              </div>
              <button
                onClick={() => setIsAddSecurityModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSecuritySubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Tanggal *</label>
                  <input
                    type="date"
                    required
                    value={newSecurity.tanggal}
                    onChange={(e) => setNewSecurity({ ...newSecurity, tanggal: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Shift Jaga *</label>
                  <select
                    value={newSecurity.shift}
                    onChange={(e) => setNewSecurity({ ...newSecurity, shift: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Pagi (07:00 - 15:00)">Pagi (07:00 - 15:00)</option>
                    <option value="Siang (15:00 - 23:00)">Siang (15:00 - 23:00)</option>
                    <option value="Malam (23:00 - 07:00)">Malam (23:00 - 07:00)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Komandan Regu (Danru) *</label>
                  <input
                    type="text"
                    required
                    value={newSecurity.danru}
                    onChange={(e) => setNewSecurity({ ...newSecurity, danru: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Jumlah Personel *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={newSecurity.personelCount}
                    onChange={(e) => setNewSecurity({ ...newSecurity, personelCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Pos Jaga yang Diawasi (Pisahkan Koma) *</label>
                <input
                  type="text"
                  required
                  value={newSecurity.posJaga}
                  onChange={(e) => setNewSecurity({ ...newSecurity, posJaga: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Kondisi Keamanan *</label>
                <select
                  value={newSecurity.kondisiKeamanan}
                  onChange={(e) => setNewSecurity({ ...newSecurity, kondisiKeamanan: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Aman & Terkendali">Aman & Terkendali</option>
                  <option value="Tertib">Tertib</option>
                  <option value="Insiden / Perhatian Khusus">Insiden / Perhatian Khusus</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Catatan Buku Mutasi / Kejadian *</label>
                <textarea
                  rows={3}
                  required
                  value={newSecurity.catatanMutasi}
                  onChange={(e) => setNewSecurity({ ...newSecurity, catatanMutasi: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSecurityModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold"
                >
                  Simpan Laporan Jaga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
