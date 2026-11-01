import React, { useState } from 'react';
import {
  Car,
  Users,
  Calendar,
  Clock,
  MapPin,
  Plus,
  Printer,
  Search,
  Check,
  X,
  Edit2,
  Trash2,
  AlertTriangle,
  RotateCcw,
  UserCheck,
  KeyRound
} from 'lucide-react';
import { VehicleItem, VehicleBooking } from '../../types';

interface VehicleBookingViewProps {
  vehicles: VehicleItem[];
  bookings: VehicleBooking[];
  onAddBooking: (booking: Omit<VehicleBooking, 'id' | 'submittedAt'>) => void;
  onUpdateBooking: (booking: VehicleBooking) => void;
  onDeleteBooking: (id: string) => void;
  onUpdateStatus: (id: string, status: VehicleBooking['status']) => void;
  onPrintBooking: (booking: VehicleBooking) => void;
  activeRole: 'pegawai' | 'kasubbag' | 'admin';
}

export const VehicleBookingView: React.FC<VehicleBookingViewProps> = ({
  vehicles,
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

  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | VehicleBooking['status']>('all');

  // Form states matching user request:
  // 1. Pilih Kendaraan
  // 2. Pilihan Layanan Dengan Supir atau Tanpa Supir
  // 3. Nama Pemohon
  // 4. Destinasi / Tujuan Perjalanan
  // 5. Jumlah Penumpang
  // 6. Tanggal Berangkat
  // 7. Jam Berangkat
  // 8. Estimasi Kembali
  // 9. Jam Kembali
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || 'v-01');
  const [serviceType, setServiceType] = useState<'Dengan Supir' | 'Tanpa Supir'>('Dengan Supir');
  const [customDriver, setCustomDriver] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [division, setDivision] = useState('Bidang Pembinaan Pelaksanaan Anggaran II (PPA II)');
  const [destination, setDestination] = useState('');
  const [purpose, setPurpose] = useState('');
  const [passengerCount, setPassengerCount] = useState(3);
  const [departureDate, setDepartureDate] = useState('2026-10-31');
  const [departureTime, setDepartureTime] = useState('08:00');
  const [returnDate, setReturnDate] = useState('2026-10-31');
  const [returnTime, setReturnTime] = useState('17:00');

  const selectedVehicleObj = vehicles.find(v => v.id === selectedVehicleId);

  // Handle open form for new application
  const handleOpenAddForm = () => {
    setEditingId(null);
    setSelectedVehicleId(vehicles[0]?.id || 'v-01');
    setServiceType('Dengan Supir');
    setCustomDriver('');
    setRequesterName('');
    setDivision('Bidang Pembinaan Pelaksanaan Anggaran II (PPA II)');
    setDestination('');
    setPurpose('');
    setPassengerCount(3);
    setDepartureDate('2026-10-31');
    setDepartureTime('08:00');
    setReturnDate('2026-10-31');
    setReturnTime('17:00');
    setShowForm(true);
  };

  // Handle open form for editing existing record
  const handleOpenEditForm = (booking: VehicleBooking) => {
    setEditingId(booking.id);
    const matchedVehicle = vehicles.find(v => v.name === booking.vehicleName || v.plateNumber === booking.plateNumber);
    if (matchedVehicle) {
      setSelectedVehicleId(matchedVehicle.id);
    }
    setServiceType(booking.serviceType || (booking.driverName.toLowerCase().includes('tanpa') ? 'Tanpa Supir' : 'Dengan Supir'));
    setCustomDriver(booking.driverName.toLowerCase().includes('tanpa') ? '' : booking.driverName);
    setRequesterName(booking.requesterName);
    setDivision(booking.division || 'Bidang Pembinaan Pelaksanaan Anggaran II (PPA II)');
    setDestination(booking.destination);
    setPurpose(booking.purpose || '');
    setPassengerCount(booking.passengerCount || 3);
    setDepartureDate(booking.departureDate || '2026-10-31');
    setDepartureTime(booking.departureTime || '08:00');
    setReturnDate(booking.returnDate || '2026-10-31');
    setReturnTime(booking.returnTime || '17:00');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !requesterName) return;

    const assignedDriverName = serviceType === 'Tanpa Supir'
      ? 'Tanpa Supir (Mandiri/Lepas Kunci)'
      : (customDriver.trim() || selectedVehicleObj?.assignedDriver || 'Driver Dinas TURT');

    if (editingId) {
      const original = bookings.find(b => b.id === editingId);
      const updated: VehicleBooking = {
        id: editingId,
        vehicleName: selectedVehicleObj ? selectedVehicleObj.name : (original?.vehicleName || 'Mobil Dinas'),
        plateNumber: selectedVehicleObj ? selectedVehicleObj.plateNumber : (original?.plateNumber || 'BH 1024 ZQ'),
        serviceType,
        driverName: assignedDriverName,
        purpose: purpose.trim() || original?.purpose || `Tugas kedinasan ke ${destination}`,
        destination,
        departureDate,
        departureTime,
        returnDate,
        returnTime,
        requesterName,
        division,
        passengerCount: Number(passengerCount),
        status: original?.status || 'Menunggu',
        submittedAt: original?.submittedAt || new Date().toISOString().replace('T', ' ').slice(0, 16),
      };
      onUpdateBooking(updated);
    } else {
      onAddBooking({
        vehicleName: selectedVehicleObj ? selectedVehicleObj.name : 'Mobil Dinas',
        plateNumber: selectedVehicleObj ? selectedVehicleObj.plateNumber : 'BH 1024 ZQ',
        serviceType,
        driverName: assignedDriverName,
        purpose: purpose.trim() || `Tugas kedinasan ke ${destination}`,
        destination,
        departureDate,
        departureTime,
        returnDate,
        returnTime,
        requesterName,
        division,
        passengerCount: Number(passengerCount),
        status: 'Menunggu',
      });
    }

    setEditingId(null);
    setShowForm(false);
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch =
      b.destination.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.requesterName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.vehicleName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.plateNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (b.serviceType && b.serviceType.toLowerCase().includes(searchFilter.toLowerCase())) ||
      b.driverName.toLowerCase().includes(searchFilter.toLowerCase());
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
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">Peminjaman Kendaraan Dinas Operasional</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Layanan peminjaman armada mobil dinas Kanwil DJPb Provinsi Jambi untuk keperluan dinas luar.
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
          <span>{showForm && !editingId ? 'Tutup Formulir' : '+ Ajukan Peminjaman Mobil Dinas'}</span>
        </button>
      </div>

      {/* Form Permohonan / Ubah Kendaraan */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${editingId ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'}`}>
                {editingId ? <Edit2 className="w-4 h-4" /> : <Car className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {editingId ? 'Ubah Data Peminjaman Kendaraan Dinas' : 'Formulir Permohonan Pemakaian Kendaraan Dinas'}
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
              <span className="text-[11px] text-slate-500 font-medium">Subbagian TURT Kanwil Jambi</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Pilih Kendaraan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">1. Pilih Kendaraan *</label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:border-blue-700 focus:outline-hidden font-medium"
              >
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.plateNumber}) · {v.capacity} ({v.status})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Pilihan Layanan Dengan Supir atau Tanpa Supir */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                2. Pilihan Layanan (Dengan Supir atau Tanpa Supir) *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setServiceType('Dengan Supir')}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    serviceType === 'Dengan Supir'
                      ? 'bg-blue-50 text-blue-900 border-blue-600 ring-1 ring-blue-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-blue-700" />
                  <span>Dengan Supir</span>
                </button>

                <button
                  type="button"
                  onClick={() => setServiceType('Tanpa Supir')}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    serviceType === 'Tanpa Supir'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-600 ring-1 ring-emerald-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <KeyRound className="w-4 h-4 text-emerald-700" />
                  <span>Tanpa Supir (Lepas Kunci)</span>
                </button>
              </div>

              {serviceType === 'Dengan Supir' ? (
                <div className="mt-2 text-[11px] text-blue-800 bg-blue-50/60 p-2 rounded border border-blue-100 flex items-center justify-between">
                  <span>Supir Ditugaskan: <strong>{selectedVehicleObj?.assignedDriver || 'Driver Dinas TURT'}</strong></span>
                  <span className="text-slate-400 font-mono text-[10px]">{selectedVehicleObj?.driverPhone || 'Kontak TURT'}</span>
                </div>
              ) : (
                <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50/60 p-2 rounded border border-emerald-100">
                  <span>Peminjam membawa kendaraan secara mandiri untuk operasional dinas.</span>
                </div>
              )}
            </div>

            {/* 3. Nama Pemohon */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">3. Nama Pemohon *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Ahmad Fauzi, S.E. / Deni Kurniawan"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:outline-hidden"
              />
            </div>

            {/* Bagian / Bidang Pemohon */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bagian / Bidang Pemohon *</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:border-blue-700 focus:outline-hidden"
              >
                <option value="Bagian Umum (Subbagian TURT)">Bagian Umum - Subbagian TURT</option>
                <option value="Bidang Pembinaan Pelaksanaan Anggaran I (PPA I)">Bidang Pembinaan Pelaksanaan Anggaran I (PPA I)</option>
                <option value="Bidang Pembinaan Pelaksanaan Anggaran II (PPA II)">Bidang Pembinaan Pelaksanaan Anggaran II (PPA II)</option>
                <option value="Bidang Pembinaan Akuntansi & Pelaporan Keuangan (PAPK)">Bidang PAPK</option>
                <option value="Bidang Supervisi KPPN dan Kepatuhan Internal (SKKI)">Bidang SKKI</option>
                <option value="Subbagian Kepegawaian">Subbagian Kepegawaian</option>
                <option value="Subbagian Keuangan">Subbagian Keuangan</option>
                <option value="Subbagian Penilaian Kinerja">Subbagian Penilaian Kinerja</option>
              </select>
            </div>

            {/* 4. Destinasi / Tujuan Perjalanan */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                4. Destinasi / Tujuan Perjalanan *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Kantor BPKAD Kab. Batanghari / KPPN Bangko / BPK Perwakilan Prov. Jambi"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:outline-hidden"
              />
            </div>

            {/* Keperluan / Maksud Perjalanan Dinas */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Maksud & Keperluan Penugasan Dinas
              </label>
              <input
                type="text"
                placeholder="Contoh: Pendampingan dan koordinasi percepatan penyaluran DAK Fisik & Dana Desa"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:outline-hidden"
              />
            </div>

            {/* 5. Jumlah Penumpang */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">5. Jumlah Penumpang (Orang) *</label>
              <input
                type="number"
                min="1"
                max="16"
                required
                value={passengerCount}
                onChange={(e) => setPassengerCount(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:outline-hidden"
              />
            </div>

            {/* 6. Tanggal Berangkat & 7. Jam Berangkat */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">6. Tanggal Berangkat *</label>
                <input
                  type="date"
                  required
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">7. Jam Berangkat *</label>
                <input
                  type="time"
                  required
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:outline-hidden"
                />
              </div>
            </div>

            {/* 8. Estimasi Kembali & 9. Jam Kembali */}
            <div className="grid grid-cols-2 gap-2 md:col-span-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">8. Estimasi Kembali *</label>
                <input
                  type="date"
                  required
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">9. Jam Kembali *</label>
                <input
                  type="time"
                  required
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:outline-hidden"
                />
              </div>
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
              <span>{editingId ? 'Simpan Perubahan Peminjaman Kendaraan' : 'Kirim Permohonan Kendaraan'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Fleet Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {vehicles.map(v => (
          <div
            key={v.id}
            className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-blue-400 hover:shadow-xs transition-all"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className="font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300">
                  {v.plateNumber}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  v.status === 'Tersedia' 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : v.status === 'Sedang Digunakan'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {v.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{v.name}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{v.type} · {v.capacity}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[11px] text-slate-600">
                <span className="text-slate-400">Driver Dinas:</span> <span className="font-semibold text-slate-800">{v.assignedDriver}</span>
              </div>
              <button
                onClick={() => {
                  setSelectedVehicleId(v.id);
                  setEditingId(null);
                  setShowForm(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-1.5 text-xs text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 rounded-md transition-colors text-center cursor-pointer"
              >
                Pilih Kendaraan Ini
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bookings Table matching requested fields:
          Pilih Kendaraan, Pilihan Layanan Dengan Supir atau Tanpa Supir, Nama Pemohon,
          Destinasi / Tujuan Perjalanan, Jumlah Penumpang, Tanggal Berangkat, Jam Berangkat,
          Estimasi Kembali, Jam Kembali, Ubah, Hapus */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Daftar Peminjaman Kendaraan Dinas Operasional</h2>
            <p className="text-xs text-slate-500">
              Monitoring penggunaan armada mobil dinas jabatan dan operasional Kanwil DJPb Prov. Jambi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kendaraan, pemohon, tujuan..."
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

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#002b49] text-white font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 text-center w-12">NO</th>
                <th className="py-3 px-3.5 min-w-[150px]">PILIH KENDARAAN</th>
                <th className="py-3 px-3.5 min-w-[160px]">PILIHAN LAYANAN</th>
                <th className="py-3 px-3.5 min-w-[150px]">NAMA PEMOHON</th>
                <th className="py-3 px-4 min-w-[180px]">DESTINASI / TUJUAN PERJALANAN</th>
                <th className="py-3 px-3 text-center min-w-[110px]">JUMLAH PENUMPANG</th>
                <th className="py-3 px-3.5 text-center min-w-[120px]">TANGGAL BERANGKAT</th>
                <th className="py-3 px-3 text-center min-w-[100px]">JAM BERANGKAT</th>
                <th className="py-3 px-3.5 text-center min-w-[120px]">ESTIMASI KEMBALI</th>
                <th className="py-3 px-3 text-center min-w-[100px]">JAM KEMBALI</th>
                <th className="py-3 px-3.5 text-center min-w-[210px]">UBAH, HAPUS & STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    Tidak ada data peminjaman kendaraan yang sesuai filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b, index) => {
                  const isWithDriver = !b.driverName?.toLowerCase().includes('tanpa') && b.serviceType !== 'Tanpa Supir';

                  return (
                    <tr key={b.id} className="hover:bg-blue-50/40 transition-colors">
                      {/* NO */}
                      <td className="py-3 px-3 text-center font-bold text-slate-700 align-top">
                        {index + 1}
                      </td>

                      {/* 1. PILIH KENDARAAN */}
                      <td className="py-3 px-3.5 align-top">
                        <div className="font-bold text-slate-900">{b.vehicleName}</div>
                        <div className="font-mono text-[10px] text-blue-800 font-bold mt-0.5 inline-block bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                          {b.plateNumber}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{b.id}</div>
                      </td>

                      {/* 2. PILIHAN LAYANAN DENGAN SUPIR ATAU TANPA SUPIR */}
                      <td className="py-3 px-3.5 align-top">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            isWithDriver
                              ? 'bg-blue-100 text-blue-900 border border-blue-200'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          }`}>
                            {isWithDriver ? <UserCheck className="w-3 h-3 text-blue-700" /> : <KeyRound className="w-3 h-3 text-emerald-700" />}
                            <span>{isWithDriver ? 'Dengan Supir' : 'Tanpa Supir'}</span>
                          </span>

                          <div className="text-[11px] text-slate-700 font-medium">
                            {isWithDriver ? (
                              <span className="text-slate-800">Driver: <strong>{b.driverName}</strong></span>
                            ) : (
                              <span className="text-slate-500 italic">Mandiri (Lepas Kunci)</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 3. NAMA PEMOHON */}
                      <td className="py-3 px-3.5 align-top">
                        <div className="font-bold text-slate-900">{b.requesterName}</div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          <span className="inline-block bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
                            {b.division}
                          </span>
                        </div>
                      </td>

                      {/* 4. DESTINASI / TUJUAN PERJALANAN */}
                      <td className="py-3 px-4 align-top">
                        <div className="font-semibold text-slate-900 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span>{b.destination}</span>
                        </div>
                        {b.purpose && (
                          <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                            {b.purpose}
                          </div>
                        )}
                      </td>

                      {/* 5. JUMLAH PENUMPANG */}
                      <td className="py-3 px-3 text-center align-top whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-900 rounded font-bold border border-blue-200 text-xs">
                          {b.passengerCount} Orang
                        </span>
                      </td>

                      {/* 6. TANGGAL BERANGKAT */}
                      <td className="py-3 px-3.5 text-center font-medium text-slate-800 align-top whitespace-nowrap">
                        {b.departureDate}
                      </td>

                      {/* 7. JAM BERANGKAT */}
                      <td className="py-3 px-3 text-center font-semibold text-blue-900 align-top whitespace-nowrap">
                        {b.departureTime} WIB
                      </td>

                      {/* 8. ESTIMASI KEMBALI */}
                      <td className="py-3 px-3.5 text-center font-medium text-slate-800 align-top whitespace-nowrap">
                        {b.returnDate}
                      </td>

                      {/* 9. JAM KEMBALI */}
                      <td className="py-3 px-3 text-center font-semibold text-blue-900 align-top whitespace-nowrap">
                        {b.returnTime} WIB
                      </td>

                      {/* 10. UBAH, HAPUS & STATUS */}
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

                          {/* Tombol Aksi: Ubah, Hapus, Cetak SPT */}
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            {/* Tombol Ubah */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditForm(b)}
                              title="Ubah data peminjaman mobil dinas"
                              className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Ubah</span>
                            </button>

                            {/* Tombol Hapus */}
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(b.id)}
                              title="Hapus data peminjaman mobil dinas"
                              className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-xs transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Hapus</span>
                            </button>

                            {/* Tombol Cetak */}
                            <button
                              type="button"
                              onClick={() => onPrintBooking(b)}
                              title="Cetak Surat Izin Jalan / SPT"
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
                                  title="Setujui Mobil Dinas"
                                  className="px-1.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition-colors cursor-pointer inline-flex items-center gap-0.5"
                                >
                                  <Check className="w-2.5 h-2.5" />
                                  <span>Setuju</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onUpdateStatus(b.id, 'Ditolak')}
                                  title="Tolak Permohonan"
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus Peminjaman Kendaraan */}
      {deleteConfirmId && itemToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Hapus Peminjaman Kendaraan</h3>
                <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2 mb-5">
              <div className="flex justify-between">
                <span className="text-slate-500">ID Registrasi:</span>
                <span className="font-mono font-bold text-blue-900">{itemToDelete.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kendaraan:</span>
                <span className="font-bold text-slate-900">{itemToDelete.vehicleName} ({itemToDelete.plateNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pilihan Layanan:</span>
                <span className="font-semibold text-slate-800">{itemToDelete.serviceType || 'Dengan Supir'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pemohon:</span>
                <span className="font-semibold text-slate-800">{itemToDelete.requesterName} ({itemToDelete.division})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destinasi:</span>
                <span className="font-medium text-slate-800 max-w-[200px] text-right truncate">{itemToDelete.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jadwal:</span>
                <span className="font-medium text-slate-800">
                  {itemToDelete.departureDate} ({itemToDelete.departureTime} WIB) s.d. {itemToDelete.returnDate} ({itemToDelete.returnTime} WIB)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-6">
              Apakah Anda yakin ingin menghapus data peminjaman kendaraan dinas ini dari sistem Subbagian TURT?
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
