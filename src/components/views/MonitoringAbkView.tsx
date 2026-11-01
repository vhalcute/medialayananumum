import React, { useState } from 'react';
import {
  BarChart3,
  Search,
  Download,
  Filter,
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  Sparkles,
  Info
} from 'lucide-react';

export interface AbkRow {
  no: number;
  unitOrganisasi: string;
  bebanKerjaUnit: string;
  kebutuhanPegawai: number;
  jumlahPegawai: number;
  selisih: number;
  keterangan: string;
  isHighlighted?: boolean;
}

export const ABK_DATA: AbkRow[] = [
  {
    no: 1,
    unitOrganisasi: 'Kepala Kantor Wilayah - Kantor Wilayah Direktorat Jenderal Perbendaharaan Provinsi Riau',
    bebanKerjaUnit: '1,506.63',
    kebutuhanPegawai: 1,
    jumlahPegawai: 1,
    selisih: 0,
    keterangan: '-'
  },
  {
    no: 2,
    unitOrganisasi: 'Analis Perbendaharaan Negara Ahli Pertama (ABK) - Kantor Wilayah Direktorat Jenderal Perbendaharaan Provinsi Riau',
    bebanKerjaUnit: '1,373.43',
    kebutuhanPegawai: 0,
    jumlahPegawai: 1,
    selisih: 1,
    keterangan: 'Kelebihan 1 Pegawai'
  },
  {
    no: 3,
    unitOrganisasi: 'Pranata Keuangan APBN Mahir - Kantor Direktorat Jenderal Perbendaharaan Provinsi Riau',
    bebanKerjaUnit: '1,226.40',
    kebutuhanPegawai: 1,
    jumlahPegawai: 1,
    selisih: 0,
    keterangan: '-'
  },
  {
    no: 4,
    unitOrganisasi: 'Bagian Umum',
    bebanKerjaUnit: '13,822.33',
    kebutuhanPegawai: 11,
    jumlahPegawai: 10,
    selisih: -1,
    keterangan: 'Kekurangan 1 Pegawai Pelaksana'
  },
  {
    no: 5,
    unitOrganisasi: 'Bagian Pembinaan Pelaksanaan Anggaran I',
    bebanKerjaUnit: '16,145.07',
    kebutuhanPegawai: 11,
    jumlahPegawai: 9,
    selisih: -2,
    keterangan: 'Kekurangan 2 Pegawai Pelaksana'
  },
  {
    no: 6,
    unitOrganisasi: 'Bagian Pembinaan Pelaksanaan Anggaran II',
    bebanKerjaUnit: '12,745.20',
    kebutuhanPegawai: 8,
    jumlahPegawai: 7,
    selisih: -1,
    keterangan: 'Kekurangan 1 Pegawai Pelaksana'
  },
  {
    no: 7,
    unitOrganisasi: 'Bidang Pembinaan Akuntansi dan Pelaporan Keuangan',
    bebanKerjaUnit: '11,803.78',
    kebutuhanPegawai: 8,
    jumlahPegawai: 7,
    selisih: -1,
    keterangan: 'Kekurangan 1 Pegawai Pelaksana'
  },
  {
    no: 9,
    unitOrganisasi: 'Bidang Supervisi KPPN dan Kepatuhan Internal',
    bebanKerjaUnit: '10,529.73',
    kebutuhanPegawai: 7,
    jumlahPegawai: 6,
    selisih: -1,
    keterangan: 'Kekurangan 1 Pejabat Pengawas'
  },
  {
    no: 10,
    unitOrganisasi: 'Kantor Pelayanan Perbendaharaan Negara Tipe A1 Pekanbaru',
    bebanKerjaUnit: '41,101.33',
    kebutuhanPegawai: 27,
    jumlahPegawai: 22,
    selisih: -5,
    keterangan: 'Kekurangan 1 Pejabat Pengawas dan 4 Pegawai Pelaksana'
  },
  {
    no: 11,
    unitOrganisasi: 'Kantor Pelayanan Perbendaharaan Negara Tipe A1 Dumai',
    bebanKerjaUnit: '30,469.98',
    kebutuhanPegawai: 18,
    jumlahPegawai: 14,
    selisih: -4,
    keterangan: 'Kekurangan 4 Pegawai Pelaksana'
  },
  {
    no: 12,
    unitOrganisasi: 'Kantor Pelayanan Perbendaharaan Negara Tipe A1 Rengat',
    bebanKerjaUnit: '20,841.07',
    kebutuhanPegawai: 13,
    jumlahPegawai: 10,
    selisih: -3,
    keterangan: 'Kekurangan 3 Pegawai Pelaksana',
    isHighlighted: true
  }
];

