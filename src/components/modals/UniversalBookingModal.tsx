import React, { useState } from 'react';
import {
  X,
  DoorOpen,
  Car,
  Package,
  Wrench,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { RoomItem, VehicleItem, BmnItem, AtkItem } from '../../types';

interface UniversalBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: 'room' | 'vehicle' | 'bmn' | 'ticket' | 'atk';
  rooms: RoomItem[];
  vehicles: VehicleItem[];
  bmnItems: BmnItem[];
  atkCatalog: AtkItem[];
  onSubmitRoom: (b: any) => void;
  onSubmitVehicle: (b: any) => void;
  onSubmitBmn: (b: any) => void;
  onSubmitTicket: (t: any) => void;
  onSubmitAtk: (req: any) => void;
}

export const UniversalBookingModal: React.FC<UniversalBookingModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'room',
  rooms,
  vehicles,
  bmnItems,
  atkCatalog,
  onSubmitRoom,
  onSubmitVehicle,
  onSubmitBmn,
  onSubmitTicket,
  onSubmitAtk,
}) => {
  const [activeTab, setActiveTab] = useState<'room' | 'vehicle' | 'bmn' | 'ticket' | 'atk'>(defaultCategory);
  const [submitted, setSubmitted] = useState(false);

  // Common fields
  const [requesterName, setRequesterName] = useState('');
  const [division, setDivision] = useState('Bidang Pembinaan Pelaksanaan Anggaran I (PPA I)');

  // Room
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || 'aula');
  const [roomActivity, setRoomActivity] = useState('');
  const [roomDate, setRoomDate] = useState('2026-10-31');
  const [roomStartTime, setRoomStartTime] = useState('09:00');
  const [roomEndTime, setRoomEndTime] = useState('11:30');
  const [roomAttendees, setRoomAttendees] = useState(30);

  // Vehicle
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || 'v-01');
  const [vehiclePurpose, setVehiclePurpose] = useState('');
  const [vehicleDestination, setVehicleDestination] = useState('');
  const [vehicleDate, setVehicleDate] = useState('2026-10-31');

  // Maintenance Ticket
  const [ticketCategory, setTicketCategory] = useState<'AC / Tata Udara' | 'Kelistrikan & Lampu' | 'Plumbing & Air' | 'IT & Jaringan'>('AC / Tata Udara');
  const [ticketLocation, setTicketLocation] = useState('');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');

  // ATK
  const [selectedAtkCode, setSelectedAtkCode] = useState(atkCatalog[0]?.code || 'ATK-KRT-01');
  const [atkQty, setAtkQty] = useState(2);
  const [atkPurpose, setAtkPurpose] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'room') {
      const room = rooms.find(r => r.id === selectedRoomId);
      onSubmitRoom({
        roomId: selectedRoomId,
        roomName: room?.name || 'Ruang Rapat',
        activityName: roomActivity || 'Rapat Koordinasi Dinas',
        division,
        picName: requesterName || 'Staf Kanwil',
        date: roomDate,
        startTime: roomStartTime,
        endTime: roomEndTime,
        attendeesCount: Number(roomAttendees),
        facilitiesNeeded: ['Sound System', 'Projector', 'Zoom Hybrid'],
        status: 'Menunggu',
      });
    } else if (activeTab === 'vehicle') {
      const v = vehicles.find(item => item.id === selectedVehicleId);
      onSubmitVehicle({
        vehicleName: v?.name || 'Mobil Dinas',
        plateNumber: v?.plateNumber || 'BH 1024 ZQ',
        serviceType: 'Dengan Supir',
        driverName: v?.assignedDriver || 'Driver Dinas',
        purpose: vehiclePurpose || 'Tugas Dinas Luar',
        destination: vehicleDestination || 'Kota Jambi',
        departureDate: vehicleDate,
        departureTime: '08:00',
        returnDate: vehicleDate,
        returnTime: '16:00',
        requesterName: requesterName || 'Pegawai Kanwil',
        division,
        passengerCount: 3,
        status: 'Menunggu',
      });
    } else if (activeTab === 'ticket') {
      onSubmitTicket({
        category: ticketCategory,
        location: ticketLocation || 'Gedung Kanwil Jambi',
        title: ticketTitle || 'Keluhan Sarana',
        description: ticketDesc || 'Mohon bantuan perbaikan',
        priority: 'Sedang',
        reporterName: requesterName || 'Pegawai',
        division,
        status: 'Menunggu',
      });
    } else if (activeTab === 'atk') {
      const item = atkCatalog.find(i => i.code === selectedAtkCode);
      onSubmitAtk({
        requesterName: requesterName || 'Pegawai',
        division,
        items: [{ code: selectedAtkCode, name: item?.name || 'ATK', qty: Number(atkQty), unit: item?.unit || 'Pcs' }],
        purpose: atkPurpose || 'Keperluan administrasi berkas kantor',
        status: 'Menunggu Kasubbag',
      });
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#002b49] text-white p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm">Permohonan Layanan Umum Kanwil DJPb Prov. Jambi</h3>
            <p className="text-[11px] text-amber-200">Pilih jenis layanan yang ingin diajukan ke Subbagian TURT</p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white p-1 rounded cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Tab Strip */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('room')}
            className={`px-4 py-2.5 flex items-center gap-1.5 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'room' ? 'border-blue-700 text-blue-900 bg-white font-bold' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Ruang Rapat</span>
          </button>
          <button
            onClick={() => setActiveTab('vehicle')}
            className={`px-4 py-2.5 flex items-center gap-1.5 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'vehicle' ? 'border-blue-700 text-blue-900 bg-white font-bold' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Mobil Dinas</span>
          </button>
          <button
            onClick={() => setActiveTab('atk')}
            className={`px-4 py-2.5 flex items-center gap-1.5 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'atk' ? 'border-blue-700 text-blue-900 bg-white font-bold' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Bon ATK</span>
          </button>
          <button
            onClick={() => setActiveTab('ticket')}
            className={`px-4 py-2.5 flex items-center gap-1.5 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'ticket' ? 'border-blue-700 text-blue-900 bg-white font-bold' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Helpdesk Sarpras</span>
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {submitted ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Permohonan Berhasil Dikirim!</h4>
              <p className="text-slate-500 text-xs">
                Data telah tersimpan di sistem Media Layanan Umum dan siap diverifikasi oleh Kasubbag TURT.
              </p>
            </div>
          ) : (
            <>
              {/* Common Identification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Pemohon *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Pegawai"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    className="w-full p-2 bg-white rounded border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Kerja / Bidang *</label>
                  <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full p-2 bg-white rounded border border-slate-300"
                  >
                    <option value="Bidang PPA I">Bidang PPA I</option>
                    <option value="Bidang PPA II">Bidang PPA II</option>
                    <option value="Bidang PAPK">Bidang PAPK</option>
                    <option value="Bidang SKKI">Bidang SKKI</option>
                    <option value="Bagian Umum">Bagian Umum</option>
                  </select>
                </div>
              </div>

              {/* Tab 1: Room Fields */}
              {activeTab === 'room' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pilih Ruangan *</label>
                    <select
                      value={selectedRoomId}
                      onChange={(e) => setSelectedRoomId(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300 bg-white"
                    >
                      {rooms.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.floor} · Kapasitas: {r.capacity} org)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Kegiatan *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Rapat Evaluasi Kinerja Anggaran Triwulan"
                      value={roomActivity}
                      onChange={(e) => setRoomActivity(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tanggal</label>
                      <input
                        type="date"
                        value={roomDate}
                        onChange={(e) => setRoomDate(e.target.value)}
                        className="w-full p-2 rounded border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Mulai Jam</label>
                      <input
                        type="time"
                        value={roomStartTime}
                        onChange={(e) => setRoomStartTime(e.target.value)}
                        className="w-full p-2 rounded border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Selesai Jam</label>
                      <input
                        type="time"
                        value={roomEndTime}
                        onChange={(e) => setRoomEndTime(e.target.value)}
                        className="w-full p-2 rounded border border-slate-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Vehicle Fields */}
              {activeTab === 'vehicle' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pilih Mobil Dinas *</label>
                    <select
                      value={selectedVehicleId}
                      onChange={(e) => setSelectedVehicleId(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300 bg-white"
                    >
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.plateNumber}) · Driver: {v.assignedDriver}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tujuan Lokasi *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: KPPN Bangko / Kantor BPKAD Muaro Jambi"
                      value={vehicleDestination}
                      onChange={(e) => setVehicleDestination(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Keperluan Tugas *</label>
                    <input
                      type="text"
                      required
                      placeholder="Maksud dan agenda kedinasan"
                      value={vehiclePurpose}
                      onChange={(e) => setVehiclePurpose(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: ATK */}
              {activeTab === 'atk' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Pilih Barang ATK *</label>
                      <select
                        value={selectedAtkCode}
                        onChange={(e) => setSelectedAtkCode(e.target.value)}
                        className="w-full p-2 rounded border border-slate-300 bg-white"
                      >
                        {atkCatalog.map(item => (
                          <option key={item.id} value={item.code}>
                            {item.name} (Stok: {item.stock} {item.unit})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Jumlah</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={atkQty}
                        onChange={(e) => setAtkQty(Number(e.target.value))}
                        className="w-full p-2 rounded border border-slate-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Keperluan Penggunaan *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Pencetakan Berkas SP2D dan Laporan Kinerja"
                      value={atkPurpose}
                      onChange={(e) => setAtkPurpose(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300"
                    />
                  </div>
                </div>
              )}

              {/* Tab 4: Ticket */}
              {activeTab === 'ticket' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Kategori Masalah *</label>
                      <select
                        value={ticketCategory}
                        onChange={(e) => setTicketCategory(e.target.value as any)}
                        className="w-full p-2 rounded border border-slate-300 bg-white"
                      >
                        <option value="AC / Tata Udara">AC / Tata Udara</option>
                        <option value="Kelistrikan & Lampu">Kelistrikan & Lampu</option>
                        <option value="Plumbing & Air">Plumbing & Sanitasi Air</option>
                        <option value="IT & Jaringan">IT, Jaringan & WiFi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Lokasi Ruangan *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Ruang Seksi PPA I Lantai 2"
                        value={ticketLocation}
                        onChange={(e) => setTicketLocation(e.target.value)}
                        className="w-full p-2 rounded border border-slate-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Judul Keluhan *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Lampu Downlight Padam"
                      value={ticketTitle}
                      onChange={(e) => setTicketTitle(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
                    <textarea
                      rows={2}
                      placeholder="Kondisi atau detail yang perlu diperhatikan teknisi"
                      value={ticketDesc}
                      onChange={(e) => setTicketDesc(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  Kirim Pengajuan
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
