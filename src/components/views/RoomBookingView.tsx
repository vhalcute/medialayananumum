import React, { useState } from 'react';
import {
  DoorOpen,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Printer,
  Search,
  Filter,
  Check,
  X,
  Edit2,
  Trash2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { RoomItem, RoomBooking } from '../../types';

interface RoomBookingViewProps {
  rooms: RoomItem[];
  bookings: RoomBooking[];
  onAddBooking: (booking: Omit<RoomBooking, 'id' | 'submittedAt'>) => void;
  onUpdateBooking: (booking: RoomBooking) => void;
  onDeleteBooking: (id: string) => void;
  onUpdateStatus: (id: string, status: RoomBooking['status']) => void;
  onPrintBooking: (booking: RoomBooking) => void;
  activeRole: 'pegawai' | 'kasubbag' | 'admin';
}

export const RoomBookingView: React.FC<RoomBookingViewProps> = ({
  rooms,
  bookings,
  onAddBooking,
  onUpdateBooking,
  onDeleteBooking,
  onUpdateStatus,
  onPrintBooking,
  activeRole,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || 'aula');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RoomBooking['status']>('all');

  // Form states matching user specification:
  // 1. Pilih Ruangan
  // 2. Nama Peminjam
  // 3. Bagian/Bidang
  // 4. Tanggal Kegiatan
  // 5. Mulai Jam
  // 6. Selesai Jam
  // 7. Jumlah Peserta (Orang)
  // 8. Nama Kegiatan/Agenda
  // 9. Kebutuhan/Perlengkapan yang dibutuhkan
  const [picName, setPicName] = useState('');
  const [division, setDivision] = useState('Bidang Pembinaan Pelaksanaan Anggaran I (PPA I)');
  const [date, setDate] = useState('2026-10-31');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:30');
  const [attendeesCount, setAttendeesCount] = useState(25);
  const [activityName, setActivityName] = useState('');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([
    'Dual Projector',
    'Mic Wireless (6)',
    'Zoom Room Hybrid',
  ]);
  const [additionalEquipment, setAdditionalEquipment] = useState('');

  const selectedRoomObj = rooms.find(r => r.id === selectedRoomId);

  // Open form for new booking
  const handleOpenAddForm = () => {
    setEditingId(null);
    setSelectedRoomId(rooms[0]?.id || 'aula');
    setPicName('');
    setDivision('Bidang Pembinaan Pelaksanaan Anggaran I (PPA I)');
    setDate('2026-10-31');
    setStartTime('09:00');
    setEndTime('11:30');
    setAttendeesCount(25);
    setActivityName('');
    setSelectedFacilities(['Dual Projector', 'Mic Wireless (6)', 'Zoom Room Hybrid']);
    setAdditionalEquipment('');
    setShowForm(true);
  };

  // Open form for editing existing booking
  const handleOpenEditForm = (booking: RoomBooking) => {
    setEditingId(booking.id);
    setSelectedRoomId(booking.roomId);
    setPicName(booking.picName);
    setDivision(booking.division);
    setDate(booking.date || '2026-10-31');
    setStartTime(booking.startTime || '09:00');
    setEndTime(booking.endTime || '11:30');
    setAttendeesCount(booking.attendeesCount || 10);
    setActivityName(booking.activityName);
    setSelectedFacilities(booking.facilitiesNeeded || []);
    setAdditionalEquipment('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityName || !picName) return;

    const allFacilities = [...selectedFacilities];
    if (additionalEquipment.trim()) {
      allFacilities.push(additionalEquipment.trim());
    }

    if (editingId) {
      const original = bookings.find(b => b.id === editingId);
      const updated: RoomBooking = {
        id: editingId,
        roomId: selectedRoomId,
        roomName: selectedRoomObj ? selectedRoomObj.name : (original?.roomName || 'Ruang Rapat'),
        activityName,
        division,
        picName,
        picPhone: original?.picPhone,
        date,
        startTime,
        endTime,
        attendeesCount: Number(attendeesCount),
        facilitiesNeeded: allFacilities,
        consumptionNote: original?.consumptionNote || '',
        status: original?.status || 'Menunggu',
        submittedAt: original?.submittedAt || new Date().toISOString().replace('T', ' ').slice(0, 16),
      };
      onUpdateBooking(updated);
    } else {
      onAddBooking({
        roomId: selectedRoomId,
        roomName: selectedRoomObj ? selectedRoomObj.name : 'Ruang Rapat',
        activityName,
        division,
        picName,
        date,
        startTime,
        endTime,
        attendeesCount: Number(attendeesCount),
        facilitiesNeeded: allFacilities,
        consumptionNote: '',
        status: 'Menunggu',
      });
    }

    // Reset & close
    setEditingId(null);
    setActivityName('');
    setPicName('');
    setAdditionalEquipment('');
    setShowForm(false);
  };

  const toggleFacility = (facility: string) => {
    if (selectedFacilities.includes(facility)) {
      setSelectedFacilities(selectedFacilities.filter(f => f !== facility));
    } else {
      setSelectedFacilities([...selectedFacilities, facility]);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch =
      b.activityName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.roomName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.picName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.division.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const itemToDelete = bookings.find(b => b.id === deleteConfirmId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700"></span>
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Subbagian TURT</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">Peminjaman Ruangan Kanwil DJPb Prov. Jambi</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pelayanan peminjaman ruang rapat, aula, dan ruang koordinasi kedinasan.
          </p>
        </div>

        <button
          onClick={() => {
            if (showForm && !editingId) {
              setShowForm(false);
            } else {
              handleOpenAddForm();
            }
          }}
          className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>{showForm && !editingId ? 'Tutup Formulir' : '+ Ajukan Peminjaman Ruangan'}</span>
        </button>
      </div>

      {/* Booking Form Card (Collapsible) */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${editingId ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'}`}>
                {editingId ? <Edit2 className="w-4 h-4" /> : <DoorOpen className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {editingId ? 'Ubah Data Peminjaman Ruangan' : 'Formulir Peminjaman Ruangan'}
                </h3>
                {editingId && (
                  <span className="text-[10px] text-amber-700 font-semibold">
                    Mode Ubah Data • ID: {editingId}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setShowForm(false);
                  }}
                  className="px-2 py-1 text-[11px] text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1 cursor-pointer font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Batal Ubah</span>
                </button>
              )}
              <span className="text-[11px] text-slate-500 font-medium">Standar Pelayanan Subbagian TURT</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Pilih Ruangan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">1. Pilih Ruangan *</label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:border-blue-700 focus:outline-hidden font-medium"
              >
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.name} ({room.floor} · Kapasitas: {room.capacity} orang)
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Nama Peminjam */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">2. Nama Peminjam *</label>
              <input
                type="text"
                required
                placeholder="Nama Lengkap Peminjam"
                value={picName}
                onChange={(e) => setPicName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:outline-hidden"
              />
            </div>

            {/* 3. Bagian / Bidang */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">3. Bagian / Bidang *</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:border-blue-700 focus:outline-hidden font-medium"
              >
                <option value="Bidang Pembinaan Pelaksanaan Anggaran I (PPA I)">Bidang Pembinaan Pelaksanaan Anggaran I (PPA I)</option>
                <option value="Bidang Pembinaan Pelaksanaan Anggaran II (PPA II)">Bidang Pembinaan Pelaksanaan Anggaran II (PPA II)</option>
                <option value="Bidang Pembinaan Akuntansi & Pelaporan Keuangan (PAPK)">Bidang Pembinaan Akuntansi & Pelaporan Keuangan (PAPK)</option>
                <option value="Bidang Supervisi KPPN dan Kepatuhan Internal (SKKI)">Bidang Supervisi KPPN dan Kepatuhan Internal (SKKI)</option>
                <option value="Bagian Umum (Subbagian TURT)">Bagian Umum - Subbagian TURT</option>
                <option value="Bagian Umum (Subbagian Kepegawaian)">Bagian Umum - Subbagian Kepegawaian</option>
                <option value="Bagian Umum (Subbagian Keuangan)">Bagian Umum - Subbagian Keuangan</option>
                <option value="Bagian Umum (Subbagian Penilaian Kinerja)">Bagian Umum - Subbagian Penilaian Kinerja</option>
              </select>
            </div>

            {/* 4. Tanggal Kegiatan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">4. Tanggal Kegiatan *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:outline-hidden"
              />
            </div>

            {/* 5. Mulai Jam & 6. Selesai Jam */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">5. Mulai Jam *</label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">6. Selesai Jam *</label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:outline-hidden"
                />
              </div>
            </div>

            {/* 7. Jumlah Peserta (Orang) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">7. Jumlah Peserta (Orang) *</label>
              <input
                type="number"
                required
                min="1"
                max="300"
                value={attendeesCount}
                onChange={(e) => setAttendeesCount(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:outline-hidden"
              />
            </div>

            {/* 8. Nama Kegiatan / Agenda */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">8. Nama Kegiatan / Agenda *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Rapat Koordinasi Penyaluran DAK Fisik & Dana Desa TW III"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:outline-hidden"
              />
            </div>

            {/* 9. Kebutuhan / Perlengkapan yang dibutuhkan */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                9. Kebutuhan / Perlengkapan yang dibutuhkan:
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {[
                  'Sound System 8 Ch',
                  'Dual Projector',
                  'Smart TV 75"',
                  'Mic Wireless (6)',
                  'Video Soundbar 4K',
                  'Zoom Room Hybrid',
                  'Podium Sambutan',
                  'Papan Whiteboard & Spidol',
                  'Laptop Operasional',
                  'Pointer Laser'
                ].map(facility => (
                  <button
                    type="button"
                    key={facility}
                    onClick={() => toggleFacility(facility)}
                    className={`text-xs px-3 py-1.5 rounded-md border font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                      selectedFacilities.includes(facility)
                        ? 'bg-blue-50 text-blue-800 border-blue-400 font-semibold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {selectedFacilities.includes(facility) && <Check className="w-3 h-3 text-blue-700" />}
                    <span>{facility}</span>
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Perlengkapan tambahan lainnya (opsional, pisahkan dengan koma)"
                value={additionalEquipment}
                onChange={(e) => setAdditionalEquipment(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-700 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setShowForm(false);
              }}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                editingId
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-[#003366] hover:bg-[#002244]'
              }`}
            >
              {editingId ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{editingId ? 'Simpan Perubahan Peminjaman' : 'Kirim Permohonan Peminjaman Ruangan'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Directory of Rooms */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {rooms.map(room => (
          <div
            key={room.id}
            className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-blue-400 hover:shadow-xs transition-all"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className="font-semibold text-slate-500">{room.floor}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${room.isAvailableToday ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {room.isAvailableToday ? 'Tersedia' : 'Terpakai'}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{room.name}</h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{room.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold mb-2">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Kapasitas: {room.capacity} orang</span>
              </div>
              <button
                onClick={() => {
                  setSelectedRoomId(room.id);
                  setEditingId(null);
                  setShowForm(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-1.5 text-xs text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 rounded-md transition-colors text-center cursor-pointer"
              >
                Pilih Ruangan Ini
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bookings Tracking Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Daftar Peminjaman Ruangan</h2>
            <p className="text-xs text-slate-500">
              Data peminjaman ruangan Kanwil DJPb Prov. Jambi terintegrasi Subbagian TURT.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari peminjaman..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:border-blue-600"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700"
            >
              <option value="all">Semua Status</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Berlangsung">Berlangsung</option>
              <option value="Selesai">Selesai</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        {/* The requested 10 fields table:
            No, Pilih Ruangan, Nama Peminjam, Bagian/Bidang, Tanggal Kegiatan, Mulai Jam, Selesai Jam,
            Jumlah Peserta (Orang), Nama Kegiatan/Agenda, Kebutuhan/Perlengkapan yang dibutuhkan + Status/Aksi */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#002b49] text-white font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 text-center w-12">NO</th>
                <th className="py-3 px-3.5 min-w-[140px]">PILIH RUANGAN</th>
                <th className="py-3 px-3.5 min-w-[140px]">NAMA PEMINJAM</th>
                <th className="py-3 px-3.5 min-w-[150px]">BAGIAN / BIDANG</th>
                <th className="py-3 px-3.5 text-center min-w-[120px]">TANGGAL KEGIATAN</th>
                <th className="py-3 px-3 text-center min-w-[90px]">MULAI JAM</th>
                <th className="py-3 px-3 text-center min-w-[90px]">SELESAI JAM</th>
                <th className="py-3 px-3 text-center min-w-[100px]">JUMLAH PESERTA (ORANG)</th>
                <th className="py-3 px-4 min-w-[200px]">NAMA KEGIATAN / AGENDA</th>
                <th className="py-3 px-4 min-w-[200px]">KEBUTUHAN / PERLENGKAPAN YANG DIBUTUHKAN</th>
                <th className="py-3 px-3.5 text-center min-w-[210px]">STATUS & AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    Tidak ada data peminjaman ruangan yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b, index) => (
                  <tr key={b.id} className="hover:bg-blue-50/40 transition-colors">
                    {/* 1. NO */}
                    <td className="py-3 px-3 text-center font-bold text-slate-700 align-top">
                      {index + 1}
                    </td>

                    {/* 2. PILIH RUANGAN */}
                    <td className="py-3 px-3.5 align-top">
                      <div className="font-bold text-slate-900">{b.roomName}</div>
                      <div className="text-[10px] text-blue-700 font-mono mt-0.5">{b.id}</div>
                    </td>

                    {/* 3. NAMA PEMINJAM */}
                    <td className="py-3 px-3.5 font-semibold text-slate-900 align-top">
                      {b.picName}
                    </td>

                    {/* 4. BAGIAN / BIDANG */}
                    <td className="py-3 px-3.5 text-slate-700 align-top">
                      <span className="inline-block bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                        {b.division}
                      </span>
                    </td>

                    {/* 5. TANGGAL KEGIATAN */}
                    <td className="py-3 px-3.5 text-center font-medium text-slate-800 align-top whitespace-nowrap">
                      {b.date}
                    </td>

                    {/* 6. MULAI JAM */}
                    <td className="py-3 px-3 text-center font-semibold text-blue-900 align-top whitespace-nowrap">
                      {b.startTime} WIB
                    </td>

                    {/* 7. SELESAI JAM */}
                    <td className="py-3 px-3 text-center font-semibold text-blue-900 align-top whitespace-nowrap">
                      {b.endTime} WIB
                    </td>

                    {/* 8. JUMLAH PESERTA (ORANG) */}
                    <td className="py-3 px-3 text-center font-bold text-slate-800 align-top whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-900 rounded font-bold border border-amber-200">
                        {b.attendeesCount} Orang
                      </span>
                    </td>

                    {/* 9. NAMA KEGIATAN / AGENDA */}
                    <td className="py-3 px-4 align-top">
                      <div className="font-semibold text-slate-900">{b.activityName}</div>
                    </td>

                    {/* 10. KEBUTUHAN / PERLENGKAPAN YANG DIBUTUHKAN */}
                    <td className="py-3 px-4 align-top">
                      {b.facilitiesNeeded && b.facilitiesNeeded.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {b.facilitiesNeeded.map((facility, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded font-medium"
                            >
                              {facility}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">- Standar Ruangan -</span>
                      )}
                    </td>

                    {/* STATUS & AKSI */}
                    <td className="py-3 px-3.5 text-center align-top whitespace-nowrap">
                      <div className="flex flex-col items-center gap-2">
                        {/* Status Badge */}
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.status === 'Disetujui'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : b.status === 'Berlangsung'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : b.status === 'Menunggu'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : b.status === 'Selesai'
                            ? 'bg-slate-100 text-slate-700 border border-slate-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {b.status}
                        </span>

                        {/* Action buttons: Ubah, Hapus, Cetak, Approval */}
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {/* Tombol Ubah */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditForm(b)}
                            title="Ubah data peminjaman ruangan"
                            className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Ubah</span>
                          </button>

                          {/* Tombol Hapus */}
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(b.id)}
                            title="Hapus data peminjaman ruangan"
                            className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-xs transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus</span>
                          </button>

                          {/* Tombol Cetak */}
                          <button
                            type="button"
                            onClick={() => onPrintBooking(b)}
                            title="Cetak Bukti Peminjaman Resmi"
                            className="p-1 text-slate-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* Kasubbag / Admin Approval */}
                          {(activeRole === 'kasubbag' || activeRole === 'admin') && b.status === 'Menunggu' && (
                            <>
                              <button
                                type="button"
                                onClick={() => onUpdateStatus(b.id, 'Disetujui')}
                                title="Setujui Peminjaman"
                                className="px-1.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition-colors cursor-pointer inline-flex items-center gap-0.5"
                              >
                                <Check className="w-2.5 h-2.5" />
                                <span>Setuju</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => onUpdateStatus(b.id, 'Ditolak')}
                                title="Tolak Peminjaman"
                                className="px-1.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold transition-colors cursor-pointer inline-flex items-center gap-0.5"
                              >
                                <X className="w-2.5 h-2.5" />
                                <span>Tolak</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus Peminjaman Ruangan */}
      {deleteConfirmId && itemToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Hapus Peminjaman Ruangan</h3>
                <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2 mb-5">
              <div className="flex justify-between">
                <span className="text-slate-500">ID Registrasi:</span>
                <span className="font-mono font-bold text-blue-900">{itemToDelete.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ruangan:</span>
                <span className="font-bold text-slate-900">{itemToDelete.roomName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Kegiatan:</span>
                <span className="font-medium text-slate-800 max-w-[200px] text-right truncate">
                  {itemToDelete.activityName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Peminjam:</span>
                <span className="font-semibold text-slate-800">{itemToDelete.picName} ({itemToDelete.division})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jadwal:</span>
                <span className="font-medium text-slate-800">
                  {itemToDelete.date} • {itemToDelete.startTime} - {itemToDelete.endTime} WIB
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-6">
              Apakah Anda yakin ingin menghapus data peminjaman ruangan ini dari daftar Subbagian TURT?
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteBooking(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Peminjaman</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