export const MonitoringAbkView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSelisih, setFilterSelisih] = useState<'all' | 'minus' | 'zero' | 'plus'>('all');

  const filteredData = ABK_DATA.filter((row) => {
    const matchSearch = row.unitOrganisasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.keterangan.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;

    if (filterSelisih === 'minus') return row.selisih < 0;
    if (filterSelisih === 'zero') return row.selisih === 0;
    if (filterSelisih === 'plus') return row.selisih > 0;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const headers = ['NO', 'UNIT ORGANISASI', 'BEBAN KERJA UNIT', 'KEBUTUHAN PEGAWAI', 'JUMLAH PEGAWAI', 'SELISIH', 'KETERANGAN'];
    const rows = ABK_DATA.map(r => [
      r.no,
      `"${r.unitOrganisasi}"`,
      `"${r.bebanKerjaUnit}"`,
      r.kebutuhanPegawai,
      r.jumlahPegawai,
      r.selisih,
      `"${r.keterangan}"`
    ]);
    rows.push([
      13,
      '"TOTAL"',
      '"161,564.95"',
      104,
      91,
      -13,
      '"Kekurangan 2 Pejabat Pengawas dan 11 Pegawai Pelaksana"'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Tabel_ABK_Kanwil_DJPb_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Beban Kerja Unit
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">
            161,564.95
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Satuan norma waktu jam kerja per tahun
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Kebutuhan Pegawai Ideal
          </div>
          <div className="text-2xl font-black text-[#003366] font-mono mt-1">
            104 Pegawai
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Kebutuhan formasi berdasarkan analisis ABK
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Eksisting Pegawai Aktif
          </div>
          <div className="text-2xl font-black text-emerald-800 font-mono mt-1">
            91 Pegawai
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Jumlah ASN terisi saat ini
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
            Defisit / Selisih Pegawai
          </div>
          <div className="text-2xl font-black text-rose-700 font-mono mt-1">
            -13 Pegawai
          </div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">
            2 Pengawas & 11 Pelaksana
          </div>
        </div>
      </div>

      {/* Main Table Container matching the screenshot */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Top Header Bar matching image: icon + TABEL ANALISIS BEBAN KERJA (ABK) + Status badge */}
        <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2.5">
            <span className="text-blue-700 text-lg sm:text-xl font-bold flex items-center">
              📊
            </span>
            <h2 className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900 tracking-tight uppercase">
              TABEL ANALISIS BEBAN KERJA (ABK) KANWIL DJPB PROVINSI RIAU & KPPN LINGKUP
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md">
              Status: Updated 2026
            </span>
            <button
              onClick={handleExportCsv}
              title="Ekspor CSV"
              className="p-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            </button>
            <button
              onClick={handlePrint}
              title="Cetak Tabel"
              className="p-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Unit Organisasi atau Keterangan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#003366]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Filter Status:</span>
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setFilterSelisih('all')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                  filterSelisih === 'all' ? 'bg-[#003366] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({ABK_DATA.length})
              </button>
              <button
                onClick={() => setFilterSelisih('minus')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                  filterSelisih === 'minus' ? 'bg-rose-600 text-white' : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                Defisit (-13)
              </button>
              <button
                onClick={() => setFilterSelisih('zero')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                  filterSelisih === 'zero' ? 'bg-slate-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Sesuai (2)
              </button>
              <button
                onClick={() => setFilterSelisih('plus')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                  filterSelisih === 'plus' ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                Lebih (+1)
              </button>
            </div>
          </div>
        </div>

        {/* Table itself - exactly matching image columns, colors, badges, and font weights */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111827] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <th className="py-3 px-3 text-center border-r border-slate-700/60 w-12">NO</th>
                <th className="py-3 px-4 border-r border-slate-700/60">UNIT ORGANISASI</th>
                <th className="py-3 px-4 text-center border-r border-slate-700/60 whitespace-nowrap">BEBAN KERJA UNIT</th>
                <th className="py-3 px-4 text-center border-r border-slate-700/60 whitespace-nowrap">KEBUTUHAN PEGAWAI</th>
                <th className="py-3 px-4 text-center border-r border-slate-700/60 whitespace-nowrap">JUMLAH PEGAWAI</th>
                <th className="py-3 px-3 text-center border-r border-slate-700/60 w-16">SELISIH</th>
                <th className="py-3 px-4">KETERANGAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
              {filteredData.map((row) => (
                <tr
                  key={row.no}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    row.isHighlighted ? 'bg-blue-50/40' : ''
                  }`}
                >
                  {/* NO */}
                  <td className="py-3 px-3 text-center font-bold text-slate-700 border-r border-slate-100">
                    {row.no}
                  </td>

                  {/* UNIT ORGANISASI */}
                  <td className="py-3 px-4 font-semibold text-slate-900 border-r border-slate-100 leading-snug">
                    {row.unitOrganisasi}
                  </td>

                  {/* BEBAN KERJA UNIT */}
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-900 border-r border-slate-100 whitespace-nowrap">
                    {row.isHighlighted ? (
                      <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded shadow-2xs">
                        {row.bebanKerjaUnit}
                      </span>
                    ) : (
                      row.bebanKerjaUnit
                    )}
                  </td>

                  {/* KEBUTUHAN PEGAWAI */}
                  <td className="py-3 px-4 text-center font-mono text-slate-800 border-r border-slate-100">
                    {row.isHighlighted ? (
                      <span className="bg-blue-600 text-white font-bold px-2.5 py-0.5 rounded shadow-2xs">
                        {row.kebutuhanPegawai}
                      </span>
                    ) : (
                      row.kebutuhanPegawai
                    )}
                  </td>

                  {/* JUMLAH PEGAWAI */}
                  <td className="py-3 px-4 text-center font-mono text-slate-800 border-r border-slate-100">
                    {row.isHighlighted ? (
                      <span className="bg-blue-600 text-white font-bold px-2.5 py-0.5 rounded shadow-2xs">
                        {row.jumlahPegawai}
                      </span>
                    ) : (
                      row.jumlahPegawai
                    )}
                  </td>

                  {/* SELISIH */}
                  <td className="py-3 px-3 text-center border-r border-slate-100">
                    {row.selisih === 0 && (
                      <span className="text-slate-400 font-bold font-mono">0</span>
                    )}
                    {row.selisih > 0 && (
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
                        +{row.selisih}
                      </span>
                    )}
                    {row.selisih < 0 && (
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                          row.isHighlighted
                            ? 'bg-blue-600 text-white'
                            : 'bg-rose-100 text-rose-700 border border-rose-300'
                        }`}
                      >
                        {row.selisih}
                      </span>
                    )}
                  </td>

                  {/* KETERANGAN */}
                  <td className="py-3 px-4">
                    {row.keterangan === '-' ? (
                      <span className="text-slate-400 font-medium">-</span>
                    ) : row.keterangan.includes('Kelebihan') ? (
                      <span className="inline-block px-3 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
                        {row.keterangan}
                      </span>
                    ) : row.isHighlighted ? (
                      <span className="inline-block px-3 py-1 rounded-md text-[11px] font-bold bg-blue-600 text-white shadow-2xs">
                        {row.keterangan}
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs">
                        {row.keterangan}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Table Footer: TOTAL Row exactly matching the screenshot */}
            <tfoot>
              <tr className="bg-[#0f172a] text-white font-bold text-xs sm:text-sm border-t-2 border-slate-800">
                {/* Square badge 13 in blue */}
                <td className="py-3 px-3 text-center">
                  <span className="inline-block bg-blue-600 text-white font-extrabold px-2 py-0.5 rounded text-xs">
                    13
                  </span>
                </td>

                <td className="py-3 px-4 uppercase tracking-wider font-extrabold text-white">
                  TOTAL
                </td>

                <td className="py-3 px-4 text-center font-mono font-extrabold text-white whitespace-nowrap">
                  161,564.95
                </td>

                <td className="py-3 px-4 text-center font-mono font-extrabold text-white">
                  104
                </td>

                <td className="py-3 px-4 text-center font-mono font-extrabold text-emerald-400">
                  91
                </td>

                <td className="py-3 px-3 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded text-xs font-black font-mono bg-rose-600 text-white">
                    -13
                  </span>
                </td>

                <td className="py-3 px-4 font-bold text-white text-xs">
                  Kekurangan 2 Pejabat Pengawas dan 11 Pegawai Pelaksana
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>Data Analisis Beban Kerja (ABK) diverifikasi secara berkala oleh Bagian Umum dan Subbagian Penilaian Kinerja.</span>
          </div>
          <div className="font-semibold text-slate-700">
            Total Unit: {ABK_DATA.length} Satuan Kerja Terdaftar
          </div>
        </div>
      </div>
    </div>
  );
};
