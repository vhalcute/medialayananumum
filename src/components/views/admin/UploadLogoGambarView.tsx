import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Eye,
  RefreshCw,
  Building2,
  Sparkles,
  Download,
  AlertCircle,
  FileImage,
  Tag,
  FolderOpen,
  X,
  ExternalLink,
  Layers,
  ZoomIn,
  Palette,
  Check
} from 'lucide-react';
import { BANNER_COLOR_THEMES, getBannerTheme, BannerColorTheme } from '../../../data/bannerThemes';

export interface UploadedAsset {
  id: string;
  title: string;
  category: 'Logo & Lambang' | 'Banner Header' | 'Ruangan Rapat' | 'Kendaraan Dinas' | 'Sarpras & BMN' | 'Kegiatan & Infografis';
  dataUrl: string;
  fileName: string;
  fileSize: string;
  dimensions?: string;
  uploadedAt: string;
  isActiveLogo?: boolean;
  isActiveBanner?: boolean;
}

const INITIAL_SAMPLE_ASSETS: UploadedAsset[] = [
  {
    id: 'asset-01',
    title: 'Logo Resmi Kanwil DJPb Prov. Jambi',
    category: 'Logo & Lambang',
    dataUrl: '/assets/aistudio/Logo_Kemenkeu_eb9f3e65.png', // Official logo from user attachment
    fileName: 'Logo_Kemenkeu_eb9f3e65.png',
    fileSize: '142 KB',
    dimensions: '512 x 512 px',
    uploadedAt: '2026-10-31 08:30 WIB',
    isActiveLogo: true
  },
  {
    id: 'asset-02',
    title: 'Banner Selamat Datang Media Layanan Umum (MELAYU)',
    category: 'Banner Header',
    dataUrl: '/assets/aistudio/image_cce672bd.png',
    fileName: 'banner_header_melayu.png',
    fileSize: '480 KB',
    dimensions: '1920 x 480 px',
    uploadedAt: '2026-10-30 14:15 WIB',
    isActiveBanner: true
  },
  {
    id: 'asset-03',
    title: 'Kartu Modul Treasury Learning On The Go (T-LEGO)',
    category: 'Kegiatan & Infografis',
    dataUrl: '/assets/aistudio/image_777e55ea.png',
    fileName: 'tlego_cover_learning.png',
    fileSize: '320 KB',
    dimensions: '1080 x 600 px',
    uploadedAt: '2026-10-29 11:20 WIB'
  },
  {
    id: 'asset-04',
    title: 'Matriks Monitoring Beban Kerja (ABK) Kanwil & Satker',
    category: 'Kegiatan & Infografis',
    dataUrl: '/assets/aistudio/image_8682ec42.png',
    fileName: 'tabel_abk_satker_lingkup.png',
    fileSize: '290 KB',
    dimensions: '1280 x 720 px',
    uploadedAt: '2026-10-28 09:40 WIB'
  }
];

