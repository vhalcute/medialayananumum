import React, { useState, useEffect } from 'react';
import {
  Users,
  CalendarDays,
  GraduationCap,
  FileCheck2,
  CheckCircle2,
  Clock,
  Award,
  AlertCircle,
  FileText,
  Search,
  BookOpen,
  Plus,
  Tv,
  MapPin,
  Calendar,
  Sparkles,
  Download,
  Filter
} from 'lucide-react';
import { ActiveTab, GkmItem } from '../../types';
import { INITIAL_GKM_DATA } from '../../data/mockData';
import { CekSeribuView } from './CekSeribuView';
import { InformasiBeasiswaView } from './InformasiBeasiswaView';
import { TlegoView } from './TlegoView';

interface KepegawaianViewProps {
  currentTab?: ActiveTab;
}

export const KepegawaianView: React.FC<KepegawaianViewProps> = ({ currentTab }) => {
  const [activeSubTab, setActiveSubTab] = useState<'gkm' | 'berkas' | 'beasiswa' | 'tlego'>('gkm');

  // GKM State
  const [gkmList, setGkmList] = useState<GkmItem[]>(() => {
    const saved = localStorage.getItem('mlu_jambi_gkm');
    return saved ? JSON.parse(saved) : INITIAL_GKM_DATA;
  });

  const [searchGkm, setSearchGkm] = useState('');
  const [showAddGkmForm, setShowAddGkmForm] = useState(false);

  // Form State for new GKM
  const [newRoomAndMedia, setNewRoomAndMedia] = useState('Aula Rangkayo Hitam (Hybrid Zoom)');
  const [newTitle, setNewTitle] = useState('');
  const [newSpeaker, setNewSpeaker] = useState('');
  const [newDate, setNewDate] = useState('2026-11-04');
  const [newStartTime, setNewStartTime] = useState('09:00 WIB');
  const [newEndTime, setNewEndTime] = useState('11:30 WIB');
  const [gkmSuccess, setGkmSuccess] = useState(false);

  // Sync sub-tab with active sidebar menu tab
  useEffect(() => {
    if (currentTab === 'kepeg-gkm' || currentTab === 'kepeg-dkm') {
      setActiveSubTab('gkm');
    } else if (currentTab === 'kepeg-seribu' || currentTab === 'kepeg-berkas') {
      setActiveSubTab('berkas');
    } else if (currentTab === 'kepeg-beasiswa') {
      setActiveSubTab('beasiswa');
    } else if (currentTab === 'kepeg-tlego' || currentTab === 'kepeg-cuti') {
      setActiveSubTab('tlego');
    }
  }, [currentTab]);

  useEffect(() => {
    localStorage.setItem('mlu_jambi_gkm', JSON.stringify(gkmList));
  }, [gkmList]);

  const handleAddGkmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSpeaker.trim()) return;

    const newGkmItem: GkmItem = {
      no: gkmList.length + 1,
      roomAndMedia: newRoomAndMedia,
      title: newTitle,
      speaker: newSpeaker,
      date: newDate,
      startTime: newStartTime.includes('WIB') ? newStartTime : `${newStartTime} WIB`,
      endTime: newEndTime.includes('WIB') ? newEndTime : `${newEndTime} WIB`,
      status: 'Dijadwalkan',
    };

    setGkmList([...gkmList, newGkmItem]);
    setGkmSuccess(true);
    setNewTitle('');
    setNewSpeaker('');
    setTimeout(() => {
      setGkmSuccess(false);
      setShowAddGkmForm(false);
    }, 2000);
  };

  const filteredGkm = gkmList.filter(item =>
    item.title.toLowerCase().includes(searchGkm.toLowerCase()) ||
    item.speaker.toLowerCase().includes(searchGkm.toLowerCase()) ||
    item.roomAndMedia.toLowerCase().includes(searchGkm.toLowerCase()) ||
    item.date.toLowerCase().includes(searchGkm.toLowerCase())
  );



  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700"></span>
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Subbagian Kepegawaian</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">Layanan Digital Kepegawaian Kanwil Jambi</h1>
          <p className="text-xs text-slate-500">
            Jadwal Gugus Kendali Mutu (GKM), Cek Seribu Presensi Kepegawaian, Informasi Beasiswa, dan Treasury Learning On The Go (TLEGO).
          </p>
        </div>

        {/* Sub-tabs switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveSubTab('gkm')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'gkm' ? 'bg-[#003366] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Informasi GKM
          </button>
          <button
            onClick={() => setActiveSubTab('berkas')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'berkas' ? 'bg-[#003366] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cek Seribu
          </button>
          <button
            onClick={() => setActiveSubTab('beasiswa')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'beasiswa' ? 'bg-[#003366] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Informasi Beasiswa
          </button>
          <button
            onClick={() => setActiveSubTab('tlego')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'tlego' ? 'bg-[#003366] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            T-LEGO
          </button>
        </div>
      </div>

      {/* Sub-tab 1: INFORMASI GKM (GUGUS KENDALI MUTU) */}
      {activeSubTab === 'gkm' && (
        <div className="space-y-4">
          {/* Action & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-900">
                <Users className="w-5 h-5 text-[#003366]" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                  INFORMASI GKM (GUGUS KENDALI MUTU)
                </h2>
                <p className="text-xs text-slate-500">
                  Agenda sosialisasi, internalisasi regulasi, dan peningkatan kompetensi pegawai Kanwil DJPb Prov. Jambi.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari Judul, Narasumber, Ruangan..."
                  value={searchGkm}
                  onChange={(e) => setSearchGkm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 w-56 sm:w-64 focus:outline-hidden focus:border-[#003366] focus:bg-white"
                />
              </div>

              <button
                onClick={() => setShowAddGkmForm(!showAddGkmForm)}
                className="px-3 py-1.5 bg-[#003366] hover:bg-[#002244] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-300" />
                <span>{showAddGkmForm ? 'Tutup Formulir' : '+ Tambah Jadwal GKM'}</span>
              </button>
            </div>
          </div>

          {/* Form Tambah GKM (Collapsible) */}
          {showAddGkmForm && (
            <form onSubmit={handleAddGkmSubmit} className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-700" />
                  <span>Entri Jadwal Gugus Kendali Mutu (GKM) Baru</span>
                </h3>
                <span className="text-[11px] text-slate-500">Subbagian Kepegawaian Kanwil Jambi</span>
              </div>

              {gkmSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Jadwal GKM berhasil ditambahkan ke daftar agenda Kanwil!</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ruangan dan Media *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Aula Rangkayo Hitam (Hybrid Zoom) / Ruang Rapat Utama"
                    value={newRoomAndMedia}
                    onChange={(e) => setNewRoomAndMedia(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-[#003366] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Narasumber *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rahmat Hidayat, S.E. (APN Ahli Muda)"
                    value={newSpeaker}
                    onChange={(e) => setNewSpeaker(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-[#003366] focus:outline-hidden"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Judul GKM *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Penguatan Budaya Integritas & Pengendalian Gratifikasi"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-[#003366] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal GKM *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 14 Oktober 2026 atau 2026-11-04"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-[#003366] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mulai Jam *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 09:00 WIB"
                      value={newStartTime}
                      onChange={(e) => setNewStartTime(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-[#003366] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Selesai Jam *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 11:30 WIB"
                      value={newEndTime}
                      onChange={(e) => setNewEndTime(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-[#003366] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddGkmForm(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  Simpan Jadwal GKM
                </button>
              </div>
            </form>
          )}

          {/* Table GKM with Exact Required Columns */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#003366] text-white text-[11px] font-bold tracking-wider uppercase">
                    <th className="py-3 px-3 text-center w-12 border-r border-blue-900/40">NO</th>
                    <th className="py-3 px-4 min-w-[200px] border-r border-blue-900/40">RUANGAN DAN MEDIA</th>
                    <th className="py-3 px-4 min-w-[280px] border-r border-blue-900/40">JUDUL GKM</th>
                    <th className="py-3 px-4 min-w-[180px] border-r border-blue-900/40">NARASUMBER</th>
                    <th className="py-3 px-4 min-w-[140px] text-center border-r border-blue-900/40">TANGGAL GKM</th>
                    <th className="py-3 px-3 min-w-[100px] text-center border-r border-blue-900/40">MULAI JAM</th>
                    <th className="py-3 px-3 min-w-[100px] text-center">SELESAI JAM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredGkm.length > 0 ? (
                    filteredGkm.map((item, index) => (
                      <tr key={item.no || index} className="hover:bg-blue-50/40 transition-colors">
                        {/* No */}
                        <td className="py-3.5 px-3 text-center font-bold text-slate-600 align-top border-r border-slate-100">
                          {index + 1}
                        </td>

                        {/* Ruangan dan Media */}
                        <td className="py-3.5 px-4 align-top border-r border-slate-100">
                          <div className="flex items-start gap-1.5">
                            <Tv className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                            <span className="font-semibold text-slate-800 leading-snug">
                              {item.roomAndMedia}
                            </span>
                          </div>
                        </td>

                        {/* Judul GKM */}
                        <td className="py-3.5 px-4 align-top border-r border-slate-100">
                          <div className="font-bold text-slate-900 text-xs leading-snug">
                            {item.title}
                          </div>
                          {item.notes && (
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                              {item.notes}
                            </p>
                          )}
                        </td>

                        {/* Narasumber */}
                        <td className="py-3.5 px-4 align-top border-r border-slate-100">
                          <div className="font-semibold text-slate-800">
                            {item.speaker}
                          </div>
                          <span className="text-[10px] text-slate-400">Pemateri Internal</span>
                        </td>

                        {/* Tanggal GKM */}
                        <td className="py-3.5 px-4 text-center align-top border-r border-slate-100">
                          <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 px-2.5 py-1 rounded text-xs font-medium">
                            <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
                            <span>{item.date}</span>
                          </div>
                        </td>

                        {/* Mulai Jam */}
                        <td className="py-3.5 px-3 text-center align-top border-r border-slate-100 font-mono text-slate-700 font-semibold">
                          <span className="inline-block bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                            {item.startTime}
                          </span>
                        </td>

                        {/* Selesai Jam */}
                        <td className="py-3.5 px-3 text-center align-top font-mono text-slate-700 font-semibold">
                          <span className="inline-block bg-slate-50 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                            {item.endTime}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-slate-500">
                        Tidak ada data Gugus Kendali Mutu yang sesuai dengan kata kunci pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Seluruh pegawai diwajibkan mengikuti GKM sesuai jadwal yang ditetapkan untuk pemenuhan jam pembelajaran KLC.</span>
              </div>
              <div className="font-bold text-slate-800">
                Total: {filteredGkm.length} Kegiatan GKM Terjadwal
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Cek Seribu */}
      {activeSubTab === 'berkas' && (
        <CekSeribuView />
      )}

      {/* Sub-tab 3: Beasiswa & Diklat */}
      {activeSubTab === 'beasiswa' && (
        <InformasiBeasiswaView />
      )}

      {/* Sub-tab 4: Treasury Learning On The Go (TLEGO) */}
      {activeSubTab === 'tlego' && (
        <TlegoView />
      )}
    </div>
  );
};
