import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Share2,
  Users,
  CheckCircle2,
  XCircle,
  Upload,
  Copy,
  FileSpreadsheet,
  Printer,
  Plus,
  ArrowUpDown,
  Search,
  Check,
  X,
  Edit,
  Trash2,
  ChevronDown,
  Download,
  AlertCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export interface EmployeeRecord {
  id: string;
  name: string;
  statusByEdition: Record<string, 'Sudah' | 'Belum'>;
}

const DEFAULT_EDITIONS = [
  'EA 11',
  'EA 09',
  'EA 10',
  'EA 08',
  'EA 07',
  'EA 06',
  'EA 05',
  'EA 04',
  'EA 03',
  'EA 02',
  'EA 01'
];

// Initial 90 employee names - first 4 match screenshot exactly, 87 Sudah and 3 Belum for EA 11
const INITIAL_NAMES = [
  'Abdul Hafid',
  'Abil Fikri Audia S.M.',
  'Achmad Djunaidi',
  'Ade Wahyu Susanto S.S.T. Ak. M.E.',
  'Ahmad Nauval',
  'Ahmad Triyadi',
  'Ahmad Widyarma, S.E.',
  'Aidil Fajri',
  'Alfin Nur Fadhilah',
  'Andi Pratama',
  'Anisa Rahmawati',
  'Arif Budiman',
  'Arya Wicaksana',
  'Asep Suryana',
  'Bagas Pratama',
  'Bambang Irawan',
  'Bayu Setiawan',
  'Bima Arya',
  'Budi Santoso',
  'Cahyo Purnomo',
  'Candra Wijaya',
  'Danang Priyanto',
  'Dedi Mulyadi',
  'Denny Kurniawan',
  'Dewi Sartika',
  'Diah Permata',
  'Dian Anggraini',
  'Dimas Anggara',
  'Dini Rahayu',
  'Doni Prasetyo',
  'Eko Prasetyo',
  'Endang Wulandari',
  'Fajar Nugroho',
  'Farhan Maulana',
  'Febri Hermansyah',
  'Fitri Handayani',
  'Gilang Ramadhan',
  'Gunawan Wibisono',
  'Hadi Prabowo',
  'Hafidz Alamsyah',
  'Hendra Gunawan',
  'Heri Setiawan',
  'Ilham Firmansyah',
  'Iman Supriatna',
  'Indah Permatasari',
  'Indra Kurnia',
  'Iqbal Tawakal',
  'Irfan Hakim',
  'Joko Susilo',
  'Lestari Nur',
  'Lucky Hakim',
  'M. Faisal Akbar',
  'M. Rizky Pratama',
  'M. Syahroni',
  'Maya Safitri',
  'Mega Utami',
  'Mirna Oktaviani',
  'Muchlis Anshori',
  'Muhammad Ilham',
  'Nanda Putra',
  'Nova Eliza',
  'Nur Hidayat',
  'Nurul Fadhilah',
  'Panji Gumilang',
  'Prasetyo Adi',
  'Putri Ayu',
  'Raden Mas Bagus',
  'Rahmat Hidayat',
  'Rian Kurniawan',
  'Rini Astuti',
  'Rio Ferdinand',
  'Rizka Amelia',
  'Roni Wijaya',
  'Rudi Hartono',
  'Sandi Kurnia',
  'Septian Nugraha',
  'Sigit Pramono',
  'Siti Aminah',
  'Sri Wahyuni',
  'Suryadi Pratama',
  'Teguh Wibowo',
  'Tio Nugroho',
  'Tri Wahyudi',
  'Utari Dewi',
  'Wahyu Hidayat',
  'Wawan Setiawan',
  'Yoga Pratama',
  'Yudha Pratama',
  'Zainal Abidin',
  'Zulkifli Harahap'
];

