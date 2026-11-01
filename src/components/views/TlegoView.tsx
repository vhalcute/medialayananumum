import React, { useState } from 'react';
import {
  BookOpen,
  FileQuestion,
  HelpCircle,
  Award,
  CheckCircle2,
  XCircle,
  Download,
  ArrowRight,
  RotateCcw,
  Clock,
  Sparkles,
  ChevronRight,
  X,
  Play,
  FileText,
  Star
} from 'lucide-react';

interface ModuleItem {
  id: number;
  label: string;
  title: string;
  subtitle: string;
  badge: string;
  year: string;
  gradient: string;
  borderHover: string;
  description: string;
  topics: string[];
  regulation: string[];
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const TlegoView: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<ModuleItem | null>(null);
  const [selectedLatihan, setSelectedLatihan] = useState<number | null>(null);
  const [selectedKuis, setSelectedKuis] = useState<number | null>(null);

  // Practice state
  const [userAnswers, setUserAnswers] = useState<{ [qId: number]: number }>({});
  const [showExplanation, setShowExplanation] = useState<{ [qId: number]: boolean }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [cardSize, setCardSize] = useState<'normal' | 'large'>('large');

  // 6 Modules exactly matching the screenshot
  const modules: ModuleItem[] = [
    {
      id: 1,
      label: 'Modul 1',
      title: 'Pengelolaan Keuangan Negara',
      subtitle: 'Kanwil DJPb Provinsi Jambi',
      badge: 'MODUL',
      year: '2026',
      gradient: 'from-[#1e3a8a] via-[#1d4ed8] to-[#0f172a]',
      borderHover: 'hover:border-blue-400',
      description: 'Membahas kerangka regulasi pokok keuangan negara, asas-asas pengelolaan APBN, kedudukan Bendahara Umum Negara (BUN), serta siklus penyusunan anggaran negara.',
      topics: [
        'Asas Tahunan, Universalitas, Kesatuan, dan Spesialitas APBN',
        'Kedudukan & Wewenang Menteri Keuangan selaku Bendahara Umum Negara (BUN)',
        'Siklus Perencanaan, Penetapan, Pelaksanaan, dan Pertanggungjawaban APBN',
        'Hubungan Keuangan Pusat dan Daerah (HKPD) & Transfer ke Daerah (TKD)'
      ],
      regulation: [
        'UU Nomor 17 Tahun 2003 tentang Keuangan Negara',
        'UU Nomor 1 Tahun 2004 tentang Perbendaharaan Negara',
        'UU Nomor 1 Tahun 2022 tentang Hubungan Keuangan antara Pemerintah Pusat dan Pemerintahan Daerah (HKPD)'
      ]
    },
    {
      id: 2,
      label: 'Modul 2',
      title: 'Pelaksanaan Anggaran',
      subtitle: 'Kanwil DJPb Provinsi Jambi',
      badge: 'MODUL',
      year: '2026',
      gradient: 'from-[#881337] via-[#9f1239] to-[#3f0814]',
      borderHover: 'hover:border-rose-400',
      description: 'Pendalaman tata cara pembayaran atas beban APBN, penerbitan SPM dan SP2D, manajemen komitmen kontrak, mekanisme Uang Persediaan (UP/TUP), serta evaluasi kinerja anggaran melalui IKPA.',
      topics: [
        'Mekanisme Penerbitan SPP, SPM, dan Pencairan Dana SP2D',
        'Pengelolaan Uang Persediaan (UP) dan Tambahan Uang Persediaan (TUP) KKP/Digipay',
        'Pendaftaran dan Manajemen Kontrak Pengadaan Barang dan Jasa Pemerintah',
        'Indikator Kinerja Pelaksanaan Anggaran (IKPA) 8 Indikator Kemenkeu'
      ],
      regulation: [
        'PMK Nomor 62 Tahun 2023 tentang Perencanaan Anggaran dan Pelaksanaan Anggaran',
        'Perdirjen Perbendaharaan tentang Petunjuk Teknis IKPA Tahun Anggaran 2026',
        'PMK Nomor 196/PMK.05/2018 tentang Tata Cara Pembayaran dan Penggunaan Kartu Kredit Pemerintah'
      ]
    },
    {
      id: 3,
      label: 'Modul 3',
      title: 'Pengelolaan Kas',
      subtitle: 'Kanwil DJPb Provinsi Jambi',
      badge: 'MODUL',
      year: '2026',
      gradient: 'from-[#065f46] via-[#047857] to-[#022c22]',
      borderHover: 'hover:border-emerald-400',
      description: 'Pengelolaan likuiditas keuangan negara melalui Treasury Single Account (TSA), optimalisasi saldo kas pemerintah, penatausahaan rekening kementerian/lembaga, dan pelaporan arus kas.',
      topics: [
        'Penerapan Treasury Single Account (TSA) pada Pengeluaran dan Penerimaan',
        'Perencanaan Kas (Cash Forecasting) Satker dan Monitoring Saldo Kas Harian',
        'Penertiban Rekening Pemerintah melalui Sistem Kliring dan Virtual Account',
        'Pemanfaatan Saldo Kas Idle untuk Peningkatan Pendapatan Negara Bukan Pajak'
      ],
      regulation: [
        'PMK Nomor 183/PMK.05/2019 tentang Pengelolaan Rekening Milik Satuan Kerja',
        'PMK Nomor 190/PMK.05/2012 jo PMK 62/2023 tentang Tata Cara Pembayaran Beban APBN',
        'Perdirjen Perbendaharaan terkait Treasury Management System'
      ]
    },
    {
      id: 4,
      label: 'Modul 4',
      title: 'Akuntansi dan Pertanggungjawaban Keuangan',
      subtitle: 'Kanwil DJPb Provinsi Jambi',
      badge: 'MODUL',
      year: '2026',
      gradient: 'from-[#b45309] via-[#d97706] to-[#451a03]',
      borderHover: 'hover:border-amber-400',
      description: 'Standar Akuntansi Pemerintahan (SAP) berbasis akrual, proses rekonsiliasi data transaksi keuangan pada aplikasi MonSAKTI, serta penyusunan Laporan Keuangan Pemerintah Pusat (LKPP/LKKL/LKBUN).',
      topics: [
        'Standar Akuntansi Pemerintahan (SAP) Berbasis Akrual',
        'Rekonsiliasi Internal dan Eksternal SAKTI - SPAN melalui MonSAKTI',
        'Penyusunan Neraca, Laporan Operasional (LO), dan Laporan Perubahan Ekuitas (LPE)',
        'Penatausahaan dan Rekonsiliasi Barang Milik Negara (BMN) dalam Neraca Keuangan'
      ],
      regulation: [
        'PP Nomor 71 Tahun 2010 tentang Standar Akuntansi Pemerintahan (SAP)',
        'PMK Nomor 217/PMK.05/2022 tentang Sistem Akuntansi dan Pelaporan Keuangan Pemerintah Pusat',
        'Petunjuk Teknis Tutup Buku dan Penyusunan LKKL Tahunan'
      ]
    },
    {
      id: 5,
      label: 'Modul 5',
      title: 'Sistem Informasi dan Teknologi',
      subtitle: 'Kanwil DJPb Provinsi Jambi',
      badge: 'MODUL',
      year: '2026',
      gradient: 'from-[#334155] via-[#1e293b] to-[#0f172a]',
      borderHover: 'hover:border-slate-400',
      description: 'Arsitektur teknologi informasi perbendaharaan digital, operasional Sistem Aplikasi Keuangan Tingkat Instansi (SAKTI), integrasi SPAN, Satu Kemenkeu, serta keamanan siber dan perlindungan data keuangan.',
      topics: [
        'Modul SAKTI: Penganggaran, Komitmen, Pembayaran, Bendahara, Persediaan, Aset Tetap, dan GLP',
        'Sistem Perbendaharaan dan Anggaran Negara (SPAN) Backbone Transaksi APBN',
        'Pemanfaatan Tanda Tangan Elektronik (TTE) Tersertifikasi BSrE pada Dokumen Keuangan',
        'Manajemen Keamanan Informasi (SMKI ISO 27001) dan Privasi Data Transaksi'
      ],
      regulation: [
        'PMK Nomor 171/PMK.05/2021 tentang Tata Cara Sistem Aplikasi Keuangan Tingkat Instansi (SAKTI)',
        'Keputusan Dirjen Perbendaharaan tentang Keamanan Sistem Informasi SPAN & SAKTI',
        'Peraturan BSSN tentang Standar Penggunaan Tanda Tangan Elektronik Instansi Pemerintah'
      ]
    },
    {
      id: 6,
      label: 'Modul 6',
      title: 'Special Mission',
      subtitle: 'Kanwil DJPb Provinsi Jambi',
      badge: 'MODUL',
      year: '2026',
      gradient: 'from-[#be185d] via-[#db2777] to-[#500724]',
      borderHover: 'hover:border-pink-400',
      description: 'Peran strategis Kanwil DJPb sebagai Regional Chief Economist (RCE) dan Financial Advisor, pemberdayaan UMKM melalui Kredit Usaha Rakyat (KUR) dan Pembiayaan Ultra Mikro (UMi), serta analisis fiskal regional (KFR).',
      topics: [
        'Kanwil DJPb sebagai Regional Chief Economist (RCE) & Analisis Kajian Fiskal Regional (KFR)',
        'Dukungan Pembiayaan UMKM: Monitoring Kredit Usaha Rakyat (KUR) dan Sistem Informasi SIKP',
        'Penyaluran Pembiayaan Ultra Mikro (UMi) dan Program Pemberdayaan Ekonomi Kerakyatan',
        'Kerja Sama Local Expert Akademisi dan Forum Koordinasi Pengelola Keuangan Daerah'
      ],
      regulation: [
        'Keputusan Menteri Keuangan tentang Peran Kanwil DJPb sebagai Regional Chief Economist',
        'Peraturan Menteri Koordinator Bidang Perekonomian tentang Pedoman Pelaksanaan KUR',
        'PMK tentang Pengelolaan Dana Bergulir dan Pembiayaan Ultra Mikro'
      ]
    }
  ];

