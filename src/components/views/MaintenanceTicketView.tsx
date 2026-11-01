import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle2,
  MapPin,
  Search,
  Filter,
  Check,
  Zap,
  Droplets,
  Wind,
  Armchair,
  Wifi,
  Building
} from 'lucide-react';
import { MaintenanceTicket } from '../../types';

interface MaintenanceTicketViewProps {
  tickets: MaintenanceTicket[];
  onAddTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'submittedAt'>) => void;
  onUpdateStatus: (id: string, status: MaintenanceTicket['status'], note?: string) => void;
  activeRole: 'pegawai' | 'kasubbag' | 'admin';
}

export const MaintenanceTicketView: React.FC<MaintenanceTicketViewProps> = ({
  tickets,
  onAddTicket,
  onUpdateStatus,
  activeRole,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<MaintenanceTicket['category']>('AC / Tata Udara');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<MaintenanceTicket['priority']>('Sedang');
  const [reporterName, setReporterName] = useState('');
  const [division, setDivision] = useState('Bidang PPA I');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !reporterName) return;

    onAddTicket({
      category,
      location,
      title,
      description,
      priority,
      reporterName,
      division,
      status: 'Menunggu',
    });

    setTitle('');
    setLocation('');
    setDescription('');
    setReporterName('');
    setShowForm(false);
  };

  const getCategoryIcon = (cat: MaintenanceTicket['category']) => {
    switch (cat) {
      case 'AC / Tata Udara': return <Wind className="w-4 h-4 text-cyan-600" />;
      case 'Kelistrikan & Lampu': return <Zap className="w-4 h-4 text-amber-500" />;
      case 'Plumbing & Air': return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'Meubeler & Furniture': return <Armchair className="w-4 h-4 text-stone-600" />;
      case 'IT & Jaringan': return <Wifi className="w-4 h-4 text-indigo-600" />;
      default: return <Building className="w-4 h-4 text-slate-600" />;
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.location.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.reporterName.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'all' || t.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700"></span>
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Subbagian TURT</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">Helpdesk Perbaikan Sarana & Prasarana</h1>
          <p className="text-xs text-slate-500">
            Kanal pengaduan kerusakan gedung, AC, kelistrikan, IT, dan peralatan kantor Kanwil DJPb Prov. Jambi.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>{showForm ? 'Tutup Formulir' : '+ Laporkan Kerusakan Sarpras'}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-700" />
              <span>Tiket Lapor Kerusakan Fasilitas Kantor</span>
            </h3>
            <span className="text-[11px] text-slate-500">Respon teknisi maksimal 1x24 jam kerja</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Fasilitas *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="AC / Tata Udara">AC / Tata Udara</option>
                <option value="Kelistrikan & Lampu">Kelistrikan & Lampu</option>
                <option value="Plumbing & Air">Plumbing & Sanitasi Air</option>
                <option value="Meubeler & Furniture">Meubeler, Meja & Kursi</option>
                <option value="IT & Jaringan">IT, Jaringan & WiFi</option>
                <option value="Bangunan & Gedung">Bangunan, Pintu & Plafon</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tingkat Urgensi / Prioritas *</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Rendah">Rendah (Dapat dijadwalkan berkala)</option>
                <option value="Sedang">Sedang (Mengganggu kenyamanan kerja)</option>
                <option value="Mendesak">Mendesak (Menghentikan operasional/berbahaya)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lokasi Detail *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Ruang Seksi PPA I Lantai 2 / Toilet Lt. 1"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Kerusakan / Masalah *</label>
              <input
                type="text"
                required
                placeholder="Contoh: AC Meneteskan Air Deras ke Karpet"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Kerusakan & Gejala *</label>
              <textarea
                required
                rows={3}
                placeholder="Jelaskan secara rinci kondisi fisik peralatan dan waktu mulai terjadi kerusakan..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Pelapor *</label>
              <input
                type="text"
                required
                placeholder="Nama Lengkap Pegawai"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Kerja / Bidang</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Bidang PPA I">Bidang PPA I</option>
                <option value="Bidang PPA II">Bidang PPA II</option>
                <option value="Bidang PAPK">Bidang PAPK</option>
                <option value="Bidang SKKI">Bidang SKKI</option>
                <option value="Bagian Umum">Bagian Umum</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
            >
              Kirim Tiket Perbaikan
            </button>
          </div>
        </form>
      )}

      {/* Tickets List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Daftar Tiket Helpdesk Sarana & Prasarana</h2>
            <p className="text-xs text-slate-500">Pantau tindak lanjut perbaikan teknisi rumah tangga.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari tiket..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              />
            </div>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
            >
              <option value="all">Semua Kategori</option>
              <option value="AC / Tata Udara">AC</option>
              <option value="Kelistrikan & Lampu">Kelistrikan</option>
              <option value="Plumbing & Air">Plumbing</option>
              <option value="IT & Jaringan">IT & Jaringan</option>
              <option value="Meubeler & Furniture">Meubeler</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredTickets.map(t => (
            <div key={t.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                  {getCategoryIcon(t.category)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-slate-800">{t.id}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {t.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      t.priority === 'Mendesak'
                        ? 'bg-red-100 text-red-800'
                        : t.priority === 'Sedang'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      Prioritas: {t.priority}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{t.title}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">{t.description}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {t.location}
                    </span>
                    <span>·</span>
                    <span>Pelapor: {t.reporterName} ({t.division})</span>
                    <span>·</span>
                    <span className="font-mono">{t.submittedAt}</span>
                  </div>

                  {t.technicianNotes && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900">
                      <span className="font-semibold">Catatan Penanganan: </span>
                      {t.technicianNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Status and Action */}
              <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                  t.status === 'Selesai'
                    ? 'bg-emerald-100 text-emerald-800'
                    : t.status === 'Dikerjakan'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {t.status}
                </span>

                {(activeRole === 'kasubbag' || activeRole === 'admin') && (
                  <div className="flex items-center gap-1.5">
                    {t.status === 'Menunggu' && (
                      <button
                        onClick={() => onUpdateStatus(t.id, 'Dikerjakan', 'Teknisi ditugaskan ke lokasi untuk investigasi fisik.')}
                        className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded text-[11px] font-semibold cursor-pointer"
                      >
                        Tugaskan Teknisi
                      </button>
                    )}
                    {t.status === 'Dikerjakan' && (
                      <button
                        onClick={() => onUpdateStatus(t.id, 'Selesai', 'Perbaikan rampung dan telah diuji fungsi bersama pelapor.')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold cursor-pointer"
                      >
                        Selesaikan Tiket
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
