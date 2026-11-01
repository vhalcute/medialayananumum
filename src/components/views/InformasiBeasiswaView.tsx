import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Calendar,
  Building2,
  Award,
  FileText,
  Search,
  Plus,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Filter,
  AlertCircle,
  X,
  Share2,
  BookmarkCheck,
  RotateCcw,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { BeasiswaItem } from '../../types';
import { INITIAL_BEASISWA_DATA } from '../../data/mockData';

export const InformasiBeasiswaView: React.FC = () => {
  // State for scholarship list with localStorage persistence
  const [scholarships, setScholarships] = useState<BeasiswaItem[]>(() => {
    const saved = localStorage.getItem('mlu_jambi_beasiswa');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved beasiswa data', e);
      }
    }
    return INITIAL_BEASISWA_DATA;
  });

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJenjang, setSelectedJenjang] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BeasiswaItem | null>(null);
  const [detailItem, setDetailItem] = useState<BeasiswaItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form states matching the requested fields
  const [formData, setFormData] = useState({
    namaProgram: '',
    penyelenggara: '',
    jenjangProgram: 'Magister (S2)',
    batasPendaftaran: '',
    deskripsiRincian: '',
    syaratKelayakanText: '', // Multi-line text (1 syarat per baris)
    status: 'Buka' as 'Buka' | 'Segera Ditutup' | 'Akan Datang',
    kategori: 'Kedinasan Kemenkeu' as 'Dalam Negeri' | 'Luar Negeri' | 'Kedinasan Kemenkeu' | 'Non-Gelar / Sertifikasi',
    linkPendaftaran: '',
    kuotaPerkiraan: ''
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('mlu_jambi_beasiswa', JSON.stringify(scholarships));
  }, [scholarships]);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      namaProgram: '',
      penyelenggara: '',
      jenjangProgram: 'Magister (S2)',
      batasPendaftaran: '',
      deskripsiRincian: '',
      syaratKelayakanText: '',
      status: 'Buka',
      kategori: 'Kedinasan Kemenkeu',
      linkPendaftaran: '',
      kuotaPerkiraan: ''
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (item: BeasiswaItem) => {
    setEditingItem(item);
    setFormData({
      namaProgram: item.namaProgram,
      penyelenggara: item.penyelenggara,
      jenjangProgram: item.jenjangProgram,
      batasPendaftaran: item.batasPendaftaran,
      deskripsiRincian: item.deskripsiRincian,
      syaratKelayakanText: item.syaratKelayakan.join('\n'),
      status: (item.status as any) || 'Buka',
      kategori: item.kategori || 'Kedinasan Kemenkeu',
      linkPendaftaran: item.linkPendaftaran || '',
      kuotaPerkiraan: item.kuotaPerkiraan || ''
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.namaProgram.trim() || !formData.penyelenggara.trim() || !formData.batasPendaftaran.trim()) {
      alert('Mohon lengkapi Nama Program, Penyelenggara, dan Batas Pendaftaran.');
      return;
    }

    // Split text into lines: 1 syarat per baris
    const rawLines = formData.syaratKelayakanText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const syaratList = rawLines.length > 0 ? rawLines : [
      'Pegawai ASN aktif di lingkungan Kanwil DJPb Provinsi Jambi.',
      'Mendapatkan persetujuan dan rekomendasi resmi dari atasan langsung / Kepala Kanwil.',
      'Memenuhi kriteria nilai kinerja SKP minimal "Baik" dalam 2 tahun terakhir.'
    ];

    if (editingItem) {
      // Update existing
      const updated = scholarships.map(item => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            namaProgram: formData.namaProgram,
            penyelenggara: formData.penyelenggara,
            jenjangProgram: formData.jenjangProgram,
            batasPendaftaran: formData.batasPendaftaran,
            deskripsiRincian: formData.deskripsiRincian,
            syaratKelayakan: syaratList,
            status: formData.status,
            kategori: formData.kategori,
            linkPendaftaran: formData.linkPendaftaran,
            kuotaPerkiraan: formData.kuotaPerkiraan
          };
        }
        return item;
      });
      setScholarships(updated);
      showToast('Program beasiswa berhasil diperbarui.');
    } else {
      // Create new
      const newItem: BeasiswaItem = {
        id: `bsw-${Date.now()}`,
        namaProgram: formData.namaProgram,
        penyelenggara: formData.penyelenggara,
        jenjangProgram: formData.jenjangProgram,
        batasPendaftaran: formData.batasPendaftaran,
        deskripsiRincian: formData.deskripsiRincian || 'Rincian program beasiswa dan layanan pengembangan kompetensi pegawai.',
        syaratKelayakan: syaratList,
        status: formData.status,
        kategori: formData.kategori,
        linkPendaftaran: formData.linkPendaftaran || 'https://klc2.kemenkeu.go.id',
        kuotaPerkiraan: formData.kuotaPerkiraan || 'Sesuai Ketetapan Panitia'
      };
      setScholarships([newItem, ...scholarships]);
      showToast('Program beasiswa baru berhasil ditambahkan.');
    }

    setIsFormModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setScholarships(scholarships.filter(item => item.id !== id));
    setDeleteConfirmId(null);
    showToast('Program beasiswa berhasil dihapus.');
  };

  const handleResetData = () => {
    if (window.confirm('Kembalikan daftar informasi beasiswa ke data awal resmi?')) {
      setScholarships(INITIAL_BEASISWA_DATA);
      showToast('Data beasiswa dikembalikan ke setelan awal.');
    }
  };

  // Filter items
  const filteredScholarships = scholarships.filter(item => {
    const matchSearch =
      item.namaProgram.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.penyelenggara.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jenjangProgram.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deskripsiRincian.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.syaratKelayakan.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchJenjang =
      selectedJenjang === 'Semua' ||
      item.jenjangProgram.toLowerCase().includes(selectedJenjang.toLowerCase());

    const matchStatus =
      selectedStatus === 'Semua' || item.status === selectedStatus;

    return matchSearch && matchJenjang && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#003366] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-blue-400/30 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

      {/* Main Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#003366] to-[#002244] flex items-center justify-center text-white shadow-sm shrink-0">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Subbagian Kepegawaian
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  Kanwil DJPb Provinsi Jambi
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                INFORMASI BEASISWA & PENGEMBANGAN KOMPETENSI
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Katalog resmi program beasiswa tugas belajar (S2/S3), izin belajar, dan sertifikasi profesi perbendaharaan negara.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Tambah Program Beasiswa</span>
            </button>
            <button
              onClick={handleResetData}
              title="Reset data ke standar awal"
              className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari program, penyelenggara, jenjang, atau syarat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#003366] focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-600">Jenjang:</span>
              <select
                value={selectedJenjang}
                onChange={(e) => setSelectedJenjang(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden focus:border-[#003366]"
              >
                <option value="Semua">Semua Jenjang</option>
                <option value="S2">Magister (S2)</option>
                <option value="S3">Doktor (S3)</option>
                <option value="Non-Gelar">Non-Gelar / Sertifikasi</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-600">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden focus:border-[#003366]"
              >
                <option value="Semua">Semua Status</option>
                <option value="Buka">Buka</option>
                <option value="Segera Ditutup">Segera Ditutup</option>
                <option value="Akan Datang">Akan Datang</option>
              </select>
            </div>

            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg ml-auto md:ml-0">
              Total: {filteredScholarships.length} Program
            </span>
          </div>
        </div>
      </div>

      {/* Scholarship Cards Grid */}
      <div className="space-y-5">
        {filteredScholarships.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-2xs">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">Tidak ada program beasiswa yang ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Coba sesuaikan kata kunci pencarian atau ubah filter jenjang dan status pendaftaran.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedJenjang('Semua');
                setSelectedStatus('Semua');
              }}
              className="mt-4 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          filteredScholarships.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Card Header with Nama Program & Status */}
              <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-[#003366]">
                        {item.kategori || 'Kedinasan Kemenkeu'}
                      </span>
                      {item.status === 'Buka' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                          Pendaftaran Buka
                        </span>
                      )}
                      {item.status === 'Segera Ditutup' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-700" />
                          Segera Ditutup
                        </span>
                      )}
                      {item.status === 'Akan Datang' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-indigo-700" />
                          Akan Datang
                        </span>
                      )}
                      {item.kuotaPerkiraan && (
                        <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                          {item.kuotaPerkiraan}
                        </span>
                      )}
                    </div>

                    {/* 1. Nama Program Beasiswa / Layanan */}
                    <div className="pt-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Nama Program Beasiswa / Layanan
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {item.namaProgram}
                      </h2>
                    </div>
                  </div>

                  {/* Actions: Edit, Delete */}
                  <div className="flex items-center gap-1.5 self-start sm:self-center shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      title="Ubah program beasiswa"
                      className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(item.id)}
                      title="Hapus program beasiswa"
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 2. Penyelenggara, 3. Jenjang Program, 4. Batas Pendaftaran Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100">
                  {/* Field 2: Penyelenggara */}
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold mb-0.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-700" />
                      <span>Penyelenggara</span>
                    </div>
                    <div className="font-bold text-slate-800 text-xs sm:text-sm">
                      {item.penyelenggara}
                    </div>
                  </div>

                  {/* Field 3: Jenjang Program */}
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold mb-0.5">
                      <Award className="w-3.5 h-3.5 text-indigo-700" />
                      <span>Jenjang Program</span>
                    </div>
                    <div className="font-bold text-slate-800 text-xs sm:text-sm">
                      {item.jenjangProgram}
                    </div>
                  </div>

                  {/* Field 4: Batas Pendaftaran */}
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold mb-0.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-700" />
                      <span>Batas Pendaftaran</span>
                    </div>
                    <div className="font-bold text-amber-800 text-xs sm:text-sm flex items-center gap-1.5">
                      <span>{item.batasPendaftaran}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body: 5. Deskripsi & Rincian Layanan + 6. Syarat Kelayakan Utama */}
              <div className="p-5 space-y-4">
                {/* Field 5: Deskripsi & Rincian Layanan */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-700" />
                    <span>Deskripsi & Rincian Layanan</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                    {item.deskripsiRincian}
                  </p>
                </div>

                {/* Field 6: Syarat Kelayakan Utama (1 Syarat per baris) */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                      <span>Syarat Kelayakan Utama (1 Syarat per baris)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {item.syaratKelayakan.length} Kriteria Wajib
                    </span>
                  </div>

                  {/* Strictly 1 Syarat per baris */}
                  <div className="bg-slate-50/90 rounded-xl border border-slate-200/80 p-3 sm:p-4 divide-y divide-slate-200/60">
                    {item.syaratKelayakan.map((syarat, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-2.5 text-xs text-slate-700 py-2.5 first:pt-0 last:pb-0`}
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 leading-relaxed font-normal">
                          {syarat}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Actions: Portal Link & Details */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Konsultasi berkas dan rekomendasi melalui Kasubbag Kepegawaian Kanwil Jambi.</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDetailItem(item)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#003366] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Lihat Rincian
                    </button>
                    {item.linkPendaftaran && (
                      <a
                        href={item.linkPendaftaran}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 text-xs font-bold text-white bg-[#003366] hover:bg-[#002244] rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <span>Portal Pendaftaran Resmi</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: Tambah / Edit Program Beasiswa */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl my-8 overflow-hidden animate-scale-in">
            <div className="p-5 bg-gradient-to-r from-[#003366] to-[#002244] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10 text-amber-300">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold">
                    {editingItem ? 'Ubah Informasi Program Beasiswa' : 'Tambah Program Beasiswa / Layanan Baru'}
                  </h3>
                  <p className="text-[11px] text-blue-100">
                    Lengkapi seluruh parameter informasi beasiswa pegawai sesuai petunjuk.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {/* Field 1: Nama Program Beasiswa / Layanan */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Nama Program Beasiswa / Layanan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Beasiswa LPDP Targeted PNS/TNI/POLRI Tahap I 2027"
                  value={formData.namaProgram}
                  onChange={(e) => setFormData({ ...formData, namaProgram: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-[#003366] font-medium"
                />
              </div>

              {/* Grid 2-kolom: Penyelenggara & Jenjang Program */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Field 2: Penyelenggara */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Penyelenggara *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: LPDP Kemenkeu RI / BPPK / DFAT Australia"
                    value={formData.penyelenggara}
                    onChange={(e) => setFormData({ ...formData, penyelenggara: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-[#003366]"
                  />
                </div>

                {/* Field 3: Jenjang Program */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Jenjang Program *
                  </label>
                  <select
                    value={formData.jenjangProgram}
                    onChange={(e) => setFormData({ ...formData, jenjangProgram: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-[#003366]"
                  >
                    <option value="Magister (S2)">Magister (S2)</option>
                    <option value="Doktor (S3)">Doktor (S3)</option>
                    <option value="Magister (S2) & Doktor (S3)">Magister (S2) & Doktor (S3)</option>
                    <option value="Non-Gelar / Sertifikasi Internasional">Non-Gelar / Sertifikasi Internasional</option>
                    <option value="Short Course / Pelatihan Khusus">Short Course / Pelatihan Khusus</option>
                  </select>
                </div>
              </div>

              {/* Grid 2-kolom: Batas Pendaftaran & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Field 4: Batas Pendaftaran */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Batas Pendaftaran *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 28 Februari 2027 atau 15 Desember 2026"
                    value={formData.batasPendaftaran}
                    onChange={(e) => setFormData({ ...formData, batasPendaftaran: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-[#003366]"
                  />
                </div>

                {/* Status Pendaftaran */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Status Pendaftaran
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-[#003366]"
                  >
                    <option value="Buka">Buka</option>
                    <option value="Segera Ditutup">Segera Ditutup</option>
                    <option value="Akan Datang">Akan Datang</option>
                  </select>
                </div>
              </div>

              {/* Field 5: Deskripsi & Rincian Layanan */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Deskripsi & Rincian Layanan *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Rincian pendanaan, cakupan beasiswa (SPP, biaya hidup, tiket, visa), universitas tujuan, dan orientasi lulusan..."
                  value={formData.deskripsiRincian}
                  onChange={(e) => setFormData({ ...formData, deskripsiRincian: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-[#003366]"
                />
              </div>

              {/* Field 6: Syarat Kelayakan Utama (1 Syarat per baris) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Syarat Kelayakan Utama (1 Syarat per baris) *</span>
                  </label>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    1 baris = 1 butir syarat
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-1.5">
                  Tuliskan setiap syarat kelayakan pada baris terpisah. Tekan tombol <kbd className="px-1.5 py-0.5 bg-slate-200 rounded font-mono text-[10px]">Enter</kbd> untuk berpindah ke butir syarat berikutnya.
                </p>
                <textarea
                  rows={6}
                  required
                  placeholder={`Contoh penulisan:\nPegawai Negeri Sipil aktif dengan masa kerja minimal 2 tahun.\nIPK jenjang sebelumnya minimal 3.00 pada skala 4.00.\nSkor TOEFL ITP minimal 500 atau IELTS minimal 6.0.\nMendapatkan Surat Usulan dari Sekretaris Ditjen Perbendaharaan.`}
                  value={formData.syaratKelayakanText}
                  onChange={(e) => setFormData({ ...formData, syaratKelayakanText: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono text-[11px] leading-relaxed focus:outline-hidden focus:border-[#003366]"
                />
              </div>

              {/* Optional Fields: Link & Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Tautan Pendaftaran Resmi (URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://beasiswalpdp.kemenkeu.go.id"
                    value={formData.linkPendaftaran}
                    onChange={(e) => setFormData({ ...formData, linkPendaftaran: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-[#003366]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Kategori Program
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:border-[#003366]"
                  >
                    <option value="Kedinasan Kemenkeu">Kedinasan Kemenkeu</option>
                    <option value="Dalam Negeri">Dalam Negeri</option>
                    <option value="Luar Negeri">Luar Negeri</option>
                    <option value="Non-Gelar / Sertifikasi">Non-Gelar / Sertifikasi</option>
                  </select>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#003366] hover:bg-[#002244] text-white rounded-xl font-bold shadow-sm transition-colors cursor-pointer"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Terbitkan Program Beasiswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Konfirmasi Hapus */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-sm w-full space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-900 text-sm">Hapus Informasi Beasiswa?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Data program ini akan dihapus dari katalog informasi beasiswa pegawai.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Rincian Lengkap */}
      {detailItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl my-8 overflow-hidden animate-scale-in">
            <div className="p-5 bg-[#003366] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10 text-amber-300">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                    Rincian Lengkap Beasiswa
                  </span>
                  <h3 className="text-sm sm:text-base font-bold leading-tight">
                    {detailItem.namaProgram}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setDetailItem(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Penyelenggara</div>
                  <div className="font-bold text-slate-800 text-xs mt-0.5">{detailItem.penyelenggara}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Jenjang Program</div>
                  <div className="font-bold text-slate-800 text-xs mt-0.5">{detailItem.jenjangProgram}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Batas Pendaftaran</div>
                  <div className="font-bold text-amber-800 text-xs mt-0.5">{detailItem.batasPendaftaran}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-700" />
                  <span>Deskripsi & Rincian Layanan:</span>
                </h4>
                <p className="text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                  {detailItem.deskripsiRincian}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                  <span>Syarat Kelayakan Utama (1 Syarat per baris):</span>
                </h4>
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
                  {detailItem.syaratKelayakan.map((syarat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="flex-1 leading-relaxed">{syarat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setDetailItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Tutup
              </button>
              {detailItem.linkPendaftaran && (
                <a
                  href={detailItem.linkPendaftaran}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#003366] hover:bg-[#002244] rounded-xl flex items-center gap-1.5"
                >
                  <span>Kunjungi Portal Resmi</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