  // Latihan Soal Datasets
  const latihanDatasets: { [key: number]: { title: string; subtitle: string; questions: Question[] } } = {
    1: {
      title: 'Latihan Soal 1: Dasar Keuangan Negara & Pelaksanaan Anggaran',
      subtitle: 'Latihan pemahaman asas keuangan negara, mekanisme pembayaran beban APBN, dan IKPA',
      questions: [
        {
          id: 101,
          question: 'Asas dalam pengelolaan keuangan negara yang mengharuskan setiap transaksi keuangan dicatat dan dipertanggungjawabkan dalam satu dokumen anggaran adalah...',
          options: ['Asas Universalitas', 'Asas Kesatuan', 'Asas Spesialitas', 'Asas Tahunan'],
          correctAnswer: 1,
          explanation: 'Asas Kesatuan menghendaki agar semua pendapatan dan belanja negara disajikan dalam satu dokumen anggaran (APBN).'
        },
        {
          id: 102,
          question: 'Siapakah pejabat yang memiliki kewenangan menerbitkan Surat Perintah Membayar (SPM) pada satuan kerja pengelola APBN?',
          options: ['Kuasa Pengguna Anggaran (KPA)', 'Pejabat Penandatangan SPM (PPSPM)', 'Pejabat Pembuat Komitmen (PPK)', 'Bendahara Pengeluaran'],
          correctAnswer: 1,
          explanation: 'PPSPM adalah pejabat yang diberi kewenangan oleh KPA untuk melakukan pengujian atas SPP dan menerbitkan SPM.'
        },
        {
          id: 103,
          question: 'Batas waktu penyampaian data kontrak pengadaan barang/jasa bernilai di atas Rp50 juta ke KPPN paling lambat berapa hari kerja setelah penandatanganan?',
          options: ['3 hari kerja', '5 hari kerja', '7 hari kerja', '14 hari kerja'],
          correctAnswer: 1,
          explanation: 'Sesuai regulasi pelaksanaan anggaran, data kontrak wajib didaftarkan ke KPPN paling lambat 5 hari kerja setelah kontrak ditandatangani untuk menjaga indikator IKPA.'
        }
      ]
    },
    2: {
      title: 'Latihan Soal 2: Pengelolaan Kas & Perbendaharaan Modern',
      subtitle: 'Latihan pemahaman konsep Treasury Single Account (TSA) dan manajemen likuiditas kas negara',
      questions: [
        {
          id: 201,
          question: 'Prinsip utama dari implementasi Treasury Single Account (TSA) adalah...',
          options: [
            'Memisahkan seluruh uang negara ke ribuan bank komersial daerah',
            'Menyatukan seluruh saldo kas negara dalam satu rekening induk di bank sentral secara realtime',
            'Membolehkan bendahara menyimpan kas dalam bentuk tunai tanpa batas',
            'Menghilangkan fungsi verifikasi pencairan dana di KPPN'
          ],
          correctAnswer: 1,
          explanation: 'TSA menyatukan saldo kas pemerintah di Bank Sentral untuk pengelolaan likuiditas yang optimal, transparan, dan meminimalisir kas idle.'
        },
        {
          id: 202,
          question: 'Kartu yang diterbitkan oleh Bank Penerbit KKP untuk digunakan oleh satker dalam membiayai belanja operasional dan perjalanan dinas adalah...',
          options: ['Kartu Debit Giro Satker', 'Kartu Kredit Pemerintah (KKP)', 'Kartu Tapcash Pribadi', 'Kartu Identitas Pegawai'],
          correctAnswer: 1,
          explanation: 'Kartu Kredit Pemerintah (KKP) digunakan untuk memfasilitasi transaksi non-tunai Uang Persediaan demi akuntabilitas dan efisiensi belanja negara.'
        },
        {
          id: 203,
          question: 'Aplikasi yang digunakan satker untuk monitoring saldo rekening, izin pembukaan rekening, dan rekonsiliasi kas pemerintah adalah...',
          options: ['Aplikasi SPRINT / Rekening Pemerintah', 'Aplikasi Gaji Web', 'Aplikasi SIMAK BMN', 'Aplikasi SAS Offline'],
          correctAnswer: 0,
          explanation: 'Sistem Pengelolaan Rekening Terintegrasi (SPRINT) digunakan untuk pengelolaan dan penatausahaan rekening satker K/L.'
        }
      ]
    },
    3: {
      title: 'Latihan Soal 3: Akuntansi, Teknologi SAKTI & Special Mission',
      subtitle: 'Latihan pemahaman akuntansi berbasis akrual, modul SAKTI, dan peran Regional Chief Economist',
      questions: [
        {
          id: 301,
          question: 'Laporan keuangan yang menyajikan ikhtisar sumber, alokasi, dan pemakaian sumber daya finansial yang dikelola oleh pemerintah selama satu periode adalah...',
          options: ['Laporan Realisasi Anggaran (LRA)', 'Laporan Arus Kas', 'Catatan atas Laporan Keuangan (CaLK)', 'Neraca Saldo'],
          correctAnswer: 0,
          explanation: 'LRA menyajikan realisasi pendapatan dan belanja negara dibandingkan dengan target yang ditetapkan dalam APBN.'
        },
        {
          id: 302,
          question: 'Modul pada aplikasi SAKTI yang berfungsi membukukan jurnal akrual dan kas secara otomatis dari transaksi sub-ledger adalah...',
          options: ['Modul Pembayaran', 'Modul Komitmen', 'Modul General Ledger dan Pelaporan (GLP)', 'Modul Penganggaran'],
          correctAnswer: 2,
          explanation: 'Modul GLP membukukan seluruh jurnal keuangan dari modul operasional serta memproduksi laporan keuangan satker.'
        },
        {
          id: 303,
          question: 'Peran strategis Kanwil DJPb di daerah dalam mengkaji perkembangan ekonomi regional dan fiskal daerah dikenal dengan istilah...',
          options: ['Regional Chief Economist (RCE)', 'National Budget Inspector', 'Local Treasury Auditor', 'Public Finance Comptroller'],
          correctAnswer: 0,
          explanation: 'Kanwil DJPb menjalankan fungsi Regional Chief Economist (RCE) untuk menyusun Kajian Fiskal Regional (KFR) dan mendampingi pemda.'
        }
      ]
    }
  };

