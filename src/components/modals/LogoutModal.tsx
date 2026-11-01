import React from 'react';
import {
  LogOut,
  ShieldAlert,
  UserX,
  X,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  type: 'admin' | 'pegawai';
  onClose: () => void;
  onConfirm: (type: 'admin' | 'pegawai') => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  type,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const isAdmin = type === 'admin';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
        {/* Modal Header */}
        <div
          className={`p-5 text-white flex items-center justify-between ${
            isAdmin
              ? 'bg-gradient-to-r from-rose-800 to-red-950'
              : 'bg-gradient-to-r from-[#003366] to-[#002244]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-white shadow-xs">
              {isAdmin ? (
                <ShieldAlert className="w-5 h-5 text-amber-300" />
              ) : (
                <UserX className="w-5 h-5 text-blue-200" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                Konfirmasi Keluar Sistem
              </span>
              <h3 className="text-base font-extrabold leading-tight">
                {isAdmin ? 'Logout / Keluar Admin' : 'Logout / Keluar Pegawai'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs text-slate-600">
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                isAdmin ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-[#003366]'
              }`}
            >
              <LogOut className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">
                {isAdmin
                  ? 'Apakah Anda yakin ingin keluar dari Akun Admin?'
                  : 'Apakah Anda yakin ingin keluar dari Akun Pegawai?'}
              </h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                {isAdmin
                  ? 'Sesi hak akses Administrator Kanwil / KPPN akan ditutup. Anda harus memasukkan kredensial admin kembali untuk mengelola persetujuan data.'
                  : 'Sesi akun pegawai Kanwil DJPb akan diakhiri. Pengajuan permohonan sarpras, Cek Seribu, dan presensi memerlukan login ulang.'}
              </p>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] flex items-center gap-2">
            <span className="font-bold text-amber-700">Catatan:</span>
            <span>Seluruh perubahan data yang telah Anda simpan tetap tersimpan aman di server.</span>
          </div>
        </div>

        {/* Modal Footer Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(type)}
            className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              isAdmin
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-[#003366] hover:bg-[#002244]'
            }`}
          >
            <span>{isAdmin ? 'Ya, Logout Admin' : 'Ya, Logout Pegawai'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
