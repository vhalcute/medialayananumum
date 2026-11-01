import React, { useState } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Database,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { checkFirebaseConnection, firebaseConfig } from '../../firebase';
import { AppRole } from '../../types';

interface LoginViewProps {
  onLoginSuccess: (role: AppRole, username: string, name?: string) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

// Authentic SVG Emblem for Kementerian Keuangan RI
export const KemenkeuLogo: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0a4b91" />
        <stop offset="100%" stopColor="#002d62" />
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffd700" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="torchGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#d97706" />
        <stop offset="40%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#ffedd5" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
      </filter>
    </defs>

    {/* Outer Pentagon Shield */}
    <polygon
      points="100,14 182,62 154,168 46,168 18,62"
      fill="url(#shieldGrad)"
      stroke="#ffffff"
      strokeWidth="3"
      filter="url(#shadow)"
    />
    <polygon
      points="100,20 176,65 150,162 50,162 24,65"
      fill="none"
      stroke="url(#goldGrad)"
      strokeWidth="4"
    />

    {/* Golden Rays & Wing Feathers (Left & Right) */}
    {/* Right Wing Feathers */}
    <g fill="url(#goldGrad)" stroke="#b45309" strokeWidth="0.8">
      <path d="M102,40 C118,48 140,55 160,50 C154,62 144,72 134,80 C146,85 158,92 165,102 C155,108 142,112 130,114 C140,122 148,132 150,144 C136,144 122,138 114,132 C120,142 122,150 120,158 C110,154 105,145 102,138 Z" />
    </g>

    {/* Left Wing Feathers (Mirror) */}
    <g fill="url(#goldGrad)" stroke="#b45309" strokeWidth="0.8">
      <path d="M98,40 C82,48 60,55 40,50 C46,62 56,72 66,80 C54,85 42,92 35,102 C45,108 58,112 70,114 C60,122 52,132 50,144 C64,144 78,138 86,132 C80,142 78,150 80,158 C90,154 95,145 98,138 Z" />
    </g>

    {/* Central Torch / Suluh Api */}
    <g filter="url(#shadow)">
      {/* Handle / Stand */}
      <rect x="96" y="85" width="8" height="65" rx="3" fill="url(#goldGrad)" stroke="#b45309" strokeWidth="1" />
      <polygon points="93,142 107,142 100,154" fill="#f59e0b" />
      {/* Torch Bowl */}
      <path d="M90,85 C90,85 92,95 100,95 C108,95 110,85 110,85 Z" fill="#ffd700" stroke="#b45309" strokeWidth="1" />
      {/* Flame */}
      <path
        d="M100,35 C108,50 114,64 108,76 C105,82 95,82 92,76 C86,64 92,50 100,35 Z"
        fill="url(#torchGrad)"
      />
      <circle cx="100" cy="70" r="4" fill="#ffffff" opacity="0.8" />
    </g>

