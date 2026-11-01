import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Search,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Building,
  ShieldCheck,
  Award,
  Users,
  Clock,
  Folder,
  ThumbsUp,
  ClipboardCheck,
  Calendar,
  Megaphone
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { MonitoringAbkView } from './MonitoringAbkView';
import { PerformanceAgendaTable } from '../PerformanceAgendaTable';
import { INITIAL_PERFORMANCE_SCHEDULE } from '../../data/mockData';

interface MultiQuarterIku {
  no: number;
  code: string;
  codeVariant: 'blue' | 'purple';
  name: string;
  q1: { target: string | number; realisasi: string | number; indeks: string | number };
  q2: { target: string | number; realisasi: string | number; indeks: string | number };
  q3: { target: string | number; realisasi: string | number; indeks: string | number };
  q4: { target: string | number; realisasi: string | number; indeks: string | number };
}

const IKU_DATA: MultiQuarterIku[] = [
  {
    no: 1,
    code: '1a-CP',
    codeVariant: 'blue',
    name: 'Indeks Kualitas Nilai IKPA K/L',
    q1: { target: 3, realisasi: 3.75, indeks: 120 },
    q2: { target: 3, realisasi: '-', indeks: '-' },
    q3: { target: 3, realisasi: '-', indeks: '-' },
    q4: { target: 3, realisasi: '-', indeks: '-' },
  },
  {
    no: 2,
    code: '2a-CP',
    codeVariant: 'blue',
    name: 'Tingkat kepuasan terhadap layanan Kanwil DJPb',
    q1: { target: 100, realisasi: 116.83, indeks: 116.83 },
    q2: { target: 100, realisasi: '-', indeks: '-' },
    q3: { target: 100, realisasi: '-', indeks: '-' },
    q4: { target: 100, realisasi: '-', indeks: '-' },
  },
  {
    no: 3,
    code: '3a-CP',
    codeVariant: 'blue',
    name: 'Indeks Efektivitas Pelaksanaan Anggaran Pusat dan Daerah',
    q1: { target: 4, realisasi: 5, indeks: 120 },
    q2: { target: 4, realisasi: '-', indeks: '-' },
    q3: { target: 4, realisasi: '-', indeks: '-' },
    q4: { target: 4, realisasi: '-', indeks: '-' },
  },
  {
    no: 4,
    code: '3b-N',
    codeVariant: 'purple',
    name: 'Indeks kualitas operasional Treasury',
    q1: { target: 4.1, realisasi: 5, indeks: 120 },
    q2: { target: 4.1, realisasi: '-', indeks: '-' },
    q3: { target: 4.1, realisasi: '-', indeks: '-' },
    q4: { target: 4.1, realisasi: '-', indeks: '-' },
  },
  {
    no: 5,
    code: '4a-N',
    codeVariant: 'purple',
    name: 'Indeks Kualitas Laporan Government Finance Statistic (GFS) Tingkat Wilayah',
    q1: { target: 4.1, realisasi: 5, indeks: 120 },
    q2: { target: 4.1, realisasi: '-', indeks: '-' },
    q3: { target: 4.1, realisasi: '-', indeks: '-' },
    q4: { target: 4.1, realisasi: '-', indeks: '-' },
  },
  {
    no: 6,
    code: '4b-N',
    codeVariant: 'purple',
    name: 'Indeks Kualitas Analisis Keuangan BUN Tingkat Wilayah',
    q1: { target: 4, realisasi: 5, indeks: 120 },
    q2: { target: 4, realisasi: '-', indeks: '-' },
    q3: { target: 4, realisasi: '-', indeks: '-' },
    q4: { target: 4, realisasi: '-', indeks: '-' },
  },
  {
    no: 7,
    code: '5a-N',
    codeVariant: 'purple',
    name: 'Indeks Kualitas Pelaksanaan Special Mission di Daerah',
    q1: { target: 4, realisasi: 5, indeks: 120 },
    q2: { target: 4, realisasi: '-', indeks: '-' },
    q3: { target: 4, realisasi: '-', indeks: '-' },
    q4: { target: 4, realisasi: '-', indeks: '-' },
  },
  {
    no: 8,
    code: '6a-N',
    codeVariant: 'purple',
    name: 'Tingkat kualitas pengelolaan kinerja organisasi',
    q1: { target: 100, realisasi: 120, indeks: 120 },
    q2: { target: 100, realisasi: '-', indeks: '-' },
    q3: { target: 100, realisasi: '-', indeks: '-' },
    q4: { target: 100, realisasi: '-', indeks: '-' },
  },
  {
    no: 9,
    code: '6b-N',
    codeVariant: 'purple',
    name: 'Nilai implementasi Learning Organization',
    q1: { target: 30, realisasi: 55.31, indeks: 120 },
    q2: { target: 50, realisasi: '-', indeks: '-' },
    q3: { target: 70, realisasi: '-', indeks: '-' },
    q4: { target: 90, realisasi: '-', indeks: '-' },
  },
];

