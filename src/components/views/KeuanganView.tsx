import React, { useState } from 'react';
import {
  Receipt,
  PiggyBank,
  PieChart,
  BarChart3,
  Plus,
  CheckCircle2,
  Calendar,
  Clock,
  Printer,
  DollarSign
} from 'lucide-react';
import { OvertimeBudgetRow } from '../../types';
import { INITIAL_OVERTIME_BUDGET } from '../../data/mockData';

export const KeuanganView: React.FC = () => {
  const [budgetRows] = useState<OvertimeBudgetRow[]>(INITIAL_OVERTIME_BUDGET);
  const [showSplForm, setShowSplForm] = useState(false);
  const [splDivision, setSplDivision] = useState('Bidang Pembinaan Akuntansi & Pelaporan Keuangan (PAPK)');
  const [splDate, setSplDate] = useState('2026-10-31');
  const [splActivity, setSplActivity] = useState('');
  const [splCount, setSplCount] = useState(4);
  const [splSuccess, setSplSuccess] = useState(false);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const totalPagu = budgetRows.reduce((sum, r) => sum + r.paguTahun, 0);
  const totalRealisasi = budgetRows.reduce((sum, r) => sum + r.realisasiSdTw3, 0);
  const totalSisa = budgetRows.reduce((sum, r) => sum + r.sisaPagu, 0);
  const totalPersen = ((totalRealisasi / totalPagu) * 100).toFixed(1);

  const handleSplSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSplSuccess(true);
    setTimeout(() => {
      setSplSuccess(false);
      setShowSplForm(false);
      setSplActivity('');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700"></span>
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Subbagian Keuangan</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">Pengelolaan Anggaran & Realisasi Lembur Pegawai</h1>
          <p className="text-xs text-slate-500">
            Transparansi alokasi pagu DIPA, realisasi belanja lemur & uang makan lembur, serta penerbitan Surat Perintah Lembur (SPL).
          </p>
        </div>

        <button
          onClick={() => setShowSplForm(!showSplForm)}
          className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>{showSplForm ? 'Tutup Formulir' : '+ Ajukan Surat Perintah Lembur (SPL)'}</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Pagu DIPA Lembur 2026</div>
          <div className="text-xl font-extrabold text-slate-900 mt-1 font-mono">{formatRupiah(totalPagu)}</div>
          <div className="text-[11px] text-slate-500 mt-1">DIPA Kanwil DJPb Jambi</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Realisasi s.d. Triwulan III</div>
          <div className="text-xl font-extrabold text-blue-800 mt-1 font-mono">{formatRupiah(totalRealisasi)}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Penyerapan: {totalPersen}%</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Sisa Pagu Tersedia (TW IV)</div>
          <div className="text-xl font-extrabold text-emerald-700 mt-1 font-mono">{formatRupiah(totalSisa)}</div>
          <div className="text-[11px] text-slate-500 mt-1">Siap untuk penutupan tahun anggaran</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Total Jam Lembur Dilayani</div>
          <div className="text-xl font-extrabold text-purple-700 mt-1 font-mono">1.547 Jam</div>
          <div className="text-[11px] text-slate-500 mt-1">80 Pegawai penerima lembur</div>
        </div>
      </div>

      {/* SPL Form (Collapsible) */}
      {showSplForm && (
        <form onSubmit={handleSplSubmit} className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-700" />
              <span>Pengajuan Penerbitan Surat Perintah Lembur (SPL)</span>
            </h3>
            <span className="text-[11px] text-slate-500">Standar Subbagian Keuangan Kanwil Jambi</span>
          </div>

          {splSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Pengajuan SPL berhasil disimpan dan diteruskan ke PPK untuk penetapan!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Unit Kerja / Bidang Pemohon *</label>
              <select
                value={splDivision}
                onChange={(e) => setSplDivision(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Bidang Pembinaan Akuntansi & Pelaporan Keuangan (PAPK)">Bidang PAPK</option>
                <option value="Bidang Pembinaan Pelaksanaan Anggaran I (PPA I)">Bidang PPA I</option>
                <option value="Bidang Pembinaan Pelaksanaan Anggaran II (PPA II)">Bidang PPA II</option>
                <option value="Bidang Supervisi KPPN dan Kepatuhan Internal (SKKI)">Bidang SKKI</option>
                <option value="Bagian Umum (Subbagian TURT / Kepeg / Keu / PK)">Bagian Umum</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Pelaksanaan Lembur *</label>
              <input
                type="date"
                value={splDate}
                onChange={(e) => setSplDate(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Uraian Pekerjaan / Agenda Lembur *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Rekonsiliasi Akhir Bulan Data SP2D dan Penyusunan Laporan Keuangan Konsolidasi"
                value={splActivity}
                onChange={(e) => setSplActivity(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Perkiraan Jumlah Pegawai Lembur</label>
              <input
                type="number"
                min="1"
                max="20"
                value={splCount}
                onChange={(e) => setSplCount(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Waktu Lembur Rencana</label>
              <input
                type="text"
                defaultValue="17.30 s.d. 21.00 WIB (3.5 Jam)"
                className="w-full p-2.5 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowSplForm(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Kirim Pengajuan SPL ke Subbag Keuangan
            </button>
          </div>
        </form>
      )}

      {/* Budget Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Alokasi & Realisasi Anggaran Lembur Per Bidang / Bagian Tahun 2026
            </h2>
            <p className="text-xs text-slate-500">Monitoring realisasi s.d. Triwulan III (Per 30 September 2026)</p>
          </div>
          <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            Mata Anggaran: 512211 (Belanja Lembur)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#003366] text-white font-semibold">
                <th className="py-2.5 px-4">UNIT KERJA / BIDANG</th>
                <th className="py-2.5 px-4 text-right">PAGU TAHUN (RP)</th>
                <th className="py-2.5 px-4 text-right">REALISASI TW III (RP)</th>
                <th className="py-2.5 px-4 text-right">SISA PAGU (RP)</th>
                <th className="py-2.5 px-4 text-center">% PENYERAPAN</th>
                <th className="py-2.5 px-4 text-center">PEGAWAI</th>
                <th className="py-2.5 px-4 text-center">TOTAL JAM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {budgetRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-slate-900">{row.bidang}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-700">{formatRupiah(row.paguTahun)}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-blue-900">{formatRupiah(row.realisasiSdTw3)}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-700 font-semibold">{formatRupiah(row.sisaPagu)}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-700 h-2 rounded-full"
                          style={{ width: `${row.persentase}%` }}
                        ></div>
                      </div>
                      <span className="font-mono font-bold text-slate-800 text-[11px]">{row.persentase}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-slate-700">{row.jumlahPegawai} org</td>
                  <td className="py-3 px-4 text-center font-mono text-slate-700">{row.jamLemburTotal} jam</td>
                </tr>
              ))}
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                <td className="py-3 px-4 uppercase">Total Kanwil DJPb Prov. Jambi</td>
                <td className="py-3 px-4 text-right font-mono">{formatRupiah(totalPagu)}</td>
                <td className="py-3 px-4 text-right font-mono text-blue-900">{formatRupiah(totalRealisasi)}</td>
                <td className="py-3 px-4 text-right font-mono text-emerald-700">{formatRupiah(totalSisa)}</td>
                <td className="py-3 px-4 text-center font-mono">{totalPersen}%</td>
                <td className="py-3 px-4 text-center font-mono">80 org</td>
                <td className="py-3 px-4 text-center font-mono">1.547 jam</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