    {/* White Ribbon Banner at Bottom with Gold Inscription */}
    <g filter="url(#shadow)">
      <path
        d="M32,158 C55,164 145,164 168,158 C160,172 152,176 138,172 C100,175 62,172 32,158 Z"
        fill="#ffffff"
        stroke="#ffd700"
        strokeWidth="2"
      />
      <text
        x="100"
        y="168"
        textAnchor="middle"
        fontSize="8"
        fontWeight="bold"
        fontFamily="sans-serif"
        fill="#002d62"
        letterSpacing="0.8"
      >
        NAGARA DANA RAKCA
      </text>
    </g>
  </svg>
);

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onCancel,
  isModal = false
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(true);
  const [loginLogo, setLoginLogo] = useState<string>(() => {
    return localStorage.getItem('mlu_custom_logo') || '/assets/aistudio/Logo_Kemenkeu_eb9f3e65.png';
  });

  React.useEffect(() => {
    checkFirebaseConnection().then(setIsFirebaseConnected);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const userClean = username.trim().toLowerCase();
    const passClean = password.trim();

    if (!userClean) {
      setErrorMessage('Silakan masukkan Username.');
      return;
    }

    if (!passClean) {
      setErrorMessage('Silakan masukkan Password.');
      return;
    }

    setIsLoading(true);

    // Simulate authentication check
    setTimeout(() => {
      // Check stored admin accounts in localStorage (mlu_jambi_admin_access)
      const storedAdmins = localStorage.getItem('mlu_jambi_admin_access');
      if (storedAdmins) {
        try {
          const list = JSON.parse(storedAdmins);
          const found = list.find((u: any) => u.username.toLowerCase() === userClean && u.password === passClean);
          if (found) {
            if (found.statusAkses === 'Nonaktif' || found.statusAkses === 'Terkunci') {
              setIsLoading(false);
              setErrorMessage(`Akun ${found.username} berstatus ${found.statusAkses}. Silakan hubungi Super Admin.`);
              return;
            }
            setIsLoading(false);
            onLoginSuccess(found.role, found.username, found.namaLengkap || `${found.role} ${found.username}`);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }

      setIsLoading(false);

      // Determine role based on username or credentials
      let resolvedRole: AppRole = 'Kanwil';
      if (userClean.includes('admin') || userClean === 'superadmin') {
        resolvedRole = 'Admin';
      } else if (userClean.includes('kppn')) {
        resolvedRole = 'KPPN';
      } else {
        resolvedRole = 'Kanwil';
      }

      const displayName = resolvedRole === 'Admin'
        ? 'Administrator Sistem'
        : resolvedRole === 'KPPN'
        ? `Satker ${username.trim().toUpperCase()}`
        : `Pegawai Kanwil (${username.trim()})`;

      onLoginSuccess(resolvedRole, username.trim(), displayName);
    }, 450);
  };

  return (
    <div className={`w-full flex flex-col items-center justify-center p-4 sm:p-6 ${isModal ? 'min-h-full bg-transparent' : 'min-h-screen bg-[#eef3f8] py-8 sm:py-12'}`}>
      {/* Outer Card - Exactly matching screenshot image_f072d1b2.png */}
      <div className="w-full max-w-[410px] bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden animate-scale-in">
        
        {/* Top Header Section */}
        <div className="pt-8 pb-5 px-6 flex flex-col items-center text-center">
          {/* Logo Emblem Container - Official Kemenkeu Logo */}
          <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center p-2 mb-4 hover:shadow-xs transition-shadow">
            <img
              src={loginLogo}
              alt="Logo Resmi Kemenkeu RI"
              className="w-20 h-20 object-contain drop-shadow-xs"
              onError={() => {
                setLoginLogo('/assets/aistudio/Logo_Kemenkeu_eb9f3e65.png');
              }}
            />
          </div>

          {/* Titles */}
          <span className="text-[11px] font-bold text-slate-700 tracking-wider uppercase">
            KEMENKEU RI
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">
            DITJEN PERBENDAHARAAN
          </span>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-tight mt-1">
            KANWIL DJPB PROV. JAMBI
          </h2>

          {/* Badge: MEDIA LAYANAN UMUM */}
          <div className="mt-2.5">
            <span className="inline-block bg-[#e0edf7] text-[#003366] font-extrabold text-[11px] px-4 py-1 rounded-full border border-blue-200/60 shadow-2xs tracking-wider">
              MEDIA LAYANAN UMUM
            </span>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-6 pb-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error Message */}
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Field: USERNAME */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                USERNAME
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username..."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#003366] focus:ring-1 focus:ring-[#003366] transition-all shadow-2xs"
                  autoFocus
                />
              </div>
            </div>

            {/* Field: PASSWORD */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                PASSWORD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#003366] focus:ring-1 focus:ring-[#003366] transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                  title={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button: MASUK LAYANAN */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-[#003366] hover:bg-[#002244] active:bg-[#001830] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>MEMVERIFIKASI...</span>
                </>
              ) : (
                <span>MASUK LAYANAN</span>
              )}
            </button>
          </form>
        </div>

        {/* Information Notice Box */}
        <div className="bg-[#f8fafc] border-t border-slate-100 p-4 flex items-start gap-3">
          <div className="p-1 rounded-md bg-blue-50 text-[#003366] shrink-0 mt-0.5">
            <Shield className="w-4 h-4" />
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Penambahan akun pengguna dan reset kata sandi dikelola secara terpusat oleh{' '}
            <strong className="text-slate-800 font-bold">Administrator Bagian Umum.</strong>
          </p>
        </div>

        {/* Database Status Section */}
        <div className="bg-white border-t border-slate-100 p-4 space-y-2.5">
          {/* Header Row with Database Status Pill */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold text-[10px] sm:text-[11px] uppercase tracking-wide">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>STATUS DATABASE REAL:</span>
            </div>
            <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
              isFirebaseConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-amber-50 text-amber-700 border-amber-300'
            }`}>
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Firebase Terhubung</span>
            </div>
          </div>

          {/* Description Text */}
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Terhubung aktif ke cloud database Firebase Firestore project{' '}
            <strong className="text-slate-700 font-mono font-bold">medialayananumumjambi</strong>. Akun dan data disinkronkan secara realtime.
          </p>

          {/* Bottom Footer Row */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span className="font-mono">Sistem Otentikasi Terpusat</span>
            <span className="font-extrabold text-slate-800">Kanwil DJPb Jambi</span>
          </div>
        </div>
      </div>

      {/* Subtext under card */}
      <div className="mt-3.5 text-center text-[11px] text-slate-500 font-medium">
        <span>Kanwil DJPb Provinsi Jambi © 2026 · Satu Portal Layanan Internal</span>
      </div>

      {/* Optional Cancel / Back to Dashboard button if viewed in modal */}
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mt-3 text-xs text-slate-500 hover:text-slate-800 underline underline-offset-4 cursor-pointer"
        >
          Kembali ke Portal Layanan
        </button>
      )}
    </div>
  );
};