  // Kuis Datasets
  const kuisDatasets: { [key: number]: { title: string; timeMinutes: number; questions: Question[] } } = {
    1: {
      title: 'Kuis Evaluasi 1: Tata Kelola Keuangan Negara & SAKTI',
      timeMinutes: 10,
      questions: [
        {
          id: 501,
          question: 'Berdasarkan UU No. 17 Tahun 2003, kekuasaan pengelolaan keuangan negara tertinggi dipegang oleh...',
          options: ['Menteri Keuangan', 'Presiden', 'Ketua BPK', 'Gubernur Bank Indonesia'],
          correctAnswer: 1,
          explanation: 'Presiden selaku Kepala Pemerintahan memegang kekuasaan pengelolaan keuangan negara sebagai bagian dari kekuasaan pemerintahan.'
        },
        {
          id: 502,
          question: 'Dokumen pelaksanaan anggaran yang menjadi dasar pengeluaran negara dan pencairan dana APBN adalah...',
          options: ['RKA-K/L', 'DIPA (Daftar Isian Pelaksanaan Anggaran)', 'Nota Keuangan', 'Surat Perintah Kerja (SPK)'],
          correctAnswer: 1,
          explanation: 'DIPA merupakan dokumen pelaksanaan anggaran yang memuat alokasi pagu belanja dan rencana penarikan dana.'
        },
        {
          id: 503,
          question: 'Prinsip akuntansi akrual mengakui pendapatan dan beban pada saat...',
          options: ['Uang tunai diterima atau dibayarkan di kas negara', 'Hak timbul atau kewajiban terjadi tanpa memandang kas diterima/dikeluarkan', 'Laporan keuangan diaudit oleh BPK', 'DIPA diserahkan oleh Presiden'],
          correctAnswer: 1,
          explanation: 'Basis akrual mengakui dampak transaksi pada saat peristiwa terjadi, bukan pada saat kas diterima atau dibayar.'
        }
      ]
    },
    2: {
      title: 'Kuis Evaluasi 2: Pengelolaan Kas, Likuiditas & Perbendaharaan',
      timeMinutes: 10,
      questions: [
        {
          id: 601,
          question: 'Rekening Pengeluaran Kuasa BUN diatur dengan mekanisme saldo nihil (zero balance) setiap akhir hari kerja, hal ini bertujuan untuk...',
          options: ['Mencegah kas mengendap (idle) dan memaksimalkan likuiditas terpusat di TSA', 'Mempermudah bank memungut biaya administrasi', 'Meniadakan transaksi perbankan', 'Menunda pembayaran ke pihak ketiga'],
          correctAnswer: 0,
          explanation: 'Mekanisme Zero Balance Account memastikan seluruh sisa saldo ditarik kembali ke rekening induk BUN di Bank Indonesia setiap sore hari.'
        },
        {
          id: 602,
          question: 'Batas maksimal pengajuan Tambahan Uang Persediaan (TUP) harus dipertanggungjawabkan dalam kurun waktu...',
          options: ['10 hari kalender', '15 hari kerja', '1 bulan kalender sejak SP2D terbit', 'Akhir tahun anggaran'],
          correctAnswer: 2,
          explanation: 'TUP wajib dipertanggungjawabkan atau disetor kembali ke kas negara selambat-lambatnya 1 bulan sejak SP2D diterbitkan.'
        },
        {
          id: 603,
          question: 'Sistem yang menghubungkan perbankan, satker kementerian/lembaga, dan Ditjen Perbendaharaan dalam pertukaran data penerimaan negara secara elektronik adalah...',
          options: ['Modul Penerimaan Negara Generasi Ketiga (MPN G3)', 'Aplikasi SIAP', 'Aplikasi Simponi Versi 1', 'Sistem Pajak Daerah'],
          correctAnswer: 0,
          explanation: 'MPN G3 memproses penyetoran penerimaan negara (pajak, bea cukai, PNBP) secara online, aman, dan realtime.'
        }
      ]
    },
    3: {
      title: 'Kuis Evaluasi 3: Pengawasan Kinerja, BMN & Special Mission Kanwil',
      timeMinutes: 10,
      questions: [
        {
          id: 701,
          question: 'Dalam penilaian Indikator Kinerja Pelaksanaan Anggaran (IKPA), indikator penyerapan anggaran dihitung berdasarkan kesesuaian antara...',
          options: ['Realisasi penyerapan dana terhadap target Rencana Penarikan Dana (RPD) pada Halaman III DIPA', 'Jumlah pegawai satker terhadap pagu anggaran', 'Nilai aset BMN terhadap pagu modal', 'Total lembur satker terhadap sisa pagu'],
          correctAnswer: 0,
          explanation: 'Penyerapan anggaran diukur dari ketepatan realisasi belanja terhadap jadwal RPD Halaman III DIPA yang telah direncanakan.'
        },
        {
          id: 702,
          question: 'Kajian rutin yang disusun oleh Bidang Pembinaan Pelaksanaan Anggaran II Kanwil DJPb mengenai kondisi ekonomi dan APBN di provinsi adalah...',
          options: ['Kajian Fiskal Regional (KFR)', 'Buku Statistik Daerah', 'Laporan Akuntabilitas Kinerja Satker', 'Neraca Pembayaran Provinsi'],
          correctAnswer: 0,
          explanation: 'Kajian Fiskal Regional (KFR) adalah produk intelektual Kanwil DJPb yang menyajikan analisis fiskal komprehensif bagi pemangku kepentingan daerah.'
        },
        {
          id: 703,
          question: 'Sistem Informasi Kredit Program (SIKP) yang dikelola oleh Ditjen Perbendaharaan ditujukan untuk...',
          options: ['Mencatat debitur dan mengawasi penyaluran subsidi bunga Kredit Usaha Rakyat (KUR) dan Pembiayaan UMi', 'Merekam utang luar negeri pemerintah', 'Mengatur sistem penggajian pegawai BUMN', 'Menghitung pajak penghasilan UMKM'],
          correctAnswer: 0,
          explanation: 'SIKP adalah basis data nasional yang mencatat calon debitur serta mengontrol penyaluran subsidi bunga KUR dan pembiayaan Ultra Mikro.'
        }
      ]
    }
  };