export const UploadLogoGambarView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'logo' | 'banner' | 'colors' | 'galeri'>('logo');

  // Active custom logo & banner state
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    return localStorage.getItem('mlu_custom_logo') || null;
  });

  const [customBanner, setCustomBanner] = useState<string | null>(() => {
    return localStorage.getItem('mlu_custom_banner') || null;
  });

  const [selectedThemeId, setSelectedThemeId] = useState<string>(() => {
    return localStorage.getItem('mlu_banner_theme') || 'treasury-navy';
  });

  const handleApplyColorTheme = (id: string, name: string) => {
    setSelectedThemeId(id);
    localStorage.setItem('mlu_banner_theme', id);
    // Remove custom image banner so that pure colors are active without any image
    localStorage.removeItem('mlu_custom_banner');
    setCustomBanner(null);
    showToast(`Background warna "${name}" berhasil diterapkan (mode murni tanpa gambar).`);
  };

  const [assets, setAssets] = useState<UploadedAsset[]>(() => {
    const saved = localStorage.getItem('mlu_uploaded_gallery_images');
    return saved ? JSON.parse(saved) : INITIAL_SAMPLE_ASSETS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Upload Form Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<UploadedAsset['category']>('Logo & Lambang');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [uploadMeta, setUploadMeta] = useState<{ name: string; size: string; dimensions?: string } | null>(null);

  // Lightbox Preview Modal
  const [lightboxAsset, setLightboxAsset] = useState<UploadedAsset | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('mlu_uploaded_gallery_images', JSON.stringify(assets));
  }, [assets]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Process File Selection
  const handleFileProcess = (
    file: File,
    onSuccess: (dataUrl: string, meta: { name: string; size: string; dimensions?: string }) => void
  ) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih berkas gambar yang valid (PNG, JPG, JPEG, SVG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran berkas melebihi batas maksimum 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const sizeKb = Math.round(file.size / 1024);
        const sizeFormatted = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
        onSuccess(dataUrl, {
          name: file.name,
          size: sizeFormatted,
          dimensions: `${img.width} x ${img.height} px`
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Direct Logo Upload & Apply
  const handleLogoDirectUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleFileProcess(file, (dataUrl, meta) => {
      setCustomLogo(dataUrl);
      localStorage.setItem('mlu_custom_logo', dataUrl);

      // Add to assets
      const newAsset: UploadedAsset = {
        id: `logo-${Date.now()}`,
        title: `Logo: ${file.name.replace(/\.[^/.]+$/, '')}`,
        category: 'Logo & Lambang',
        dataUrl,
        fileName: meta.name,
        fileSize: meta.size,
        dimensions: meta.dimensions,
        uploadedAt: new Date().toLocaleString('id-ID'),
        isActiveLogo: true
      };

      setAssets(prev => [newAsset, ...prev.map(a => ({ ...a, isActiveLogo: false }))]);
      showToast('Logo resmi berhasil diunggah & diterapkan ke seluruh sistem!');
    });
  };

  // Direct Banner Upload & Apply
  const handleBannerDirectUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleFileProcess(file, (dataUrl, meta) => {
      setCustomBanner(dataUrl);
      localStorage.setItem('mlu_custom_banner', dataUrl);

      const newAsset: UploadedAsset = {
        id: `banner-${Date.now()}`,
        title: `Banner: ${file.name.replace(/\.[^/.]+$/, '')}`,
        category: 'Banner Header',
        dataUrl,
        fileName: meta.name,
        fileSize: meta.size,
        dimensions: meta.dimensions,
        uploadedAt: new Date().toLocaleString('id-ID'),
        isActiveBanner: true
      };

      setAssets(prev => [newAsset, ...prev.map(a => ({ ...a, isActiveBanner: false }))]);
      showToast('Gambar banner baru berhasil diunggah & diterapkan ke dashboard portal!');
    });
  };

  // General Gallery Upload
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleFileProcess(file, (dataUrl, meta) => {
      setUploadedPreview(dataUrl);
      setUploadMeta(meta);
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    });
  };

  const handleSaveToGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedPreview || !uploadMeta) {
      alert('Silakan pilih berkas gambar terlebih dahulu.');
      return;
    }

    const newAsset: UploadedAsset = {
      id: `asset-${Date.now()}`,
      title: uploadTitle.trim() || uploadMeta.name,
      category: uploadCategory,
      dataUrl: uploadedPreview,
      fileName: uploadMeta.name,
      fileSize: uploadMeta.size,
      dimensions: uploadMeta.dimensions,
      uploadedAt: new Date().toLocaleString('id-ID')
    };

    setAssets([newAsset, ...assets]);
    setIsUploadModalOpen(false);
    setUploadedPreview(null);
    setUploadMeta(null);
    setUploadTitle('');
    showToast(`Gambar "${newAsset.title}" berhasil disimpan ke galeri portal.`);
  };

  const handleSetAsActiveLogo = (asset: UploadedAsset) => {
    if (!asset.dataUrl) return;
    setCustomLogo(asset.dataUrl);
    localStorage.setItem('mlu_custom_logo', asset.dataUrl);
    setAssets(prev => prev.map(a => ({ ...a, isActiveLogo: a.id === asset.id })));
    showToast(`Logo "${asset.title}" diterapkan sebagai logo resmi sistem.`);
  };

  const handleResetLogo = () => {
    setCustomLogo(null);
    localStorage.removeItem('mlu_custom_logo');
    setAssets(prev => prev.map(a => ({ ...a, isActiveLogo: false })));
    showToast('Logo berhasil dikembalikan ke Lambang Standar Kanwil.');
  };

  const handleSetAsActiveBanner = (asset: UploadedAsset) => {
    if (!asset.dataUrl) return;
    setCustomBanner(asset.dataUrl);
    localStorage.setItem('mlu_custom_banner', asset.dataUrl);
    setAssets(prev => prev.map(a => ({ ...a, isActiveBanner: a.id === asset.id })));
    showToast(`Banner "${asset.title}" diterapkan ke Dashboard.`);
  };

  const handleResetBanner = () => {
    setCustomBanner(null);
    localStorage.removeItem('mlu_custom_banner');
    setAssets(prev => prev.map(a => ({ ...a, isActiveBanner: false })));
    showToast('Banner berhasil dikembalikan ke tampilan standar.');
  };

  const handleDeleteAsset = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus gambar "${title}"?`)) {
      setAssets(assets.filter(a => a.id !== id));
      showToast(`Gambar "${title}" berhasil dihapus.`);
    }
  };

  const filteredAssets = assets.filter(item => {
    const matchCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#003366] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-blue-400/30 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Sub Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('logo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'logo'
                ? 'bg-[#003366] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-300" />
            <span>Upload Logo Utama</span>
            {customLogo && (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('banner')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'banner'
                ? 'bg-[#003366] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-blue-300" />
            <span>Upload Banner Dashboard</span>
            {customBanner && (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('colors')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'colors'
                ? 'bg-[#003366] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4 text-amber-300" />
            <span>Menu Background Warna (Tanpa Gambar)</span>
            <span className="text-[10px] bg-amber-400/20 text-amber-700 px-1.5 py-0.5 rounded font-bold">
              8 Tema
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('galeri')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'galeri'
                ? 'bg-[#003366] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-emerald-300" />
            <span>Galeri & Sarpras ({assets.length})</span>
          </button>
        </div>

        <button
          onClick={() => {
            setUploadedPreview(null);
            setUploadMeta(null);
            setUploadTitle('');
            setIsUploadModalOpen(true);
          }}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>+ Upload Gambar Baru</span>
        </button>
      </div>

      {/* SUB-TAB 1: UPLOAD & ATUR LOGO UTAMA */}
      {activeSubTab === 'logo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Upload Box */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div>
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                Manajemen Logo Resmi
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">
                Upload Logo Instansi / Satker
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Logo ini akan ditampilkan di TopBar header, dokumen cetak bukti layanan, serta gerbang portal sistem.
              </p>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onClick={() => logoInputRef.current?.click()}
              className="border-2 border-dashed border-blue-200 hover:border-[#003366] bg-blue-50/40 hover:bg-blue-50/70 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
            >
              <input
                type="file"
                ref={logoInputRef}
                onChange={handleLogoDirectUpload}
                accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-blue-100 flex items-center justify-center text-[#003366] group-hover:scale-110 transition-transform mb-3">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Klik untuk Memilih Berkas Logo atau Tarik Berkas ke Sini
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                Format yang didukung: PNG, JPG, SVG, WebP transparan. Rekomendasi ukuran rasio 1:1 (min. 512x512 px, maks 10MB).
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Tips Kualitas Logo:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Gunakan format PNG dengan latar belakang transparan agar serasi di berbagai tampilan header dan kartu surat cetak.
              </p>
            </div>

            {customLogo && (
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Logo kustom sedang aktif
                </span>
                <button
                  type="button"
                  onClick={handleResetLogo}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                >
                  Reset ke Logo Standar
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Live Previews on Different Backgrounds */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                Pratinjau Langsung (Live Preview)
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">
                Tampilan Logo di Berbagai Latar
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Simulasi penempatan logo aktif pada antarmuka aplikasi.
              </p>
            </div>

            <div className="space-y-4">
              {/* Preview 1: Header TopBar Navy Background */}
              <div className="rounded-xl bg-gradient-to-r from-[#003366] to-[#001f3f] p-4 text-white flex items-center gap-3 shadow-xs">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center p-1.5 border border-white/20 shrink-0">
                  {customLogo ? (
                    <img src={customLogo} alt="Logo Preview" className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="w-6 h-6 text-amber-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">MEDIA LAYANAN UMUM</span>
                    <span className="text-[9px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                      KANWIL JAMBI
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-200">Pratinjau TopBar Header Resmi</p>
                </div>
              </div>

              {/* Preview 2: Clean White Card with Border */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white border border-slate-300 p-2 flex items-center justify-center shadow-2xs shrink-0">
                  {customLogo ? (
                    <img src={customLogo} alt="Logo Card Preview" className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="w-8 h-8 text-[#003366]" />
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Kop Surat & Kartu Tanda Bukti
                  </span>
                  <h4 className="font-bold text-slate-800 text-xs">
                    KANTOR WILAYAH DITJEN PERBENDAHARAAN PROV. JAMBI
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Format visual pencetakan surat peminjaman dan bukti layanan.
                  </p>
                </div>
              </div>

              {/* Preview 3: Badge Status */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Status: <strong>{customLogo ? 'Logo Kustom Terpasang' : 'Logo Standar Aktif'}</strong></span>
                </div>
                <span className="text-[10px] bg-emerald-100 font-mono px-2 py-0.5 rounded text-emerald-800 font-bold">
                  {customLogo ? 'Tersimpan di Browser' : 'Default Preset'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: UPLOAD & ATUR BANNER DASHBOARD */}
      {activeSubTab === 'banner' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                Manajemen Banner Utama
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">
                Upload Banner Header Dashboard Portal
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Ganti latar belakang banner selamat datang di beranda utama dengan gambar gedung, kegiatan kantor, atau infografis resmi.
              </p>
            </div>

            {customBanner && (
              <button
                type="button"
                onClick={handleResetBanner}
                className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
              >
                Reset ke Banner Standar
              </button>
            )}
          </div>

          {/* Banner Dropzone */}
          <div
            onClick={() => bannerInputRef.current?.click()}
            className="border-2 border-dashed border-blue-200 hover:border-[#003366] bg-blue-50/30 hover:bg-blue-50/60 rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
          >
            <input
              type="file"
              ref={bannerInputRef}
              onChange={handleBannerDirectUpload}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-white shadow-xs border border-blue-100 flex items-center justify-center text-[#003366] group-hover:scale-105 transition-transform mb-3">
              <Layers className="w-8 h-8 text-blue-700" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Pilih Berkas Banner untuk Mengganti Latar Dashboard
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md">
              Rekomendasi rasio lanskap/panorama (1920 x 480 px atau 16:9). Mendukung JPG, PNG, WebP hingga 10MB.
            </p>
          </div>

          {/* Banner Current Preview */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Pratinjau Banner Dashboard Saat Ini:</span>
              <span className="text-[11px] text-slate-400 font-normal">
                {customBanner ? 'Gambar Kustom Terpasang' : 'Latar Gradien Default'}
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-200 min-h-[160px] sm:min-h-[200px] flex items-center p-6 text-white shadow-xs">
              {customBanner ? (
                <img
                  src={customBanner}
                  alt="Current Banner"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-[#002244] via-[#003366] to-[#0a2540]" />
              )}
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-2xs"></div>

              <div className="relative z-10 max-w-xl space-y-2">
                <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                  SIMULASI DASHBOARD
                </span>
                <h4 className="text-lg sm:text-xl font-extrabold text-white">
                  SELAMAT DATANG DI MEDIA LAYANAN UMUM
                </h4>
                <p className="text-xs text-blue-100">
                  Portal Layanan Digital Terpadu Kanwil DJPb Provinsi Jambi
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: MENU BACKGROUND WARNA (TANPA GAMBAR) */}
      {activeSubTab === 'colors' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 animate-fade-in">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#003366] to-[#002244] text-white">
                <Palette className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  MENU BACKGROUND WARNA MENARIK (TANPA GAMBAR)
                </h3>
                <p className="text-xs text-slate-500">
                  Pilih skema gradasi warna dinamis untuk latar belakang portal. Ringan, cepat dimuat, tajam, dan tidak memerlukan berkas gambar.
                </p>
              </div>
            </div>

            {customBanner && (
              <button
                type="button"
                onClick={handleResetBanner}
                className="px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Gunakan Mode Warna Murni (Lepas Gambar Banner)</span>
              </button>
            )}
          </div>

          {/* Live Simulation Card (Inspired by screenshot image_7469f23e.png) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Pratinjau Langsung Banner Utama (Mode Warna Murni):</span>
              <span className="text-[11px] text-[#003366] bg-blue-50 px-2 py-0.5 rounded font-bold">
                Tema Aktif: {getBannerTheme(selectedThemeId).name}
              </span>
            </div>

            {(() => {
              const currentTheme = getBannerTheme(selectedThemeId);
              return (
                <div className={`relative overflow-hidden rounded-2xl ${currentTheme.gradientClass} text-white p-6 md:p-8 shadow-md border border-slate-700/40 transition-all duration-500`}>
                  {/* Subtle Geometric Dot Grid Pattern (Pure CSS/Code) */}
                  <div 
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
                      backgroundSize: '24px 24px'
                    }}
                  />

                  {/* Subtle Vertical Accent Lines */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none bg-[repeating-linear-gradient(90deg,transparent,transparent_48px,rgba(255,255,255,0.06)_48px,rgba(255,255,255,0.06)_49px)]" />

                  <div className="relative z-10 max-w-4xl space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-amber-300 tracking-wide uppercase">
                        MEDIA LAYANAN UMUM - KANWIL DJPB PROV. JAMBI
                      </span>
                      <span className="text-slate-400 text-xs">/</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${currentTheme.accentBadgeClass}`}>
                        SISTEM ONLINE | NORMAL
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white uppercase leading-tight">
                      SELAMAT DATANG DI MEDIA LAYANAN UMUM
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl font-normal">
                      Portal Layanan Digital Terpadu Kanwil Ditjen Perbendaharaan Provinsi Jambi yang menyediakan kemudahan akses layanan Subbagian TURT, Subbagian Kepegawaian, Subbagian Penilaian Kinerja, dan Subbagian Keuangan secara transparan dan akuntabel.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-2.5">
                      <div className={`px-3.5 py-2 ${currentTheme.primaryButtonClass} rounded-xl text-xs flex items-center gap-2 shadow-sm`}>
                        <span>Pinjam Ruangan</span>
                      </div>
                      <div className={`px-3.5 py-2 ${currentTheme.secondaryButtonClass} rounded-xl text-xs flex items-center gap-2 border shadow-xs`}>
                        <span>Pesan Mobil Dinas</span>
                      </div>
                      <div className={`px-3.5 py-2 ${currentTheme.secondaryButtonClass} rounded-xl text-xs flex items-center gap-2 border shadow-xs`}>
                        <span>Minta ATK</span>
                      </div>
                      <div className={`px-3.5 py-2 ${currentTheme.secondaryButtonClass} rounded-xl text-xs flex items-center gap-2 border shadow-xs`}>
                        <span>Lapor Kerusakan</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Grid of Curated Color Themes */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Pilihan Tema Gradasi Warna Siap Pakai (8 Tema):
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {BANNER_COLOR_THEMES.map((theme) => {
                const isCurrent = theme.id === selectedThemeId;
                return (
                  <div
                    key={theme.id}
                    onClick={() => handleApplyColorTheme(theme.id, theme.name)}
                    className={`rounded-2xl border-2 p-3.5 cursor-pointer transition-all flex flex-col justify-between ${
                      isCurrent
                        ? 'border-[#003366] bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Theme Preview Card */}
                      <div className={`h-24 rounded-xl ${theme.gradientClass} relative overflow-hidden flex items-center justify-between px-3.5 border border-slate-700/20 mb-3 shadow-2xs`}>
                        {/* Dot Grid */}
                        <div 
                          className="absolute inset-0 opacity-15 pointer-events-none"
                          style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
                            backgroundSize: '16px 16px'
                          }}
                        />

                        {/* Color Swatch Dots */}
                        <div className="flex items-center gap-1.5 z-10">
                          {theme.previewColors.map((color, i) => (
                            <span
                              key={i}
                              className="w-4 h-4 rounded-full border border-white/60 shadow-xs"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>

                        {isCurrent && (
                          <div className="absolute top-2 right-2 bg-white text-[#003366] rounded-full p-1 shadow-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="font-extrabold text-slate-900 text-xs">
                          {theme.name}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {theme.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className={`text-[11px] font-bold ${isCurrent ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {isCurrent ? '● Sedang Aktif' : 'Tersedia'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyColorTheme(theme.id, theme.name);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-[#003366] text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isCurrent ? 'Terpilih' : 'Terapkan'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: GALERI GAMBAR & SARPRAS */}
      {activeSubTab === 'galeri' && (
        <div className="space-y-4">
          {/* Filters & Search Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                'Semua',
                'Logo & Lambang',
                'Banner Header',
                'Ruangan Rapat',
                'Kendaraan Dinas',
                'Sarpras & BMN',
                'Kegiatan & Infografis'
              ].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#003366] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Cari nama gambar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#003366]"
              />
              <ImageIcon className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Grid of Uploaded Assets */}
          {filteredAssets.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-semibold">Tidak ada gambar yang sesuai filter pencarian.</p>
              <button
                onClick={() => { setSelectedCategory('Semua'); setSearchQuery(''); }}
                className="mt-3 text-xs text-blue-700 font-bold hover:underline"
              >
                Reset Filter Pencarian
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAssets.map(asset => (
                <div
                  key={asset.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
                >
                  {/* Image Thumbnail Container */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden flex items-center justify-center">
                    {asset.dataUrl ? (
                      <img
                        src={asset.dataUrl}
                        alt={asset.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="p-4 flex flex-col items-center justify-center text-center">
                        <Building2 className="w-12 h-12 text-[#003366] mb-1" />
                        <span className="text-[10px] text-slate-400 font-mono">Logo Standar</span>
                      </div>
                    )}

                    {/* Category Tag on Top Left */}
                    <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                      {asset.category}
                    </span>

                    {/* Active Status Badge */}
                    {asset.isActiveLogo && (
                      <span className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                        Logo Aktif
                      </span>
                    )}

                    {asset.isActiveBanner && (
                      <span className="absolute top-2.5 right-2.5 bg-blue-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                        Banner Aktif
                      </span>
                    )}

                    {/* Hover Actions Overlay */}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setLightboxAsset(asset)}
                        className="p-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 shadow-md transition-transform hover:scale-110 cursor-pointer"
                        title="Perbesar Pratinjau"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Image Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1" title={asset.title}>
                        {asset.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {asset.fileName} · {asset.fileSize}
                      </p>
                      {asset.dimensions && (
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {asset.dimensions}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px]">
                      {asset.category === 'Logo & Lambang' ? (
                        <button
                          onClick={() => handleSetAsActiveLogo(asset)}
                          className="text-[#003366] hover:text-[#002244] font-bold text-[10px] hover:underline cursor-pointer"
                        >
                          Terapkan Logo
                        </button>
                      ) : asset.category === 'Banner Header' ? (
                        <button
                          onClick={() => handleSetAsActiveBanner(asset)}
                          className="text-blue-700 hover:text-blue-900 font-bold text-[10px] hover:underline cursor-pointer"
                        >
                          Terapkan Banner
                        </button>
                      ) : (
                        <button
                          onClick={() => setLightboxAsset(asset)}
                          className="text-slate-600 hover:text-slate-900 font-semibold text-[10px] hover:underline cursor-pointer"
                        >
                          Lihat Detail
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteAsset(asset.id, asset.title)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus Gambar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: UPLOAD GAMBAR BARU KE GALERI */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-[#003366] to-[#002244] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UploadCloud className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm sm:text-base">Upload Gambar & Aset Portal</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveToGallery} className="p-6 space-y-4 text-xs">
              {/* Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#003366] bg-slate-50 hover:bg-blue-50/40 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleGalleryUpload}
                  accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                  className="hidden"
                />
                {uploadedPreview ? (
                  <div className="space-y-2">
                    <img
                      src={uploadedPreview}
                      alt="Upload Preview"
                      className="max-h-36 rounded-lg object-contain shadow-2xs mx-auto"
                    />
                    <p className="text-[11px] font-bold text-emerald-700">
                      {uploadMeta?.name} ({uploadMeta?.size})
                    </p>
                    <span className="text-[10px] text-blue-700 underline font-medium">
                      Klik untuk mengganti gambar
                    </span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="font-bold text-slate-800">Pilih Berkas Gambar dari Komputer</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      PNG, JPG, SVG, WebP hingga 10MB
                    </p>
                  </>
                )}
              </div>

              {/* Title Input */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">
                  Judul Gambar / Deskripsi Aset <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Foto Ruang Rapat Aula Rangkayo Hitam..."
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-[#003366]"
                />
              </div>

              {/* Category Selector */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">
                  Kategori Aset <span className="text-rose-500">*</span>
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-[#003366]"
                >
                  <option value="Logo & Lambang">Logo & Lambang Instansi</option>
                  <option value="Banner Header">Banner Header / Hero</option>
                  <option value="Ruangan Rapat">Ruangan Rapat (TURT)</option>
                  <option value="Kendaraan Dinas">Kendaraan Dinas Operasional</option>
                  <option value="Sarpras & BMN">Sarpras & BMN</option>
                  <option value="Kegiatan & Infografis">Kegiatan & Infografis</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!uploadedPreview}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#003366] hover:bg-[#002244] rounded-lg shadow-2xs transition-colors disabled:opacity-50"
                >
                  Simpan Gambar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LIGHTBOX DETAIL PREVIEW */}
      {lightboxAsset && (
        <div
          onClick={() => setLightboxAsset(null)}
          className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-in"
          >
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">{lightboxAsset.title}</h4>
                <p className="text-[10px] text-slate-400">
                  {lightboxAsset.category} · {lightboxAsset.fileName} ({lightboxAsset.fileSize})
                </p>
              </div>
              <button
                onClick={() => setLightboxAsset(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 flex items-center justify-center max-h-[60vh] overflow-hidden">
              {lightboxAsset.dataUrl ? (
                <img
                  src={lightboxAsset.dataUrl}
                  alt={lightboxAsset.title}
                  className="max-h-[55vh] max-w-full object-contain rounded-lg"
                />
              ) : (
                <div className="p-12 text-center text-slate-400">
                  <Building2 className="w-16 h-16 mx-auto mb-2 text-amber-400" />
                  <p className="text-xs">Logo Standar Kanwil DJPb Prov. Jambi</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-slate-500">
                Diunggah pada: {lightboxAsset.uploadedAt}
              </span>

              <div className="flex items-center gap-2">
                {lightboxAsset.category === 'Logo & Lambang' && (
                  <button
                    onClick={() => {
                      handleSetAsActiveLogo(lightboxAsset);
                      setLightboxAsset(null);
                    }}
                    className="px-3 py-1.5 bg-[#003366] text-white rounded-lg font-bold hover:bg-[#002244]"
                  >
                    Terapkan Sebagai Logo
                  </button>
                )}

                {lightboxAsset.category === 'Banner Header' && (
                  <button
                    onClick={() => {
                      handleSetAsActiveBanner(lightboxAsset);
                      setLightboxAsset(null);
                    }}
                    className="px-3 py-1.5 bg-[#003366] text-white rounded-lg font-bold hover:bg-[#002244]"
                  >
                    Terapkan Sebagai Banner
                  </button>
                )}

                <button
                  onClick={() => setLightboxAsset(null)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
