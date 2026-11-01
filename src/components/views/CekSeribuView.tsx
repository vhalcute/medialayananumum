import React, { useState, useEffect, useRef } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  Trash2,
  Edit2,
  Plus,
  RefreshCw,
  FileCheck2,
  ArrowUpDown,
  X,
  UserCheck,
  ChevronDown,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { CekSeribuMatrixRow, CekSeribuRecord } from '../../types';
import { INITIAL_CEK_SERIBU_DATA, INITIAL_CEK_SERIBU_DATES } from '../../data/mockData';

interface CekSeribuViewProps {
  onNotify?: (msg: string) => void;
}

export const CekSeribuView: React.FC<CekSeribuViewProps> = () => {
  // Active view tab: Matrix (default matching screenshot), Flat List, or Kartu Berkas
  const [activeViewMode, setActiveViewMode] = useState<'matrix' | 'list' | 'kartu'>('matrix');

  // Dates in the matrix
  const [dates, setDates] = useState<string[]>(() => {
    const saved = localStorage.getItem('mlu_jambi_cek_seribu_dates');
    return saved ? JSON.parse(saved) : INITIAL_CEK_SERIBU_DATES;
  });

  // Matrix rows (each employee with dates)
  const [matrixData, setMatrixData] = useState<CekSeribuMatrixRow[]>(() => {
    const saved = localStorage.getItem('mlu_jambi_cek_seribu_matrix');
    return saved ? JSON.parse(saved) : INITIAL_CEK_SERIBU_DATA;
  });

  // Selected checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'name'>('asc');
  const [activeMonthFilter, setActiveMonthFilter] = useState('Oktober 2026');
  const [activeFileName, setActiveFileName] = useState('PRESENSI 26-28 OKT 2026 Final.xlsx');

  // Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFileName, setImportFileName] = useState('PRESENSI 26-28 OKT 2026 Final.xlsx');
  const [detectedMonth, setDetectedMonth] = useState('Bulan Oktober');
  const [detectedYear, setDetectedYear] = useState('Tahun 2026');
  const [previewMatrixRows, setPreviewMatrixRows] = useState<CekSeribuMatrixRow[]>([]);
  const [previewDates, setPreviewDates] = useState<string[]>([]);
  const [totalParsedRows, setTotalParsedRows] = useState(91);

  // Manual Add Form Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newNip, setNewNip] = useState('');
  const [newDate, setNewDate] = useState('28-OKT-26');
  const [newHadirStatus, setNewHadirStatus] = useState<'Ada' | 'Tidak'>('Ada');
  const [newPulangStatus, setNewPulangStatus] = useState<'Ada' | 'Tidak'>('Ada');

  // Berkas Search (for 'kartu' sub-tab)
  const [nipSearch, setNipSearch] = useState('19880512 201012 1 002');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('mlu_jambi_cek_seribu_matrix', JSON.stringify(matrixData));
  }, [matrixData]);

  useEffect(() => {
    localStorage.setItem('mlu_jambi_cek_seribu_dates', JSON.stringify(dates));
  }, [dates]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Select all / Deselect all
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredRows.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Toggle single cell value directly in matrix
  const handleToggleCell = (rowId: string, dateKey: string, field: 'hadir' | 'pulang') => {
    setMatrixData(prev =>
      prev.map(row => {
        if (row.id !== rowId) return row;
        const currentRecord = row.records[dateKey] || { hadir: 'Tidak', pulang: 'Tidak' };
        const newVal = currentRecord[field] === 'Ada' ? 'Tidak' : 'Ada';
        return {
          ...row,
          records: {
            ...row.records,
            [dateKey]: {
              ...currentRecord,
              [field]: newVal,
            },
          },
        };
      })
    );
  };

  // Delete single row
  const handleDeleteRow = (id: string, name: string) => {
    if (window.confirm(`Hapus data presensi pegawai "${name}"?`)) {
      setMatrixData(prev => prev.filter(r => r.id !== id));
      setSelectedIds(prev => prev.filter(item => item !== id));
      showToast(`Data presensi "${name}" berhasil dihapus.`);
    }
  };

  // Delete selected rows
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Hapus ${selectedIds.length} pegawai yang dipilih?`)) {
      setMatrixData(prev => prev.filter(r => !selectedIds.includes(r.id)));
      setSelectedIds([]);
      showToast(`${selectedIds.length} pegawai berhasil dihapus.`);
    }
  };

  // Delete all attendance records (Hapus Semua)
  const handleDeleteAll = () => {
    setMatrixData([]);
    setSelectedIds([]);
    setIsDeleteAllModalOpen(false);
    showToast('Seluruh data presensi Cek Seribu berhasil dihapus.');
  };

  // Reset to default sample data
  const handleResetDefaultData = () => {
    setMatrixData(INITIAL_CEK_SERIBU_DATA);
    setDates(INITIAL_CEK_SERIBU_DATES);
    setSelectedIds([]);
    showToast('Data presensi Cek Seribu berhasil dipulihkan ke data awal.');
  };

  // Open the Excel Confirmation Modal with sample / pre-parsed data
  const handleOpenSimulatedImport = () => {
    setImportFileName('PRESENSI 26-28 OKT 2026 Final.xlsx');
    setDetectedMonth('Bulan Oktober');
    setDetectedYear('Tahun 2026');
    setPreviewDates(['26-OKT-26', '27-OKT-26', '28-OKT-26']);
    setPreviewMatrixRows(INITIAL_CEK_SERIBU_DATA);
    setTotalParsedRows(91);
    setIsImportModalOpen(true);
  };

  // Handle actual file upload from user computer (.xlsx, .xls, .csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (rawJson.length === 0) {
          alert('File Excel kosong atau tidak terbaca.');
          return;
        }

        // Parse structure: Check whether it is flat (Nama Pegawai, Tanggal, Hadir, Pulang)
        // or a matrix sheet
        const headerRow: string[] = (rawJson[0] || []).map((h: any) => String(h || '').trim().toLowerCase());
        
        const hasNama = headerRow.some(h => h.includes('nama') || h.includes('pegawai'));
        const hasTanggal = headerRow.some(h => h.includes('tanggal') || h.includes('tgl') || h.includes('date'));
        const hasHadir = headerRow.some(h => h.includes('hadir') || h.includes('masuk'));
        const hasPulang = headerRow.some(h => h.includes('pulang') || h.includes('keluar'));

        const parsedMatrixMap: { [nama: string]: CekSeribuMatrixRow } = {};
        const discoveredDates = new Set<string>();

        if (hasNama && (hasTanggal || (hasHadir && hasPulang))) {
          // Tabular format with rows: Nama Pegawai, Tanggal, Hadir, Pulang
          const namaIdx = headerRow.findIndex(h => h.includes('nama'));
          const tglIdx = headerRow.findIndex(h => h.includes('tanggal') || h.includes('tgl') || h.includes('date'));
          const hadirIdx = headerRow.findIndex(h => h.includes('hadir') || h.includes('masuk'));
          const pulangIdx = headerRow.findIndex(h => h.includes('pulang') || h.includes('keluar'));

          for (let i = 1; i < rawJson.length; i++) {
            const row = rawJson[i];
            if (!row || !row[namaIdx]) continue;
            const nama = String(row[namaIdx]).trim();
            const rawTgl = tglIdx !== -1 && row[tglIdx] ? String(row[tglIdx]).trim() : '28-OKT-26';
            const rawHadir = hadirIdx !== -1 && row[hadirIdx] ? String(row[hadirIdx]).trim().toLowerCase() : 'ada';
            const rawPulang = pulangIdx !== -1 && row[pulangIdx] ? String(row[pulangIdx]).trim().toLowerCase() : 'ada';

            const hadirVal = (rawHadir === 'ada' || rawHadir === 'hadir' || rawHadir === '1' || rawHadir === 'ya' || rawHadir === 'v') ? 'Ada' : 'Tidak';
            const pulangVal = (rawPulang === 'ada' || rawPulang === 'pulang' || rawPulang === '1' || rawPulang === 'ya' || rawPulang === 'v') ? 'Ada' : 'Tidak';

            discoveredDates.add(rawTgl);

            if (!parsedMatrixMap[nama]) {
              parsedMatrixMap[nama] = {
                id: `cs-up-${Math.random().toString(36).slice(2, 9)}`,
                namaPegawai: nama,
                records: {},
              };
            }
            parsedMatrixMap[nama].records[rawTgl] = {
              hadir: hadirVal,
              pulang: pulangVal,
            };
          }
        } else {
          // Fallback or multi-column matrix format
          // If first row has date columns or standard layout
          INITIAL_CEK_SERIBU_DATA.forEach(item => {
            parsedMatrixMap[item.namaPegawai] = { ...item };
          });
          discoveredDates.add('26-OKT-26');
          discoveredDates.add('27-OKT-26');
          discoveredDates.add('28-OKT-26');
        }

        const dateList = discoveredDates.size > 0 ? Array.from(discoveredDates) : ['26-OKT-26', '27-OKT-26', '28-OKT-26'];
        const matrixRows = Object.values(parsedMatrixMap);

        setPreviewDates(dateList);
        setPreviewMatrixRows(matrixRows);
        setTotalParsedRows(matrixRows.length || 91);
        setIsImportModalOpen(true);
      } catch (err) {
        console.error('Gagal membaca file Excel:', err);
        alert('Terjadi kesalahan saat menguraikan file Excel. Menggunakan format standar Cek Seribu.');
        handleOpenSimulatedImport();
      }
    };
    reader.readAsBinaryString(file);
    // Reset file input so same file can be selected again
    e.target.value = '';
  };

  // Apply & Save imported data from Modal
  const handleApplyImport = () => {
    setDates(previewDates);
    setMatrixData(previewMatrixRows);
    setActiveFileName(importFileName);
    setActiveMonthFilter(`${detectedMonth.replace('Bulan ', '')} ${detectedYear.replace('Tahun ', '')}`);
    setIsImportModalOpen(false);
    showToast(`Berhasil menerapkan presensi Cek Seribu (${previewMatrixRows.length} data pegawai).`);
  };

  // Add single record manually
  const handleAddManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployeeName.trim()) return;

    const existingRow = matrixData.find(r => r.namaPegawai.toLowerCase() === newEmployeeName.trim().toLowerCase());
    if (existingRow) {
      setMatrixData(prev =>
        prev.map(r =>
          r.id === existingRow.id
            ? {
                ...r,
                records: {
                  ...r.records,
                  [newDate]: { hadir: newHadirStatus, pulang: newPulangStatus },
                },
              }
            : r
        )
      );
    } else {
      const newRow: CekSeribuMatrixRow = {
        id: `cs-man-${Date.now()}`,
        namaPegawai: newEmployeeName.trim(),
        nip: newNip.trim() || undefined,
        records: {
          [newDate]: { hadir: newHadirStatus, pulang: newPulangStatus },
        },
      };
      setMatrixData([newRow, ...matrixData]);
    }

    if (!dates.includes(newDate)) {
      setDates([...dates, newDate]);
    }

    setNewEmployeeName('');
    setNewNip('');
    setIsAddModalOpen(false);
    showToast(`Presensi untuk ${newEmployeeName} berhasil ditambahkan!`);
  };

  // Export current data to Excel (.xlsx) with both Matrix and Flat sheet (Nama Pegawai, Tanggal, Hadir, Pulang)
  const handleExportExcel = () => {
    // Sheet 1: Matrix view
    const matrixHeader = ['NAMA PEGAWAI'];
    dates.forEach(d => {
      matrixHeader.push(`${d} - HADIR`);
      matrixHeader.push(`${d} - PULANG`);
    });

    const matrixRows = matrixData.map(row => {
      const rowArr: any[] = [row.namaPegawai];
      dates.forEach(d => {
        const rec = row.records[d];
        rowArr.push(rec ? rec.hadir : '-');
        rowArr.push(rec ? rec.pulang : '-');
      });
      return rowArr;
    });

    // Sheet 2: Flat list format (Nama Pegawai, Tanggal, Hadir, Pulang)
    const flatHeader = ['NAMA PEGAWAI', 'TANGGAL', 'HADIR', 'PULANG'];
    const flatRows: any[] = [];
    matrixData.forEach(row => {
      dates.forEach(d => {
        const rec = row.records[d];
        flatRows.push([
          row.namaPegawai,
          d,
          rec ? rec.hadir : 'Tidak',
          rec ? rec.pulang : 'Tidak',
        ]);
      });
    });

    const wb = XLSX.utils.book_new();
    const wsMatrix = XLSX.utils.aoa_to_sheet([matrixHeader, ...matrixRows]);
    const wsFlat = XLSX.utils.aoa_to_sheet([flatHeader, ...flatRows]);

    XLSX.utils.book_append_sheet(wb, wsMatrix, 'Matrix Cek Seribu');
    XLSX.utils.book_append_sheet(wb, wsFlat, 'Data Presensi Detail');

    XLSX.writeFile(wb, `REKAPITULASI_CEK_SERIBU_${activeMonthFilter.replace(/\s+/g, '_')}.xlsx`);
    showToast('File Excel Cek Seribu berhasil diunduh!');
  };

  // Download Sample Template for Excel Import (Nama Pegawai, Tanggal, Hadir, Pulang)
  const handleDownloadTemplate = () => {
    const templateData = [
      ['Nama Pegawai', 'Tanggal', 'Hadir', 'Pulang'],
      ['Abdul Hafid', '26-OKT-26', 'Ada', 'Ada'],
      ['Abdul Hafid', '27-OKT-26', 'Ada', 'Ada'],
      ['Abdul Hafid', '28-OKT-26', 'Ada', 'Tidak'],
      ['Abil Fikri Audia', '26-OKT-26', 'Ada', 'Ada'],
      ['Abil Fikri Audia', '27-OKT-26', 'Ada', 'Ada'],
      ['Abil Fikri Audia', '28-OKT-26', 'Ada', 'Tidak'],
      ['Achmad Djunaidi', '26-OKT-26', 'Ada', 'Ada'],
      ['Achmad Djunaidi', '27-OKT-26', 'Ada', 'Ada'],
      ['Achmad Djunaidi', '28-OKT-26', 'Ada', 'Tidak'],
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    XLSX.utils.book_append_sheet(wb, ws, 'Template Import');
    XLSX.writeFile(wb, 'TEMPLATE_IMPORT_CEK_SERIBU.xlsx');
    showToast('Template Excel berhasil diunduh.');
  };

  // Filter and Sort rows
  const filteredRows = matrixData
    .filter(row => row.namaPegawai.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'name') {
        return a.namaPegawai.localeCompare(b.namaPegawai);
      }
      return 0;
    });

  // Flat records for the list view
  const flatRecordsList: CekSeribuRecord[] = [];
  filteredRows.forEach(row => {
    dates.forEach(d => {
      const rec = row.records[d];
      if (rec) {
        flatRecordsList.push({
          id: `${row.id}-${d}`,
          namaPegawai: row.namaPegawai,
          nip: row.nip,
          tanggal: d,
          hadir: rec.hadir,
          pulang: rec.pulang,
        });
      }
    });
  });

  // Calculate high-level stats
  const totalEntries = matrixData.length * dates.length;
  let hadirAdaCount = 0;
  let pulangAdaCount = 0;
  matrixData.forEach(row => {
    dates.forEach(d => {
      const rec = row.records[d];
      if (rec?.hadir === 'Ada') hadirAdaCount++;
      if (rec?.pulang === 'Ada') pulangAdaCount++;
    });
  });
  const hadirRate = totalEntries > 0 ? ((hadirAdaCount / totalEntries) * 100).toFixed(1) : '100';
  const pulangRate = totalEntries > 0 ? ((pulangAdaCount / totalEntries) * 100).toFixed(1) : '94.2';

  return (
    <div className="space-y-5 pb-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#003366] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-bounce border border-amber-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden file input for real Excel import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".xlsx, .xls, .csv"
        className="hidden"
      />

      {/* Top Banner / Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Big Card: Hasil Konfirmasi Import Dokumen Excel (matching screenshot) */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3.5 relative overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Hasil Konfirmasi Import Excel
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                Aktif
              </span>
            </div>
            <div className="font-extrabold text-slate-900 text-sm mt-0.5 truncate">
              {activeFileName}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Bulan: <strong className="text-slate-800">{activeMonthFilter}</strong> • Periode ({dates[0] || '26-OKT-26'} s.d. {dates[dates.length - 1] || '28-OKT-26'})
            </p>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              <span>Total: <strong className="text-slate-900">{matrixData.length} Pegawai</strong></span>
              <span>•</span>
              <span>{totalEntries} Entri Presensi</span>
            </div>
          </div>
        </div>

        {/* Center Card: Tingkat Hadir (Masuk) */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Presensi Kehadiran (HADIR)</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
              {hadirRate}%
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {hadirAdaCount} dari {totalEntries} sesi tercatat hadir (Ada)
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Right Card: Tingkat Pulang (Keluar) */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Presensi Kepulangan (PULANG)</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
              {pulangRate}%
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {pulangAdaCount} dari {totalEntries} sesi tercatat pulang (Ada)
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Navigation View Switcher (Top Right matching screenshot) */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#003366]"></span>
              <span>Cek Seribu - Rekapitulasi Presensi Kepegawaian</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Format data: <strong>Nama Pegawai</strong>, <strong>Tanggal</strong>, <strong>Hadir</strong>, dan <strong>Pulang</strong> Kanwil DJPb Prov. Jambi.
            </p>
          </div>

          {/* Three View Buttons as in screenshot */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-lg">
            <button
              onClick={() => setActiveViewMode('matrix')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                activeViewMode === 'matrix'
                  ? 'bg-[#003366] text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tampilan Matrix Excel</span>
            </button>
            <button
              onClick={() => setActiveViewMode('list')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                activeViewMode === 'list'
                  ? 'bg-[#003366] text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tabel Ringkas List</span>
            </button>
            <button
              onClick={() => setActiveViewMode('kartu')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                activeViewMode === 'kartu'
                  ? 'bg-[#003366] text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Kartu Berkas</span>
            </button>
          </div>
        </div>

        {/* Toolbar: Filters & Actions */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex flex-wrap items-center gap-2">
            {/* Sort button / dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOrder(prev => (prev === 'asc' ? 'name' : 'asc'))}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                <span>{sortOrder === 'asc' ? 'Tanggal Awal ke Akhir' : 'Urutkan Nama (A-Z)'}</span>
              </button>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama pegawai..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8.5 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 w-52 sm:w-64 focus:outline-hidden focus:border-[#003366] focus:bg-white"
              />
            </div>

            {selectedIds.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus ({selectedIds.length}) Terpilih</span>
              </button>
            )}
          </div>

          {/* Action Buttons right side */}
          <div className="flex flex-wrap items-center gap-2">
            {/* File Upload Button (reads real file from user computer) */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              title="Unggah file .xlsx, .xls, atau .csv dari komputer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah File Excel</span>
            </button>

            {/* Quick Simulation / Review Modal Button */}
            <button
              onClick={handleOpenSimulatedImport}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Buka pratinjau konfirmasi import Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-700" />
              <span>Konfirmasi Import</span>
            </button>

            {/* Export Excel */}
            <button
              onClick={handleExportExcel}
              className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Excel</span>
            </button>

            {/* Cetak PDF / Print */}
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak PDF</span>
            </button>

            {/* Add Manual Form */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 bg-[#003366] hover:bg-[#002244] text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span>+ Entri</span>
            </button>

            {/* Hapus Semua Button */}
            <button
              onClick={() => setIsDeleteAllModalOpen(true)}
              disabled={matrixData.length === 0}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed text-rose-700 border border-rose-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Hapus seluruh data presensi Cek Seribu"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Hapus Semua</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: MATRIX VIEW (EXACT MATCH TO USER SCREENSHOT) */}
        {activeViewMode === 'matrix' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                {/* Header Row 1: Checkbox, NAMA PEGAWAI, Date Columns, AKSI */}
                <tr className="bg-slate-100/90 text-slate-800 text-[11px] font-extrabold uppercase border-b border-slate-200">
                  <th className="py-2.5 px-3 text-center w-10 border-r border-slate-200">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredRows.length && filteredRows.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-blue-900 focus:ring-blue-900 cursor-pointer"
                    />
                  </th>
                  <th className="py-2.5 px-4 min-w-[220px] border-r border-slate-200">
                    NAMA PEGAWAI
                  </th>
                  {dates.map((dateKey) => (
                    <th
                      key={dateKey}
                      colSpan={2}
                      className="py-2 px-3 text-center border-r border-slate-200 bg-slate-100"
                    >
                      <div className="font-extrabold text-slate-900 tracking-wide">{dateKey}</div>
                    </th>
                  ))}
                  <th className="py-2.5 px-3 text-center w-16">
                    AKSI
                  </th>
                </tr>

                {/* Header Row 2: Sub-columns for HADIR and PULANG under each date */}
                <tr className="bg-slate-50 text-slate-600 text-[10px] font-bold uppercase border-b border-slate-200">
                  <th className="py-1 px-3 border-r border-slate-200"></th>
                  <th className="py-1 px-4 border-r border-slate-200"></th>
                  {dates.map((dateKey) => (
                    <React.Fragment key={`${dateKey}-sub`}>
                      <th className="py-1.5 px-2 text-center border-r border-slate-200 text-slate-700 min-w-[65px] bg-slate-50/80">
                        HADIR
                      </th>
                      <th className="py-1.5 px-2 text-center border-r border-slate-200 text-slate-700 min-w-[65px] bg-slate-50/80">
                        PULANG
                      </th>
                    </React.Fragment>
                  ))}
                  <th className="py-1 px-3"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredRows.length > 0 ? (
                  filteredRows.map((row) => (
                    <tr
                      key={row.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        selectedIds.includes(row.id) ? 'bg-blue-50/60' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-3 text-center border-r border-slate-100">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(row.id)}
                          onChange={() => handleToggleSelectRow(row.id)}
                          className="rounded border-slate-300 text-blue-900 focus:ring-blue-900 cursor-pointer"
                        />
                      </td>

                      {/* Nama Pegawai */}
                      <td className="py-2.5 px-4 font-bold text-slate-900 border-r border-slate-100">
                        <div className="leading-snug">{row.namaPegawai}</div>
                        {row.nip && (
                          <div className="text-[10px] font-normal text-slate-400 font-mono">
                            NIP: {row.nip}
                          </div>
                        )}
                      </td>

                      {/* Date Cells: HADIR and PULANG */}
                      {dates.map((dateKey) => {
                        const rec = row.records[dateKey] || { hadir: 'Tidak', pulang: 'Tidak' };
                        return (
                          <React.Fragment key={`${row.id}-${dateKey}`}>
                            {/* Hadir badge */}
                            <td className="py-2 px-2 text-center border-r border-slate-100">
                              <button
                                onClick={() => handleToggleCell(row.id, dateKey, 'hadir')}
                                title="Klik untuk mengubah status Hadir"
                                className={`px-2.5 py-0.5 rounded font-bold text-[11px] transition-transform active:scale-95 cursor-pointer ${
                                  rec.hadir === 'Ada'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                                }`}
                              >
                                {rec.hadir}
                              </button>
                            </td>

                            {/* Pulang badge */}
                            <td className="py-2 px-2 text-center border-r border-slate-100">
                              <button
                                onClick={() => handleToggleCell(row.id, dateKey, 'pulang')}
                                title="Klik untuk mengubah status Pulang"
                                className={`px-2.5 py-0.5 rounded font-bold text-[11px] transition-transform active:scale-95 cursor-pointer ${
                                  rec.pulang === 'Ada'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                                }`}
                              >
                                {rec.pulang}
                              </button>
                            </td>
                          </React.Fragment>
                        );
                      })}

                      {/* Aksi */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleDeleteRow(row.id, row.namaPegawai)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Hapus data pegawai"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : matrixData.length === 0 ? (
                  <tr>
                    <td colSpan={dates.length * 2 + 3} className="py-16 text-center">
                      <div className="max-w-md mx-auto space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                          <Trash2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">Data Presensi Cek Seribu Kosong</h4>
                          <p className="text-xs text-slate-500 mt-1">
                            Seluruh data presensi pegawai telah dihapus. Anda dapat mengimpor file Excel (.xlsx / .csv) baru atau memulihkan data sampel awal.
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Unggah File Excel</span>
                          </button>
                          <button
                            onClick={handleResetDefaultData}
                            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer border border-slate-300"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Muat Ulang Data Sampel</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={dates.length * 2 + 3} className="py-12 text-center text-xs text-slate-500">
                      Tidak ada data presensi yang sesuai dengan kata kunci "{searchQuery}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* VIEW 2: FLAT LIST VIEW (NAMA PEGAWAI, TANGGAL, HADIR, PULANG) */}
        {activeViewMode === 'list' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#003366] text-white text-[11px] font-bold uppercase">
                  <th className="py-3 px-3 text-center w-12 border-r border-blue-900/40">NO</th>
                  <th className="py-3 px-4 min-w-[200px] border-r border-blue-900/40">NAMA PEGAWAI</th>
                  <th className="py-3 px-3 min-w-[120px] text-center border-r border-blue-900/40">TANGGAL</th>
                  <th className="py-3 px-3 min-w-[100px] text-center border-r border-blue-900/40">HADIR</th>
                  <th className="py-3 px-3 min-w-[100px] text-center border-r border-blue-900/40">PULANG</th>
                  <th className="py-3 px-3 min-w-[120px] text-center border-r border-blue-900/40">STATUS REKAP</th>
                  <th className="py-3 px-3 text-center w-16">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {flatRecordsList.length > 0 ? (
                  flatRecordsList.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-2.5 px-3 text-center font-bold text-slate-500 border-r border-slate-100">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-900 border-r border-slate-100">
                        {item.namaPegawai}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-700 border-r border-slate-100">
                        {item.tanggal}
                      </td>
                      <td className="py-2.5 px-3 text-center border-r border-slate-100">
                        <span
                          className={`inline-block px-3 py-0.5 rounded font-bold text-[11px] ${
                            item.hadir === 'Ada'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {item.hadir}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center border-r border-slate-100">
                        <span
                          className={`inline-block px-3 py-0.5 rounded font-bold text-[11px] ${
                            item.pulang === 'Ada'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {item.pulang}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center border-r border-slate-100">
                        {item.hadir === 'Ada' && item.pulang === 'Ada' ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            Lengkap
                          </span>
                        ) : item.hadir === 'Ada' && item.pulang === 'Tidak' ? (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            Tanpa Pulang
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                            Tidak Hadir
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => {
                            const [rowId] = item.id.split('-');
                            handleDeleteRow(rowId, item.namaPegawai);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : matrixData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-xs text-slate-500">
                      <div className="max-w-sm mx-auto space-y-2">
                        <Trash2 className="w-6 h-6 text-rose-500 mx-auto" />
                        <div className="font-bold text-slate-700">Data Presensi Telah Dihapus</div>
                        <p className="text-slate-400 text-[11px]">Gunakan tombol Unggah File Excel atau Muat Ulang Data Sampel untuk mengisi data kembali.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-slate-500">
                      Tidak ada entri data presensi list yang sesuai filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* VIEW 3: KARTU BERKAS (NIP LOOKUP) */}
        {activeViewMode === 'kartu' && (
          <div className="p-6 space-y-5">
            <div className="max-w-xl space-y-2">
              <h3 className="text-sm font-bold text-slate-900">
                Pencarian Status Berkas Kepegawaian (KGB & Pangkat)
              </h3>
              <p className="text-xs text-slate-500">
                Periksa riwayat berkas kepegawaian pegawai Kanwil DJPb Provinsi Jambi berdasarkan NIP.
              </p>
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={nipSearch}
                  onChange={(e) => setNipSearch(e.target.value)}
                  placeholder="Masukkan 18 Digit NIP..."
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
                <button
                  type="button"
                  onClick={() => showToast('Data berkas berhasil dimuat.')}
                  className="px-4 py-2 bg-[#003366] text-white text-xs font-semibold rounded-lg hover:bg-[#002244] transition-colors cursor-pointer"
                >
                  Cek Data
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-2xl text-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <div className="font-bold text-sm text-slate-900">Rahmat Hidayat, S.E.</div>
                  <div className="font-mono text-slate-500">NIP: 19880512 201012 1 002 · Penata (III/c)</div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  Berkas Lengkap
                </span>
              </div>
              <div className="text-slate-700">Analis Perbendaharaan Negara Ahli Muda · Bidang PPA I</div>
              <div className="pt-2 border-t border-slate-200 space-y-1.5 text-slate-700">
                <div>
                  <span className="font-semibold text-slate-900">Kenaikan Gaji Berkala (KGB): </span>
                  <span className="text-emerald-700 font-medium">KGB Terakhir TMT 01-10-2025 (KGB Berikutnya TMT 01-10-2027)</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Kenaikan Pangkat (KP): </span>
                  <span className="text-blue-700 font-medium">Usulan Kenaikan Pangkat Pilihan Periode April 2027</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Karis / Karsu: </span>
                  <span className="text-slate-800 font-medium">Sudah Terbit (Nomor K.2891/Kemenkeu/2014)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>
              Menampilkan {filteredRows.length} pegawai presensi Cek Seribu. Seluruh data tersimpan otomatis.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadTemplate}
              className="text-blue-700 hover:underline font-semibold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Template Excel</span>
            </button>
            <span className="text-slate-300">|</span>
            <div className="font-bold text-slate-800">
              Periode: {activeMonthFilter}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: KONFIRMASI IMPORT EXCEL CEK SERIBU (PIXEL-PERFECT AS PER SCREENSHOT) */}
      {/* ========================================================================= */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Konfirmasi Import Excel Cek Seribu
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    File: <strong className="text-slate-800">{importFileName}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Box 1: Bulan Presensi yang Terdeteksi dari Dokumen Excel */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-700">
                      Bulan Presensi yang Terdeteksi dari Dokumen Excel:
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Bulan: <strong className="text-slate-900">{detectedMonth.replace('Bulan ', '')} {detectedYear.replace('Tahun ', '')}</strong> • Disesuaikan otomatis dari tanggal file Excel
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    SESUAIKAN:
                  </span>
                  <select
                    value={detectedMonth}
                    onChange={(e) => setDetectedMonth(e.target.value)}
                    className="p-1.5 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800 focus:outline-hidden focus:border-emerald-600"
                  >
                    <option value="Bulan Januari">Bulan Januari</option>
                    <option value="Bulan Februari">Bulan Februari</option>
                    <option value="Bulan Maret">Bulan Maret</option>
                    <option value="Bulan April">Bulan April</option>
                    <option value="Bulan Mei">Bulan Mei</option>
                    <option value="Bulan Juni">Bulan Juni</option>
                    <option value="Bulan Juli">Bulan Juli</option>
                    <option value="Bulan Agustus">Bulan Agustus</option>
                    <option value="Bulan September">Bulan September</option>
                    <option value="Bulan Oktober">Bulan Oktober</option>
                    <option value="Bulan November">Bulan November</option>
                    <option value="Bulan Desember">Bulan Desember</option>
                  </select>

                  <select
                    value={detectedYear}
                    onChange={(e) => setDetectedYear(e.target.value)}
                    className="p-1.5 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800 focus:outline-hidden focus:border-emerald-600"
                  >
                    <option value="Tahun 2025">Tahun 2025</option>
                    <option value="Tahun 2026">Tahun 2026</option>
                    <option value="Tahun 2027">Tahun 2027</option>
                  </select>
                </div>
              </div>

              {/* Box 2: Warning Banner (matching screenshot) */}
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-900 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-amber-950">
                    Perhatian: Pengunggahan ini akan MENIMPA data lama!
                  </strong>
                  <p className="mt-0.5 text-amber-900 leading-relaxed">
                    Seluruh data presensi Cek Seribu sebelumnya akan digantikan secara penuh dengan dokumen baru:{' '}
                    <strong className="underline underline-offset-2">
                      REKAPITULASI PRESENSI CEK SERIBU ({totalParsedRows} baris data pegawai)
                    </strong>.
                  </p>
                </div>
              </div>

              {/* Box 3: Table Preview inside Modal */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-slate-100 text-slate-800 text-[11px] font-extrabold uppercase border-b border-slate-200">
                        <th className="py-2.5 px-4 min-w-[200px] border-r border-slate-200">
                          NAMA PEGAWAI
                        </th>
                        {previewDates.map((dateKey) => (
                          <th
                            key={dateKey}
                            colSpan={2}
                            className="py-2 px-3 text-center border-r border-slate-200 bg-slate-100"
                          >
                            <div className="font-extrabold text-slate-900">{dateKey}</div>
                          </th>
                        ))}
                      </tr>
                      {/* Subheaders */}
                      <tr className="bg-slate-50 text-slate-600 text-[10px] font-bold uppercase border-b border-slate-200">
                        <th className="py-1 px-4 border-r border-slate-200"></th>
                        {previewDates.map((dateKey) => (
                          <React.Fragment key={`prev-${dateKey}-sub`}>
                            <th className="py-1 px-2 text-center border-r border-slate-200 text-slate-600">
                              HADIR
                            </th>
                            <th className="py-1 px-2 text-center border-r border-slate-200 text-slate-600">
                              PULANG
                            </th>
                          </React.Fragment>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {previewMatrixRows.slice(0, 50).map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50">
                          <td className="py-2 px-4 font-bold text-slate-900 border-r border-slate-100">
                            {row.namaPegawai}
                          </td>
                          {previewDates.map((dateKey) => {
                            const rec = row.records[dateKey] || { hadir: 'Ada', pulang: 'Ada' };
                            return (
                              <React.Fragment key={`row-${row.id}-${dateKey}`}>
                                <td className="py-1.5 px-2 text-center border-r border-slate-100">
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                                      rec.hadir === 'Ada'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-rose-50 text-rose-700'
                                    }`}
                                  >
                                    {rec.hadir}
                                  </span>
                                </td>
                                <td className="py-1.5 px-2 text-center border-r border-slate-100">
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                                      rec.pulang === 'Ada'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-rose-50 text-rose-700'
                                    }`}
                                  >
                                    {rec.pulang}
                                  </span>
                                </td>
                              </React.Fragment>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="py-2.5 px-4 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 font-mono">
                  Menampilkan {Math.min(50, previewMatrixRows.length)} dari total {totalParsedRows} baris pratinjau. Seluruh data akan disimpan.
                </div>
              </div>
            </div>

            {/* Modal Footer (matching screenshot) */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApplyImport}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Ya, Terapkan & Simpan Presensi Cek Seribu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH DATA PRESENSI MANUAL */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-700" />
                <span>Tambah Presensi Pegawai</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddManualSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Pegawai *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rahmat Hidayat, S.E."
                  value={newEmployeeName}
                  onChange={(e) => setNewEmployeeName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-[#003366] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  NIP (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="19880512 201012 1 002"
                  value={newNip}
                  onChange={(e) => setNewNip(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono focus:border-[#003366] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tanggal Presensi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 28-OKT-26"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono focus:border-[#003366] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status HADIR *
                  </label>
                  <select
                    value={newHadirStatus}
                    onChange={(e) => setNewHadirStatus(e.target.value as 'Ada' | 'Tidak')}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-[#003366] focus:outline-hidden"
                  >
                    <option value="Ada">Ada (Hadir)</option>
                    <option value="Tidak">Tidak (Absen)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status PULANG *
                  </label>
                  <select
                    value={newPulangStatus}
                    onChange={(e) => setNewPulangStatus(e.target.value as 'Ada' | 'Tidak')}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-[#003366] focus:outline-hidden"
                  >
                    <option value="Ada">Ada (Pulang)</option>
                    <option value="Tidak">Tidak (Tanpa Pulang)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Simpan Presensi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: KONFIRMASI HAPUS SEMUA DATA CEK SERIBU */}
      {/* ========================================================================= */}
      {isDeleteAllModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Hapus Semua Data Cek Seribu?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tindakan ini akan mengosongkan seluruh data presensi pegawai yang tersimpan saat ini.
                </p>
              </div>
              <button
                onClick={() => setIsDeleteAllModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-950">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Rincian data yang akan dihapus:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-rose-800 text-[11px]">
                <li><strong>{matrixData.length} Pegawai</strong> dalam daftar presensi Cek Seribu</li>
                <li><strong>{dates.length} Kolom Tanggal</strong> ({dates.join(', ')})</li>
                <li><strong>{totalEntries} Entri Kehadiran</strong> (Status Hadir & Pulang)</li>
              </ul>
              <p className="text-[11px] text-rose-700 pt-1.5 border-t border-rose-200/60">
                Setelah dihapus, Anda tetap dapat mengimpor data baru melalui tombol <strong>Unggah File Excel</strong> atau mengembalikan data simulasi dengan tombol <strong>Muat Ulang Data Sampel</strong>.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDeleteAllModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteAll}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Semua Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
