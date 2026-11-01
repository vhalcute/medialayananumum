import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';
import { RoomBooking, VehicleBooking, BmnBorrowing, AtkRequest } from '../../types';

interface PrintDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'room' | 'vehicle' | 'bmn' | 'atk';
  data: any;
}

export const PrintDocumentModal: React.FC<PrintDocumentModalProps> = ({
  isOpen,
  onClose,
  documentType,
  data,
}) => {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-300 overflow-hidden my-8">
        {/* Modal Top Bar (Hidden in print) */}
        <div className="bg-[#002b49] text-white px-5 py-3.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-sm">Pratinjau Lembar Dokumen Resmi Kanwil DJPb Prov. Jambi</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Dokumen</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Sheet */}
        <div className="p-8 sm:p-12 text-slate-900 bg-white font-serif leading-normal select-text">
          {/* Official Letterhead (KOP SURAT RESMI KEMENKEU DJPB) */}
          <div className="border-b-2 border-slate-900 pb-3 mb-6 flex items-center gap-5">
            <div className="w-16 h-16 shrink-0 flex items-center justify-center border border-amber-600/40 rounded-full bg-amber-50 text-amber-900 font-bold font-sans">
              <ShieldCheck className="w-10 h-10 text-[#003366]" />
            </div>
            <div className="text-center flex-1">
              <div className="text-xs uppercase tracking-widest font-sans font-bold text-slate-700">
                KEMENTERIAN KEUANGAN REPUBLIK INDONESIA
              </div>
              <div className="text-sm uppercase tracking-wider font-sans font-extrabold text-[#003366]">
                DIREKTORAT JENDERAL PERBENDAHARAAN
              </div>
              <div className="text-base uppercase tracking-wider font-sans font-black text-slate-900">
                KANTOR WILAYAH PROVINSI JAMBI
              </div>
              <div className="text-[11px] font-sans text-slate-600 mt-0.5">
                Jalan Jenderal A. Yani No. 8, Telanaipura, Jambi 36122 · Telepon: (0741) 60124 · Surel: kanwil.djpb.jambi@kemenkeu.go.id
              </div>
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center mb-6">
            <div className="text-sm font-sans font-extrabold uppercase tracking-wide underline underline-offset-4">
              {documentType === 'room' && 'LEMBAR KONFIRMASI PEMINJAMAN RUANG RAPAT'}
              {documentType === 'vehicle' && 'SURAT IZIN PEMAKAIAN KENDARAAN DINAS & PENUGASAN DRIVER'}
              {documentType === 'bmn' && 'BERITA ACARA PINJAM PAKAI BARANG MILIK NEGARA (BMN)'}
              {documentType === 'atk' && 'SURAT BUKTI PENGELUARAN BARANG PERSEDIAAN (BON ATK)'}
            </div>
            <div className="text-xs font-mono text-slate-600 mt-1">
              Nomor: {data.id} / MLU-TURT / {new Date().getFullYear()}
            </div>
          </div>

          {/* Content Body */}
          <div className="text-xs space-y-4 font-sans">
            <p className="leading-relaxed">
              Menerangkan bahwa permohonan layanan pada Media Layanan Umum (MLU) Kantor Wilayah Direktorat Jenderal Perbendaharaan Provinsi Jambi telah diverifikasi dan disetujui dengan rincian data sebagai berikut:
            </p>

            {/* Room Details */}
            {documentType === 'room' && (
              <table className="w-full text-xs border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-3 bg-slate-50 font-semibold w-1/3">Nama Ruang Rapat</td>
                    <td className="py-2 px-3 font-bold">{data.roomName}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-3 bg-slate-50 font-semibold">Nama Kegiatan / Agenda</td>
                    <td className="py-2 px-3">{data.activityName}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-3 bg-slate-50 font-semibold">Unit Kerja Pemohon</td>
                    <td className="py-2 px-3">{data.division}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-3 bg-slate-50 font-semibold">Nama Peminjam / Penanggung Jawab</td>
                    <td className="py-2 px-3">{data.picName}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-3 bg-slate-50 font-semibold">Waktu Pelaksanaan</td>
                    <td className="py-2 px-3 font-semibold text-blue-950">
                      {data.date} · Pukul {data.startTime} s.d. {data.endTime} WIB
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-3 bg-slate-50 font-semibold">Jumlah Peserta Hadir</td>
                    <td className="py-2 px-3">{data.attendeesCount} Orang</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 bg-slate-50 font-semibold">Fasilitas Disiapkan</td>
                    <td className="py-2 px-3">{data.facilitiesNeeded?.join(', ') || '-'}</td>
                  </tr>
                </tbody>
              </table>
            )}

            {/* Vehicle Details */}
            {documentType === 'vehicle' && (
              <table className="w-full text-xs border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-3 bg-slate-50 font-semibold w-1/3">Kendaraan Dinas</td>
                    <td className="py-2 px-3 font-bold">{data.vehicleName} ({data.plateNumber})</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-3 bg-slate-50 font-semibold">Pilihan Layanan</td>
                    <td className="py-2 px-3 font-semibold text-blue-900">
                      {data.serviceType || (data.driverName?.toLowerCase().includes('tanpa') ? 'Tanpa Supir (Lepas Kunci)' : 'Dengan Supir')} ({data.driverName})
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-3 bg-slate-50 font-semibold">Pengemudi Ditugaskan</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{data.driverName}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-3 bg-slate-50 font-semibold">Tujuan Perjalanan Dinas</td>
                    <td className="py-2 px-3 font-semibold">{data.destination}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-3 bg-slate-50 font-semibold">Maksud & Keperluan</td>
                    <td className="py-2 px-3">{data.purpose}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-3 bg-slate-50 font-semibold">Jadwal Keberangkatan</td>
                    <td className="py-2 px-3">{data.departureDate} ({data.departureTime} WIB) s.d. {data.returnDate} ({data.returnTime} WIB)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 bg-slate-50 font-semibold">Pejabat / Pemohon</td>
                    <td className="py-2 px-3">{data.requesterName} ({data.division})</td>
                  </tr>
                </tbody>
              </table>
            )}

            {/* BMN Details */}
            {documentType === 'bmn' && (
              <table className="w-full text-xs border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-3 bg-slate-50 font-semibold w-1/3">Nama Barang BMN</td>
                    <td className="py-2 px-3 font-bold">{data.itemName}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-3 bg-slate-50 font-semibold">Kode Registrasi BMN</td>
                    <td className="py-2 px-3 font-mono">{data.itemCode}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-3 bg-slate-50 font-semibold">Jumlah Dipinjam</td>
                    <td className="py-2 px-3 font-bold">{data.quantity} Unit</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-3 bg-slate-50 font-semibold">Peminjam / Unit Kerja</td>
                    <td className="py-2 px-3">{data.borrowerName} ({data.division})</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 bg-slate-50 font-semibold">Keperluan & Masa Pinjam</td>
                    <td className="py-2 px-3">{data.purpose} (Tanggal {data.borrowDate} s.d. {data.returnPlanDate})</td>
                  </tr>
                </tbody>
              </table>
            )}

            {/* ATK Details */}
            {documentType === 'atk' && (
              <div>
                <div className="mb-2">
                  <span className="font-semibold">Nama Pemohon: </span>{data.requesterName} ({data.division})
                  <br />
                  <span className="font-semibold">Peruntukan: </span>{data.purpose}
                </div>
                <table className="w-full text-xs border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300">
                      <th className="py-2 px-3 text-left">KODE</th>
                      <th className="py-2 px-3 text-left">NAMA BARANG</th>
                      <th className="py-2 px-3 text-right">JUMLAH</th>
                      <th className="py-2 px-3 text-center">SATUAN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items?.map((item: any, idx: number) => (
                      <tr key={idx} className="border-b border-slate-200">
                        <td className="py-2 px-3 font-mono">{item.code}</td>
                        <td className="py-2 px-3 font-medium">{item.name}</td>
                        <td className="py-2 px-3 text-right font-bold font-mono">{item.qty}</td>
                        <td className="py-2 px-3 text-center">{item.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="pt-2 text-[11px] text-slate-500 italic">
              Catatan: Pemohon bertanggung jawab penuh atas pemeliharaan ketertiban, kebersihan, dan keselamatan inventaris selama penggunaan.
            </p>

            {/* Signature Blocks */}
            <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <p className="text-slate-600">Pemohon / Penanggung Jawab,</p>
                <div className="h-16 flex items-center justify-center">
                  <span className="text-[10px] text-slate-400 border border-dashed border-slate-300 px-3 py-1 rounded">
                    Tanda Tangan Digital Pemohon
                  </span>
                </div>
                <p className="font-bold underline text-slate-900">
                  {data.picName || data.requesterName || data.borrowerName || 'Pegawai Pemohon'}
                </p>
                <p className="text-[10px] text-slate-500">{data.division || 'Kanwil DJPb Prov. Jambi'}</p>
              </div>

              <div>
                <p className="text-slate-600">Mengetahui & Menyetujui,<br />Kepala Subbagian TURT</p>
                <div className="h-16 flex items-center justify-center">
                  <div className="border border-emerald-500 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>TERVERIFIKASI SISTEM MLU</span>
                  </div>
                </div>
                <p className="font-bold underline text-slate-900">Drs. M. Zulkifli, M.M.</p>
                <p className="text-[10px] text-slate-500">NIP. 19740815 199903 1 001</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar (Hidden in print) */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-2 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Dokumen Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
