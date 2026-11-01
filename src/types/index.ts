export type ActiveTab = 
  | 'dashboard'
  | 'turt-ruangan'
  | 'turt-bmn'
  | 'turt-kendaraan'
  | 'turt-perbaikan'
  | 'turt-atk'
  | 'kepeg-gkm'
  | 'kepeg-seribu'
  | 'kepeg-beasiswa'
  | 'kepeg-tlego'
  | 'kepeg-dkm'
  | 'kepeg-berkas'
  | 'kepeg-cuti'
  | 'pk-monitoring'
  | 'pk-abk'
  | 'pk-dams'
  | 'pk-katalog'
  | 'pk-feedback'
  | 'pk-jadwal'
  | 'pk-rbk'
  | 'pk-dsku'
  | 'keu-rencana'
  | 'keu-realisasi'
  | 'keu-alokasi'
  | 'keu-realisasi-bidang'
  | 'info-evaluasi'
  | 'info-kegiatan'
  | 'info-agenda'
  | 'info-advocacy'
  | 'info-security'
  | 'admin-akses';

export type AppRole = 'Admin' | 'Kanwil' | 'KPPN';

export interface AdminAccessUser {
  id: string;
  username: string;
  password: string;
  role: AppRole;
  statusAkses: 'Aktif' | 'Nonaktif' | 'Terkunci';
  lastLogin?: string;
  createdAt: string;
  satkerName?: string;
  namaLengkap?: string;
}

export interface EmployeeAdvocacyRecord {
  id: string;
  namaPegawai: string;
  nip: string;
  bidang: string;
  platform: 'Instagram' | 'LinkedIn' | 'X (Twitter)' | 'Facebook' | 'TikTok';
  judulKampanye: string;
  linkUnggahan: string;
  tanggalUnggah: string;
  statusPengisian: 'Sudah Mengisi' | 'Belum Mengisi';
  statusVerifikasi: 'Terverifikasi' | 'Menunggu' | 'Perlu Perbaikan';
}

export interface SecurityMonitoringRecord {
  id: string;
  tanggal: string;
  shift: 'Pagi (07:00 - 15:00)' | 'Siang (15:00 - 23:00)' | 'Malam (23:00 - 07:00)';
  danru: string;
  personelCount: number;
  posJaga: string[];
  kondisiKeamanan: 'Aman & Terkendali' | 'Tertib' | 'Insiden / Perhatian Khusus';
  catatanMutasi: string;
  cctvStatus: 'Normal (100%)' | 'Sebagian Offline';
  verifikator: string;
}

export interface GkmItem {
  no: number;
  roomAndMedia: string; // Ruangan dan Media
  title: string;        // Judul GKM
  speaker: string;      // Narasumber
  date: string;         // Tanggal GKM
  startTime: string;    // Mulai Jam
  endTime: string;      // Selesai Jam
  status?: 'Dijadwalkan' | 'Berlangsung' | 'Selesai';
  notes?: string;
}

export interface PerformanceScheduleItem {
  id: number;
  activity: string;
  subText?: string;
  tags: { text: string; link?: string; variant?: 'blue' | 'slate' | 'amber' }[];
  deadline: string;
  deadlineCategory: 'Selesai' | 'Paling Lambat' | 'Sebelum' | 'Sesudah';
  targetDate: string;
  isCompleted?: boolean;
  actionUrl?: string;
}

export interface RoomItem {
  id: string;
  name: string;
  floor: string;
  capacity: number;
  description: string;
  facilities: string[];
  imagePlaceholderColor: string;
  isAvailableToday: boolean;
}

export interface RoomBooking {
  id: string;
  roomName: string;
  roomId: string;
  activityName: string;
  division: string;
  picName: string;
  picPhone?: string;
  date: string;
  startTime: string;
  endTime: string;
  attendeesCount: number;
  facilitiesNeeded: string[];
  consumptionNote?: string;
  status: 'Menunggu' | 'Disetujui' | 'Berlangsung' | 'Selesai' | 'Ditolak';
  submittedAt: string;
}

export interface VehicleItem {
  id: string;
  name: string;
  plateNumber: string;
  type: string;
  capacity: string;
  assignedDriver: string;
  driverPhone: string;
  status: 'Tersedia' | 'Sedang Digunakan' | 'Dalam Perawatan';
}