interface PenilaianKinerjaViewProps {
  currentTab?: ActiveTab;
}

export const PenilaianKinerjaView: React.FC<PenilaianKinerjaViewProps> = ({ currentTab }) => {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'abk' | 'dams' | 'katalog' | 'feedback' | 'jadwal'>('monitoring');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState<'all' | 'q1' | 'q2' | 'q3' | 'q4'>('all');

  useEffect(() => {
    if (currentTab === 'pk-abk') {
      setActiveTab('abk');
    } else if (currentTab === 'pk-monitoring') {
      setActiveTab('monitoring');
    } else if (currentTab === 'pk-dams') {
      setActiveTab('dams');
    } else if (currentTab === 'pk-katalog') {
      setActiveTab('katalog');
    } else if (currentTab === 'pk-feedback') {
      setActiveTab('feedback');
    } else if (currentTab === 'pk-jadwal') {
      setActiveTab('jadwal');
    }
  }, [currentTab]);

  const filteredIku = IKU_DATA.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Subbagian Penilaian Kinerja Header & Sub-tabs */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700"></span>
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Subbagian Penilaian Kinerja
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Monitoring & Evaluasi Kinerja Organisasi
          </h1>
          <p className="text-xs text-slate-500">
            Capaian IKU Triwulanan, Analisis Beban Kerja (ABK), Rekonsiliasi DAMS, dan Pengelolaan Kinerja Pegawai.
          </p>
        </div>

        {/* Sub-tabs switcher buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'monitoring' ? 'bg-[#003366] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monitoring Kinerja
          </button>
          <button
            onClick={() => setActiveTab('abk')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'abk' ? 'bg-[#003366] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monitoring ABK
          </button>
          <button
            onClick={() => setActiveTab('dams')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'dams' ? 'bg-[#003366] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monitoring DAMS
          </button>
          <button
            onClick={() => setActiveTab('katalog')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'katalog' ? 'bg-[#003366] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Katalog IKU / HKT
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'feedback' ? 'bg-[#003366] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Feedback Layanan
          </button>
          <button
            onClick={() => setActiveTab('jadwal')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'jadwal' ? 'bg-[#003366] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Perekaman Capaian IKI TW III
          </button>
        </div>
      </div>

      {/* Tab 2: Monitoring ABK (Matching user attachment) */}
      {activeTab === 'abk' && (
        <MonitoringAbkView />
      )}

      {/* Tab 1: Monitoring Kinerja (IKU) */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          {/* 1. Top KPI Summary Cards (Exactly matching screenshot) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: NKO / Capaian */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                103.42%
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <span>▲</span>
                <span>Meningkat 1.2% dari triwulan I</span>
              </div>
            </div>

        {/* Card 2: 0 IKU deviasi */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="text-3xl font-extrabold text-red-600 font-mono tracking-tight">
            0 IKU
          </div>
          <div className="mt-2 text-xs font-medium text-slate-500">
            Sesuai ekspektasi Kemenkeu
          </div>
        </div>

        {/* Card 3: Kepuasan Layanan */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight flex items-baseline">
            <span>4.82</span>
            <span className="text-sm font-semibold text-slate-400 font-sans">/5.00</span>
          </div>
          <div className="mt-2 text-xs font-semibold text-emerald-700">
            Kategori: Sangat Memuaskan
          </div>
        </div>
      </div>

      {/* 2. Main IKU Table Section (Matching screenshot) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-900 shrink-0 mt-0.5">
              <BarChart3 className="w-5 h-5 text-[#003366]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                DAFTAR INDIKATOR KINERJA UTAMA (IKU) SUBBAGIAN PENILAIAN KINERJA
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Target, Realisasi, dan Indeks Capaian IKU Triwulan Kanwil DJPb Provinsi Jambi
              </p>
            </div>
          </div>

          {/* Search & Quarter Filter Segmented Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Kode atau Indikator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-[#003366] w-48 sm:w-60 shadow-2xs"
              />
            </div>

            {/* Segmented Quarter Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setSelectedQuarter('all')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  selectedQuarter === 'all'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua Q
              </button>
              <button
                onClick={() => setSelectedQuarter('q1')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  selectedQuarter === 'q1'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Q1
              </button>
              <button
                onClick={() => setSelectedQuarter('q2')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  selectedQuarter === 'q2'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Q2
              </button>
              <button
                onClick={() => setSelectedQuarter('q3')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  selectedQuarter === 'q3'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Q3
              </button>
              <button
                onClick={() => setSelectedQuarter('q4')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  selectedQuarter === 'q4'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Q4
              </button>
            </div>
          </div>
        </div>

        {/* Multi-Quarter Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              {/* Row 1 Header */}
              <tr className="bg-[#0b1d3a] text-white text-[11px] font-bold tracking-wider">
                <th rowSpan={2} className="py-2.5 px-3 w-12 text-center border-r border-slate-700">
                  NO
                </th>
                <th rowSpan={2} className="py-2.5 px-3 w-20 text-center border-r border-slate-700">
                  KODE
                </th>
                <th rowSpan={2} className="py-2.5 px-4 min-w-[280px] border-r border-slate-700">
                  INDIKATOR KINERJA UTAMA (IKU)
                </th>

                {(selectedQuarter === 'all' || selectedQuarter === 'q1') && (
                  <th colSpan={3} className="py-2 px-3 text-center border-r border-slate-700 bg-[#0f2444]">
                    TRIWULAN I (Q1)
                  </th>
                )}
                {(selectedQuarter === 'all' || selectedQuarter === 'q2') && (
                  <th colSpan={3} className="py-2 px-3 text-center border-r border-slate-700 bg-[#0f2444]">
                    TRIWULAN II (Q2)
                  </th>
                )}
                {(selectedQuarter === 'all' || selectedQuarter === 'q3') && (
                  <th colSpan={3} className="py-2 px-3 text-center border-r border-slate-700 bg-[#0f2444]">
                    TRIWULAN III (Q3)
                  </th>
                )}
                {(selectedQuarter === 'all' || selectedQuarter === 'q4') && (
                  <th colSpan={3} className="py-2 px-3 text-center bg-[#0f2444]">
                    TRIWULAN IV (Q4)
                  </th>
                )}
              </tr>

              {/* Row 2 Sub-Headers */}
              <tr className="bg-[#132c52] text-white text-[10px] font-semibold tracking-wider">
                {(selectedQuarter === 'all' || selectedQuarter === 'q1') && (
                  <>
                    <th className="py-1.5 px-2.5 text-center border-r border-slate-700 w-16">TARGET</th>
                    <th className="py-1.5 px-2.5 text-center border-r border-slate-700 w-20 text-amber-300 font-bold">REALISASI</th>
                    <th className="py-1.5 px-2.5 text-center border-r border-slate-700 w-16 text-emerald-300 font-bold">INDEKS</th>
                  </>
                )}
                {(selectedQuarter === 'all' || selectedQuarter === 'q2') && (
                  <>
                    <th className="py-1.5 px-2.5 text-center border-r border-slate-700 w-16">TARGET</th>
                    <th className="py-1.5 px-2.5 text-center border-r border-slate-700 w-16">REALISASI</th>
                    <th className="py-1.5 px-2.5 text-center border-r border-slate-700 w-16">INDEKS</th>
                  </>
                )}
                {(selectedQuarter === 'all' || selectedQuarter === 'q3') && (
                  <>
                    <th className="py-1.5 px-2.5 text-center border-r border-slate-700 w-16">TARGET</th>
                    <th className="py-1.5 px-2.5 text-center border-r border-slate-700 w-16">REALISASI</th>
                    <th className="py-1.5 px-2.5 text-center border-r border-slate-700 w-16">INDEKS</th>
                  </>
                )}
                {(selectedQuarter === 'all' || selectedQuarter === 'q4') && (
                  <>
                    <th className="py-1.5 px-2.5 text-center border-r border-slate-700 w-16">TARGET</th>
                    <th className="py-1.5 px-2.5 text-center border-r border-slate-700 w-16">REALISASI</th>
                    <th className="py-1.5 px-2.5 text-center w-16">INDEKS</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {filteredIku.map((row) => (
                <tr key={row.no} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3 px-3 text-center font-bold text-slate-600 border-r border-slate-100">
                    {row.no}
                  </td>

                  {/* Code pill */}
                  <td className="py-3 px-3 text-center border-r border-slate-100">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${
                        row.codeVariant === 'blue'
                          ? 'bg-sky-50 text-sky-800 border-sky-300'
                          : 'bg-purple-50 text-purple-800 border-purple-300'
                      }`}
                    >
                      {row.code}
                    </span>
                  </td>

                  {/* IKU Title */}
                  <td className="py-3 px-4 font-semibold text-slate-800 border-r border-slate-100 text-xs">
                    {row.name}
                  </td>

                  {/* Q1 Data */}
                  {(selectedQuarter === 'all' || selectedQuarter === 'q1') && (
                    <>
                      <td className="py-3 px-2 text-center font-mono text-slate-700 border-r border-slate-100">
                        {row.q1.target}
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-slate-900 border-r border-slate-100">
                        {row.q1.realisasi}
                      </td>
                      <td className="py-3 px-2 text-center border-r border-slate-100">
                        {typeof row.q1.indeks === 'number' ? (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-300">
                            {row.q1.indeks}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">-</span>
                        )}
                      </td>
                    </>
                  )}

                  {/* Q2 Data */}
                  {(selectedQuarter === 'all' || selectedQuarter === 'q2') && (
                    <>
                      <td className="py-3 px-2 text-center font-mono text-slate-600 border-r border-slate-100">
                        {row.q2.target}
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-slate-400 border-r border-slate-100">
                        {row.q2.realisasi}
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-slate-400 border-r border-slate-100">
                        {row.q2.indeks}
                      </td>
                    </>
                  )}

                  {/* Q3 Data */}
                  {(selectedQuarter === 'all' || selectedQuarter === 'q3') && (
                    <>
                      <td className="py-3 px-2 text-center font-mono text-slate-600 border-r border-slate-100">
                        {row.q3.target}
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-slate-400 border-r border-slate-100">
                        {row.q3.realisasi}
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-slate-400 border-r border-slate-100">
                        {row.q3.indeks}
                      </td>
                    </>
                  )}

                  {/* Q4 Data */}
                  {(selectedQuarter === 'all' || selectedQuarter === 'q4') && (
                    <>
                      <td className="py-3 px-2 text-center font-mono text-slate-600 border-r border-slate-100">
                        {row.q4.target}
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-slate-400 border-r border-slate-100">
                        {row.q4.realisasi}
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-slate-400">
                        {row.q4.indeks}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Seluruh capaian IKU telah melalui proses rekonsiliasi data Intense dan Satu Kemenkeu.</span>
          </div>
          <div className="font-semibold text-slate-800">
            Total 9 IKU Organisasi Kanwil DJPb Prov. Jambi
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Tab 3: Monitoring DAMS */}
  {activeTab === 'dams' && (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Monitoring DAMS (Daily Activity Monitoring System)
          </h3>
          <p className="text-xs text-slate-500">
            Rekapitulasi pengisian aktivitas harian dan jam kerja produktif pegawai Kanwil DJPb.
          </p>
        </div>
      </div>
      <div className="p-8 text-center text-slate-500 text-xs">
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
        <p className="font-bold text-slate-800">Tingkat Kepatuhan Pengisian DAMS Pegawai: 98.7%</p>
        <p className="text-slate-400 mt-1">Seluruh pegawai telah merekam log kegiatan harian sesuai target regulasi perbendaharaan.</p>
      </div>
    </div>
  )}

  {/* Tab 4: Katalog IKU / HKT */}
  {activeTab === 'katalog' && (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700">
          <Folder className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Katalog Indikator Kinerja Utama (IKU) & Hasil Kerja Tim (HKT)
          </h3>
          <p className="text-xs text-slate-500">
            Manual IKU, formula perhitungan, definisi operasional, dan sumber data dukung resmi tahun 2026.
          </p>
        </div>
      </div>
      <div className="p-8 text-center text-slate-500 text-xs">
        <Folder className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
        <p className="font-bold text-slate-800">Manual IKU 2026 Tersedia Lengkap</p>
        <p className="text-slate-400 mt-1">Dapat diunduh melalui repositori Satu Kemenkeu atau dokumen internal Subbagian Penilaian Kinerja.</p>
      </div>
    </div>
  )}

  {/* Tab 5: Feedback Layanan */}
  {activeTab === 'feedback' && (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
          <ThumbsUp className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Feedback Layanan Manajemen Kinerja
          </h3>
          <p className="text-xs text-slate-500">
            Umpan balik, masukan, dan konsultasi terkait penyusunan SKP, dialog kinerja individu, dan reviu PK.
          </p>
        </div>
      </div>
      <div className="p-8 text-center text-slate-500 text-xs">
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
        <p className="font-bold text-slate-800">Indeks Kepuasan Pengguna Layanan Kinerja: 4.82 / 5.00</p>
        <p className="text-slate-400 mt-1">Konsultasi dapat dilakukan melalui Pengelola Kinerja Organisasi (PKO) Kanwil.</p>
      </div>
    </div>
  )}

  {/* Tab 6: Perekaman Capaian IKI TW III 2026 (Disajikan Dalam Bentuk Kolom) */}
  {activeTab === 'jadwal' && (
    <div className="space-y-6">
      {/* Official Announcement Header Card */}
      <div className="bg-gradient-to-r from-[#002244] via-[#003366] to-[#0a4a82] text-white p-5 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center shrink-0 shadow-inner">
            <Megaphone className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                PENGUMUMAN PENTING
              </span>
              <span className="text-blue-200 text-xs font-semibold">
                Subbagian Penilaian Kinerja Kanwil DJPb Provinsi Jambi
              </span>
            </div>
            <h3 className="font-black text-white text-lg sm:text-xl mt-1 tracking-tight">
              Perekaman Capaian IKI TW III 2026
            </h3>
            <p className="text-xs text-blue-100 mt-0.5">
              Pemberitahuan resmi tahapan dan batas waktu perekaman realisasi IKI serta penetapan DEK & HEK.
            </p>
          </div>
        </div>

      </div>

      {/* Highlight Attention Box */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border border-amber-300 p-3.5 sm:px-5 rounded-xl flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold shrink-0">
          <AlertCircle className="w-4 h-4 text-slate-950" />
        </div>
        <div className="text-xs text-amber-950 font-medium leading-relaxed">
          <strong className="font-extrabold text-amber-900">PERHATIAN PENTING PADA TAHAP REKAM IKI:</strong> Seluruh pegawai wajib melakukan perekaman capaian IKI dengan <span className="underline decoration-amber-700 decoration-2 font-black text-amber-900">MEMILIH BULAN SEPTEMBER</span> pada aplikasi kinerja (Batas Waktu: <strong>9 November 2026</strong>).
        </div>
      </div>

      {/* Tabel Resmi Perekaman Capaian IKI TW III 2026 */}
      <PerformanceAgendaTable
        scheduleItems={INITIAL_PERFORMANCE_SCHEDULE}
      />

      {/* 4 KOLOM TAHAPAN KINERJA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KOLOM 1 */}
        <div className="bg-white rounded-2xl border-2 border-blue-200 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 to-sky-600" />
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-600 text-white uppercase tracking-wider">
                  KOLOM 1
                </span>
                <span className="text-xs font-bold text-slate-400">Tahap 1</span>
              </div>
              <h4 className="font-extrabold text-base text-slate-900 leading-snug">
                Rekam Realisasi IKI Pegawai
              </h4>
              
              <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-2 shadow-2xs">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-950 font-medium leading-relaxed">
                  <span className="font-bold text-amber-800">Catatan Khusus:</span> Wajib{' '}
                  <span className="font-bold underline decoration-amber-600 decoration-2">pilih bulan SEPTEMBER</span> pada menu perekaman capaian.
                </div>
              </div>

              <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
                Perekaman mandiri realisasi Indikator Kinerja Individu oleh masing-masing pegawai pada aplikasi kinerja Kemenkeu.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Batas Waktu Pelaksanaan
              </div>
              <div className="p-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-extrabold flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0 text-amber-700" />
                <span>Paling lambat 9 November 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM 2 */}
        <div className="bg-white rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 to-blue-600" />
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-600 text-white uppercase tracking-wider">
                  KOLOM 2
                </span>
                <span className="text-xs font-bold text-slate-400">Tahap 2</span>
              </div>
              <h4 className="font-extrabold text-base text-slate-900 leading-snug">
                Validasi Realisasi IKI Pegawai
              </h4>

              <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                Pemeriksaan, validasi, dan persetujuan capaian realisasi IKI seluruh pegawai oleh Atasan Langsung / Pejabat Penilai Kinerja.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Batas Waktu Pelaksanaan
              </div>
              <div className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-900 text-xs font-extrabold flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0 text-blue-700" />
                <span>Paling lambat 16 November 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM 3 */}
        <div className="bg-white rounded-2xl border-2 border-emerald-200 hover:border-emerald-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 to-teal-600" />
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white uppercase tracking-wider">
                  KOLOM 3
                </span>
                <span className="text-xs font-bold text-slate-400">Tahap 3</span>
              </div>
              <h4 className="font-extrabold text-base text-slate-900 leading-snug">
                Penetapan DEK dan HEK TW II
              </h4>

              <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                Pelaksanaan Dialog Evaluasi Kinerja (DEK) serta penetapan dan pengesahan Hasil Evaluasi Kinerja (HEK) Triwulan II.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Batas Waktu Pelaksanaan
              </div>
              <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs font-extrabold flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0 text-emerald-700" />
                <span>Paling Lambat 10 Desember 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM 4 */}
        <div className="bg-white rounded-2xl border-2 border-purple-200 hover:border-purple-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 to-indigo-600" />
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-600 text-white uppercase tracking-wider">
                  KOLOM 4
                </span>
                <span className="text-xs font-bold text-slate-400">Tahap 4</span>
              </div>
              <h4 className="font-extrabold text-base text-slate-900 leading-snug">
                Penetapan DEK dan HEK TW III
              </h4>

              <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                Kick-off pelaksanaan Dialog Evaluasi Kinerja (DEK) dan penetapan Hasil Evaluasi Kinerja (HEK) Triwulan III secara menyeluruh.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Jadwal Dimulai
              </div>
              <div className="p-2.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-900 text-xs font-extrabold flex items-center gap-2">
                <Calendar className="w-4 h-4 shrink-0 text-purple-700" />
                <span>Dimulai 11 Desember 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guidance Alert Banner */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
        <div className="font-bold mb-1 flex items-center gap-1.5">
          <ClipboardCheck className="w-4 h-4 text-blue-700" />
          <span>Petunjuk Teknis Pengisian IKI Pegawai TW III 2026:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px] pl-1">
          <li>Pastikan pegawai memilih periode bulan <strong>SEPTEMBER</strong> saat merekam capaian IKI TW III (Batas: <strong>9 November 2026</strong>).</li>
          <li>Pejabat penilai kinerja / atasan langsung melakukan verifikasi data dukung sebelum tanggal <strong>16 November 2026</strong>.</li>
          <li>Hasil Evaluasi Kinerja (HEK) Triwulan II ditetapkan paling lambat <strong>10 Desember 2026</strong>.</li>
          <li>Rangkaian Penetapan DEK dan HEK TW III dimulai tanggal <strong>11 Desember 2026</strong>.</li>
        </ul>
      </div>
    </div>
  )}
</div>
);
};