export const EmployeeAdvocacyMonitoringView: React.FC = () => {
  const [editions, setEditions] = useState<string[]>(() => {
    const saved = localStorage.getItem('mlu_ea_editions');
    return saved ? JSON.parse(saved) : DEFAULT_EDITIONS;
  });

  const [activeEdition, setActiveEdition] = useState<string>('EA 11');

  // Employee data with statuses for editions
  const [employees, setEmployees] = useState<EmployeeRecord[]>(() => {
    const saved = localStorage.getItem('mlu_ea_employees');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }

    // Default 90 employees: exactly 87 Sudah, 3 Belum (index 87, 88, 89) for EA 11
    return INITIAL_NAMES.map((name, index) => {
      const isBelumEA11 = index >= 87; // Yudha Pratama, Zainal Abidin, Zulkifli Harahap
      return {
        id: `emp-${index + 1}`,
        name,
        statusByEdition: {
          'EA 11': isBelumEA11 ? 'Belum' : 'Sudah',
          'EA 09': index % 15 === 0 ? 'Belum' : 'Sudah',
          'EA 10': index % 20 === 0 ? 'Belum' : 'Sudah',
          'EA 08': 'Sudah',
          'EA 07': index % 10 === 0 ? 'Belum' : 'Sudah',
          'EA 06': 'Sudah',
          'EA 05': 'Sudah',
          'EA 04': 'Sudah',
          'EA 03': 'Sudah',
          'EA 02': 'Sudah',
          'EA 01': 'Sudah'
        }
      };
    });
  });

  // UI state
  const [filterStatus, setFilterStatus] = useState<'Semua' | 'Sudah' | 'Belum'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [editingEmployee, setEditingEmployee] = useState<EmployeeRecord | null>(null);
  const [isNewEditionModalOpen, setIsNewEditionModalOpen] = useState(false);
  const [newEditionCode, setNewEditionCode] = useState('');
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadText, setUploadText] = useState('');

  const deleteMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (deleteMenuRef.current && !deleteMenuRef.current.contains(e.target as Node)) {
        setShowDeleteMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('mlu_ea_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('mlu_ea_editions', JSON.stringify(editions));
  }, [editions]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Metrics for active edition
  const totalPegawai = employees.length;
  const sudahMengisiCount = employees.filter(e => (e.statusByEdition[activeEdition] || 'Belum') === 'Sudah').length;
  const belumMengisiCount = totalPegawai - sudahMengisiCount;
  const persentaseKepatuhan = totalPegawai > 0 ? ((sudahMengisiCount / totalPegawai) * 100).toFixed(1) : '0';
  const progressPercent = totalPegawai > 0 ? Math.round((sudahMengisiCount / totalPegawai) * 100) : 0;

  // Filtered and sorted employee list
  const filteredEmployees = useMemo(() => {
    return employees
      .filter(emp => {
        const status = emp.statusByEdition[activeEdition] || 'Belum';
        const matchStatus = filterStatus === 'Semua' || status === filterStatus;
        const matchSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchStatus && matchSearch;
      })
      .sort((a, b) => {
        const compare = a.name.localeCompare(b.name, 'id');
        return sortOrder === 'asc' ? compare : -compare;
      });
  }, [employees, activeEdition, filterStatus, searchQuery, sortOrder]);

  // Status toggle handler
  const handleToggleStatus = (id: string) => {
    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id === id) {
          const current = emp.statusByEdition[activeEdition] || 'Belum';
          const next = current === 'Sudah' ? 'Belum' : 'Sudah';
          return {
            ...emp,
            statusByEdition: {
              ...emp.statusByEdition,
              [activeEdition]: next
            }
          };
        }
        return emp;
      })
    );
  };

  // Quick Action: Tandai Semua Sudah
  const handleMarkAllSudah = () => {
    setEmployees(prev =>
      prev.map(emp => ({
        ...emp,
        statusByEdition: {
          ...emp.statusByEdition,
          [activeEdition]: 'Sudah'
        }
      }))
    );
    showToast(`Seluruh pegawai (${totalPegawai}) ditandai 'Sudah Mengisi' pada ${activeEdition}.`);
  };

  // Quick Action: Tandai Semua Belum
  const handleMarkAllBelum = () => {
    setEmployees(prev =>
      prev.map(emp => ({
        ...emp,
        statusByEdition: {
          ...emp.statusByEdition,
          [activeEdition]: 'Belum'
        }
      }))
    );
    showToast(`Seluruh pegawai (${totalPegawai}) ditandai 'Belum Mengisi' pada ${activeEdition}.`);
  };

  // Quick Action: Kosongkan Edisi
  const handleResetEditionStatus = () => {
    if (window.confirm(`Yakin ingin mengosongkan status pengisian untuk ${activeEdition}? Seluruh status akan diubah menjadi 'Belum'.`)) {
      handleMarkAllBelum();
    }
  };

  // Bulk actions for selected rows
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredEmployees.map(e => e.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Feature: Salin Yang Belum (WhatsApp reminder generator)
  const handleCopyBelum = () => {
    const listBelum = employees.filter(e => (e.statusByEdition[activeEdition] || 'Belum') === 'Belum');
    if (listBelum.length === 0) {
      showToast(`Hebat! Seluruh pegawai sudah mengisi ${activeEdition}.`);
      return;
    }

    const textLines = [
      `📢 *MONITORING EMPLOYEE ADVOCACY ${activeEdition}*`,
      `*KANWIL DJPB PROVINSI JAMBI*`,
      `📅 Update: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}`,
      `---------------------------------------`,
      `⚠️ *Daftar Pegawai Belum Mengisi (${listBelum.length} Pegawai):*`,
      ...listBelum.map((emp, i) => `${i + 1}. ${emp.name}`),
      `---------------------------------------`,
      `Tingkat Kepatuhan Saat Ini: ${persentaseKepatuhan}% (${sudahMengisiCount}/${totalPegawai})`,
      `Mohon rekan-rekan yang belum mengisi untuk segera mengunggah bukti advocacy. Terima kasih! 🙏`
    ].join('\n');

    navigator.clipboard.writeText(textLines);
    showToast(`Daftar ${listBelum.length} pegawai yang belum mengisi berhasil disalin ke clipboard!`);
  };

  // Feature: Ekspor Excel (CSV)
  const handleExportCsv = () => {
    const headers = 'No,Nama Pegawai,Status ' + activeEdition + ',Keterangan\n';
    const rows = employees
      .map((emp, i) => {
        const st = emp.statusByEdition[activeEdition] || 'Belum';
        return `"${i + 1}","${emp.name.replace(/"/g, '""')}","${st}","${st === 'Sudah' ? 'Kepatuhan Terpenuhi' : 'Perlu Tindak Lanjut'}"`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Monitoring_Employee_Advocacy_${activeEdition.replace(/\s+/g, '_')}_Kanwil_Jambi.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Data ${activeEdition} berhasil diekspor ke format Excel / CSV.`);
  };

  // Feature: Download Template Excel
  const handleDownloadTemplate = () => {
    const content = 'No,Nama Pegawai,Status\n1,Nama Pegawai Contoh,Sudah\n2,Nama Pegawai Kedua,Belum\n';
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Template_Employee_Advocacy_Kanwil_Jambi.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Template Excel / CSV berhasil diunduh.');
  };

  // Feature: Cetak / PDF
  const handlePrint = () => {
    window.print();
  };

  // Feature: Tambah Pegawai
  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployeeName.trim()) {
      alert('Silakan masukkan nama pegawai.');
      return;
    }

    const newEmp: EmployeeRecord = {
      id: `emp-${Date.now()}`,
      name: newEmployeeName.trim(),
      statusByEdition: {
        [activeEdition]: 'Sudah'
      }
    };

    setEmployees(prev => [newEmp, ...prev]);
    setNewEmployeeName('');
    setIsAddEmployeeModalOpen(false);
    showToast(`Pegawai '${newEmp.name}' berhasil ditambahkan ke daftar.`);
  };

  // Feature: Edit Pegawai
  const handleEditEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee || !editingEmployee.name.trim()) return;

    setEmployees(prev =>
      prev.map(emp => (emp.id === editingEmployee.id ? editingEmployee : emp))
    );
    setEditingEmployee(null);
    showToast('Data nama pegawai berhasil diperbarui.');
  };

  // Feature: Hapus Pegawai
  const handleDeleteEmployee = (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus '${name}' dari daftar monitoring?`)) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      setSelectedIds(prev => prev.filter(i => i !== id));
      showToast(`Pegawai '${name}' berhasil dihapus.`);
    }
  };

  // Feature: Tambah Edisi Baru
  const handleAddNewEdition = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = newEditionCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (editions.includes(cleanCode)) {
      alert('Edisi tersebut sudah ada dalam daftar.');
      return;
    }

    setEditions([cleanCode, ...editions]);
    setActiveEdition(cleanCode);
    setNewEditionCode('');
    setIsNewEditionModalOpen(false);
    showToast(`Edisi baru '${cleanCode}' berhasil diterbitkan dan aktif.`);
  };

  // Feature: Hapus Pegawai Terpilih (Bulk)
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      alert('Pilih pegawai terlebih dahulu menggunakan kotak centang.');
      return;
    }

    if (window.confirm(`Yakin ingin menghapus ${selectedIds.length} pegawai terpilih?`)) {
      setEmployees(prev => prev.filter(emp => !selectedIds.includes(emp.id)));
      setSelectedIds([]);
      setShowDeleteMenu(false);
      showToast(`${selectedIds.length} pegawai terpilih berhasil dihapus.`);
    }
  };

  // Feature: Reset ke Data Standar (90 Pegawai)
  const handleResetToDefault = () => {
    if (window.confirm('Reset daftar ke format standar resmi (90 pegawai dengan 87 Sudah & 3 Belum)?')) {
      const resetList: EmployeeRecord[] = INITIAL_NAMES.map((name, index) => ({
        id: `emp-${index + 1}`,
        name,
        statusByEdition: {
          'EA 11': index >= 87 ? 'Belum' : 'Sudah',
          'EA 09': index % 15 === 0 ? 'Belum' : 'Sudah',
          'EA 10': index % 20 === 0 ? 'Belum' : 'Sudah',
          'EA 08': 'Sudah',
          'EA 07': index % 10 === 0 ? 'Belum' : 'Sudah'
        }
      }));
      setEmployees(resetList);
      setShowDeleteMenu(false);
      showToast('Daftar pegawai berhasil direset ke standar resmi (90 pegawai).');
    }
  };

  // Feature: Upload Excel / CSV file or paste text
  const handleProcessImportText = (text: string) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length === 0) return;

    let addedCount = 0;
    const newItems: EmployeeRecord[] = [];

    lines.forEach((line, idx) => {
      // Split by comma or semicolon or tab
      const parts = line.split(/[,;\t]/).map(s => s.trim().replace(/^["']|["']$/g, ''));
      if (parts.length > 0 && parts[0] && parts[0].toLowerCase() !== 'no' && parts[0].toLowerCase() !== 'nama pegawai') {
        const name = parts.length > 1 && /^\d+$/.test(parts[0]) ? parts[1] : parts[0];
        const statusRaw = parts.length > 2 ? parts[2].toLowerCase() : parts.length > 1 && !/^\d+$/.test(parts[0]) ? parts[1].toLowerCase() : 'Sudah';
        const status: 'Sudah' | 'Belum' = statusRaw.includes('belum') || statusRaw === '0' || statusRaw === 'false' ? 'Belum' : 'Sudah';

        if (name && name.length > 1) {
          newItems.push({
            id: `emp-imp-${Date.now()}-${idx}`,
            name,
            statusByEdition: {
              [activeEdition]: status
            }
          });
          addedCount++;
        }
      }
    });

    if (newItems.length > 0) {
      setEmployees(prev => [...newItems, ...prev]);
      setShowUploadModal(false);
      setUploadText('');
      showToast(`Berhasil mengimpor ${addedCount} pegawai ke edisi ${activeEdition}.`);
    } else {
      alert('Format teks atau berkas tidak sesuai. Silakan gunakan template.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        handleProcessImportText(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const isAllSelected = filteredEmployees.length > 0 && selectedIds.length === filteredEmployees.length;

  return (
    <div className="space-y-5 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#003366] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-blue-400/30 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP HEADER BANNER (Exactly matching user screenshot) */}
      <div className="bg-[#0b1626] rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        {/* Subtle geometric dot pattern */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          {/* Left Side: Logo Emblem + Titles */}
          <div className="flex items-center gap-4">
            {/* Logo Emblem Container */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center p-2 shrink-0">
              <img
                src="/assets/aistudio/Logo_Kemenkeu_eb9f3e65.png"
                alt="Logo Kemenkeu RI"
                className="w-11 h-11 sm:w-12 sm:h-12 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            {/* Title & Badges */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold text-slate-300 bg-slate-800/80 border border-slate-700/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  LAYANAN INFORMASI PUBLIKASI
                </span>
                <span className="text-[10px] font-extrabold text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  TARGET EDISI: {activeEdition}
                </span>
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 pl-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Live Monitoring</span>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Share2 className="w-5 h-5 text-sky-400 shrink-0" />
                <h1 className="text-base sm:text-xl font-extrabold text-white tracking-tight">
                  Monitoring Pengisian Employee Advocacy {activeEdition}
                </h1>
              </div>

              <p className="text-xs text-slate-300/90 max-w-2xl leading-relaxed font-normal">
                Pantauan tingkat kepatuhan dan status pengisian Employee Advocacy {activeEdition} seluruh pegawai Kantor Wilayah DJPb Provinsi Jambi.
              </p>
            </div>
          </div>

          {/* Right Side: Header Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto justify-start lg:justify-end">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Excel</span>
            </button>

            <button
              onClick={handleCopyBelum}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title="Salin nama pegawai yang belum mengisi ke WhatsApp broadcast"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Yang Belum</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ekspor Excel</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. METRIC SUMMARY CARDS (4 Columns as in screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: TOTAL PEGAWAI */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              TOTAL PEGAWAI
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono mt-1">
              {totalPegawai}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">
              Terdaftar pada {activeEdition}
            </div>
          </div>
          <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: SUDAH MENGISI */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-2xs flex items-center justify-between bg-emerald-50/10">
          <div>
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              SUDAH MENGISI
            </div>
            <div className="text-3xl font-black text-emerald-600 font-mono mt-1">
              {sudahMengisiCount}
            </div>
            <div className="text-[11px] text-emerald-600 mt-1 font-bold">
              {persentaseKepatuhan}% Kepatuhan
            </div>
          </div>
          <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: BELUM MENGISI */}
        <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-2xs flex items-center justify-between bg-rose-50/10">
          <div>
            <div className="text-xs font-bold text-rose-800 uppercase tracking-wider">
              BELUM MENGISI
            </div>
            <div className="text-3xl font-black text-rose-600 font-mono mt-1">
              {belumMengisiCount}
            </div>
            <div className="text-[11px] text-rose-500 mt-1 font-semibold">
              {totalPegawai > 0 ? ((belumMengisiCount / totalPegawai) * 100).toFixed(1) : 0}% Pegawai
            </div>
          </div>
          <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: PROGRESS KEPATUHAN */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              PROGRESS KEPATUHAN
            </div>
            <div className="text-sm font-black text-slate-900 font-mono">
              {progressPercent}%
            </div>
          </div>

          <div className="my-2.5">
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            Target: 100% Partisipasi Seluruh Pegawai
          </div>
        </div>
      </div>

      {/* 3. EDISI SELECTOR & MANAGEMENT BAR */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Edition Pills List */}
        <div className="flex items-center flex-wrap gap-1.5 overflow-x-auto py-1">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mr-1">
            EDISI:
          </span>

          {editions.map((ed) => {
            const isActive = ed === activeEdition;
            return (
              <button
                key={ed}
                onClick={() => {
                  setActiveEdition(ed);
                  setSelectedIds([]);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#002d62] text-white shadow-2xs scale-102'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {ed}
              </button>
            );
          })}

          <button
            onClick={() => setIsNewEditionModalOpen(true)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 border border-dashed border-slate-300 hover:border-[#003366] hover:text-[#003366] bg-slate-50 hover:bg-blue-50/50 transition-colors cursor-pointer flex items-center gap-1"
            title="Tambah edisi pemantauan baru"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Edisi Baru</span>
          </button>
        </div>

        {/* Right: Edition Actions (Upload, Template, Tambah Pegawai, Menu Hapus) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Excel</span>
          </button>

          <button
            onClick={handleDownloadTemplate}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Template</span>
          </button>

          <button
            onClick={() => setIsAddEmployeeModalOpen(true)}
            className="px-3.5 py-2 bg-[#003366] hover:bg-[#002244] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-amber-300" />
            <span>Tambah Pegawai</span>
          </button>

          {/* Menu Hapus Dropdown */}
          <div className="relative" ref={deleteMenuRef}>
            <button
              onClick={() => setShowDeleteMenu(!showDeleteMenu)}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Menu Hapus</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showDeleteMenu && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-30 text-xs animate-scale-in">
                <button
                  onClick={handleDeleteSelected}
                  disabled={selectedIds.length === 0}
                  className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-700 font-semibold disabled:opacity-40 disabled:hover:bg-transparent flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Terpilih ({selectedIds.length})</span>
                </button>
                <button
                  onClick={() => {
                    setShowDeleteMenu(false);
                    handleResetEditionStatus();
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Kosongkan Edisi {activeEdition}</span>
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={handleResetToDefault}
                  className="w-full text-left px-3.5 py-2 hover:bg-blue-50 text-blue-700 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Reset Daftar 90 Pegawai</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. FILTER PILLS & SEARCH TOOLBAR */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('Semua')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'Semua'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Semua ({totalPegawai})
          </button>

          <button
            onClick={() => setFilterStatus('Sudah')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'Sudah'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60'
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Sudah ({sudahMengisiCount})</span>
          </button>

          <button
            onClick={() => setFilterStatus('Belum')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'Belum'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200/60'
            }`}
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Belum ({belumMengisiCount})</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative flex-1 max-w-xs sm:max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama pegawai..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#003366] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* 5. ADMINISTRATOR QUICK ACTIONS ROW */}
      <div className="px-1 flex flex-wrap items-center justify-between text-xs text-slate-500">
        <span className="font-semibold text-slate-600">Aksi Cepat Administrator:</span>
        <div className="flex items-center gap-3 font-semibold">
          <button
            onClick={handleMarkAllSudah}
            className="text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>• Tandai Semua Sudah</span>
          </button>
          <button
            onClick={handleMarkAllBelum}
            className="text-rose-700 hover:text-rose-900 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>• Tandai Semua Belum</span>
          </button>
          <button
            onClick={handleResetEditionStatus}
            className="text-slate-500 hover:text-slate-800 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>• Kosongkan Edisi</span>
          </button>
        </div>
      </div>

      {/* 6. TABLE MONITORING (Exactly formatted as screenshot) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider select-none">
                <th className="py-3 px-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-[#003366] focus:ring-[#003366] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 text-center w-12 text-slate-500 font-bold">
                  No
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span>Nama Pegawai</span>
                    <button
                      onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
                      className="px-1.5 py-0.5 rounded border border-slate-300 text-[10px] font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                      title="Urutkan nama"
                    >
                      <ArrowUpDown className="w-3 h-3 text-blue-700" />
                      <span>{sortOrder === 'asc' ? 'A - Z' : 'Z - A'}</span>
                    </button>
                  </div>
                </th>
                <th className="py-3 px-4 text-center w-36">
                  {activeEdition}
                </th>
                <th className="py-3 px-4 text-center w-40">
                  Status / Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400 text-xs">
                    Tidak ditemukan data pegawai untuk kriteria pencarian ini.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp, idx) => {
                  const status = emp.statusByEdition[activeEdition] || 'Belum';
                  const isChecked = selectedIds.includes(emp.id);

                  return (
                    <tr
                      key={emp.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isChecked ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelectRow(emp.id)}
                          className="rounded border-slate-300 text-[#003366] focus:ring-[#003366] cursor-pointer"
                        />
                      </td>

                      {/* No */}
                      <td className="py-3 px-3 text-center text-slate-500 font-mono text-xs">
                        {idx + 1}
                      </td>

                      {/* Nama Pegawai */}
                      <td className="py-3 px-4 font-semibold text-slate-900 text-xs sm:text-sm">
                        {emp.name}
                      </td>

                      {/* Status EA Active Edition */}
                      <td className="py-3 px-4 text-center">
                        {status === 'Sudah' ? (
                          <span className="inline-block px-4 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                            Sudah
                          </span>
                        ) : (
                          <span className="inline-block px-4 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
                            Belum
                          </span>
                        )}
                      </td>

                      {/* Status / Aksi Buttons */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleToggleStatus(emp.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
                            title={`Ubah status menjadi ${status === 'Sudah' ? 'Belum' : 'Sudah'}`}
                          >
                            {status === 'Sudah' ? 'Tandai Belum' : 'Tandai Sudah'}
                          </button>

                          <button
                            onClick={() => setEditingEmployee(emp)}
                            className="p-1 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Ubah Nama Pegawai"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Pegawai"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary Info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              Menampilkan {filteredEmployees.length} dari {totalPegawai} pegawai Kanwil DJPb Prov. Jambi.
            </span>
          </div>

          <div className="font-semibold text-slate-700">
            Tingkat Kepatuhan: <strong className="text-emerald-700 font-bold">{persentaseKepatuhan}%</strong> ({sudahMengisiCount} Sudah / {belumMengisiCount} Belum)
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: Tambah Pegawai Baru */}
      {/* ========================================================================= */}
      {isAddEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-5 bg-gradient-to-r from-[#003366] to-[#002244] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Tambah Pegawai Baru</h3>
              </div>
              <button
                onClick={() => setIsAddEmployeeModalOpen(false)}
                className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployeeSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Nama Lengkap Pegawai & Gelar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Yusuf, S.E., M.Ak."
                  value={newEmployeeName}
                  onChange={(e) => setNewEmployeeName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-hidden focus:border-[#003366]"
                  autoFocus
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Pegawai akan otomatis terdaftar pada target edisi {activeEdition}.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddEmployeeModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Simpan Pegawai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Edit Nama Pegawai */}
      {/* ========================================================================= */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-5 bg-gradient-to-r from-[#003366] to-[#002244] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Edit className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Ubah Nama Pegawai</h3>
              </div>
              <button
                onClick={() => setEditingEmployee(null)}
                className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditEmployeeSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Nama Lengkap Pegawai & Gelar
                </label>
                <input
                  type="text"
                  required
                  value={editingEmployee.name}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-hidden focus:border-[#003366]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Tambah Edisi Baru */}
      {/* ========================================================================= */}
      {isNewEditionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-5 bg-gradient-to-r from-[#003366] to-[#002244] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Share2 className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Terbitkan Target Edisi Baru</h3>
              </div>
              <button
                onClick={() => setIsNewEditionModalOpen(false)}
                className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewEdition} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Kode / Nama Edisi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: EA 12 atau EA 13"
                  value={newEditionCode}
                  onChange={(e) => setNewEditionCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 font-mono focus:outline-hidden focus:border-[#003366]"
                  autoFocus
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Edisi baru akan langsung muncul di bar navigasi atas.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewEditionModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Terbitkan Edisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Upload Excel / Import CSV */}
      {/* ========================================================================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
            <div className="p-5 bg-gradient-to-r from-sky-600 to-blue-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Upload className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="font-bold text-base">Upload Excel / CSV Employee Advocacy</h3>
                  <p className="text-[11px] text-blue-100">Target: {activeEdition}</p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* File Dropzone */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".csv, .txt, .xlsx, .xls"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-sky-300 hover:border-sky-600 bg-sky-50/40 hover:bg-sky-50/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
                >
                  <Upload className="w-8 h-8 text-sky-600 mb-2" />
                  <p className="font-bold text-slate-800">Klik untuk Pilih Berkas Excel / CSV</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Mendukung file .csv, .txt format standar</p>
                </div>
              </div>

              <div className="text-center font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                — ATAU TEMPELKAN DAFTAR TEKS DI BAWAH —
              </div>

              {/* Text Area */}
              <div>
                <textarea
                  rows={5}
                  value={uploadText}
                  onChange={(e) => setUploadText(e.target.value)}
                  placeholder="Format: 1 baris per nama pegawai. Contoh:&#10;Abdul Hafid, Sudah&#10;Abil Fikri Audia S.M., Sudah&#10;Ahmad Nauval, Belum"
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-mono text-xs focus:bg-white focus:border-sky-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="text-sky-700 hover:underline font-semibold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Contoh Template</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleProcessImportText(uploadText)}
                    disabled={!uploadText.trim()}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold rounded-xl cursor-pointer shadow-xs"
                  >
                    Proses Impor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