export interface VehicleBooking {
  id: string;
  vehicleName: string;
  plateNumber: string;
  serviceType?: 'Dengan Supir' | 'Tanpa Supir';
  driverName: string;
  purpose: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  returnDate: string;
  returnTime: string;
  requesterName: string;
  division: string;
  passengerCount: number;
  status: 'Menunggu' | 'Disetujui' | 'Berlangsung' | 'Selesai' | 'Ditolak';
  submittedAt: string;
}

export interface BmnItem {
  id: string;
  code: string;
  name: string;
  category: string;
  totalQty: number;
  availableQty: number;
  condition: string;
  location: string;
}

export interface BmnBorrowing {
  id: string;
  itemCode?: string;
  itemName: string;
  quantity: number;
  borrowerName: string;
  division: string;
  purpose?: string;
  borrowDate: string;
  returnPlanDate?: string;
  actualReturnDate?: string;
  status: 'Menunggu' | 'Disetujui' | 'Dipinjam' | 'Kembali' | 'Ditolak';
}

export interface MaintenanceTicket {
  id: string;
  category: 'AC / Tata Udara' | 'Kelistrikan & Lampu' | 'Plumbing & Air' | 'Meubeler & Furniture' | 'IT & Jaringan' | 'Bangunan & Gedung';
  location: string;
  title: string;
  description: string;
  priority: 'Rendah' | 'Sedang' | 'Mendesak';
  reporterName: string;
  division: string;
  submittedAt: string;
  status: 'Menunggu' | 'Dikerjakan' | 'Selesai';
  technicianNotes?: string;
}

export interface AtkItem {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  stock: number;
  minStock: number;
}

export interface AtkRequest {
  id: string;
  requesterName: string;
  division: string;
  items: { code: string; name: string; qty: number; unit: string }[];
  purpose: string;
  requestDate: string;
  status: 'Menunggu Kasubbag' | 'Disetujui' | 'Siap Diambil' | 'Selesai' | 'Ditolak';
}

export interface TodayAgenda {
  id: string;
  category: 'rapat' | 'kendaraan' | 'bmn' | 'kinerja';
  title: string;
  time: string;
  location: string;
  pic: string;
  division: string;
  status: string;
  badgeColor?: string;
}

export interface OvertimeBudgetRow {
  bidang: string;
  paguTahun: number;
  realisasiSdTw3: number;
  sisaPagu: number;
  persentase: number;
  jumlahPegawai: number;
  jamLemburTotal: number;
}

export interface KpiItem {
  no: number;
  name: string;
  targetTw3: string;
  realisasiTw3: string;
  capaian: number;
  unit: string;
  picUnit: string;
  status: 'Melampaui' | 'Tercapai' | 'Perlu Perhatian';
}

export interface CekSeribuRecord {
  id: string;
  namaPegawai: string;
  nip?: string;
  tanggal: string; // e.g. "26-OKT-26"
  hadir: 'Ada' | 'Tidak';
  pulang: 'Ada' | 'Tidak';
  keterangan?: string;
}

export interface CekSeribuMatrixRow {
  id: string;
  namaPegawai: string;
  nip?: string;
  records: {
    [dateKey: string]: {
      hadir: 'Ada' | 'Tidak';
      pulang: 'Ada' | 'Tidak';
    };
  };
}

export interface BeasiswaItem {
  id: string;
  namaProgram: string; // Nama Program Beasiswa / Layanan
  penyelenggara: string; // Penyelenggara
  jenjangProgram: string; // Jenjang Program (S2, S3, Non-Gelar, dll)
  batasPendaftaran: string; // Batas Pendaftaran
  deskripsiRincian: string; // Deskripsi & Rincian Layanan
  syaratKelayakan: string[]; // Syarat Kelayakan Utama (1 Syarat per baris)
  status?: 'Buka' | 'Segera Ditutup' | 'Akan Datang' | 'Selesai';
  kategori?: 'Dalam Negeri' | 'Luar Negeri' | 'Kedinasan Kemenkeu' | 'Non-Gelar / Sertifikasi';
  linkPendaftaran?: string;
  kuotaPerkiraan?: string;
}