  const handleSelectAnswer = (qId: number, optionIdx: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleToggleExplanation = (qId: number) => {
    setShowExplanation(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setShowExplanation({});
    setQuizSubmitted(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8 pb-10">
      {/* 1. Header Title & Clarity Toggle */}
      <div className="flex flex-col md:flex-row items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Subbagian Kepegawaian & Pelatihan
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              Kanwil DJPb Prov. Jambi
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002244] tracking-tight">
            Treasury Learning On The Go (TLEGO)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pusat pembelajaran mandiri, bank latihan soal perbendaharaan, dan kuis evaluasi pemahaman regulasi APBN.
          </p>
        </div>

        {/* View Mode: Mode Besar (Lebih Jelas) vs Mode Standar */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 shrink-0">
          <span className="text-[11px] text-slate-400 pl-1.5 font-normal">Ukuran:</span>
          <button
            onClick={() => setCardSize('large')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              cardSize === 'large'
                ? 'bg-white text-[#003366] font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tampilan Jelas (3 Kolom)
          </button>
          <button
            onClick={() => setCardSize('normal')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              cardSize === 'normal'
                ? 'bg-white text-[#003366] font-bold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tampilan Penuh (6 Kolom)
          </button>
        </div>
      </div>

      {/* 2. Top Row: 6 Module Cards matching screenshot colors, layouts, and typography with high clarity */}
      <div
        className={
          cardSize === 'large'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6'
            : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4'
        }
      >
        {modules.map((mod) => (
          <div key={mod.id} className="flex flex-col items-center group">
            {/* The Card Component */}
            <div
              onClick={() => setSelectedModule(mod)}
              className={`w-full rounded-2xl bg-gradient-to-b ${mod.gradient} text-white flex flex-col justify-between shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 cursor-pointer border-2 border-white/20 ${mod.borderHover} relative overflow-hidden select-none ${
                cardSize === 'large'
                  ? 'p-4 sm:p-5 min-h-[250px] sm:min-h-[270px]'
                  : 'p-3 sm:p-3.5 min-h-[220px] sm:min-h-[235px]'
              }`}
              style={{
                backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.18) 1.2px, transparent 1.2px)`,
                backgroundSize: '8px 8px'
              }}
            >
              {/* Subtle top glare/gradient shine */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/30 pointer-events-none" />

              {/* Card Top Row: DJPB with Star + Year */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-full border border-white/20 backdrop-blur-xs">
                  <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[9px] font-black shadow-xs">
                    ★
                  </span>
                  <span className="tracking-wider text-amber-200 text-[10px] sm:text-xs font-black">
                    DJPB
                  </span>
                </div>
                <div className="bg-black/40 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold text-white border border-white/20 backdrop-blur-xs">
                  {mod.year}
                </div>
              </div>

              {/* Center Inset Dark Box with Yellow MODUL Badge & Title */}
              <div
                className={`my-auto z-10 bg-slate-950/75 backdrop-blur-md rounded-xl border border-white/25 text-center flex flex-col items-center justify-center shadow-lg group-hover:bg-slate-950/85 transition-colors ${
                  cardSize === 'large' ? 'p-3.5 sm:p-4 min-h-[120px]' : 'p-2.5 sm:p-3 min-h-[105px]'
                }`}
              >
                <span
                  className={`font-black uppercase rounded bg-amber-400 text-slate-950 tracking-wider shadow-xs mb-1.5 ${
                    cardSize === 'large' ? 'text-[10px] sm:text-[11px] px-3 py-0.5' : 'text-[9px] px-2 py-0.5'
                  }`}
                >
                  {mod.badge}
                </span>
                <h3
                  className={`font-extrabold text-white text-center leading-snug drop-shadow-md line-clamp-3 ${
                    cardSize === 'large' ? 'text-sm sm:text-base' : 'text-xs sm:text-[13px]'
                  }`}
                >
                  {mod.title}
                </h3>
                <p
                  className={`italic text-slate-300 font-light mt-1 ${
                    cardSize === 'large' ? 'text-[10px] sm:text-xs' : 'text-[8.5px] sm:text-[9px]'
                  }`}
                >
                  {mod.subtitle}
                </p>
              </div>

              {/* Bottom Row: Dual Circle Badge Icons + TLEGO in gold */}
              <div className="flex items-center justify-between z-10 pt-1 border-t border-white/10">
                <div className="flex items-center -space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-amber-400 border-2 border-white text-slate-950 flex items-center justify-center text-[8px] font-black shadow-xs">
                    I
                  </div>
                  <div className="w-5 h-5 rounded-full bg-cyan-400 border-2 border-white text-slate-950 flex items-center justify-center text-[8px] font-black shadow-xs">
                    II
                  </div>
                </div>
                <span
                  className={`font-black tracking-widest text-amber-300 drop-shadow-md ${
                    cardSize === 'large' ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-xs'
                  }`}
                >
                  TLEGO
                </span>
              </div>
            </div>

            {/* Label Underneath the Card */}
            <div className="flex items-center justify-center gap-1.5 mt-2.5">
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
                {mod.label}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                (Klik untuk buka)
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Divider Line */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-4 text-slate-400 font-semibold tracking-wider">
            Latihan & Evaluasi Mandiri
          </span>
        </div>
      </div>

      {/* 4. Latihan Soal Section: 3 Horizontal Columns with Spiral Notebook Icon */}
      <div className="pt-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-4xl mx-auto">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              onClick={() => {
                setSelectedLatihan(num);
                setUserAnswers({});
                setShowExplanation({});
              }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/80 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 transition-all duration-200 cursor-pointer group shadow-2xs hover:shadow-md select-none"
            >
              {/* Custom Spiral Notepad with Pencil SVG Icon matching reference picture with high DPI */}
              <div className="relative shrink-0 group-hover:scale-110 transition-transform duration-200">
                <svg
                  className="w-16 h-20 sm:w-18 sm:h-22 drop-shadow-sm"
                  viewBox="0 0 64 74"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Spiral bindings on top */}
                  <rect x="15" y="4" width="4" height="9" rx="2" fill="#0f172a" />
                  <rect x="25" y="4" width="4" height="9" rx="2" fill="#0f172a" />
                  <rect x="35" y="4" width="4" height="9" rx="2" fill="#0f172a" />
                  <rect x="45" y="4" width="4" height="9" rx="2" fill="#0f172a" />

                  {/* Notepad sheet with rounded corners */}
                  <rect
                    x="9"
                    y="9"
                    width="46"
                    height="58"
                    rx="8"
                    fill="#ffffff"
                    stroke="#1e293b"
                    strokeWidth="2.5"
                  />

                  {/* Horizontal writing lines */}
                  <line x1="16" y1="23" x2="48" y2="23" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="16" y1="31" x2="48" y2="31" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="16" y1="39" x2="48" y2="39" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="16" y1="47" x2="38" y2="47" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Diagonal pencil drawing at bottom right */}
                  <g transform="translate(36, 42) rotate(-45)">
                    {/* Pencil body */}
                    <rect x="0" y="0" width="22" height="7" rx="1.5" fill="#f59e0b" stroke="#1e293b" strokeWidth="1.5" />
                    {/* Pencil tip */}
                    <path d="M22 0 L29 3.5 L22 7 Z" fill="#fde68a" stroke="#1e293b" strokeWidth="1.5" />
                    <path d="M27 2.5 L29 3.5 L27 4.5 Z" fill="#1e293b" />
                    {/* Pink eraser */}
                    <rect x="-4.5" y="0" width="4.5" height="7" rx="1" fill="#f43f5e" stroke="#1e293b" strokeWidth="1.5" />
                  </g>
                </svg>
              </div>

              {/* Text Label: Latihan Soal 1, 2, 3 */}
              <div className="text-left flex-1">
                <span className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-[#003366] transition-colors block">
                  Latihan Soal {num}
                </span>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {num === 1 && 'Keuangan Negara & Anggaran'}
                  {num === 2 && 'Manajemen Kas & Likuiditas'}
                  {num === 3 && 'Akuntansi & Sistem SAKTI'}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 mt-1.5 group-hover:underline">
                  <span>Mulai Latihan</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Kuis Section: 3 Horizontal Columns with Circular Rose Badge & Blue Document Icon */}
      <div className="pt-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-4xl mx-auto">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              onClick={() => {
                setSelectedKuis(num);
                setUserAnswers({});
                setQuizSubmitted(false);
              }}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50/80 hover:bg-rose-50/80 border border-slate-200/80 hover:border-rose-300 transition-all duration-200 cursor-pointer group shadow-2xs hover:shadow-md select-none text-center"
            >
              {/* Circular Badge with Pink Ring & Cyan Document SVG */}
              <div className="relative group-hover:scale-110 transition-transform duration-200">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-[3.5px] border-[#f43f5e] bg-white flex items-center justify-center shadow-xs">
                  {/* Cyan Document with Lines & Pencil SVG */}
                  <svg
                    className="w-9 h-9 sm:w-10 sm:h-10"
                    viewBox="0 0 36 42"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Document Page */}
                    <rect
                      x="3"
                      y="2"
                      width="30"
                      height="38"
                      rx="4"
                      fill="#06b6d4"
                      stroke="#0891b2"
                      strokeWidth="1.5"
                    />
                    {/* Lines */}
                    <line x1="8" y1="10" x2="28" y2="10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="8" y1="17" x2="28" y2="17" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="8" y1="24" x2="20" y2="24" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Small edit pencil on document */}
                    <g transform="translate(19, 23) rotate(-35)">
                      <rect x="0" y="0" width="14" height="4.5" rx="1" fill="#f59e0b" stroke="#1e293b" strokeWidth="1" />
                      <path d="M14 0 L18 2.25 L14 4.5 Z" fill="#fde68a" stroke="#1e293b" strokeWidth="1" />
                      <path d="M16.5 1.5 L18 2.25 L16.5 3 Z" fill="#1e293b" />
                    </g>
                  </svg>
                </div>
              </div>

              {/* Text Label: Kuis 1, 2, 3 */}
              <span className="text-base sm:text-lg font-extrabold text-slate-900 mt-3 group-hover:text-rose-600 transition-colors">
                Kuis {num}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Evaluasi Mandiri {num} • 10 Menit
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 mt-1.5 group-hover:underline">
                <span>Ikuti Kuis</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: Modul Detail / Viewer */}
      {/* ========================================================================= */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden my-8 animate-scale-in">
            {/* Header with Card Gradient */}
            <div className={`p-6 bg-gradient-to-r ${selectedModule.gradient} text-white flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 font-extrabold text-sm border border-white/20">
                  {selectedModule.label.replace('Modul ', 'M')}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-900">
                      {selectedModule.badge}
                    </span>
                    <span className="text-xs text-white/80 font-medium">Tahun {selectedModule.year}</span>
                  </div>
                  <h2 className="text-lg font-bold mt-0.5">{selectedModule.title}</h2>
                  <p className="text-xs text-white/70 italic">{selectedModule.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedModule(null)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-xs">
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-700" />
                  <span>Ringkasan Materi Pokok</span>
                </h4>
                <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed text-xs">
                  {selectedModule.description}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Subtopik Pembelajaran</span>
                </h4>
                <div className="space-y-2">
                  {selectedModule.topics.map((topik, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-[#003366] font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="text-slate-700 font-medium">{topik}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Dasar Hukum & Regulasi Terkait</span>
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  {selectedModule.regulation.map((reg, idx) => (
                    <li key={idx} className="leading-relaxed">{reg}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  const num = selectedModule.id <= 2 ? 1 : selectedModule.id <= 4 ? 2 : 3;
                  setSelectedModule(null);
                  setSelectedLatihan(num);
                }}
                className="px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100/60 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Coba Latihan Soal Terkait</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Mengunduh berkas materi resmi ${selectedModule.title} (PDF)...`)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Modul PDF</span>
                </button>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#003366] hover:bg-[#002244] rounded-xl transition-colors cursor-pointer"
                >
                  Selesai Membaca
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Latihan Soal Interactive Session */}
      {/* ========================================================================= */}
      {selectedLatihan !== null && latihanDatasets[selectedLatihan] && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden my-8 animate-scale-in">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-[#003366] to-[#002244] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10 text-amber-300">
                  <FileQuestion className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">
                    {latihanDatasets[selectedLatihan].title}
                  </h3>
                  <p className="text-[11px] text-blue-100">
                    {latihanDatasets[selectedLatihan].subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLatihan(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Questions List */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs">
              {latihanDatasets[selectedLatihan].questions.map((q, qIndex) => {
                const selectedOpt = userAnswers[q.id];
                const isAnswered = selectedOpt !== undefined;
                const isCorrect = isAnswered && selectedOpt === q.correctAnswer;

                return (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#003366] text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                        {qIndex + 1}
                      </span>
                      <p className="font-bold text-slate-800 text-xs sm:text-sm leading-relaxed">
                        {q.question}
                      </p>
                    </div>

                    {/* Options */}
                    <div className="space-y-2 pt-1 pl-8">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selectedOpt === optIdx;
                        let optStyle = 'bg-white border-slate-200 hover:border-blue-400 text-slate-700';

                        if (isAnswered) {
                          if (optIdx === q.correctAnswer) {
                            optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                          } else if (isChosen) {
                            optStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-semibold';
                          } else {
                            optStyle = 'bg-white border-slate-200 opacity-60 text-slate-500';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectAnswer(q.id, optIdx)}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center gap-2 cursor-pointer ${optStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isAnswered && optIdx === q.correctAnswer && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            {isAnswered && isChosen && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback & Explanation */}
                    {isAnswered && (
                      <div className="pl-8 pt-2">
                        <div className={`p-3 rounded-lg text-xs ${isCorrect ? 'bg-emerald-100/70 text-emerald-900 border border-emerald-300' : 'bg-rose-100/70 text-rose-900 border border-rose-300'}`}>
                          <div className="flex items-center justify-between">
                            <span className="font-bold">
                              {isCorrect ? '✓ Jawaban Anda Benar!' : '✗ Jawaban Belum Tepat'}
                            </span>
                            <button
                              onClick={() => handleToggleExplanation(q.id)}
                              className="text-[11px] font-semibold underline cursor-pointer"
                            >
                              {showExplanation[q.id] ? 'Tutup Penjelasan' : 'Lihat Penjelasan'}
                            </button>
                          </div>
                          {showExplanation[q.id] && (
                            <p className="mt-2 text-[11px] leading-relaxed pt-2 border-t border-current/20">
                              <strong>Pembahasan:</strong> {q.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={handleResetQuiz}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Latihan</span>
              </button>

              <button
                onClick={() => setSelectedLatihan(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#003366] hover:bg-[#002244] rounded-xl cursor-pointer"
              >
                Selesai Latihan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: Kuis Evaluasi Interactive Session */}
      {/* ========================================================================= */}
      {selectedKuis !== null && kuisDatasets[selectedKuis] && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden my-8 animate-scale-in">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-rose-700 to-pink-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10 text-rose-200">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20">
                      Uji Pemahaman Mandiri
                    </span>
                    <span className="text-[11px] text-rose-200 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {kuisDatasets[selectedKuis].timeMinutes} Menit
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base mt-0.5">
                    {kuisDatasets[selectedKuis].title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedKuis(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quiz Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs">
              {/* Score banner if submitted */}
              {quizSubmitted && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md text-center">
                  <Sparkles className="w-6 h-6 mx-auto mb-1 text-amber-300" />
                  <h4 className="font-extrabold text-base">Hasil Kuis Selesai!</h4>
                  {(() => {
                    const totalQ = kuisDatasets[selectedKuis].questions.length;
                    const correctCount = kuisDatasets[selectedKuis].questions.filter(
                      q => userAnswers[q.id] === q.correctAnswer
                    ).length;
                    const finalScore = Math.round((correctCount / totalQ) * 100);

                    return (
                      <div>
                        <div className="text-3xl font-black my-1 font-mono">{finalScore} / 100</div>
                        <p className="text-xs text-emerald-100">
                          Anda menjawab benar {correctCount} dari {totalQ} pertanyaan evaluasi.
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Questions */}
              {kuisDatasets[selectedKuis].questions.map((q, qIndex) => {
                const selectedOpt = userAnswers[q.id];
                const isCorrect = selectedOpt === q.correctAnswer;

                return (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                        {qIndex + 1}
                      </span>
                      <p className="font-bold text-slate-800 text-xs sm:text-sm leading-relaxed">
                        {q.question}
                      </p>
                    </div>

                    {/* Options */}
                    <div className="space-y-2 pt-1 pl-8">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selectedOpt === optIdx;
                        let optStyle = 'bg-slate-50 border-slate-200 hover:border-rose-400 text-slate-700';

                        if (quizSubmitted) {
                          if (optIdx === q.correctAnswer) {
                            optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                          } else if (isChosen) {
                            optStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-semibold';
                          } else {
                            optStyle = 'bg-slate-50 border-slate-200 opacity-50';
                          }
                        } else if (isChosen) {
                          optStyle = 'bg-rose-50 border-rose-600 text-rose-900 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={quizSubmitted}
                            onClick={() => handleSelectAnswer(q.id, optIdx)}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center gap-2 cursor-pointer ${optStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {quizSubmitted && optIdx === q.correctAnswer && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="pl-8 pt-2">
                        <div className="p-3 bg-slate-100 rounded-lg text-slate-700 text-[11px] leading-relaxed">
                          <strong>Kunci & Pembahasan:</strong> {q.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={handleResetQuiz}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Jawaban</span>
              </button>

              {!quizSubmitted ? (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Kirim Jawaban Kuis
                </button>
              ) : (
                <button
                  onClick={() => setSelectedKuis(null)}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#003366] hover:bg-[#002244] rounded-xl transition-colors cursor-pointer"
                >
                  Tutup Hasil Kuis
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
