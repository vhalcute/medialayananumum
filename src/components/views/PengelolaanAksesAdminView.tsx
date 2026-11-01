import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Shield,
  UserCheck,
  UserX,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  CheckCircle2,
  Building2,
  RotateCcw,
  Sparkles,
  Lock,
  Unlock,
  Check,
  X,
  AlertTriangle,
  Image as ImageIcon,
  UploadCloud
} from 'lucide-react';
import { AdminAccessUser } from '../../types';
import { UploadLogoGambarView } from './admin/UploadLogoGambarView';

const INITIAL_ADMIN_USERS: AdminAccessUser[] = [
  {
    id: 'adm-01',
    username: 'admin.kanwil.jambi',
    password: 'TreasuryJambi2026!',
    role: 'Admin',
    statusAkses: 'Aktif',
    lastLogin: '2026-10-31 08:32 WIB',
    createdAt: '2026-01-10'
  },
  {
    id: 'adm-02',
    username: 'operator.kepeg.jambi',
    password: 'Kepegawaian2026#',
    role: 'Kanwil',
    statusAkses: 'Aktif',
    lastLogin: '2026-10-31 07:15 WIB',
    createdAt: '2026-01-15'
  },
  {
    id: 'adm-03',
    username: 'admin.kppn.jambi',
    password: 'KppnJambi12345!',
    role: 'KPPN',
    statusAkses: 'Aktif',
    lastLogin: '2026-10-30 16:45 WIB',
    createdAt: '2026-02-01'
  },
  {
    id: 'adm-04',
    username: 'admin.kppn.bungo',
    password: 'BungoTreasury2026$',
    role: 'KPPN',
    statusAkses: 'Aktif',
    lastLogin: '2026-10-30 14:20 WIB',
    createdAt: '2026-02-10'
  },
  {
    id: 'adm-05',
    username: 'admin.kppn.bangko',
    password: 'BangkoA1@2026',
    role: 'KPPN',
    statusAkses: 'Aktif',
    lastLogin: '2026-10-29 11:10 WIB',
    createdAt: '2026-02-15'
  },
  {
    id: 'adm-06',
    username: 'turt.kanwil.jambi',
    password: 'TurtSarpras2026*',
    role: 'Kanwil',
    statusAkses: 'Aktif',
    lastLogin: '2026-10-31 08:05 WIB',
    createdAt: '2026-01-20'
  },
  {
    id: 'adm-07',
    username: 'guest.kppn.evaluasi',
    password: 'GuestAudit2026!',
    role: 'KPPN',
    statusAkses: 'Nonaktif',
    lastLogin: '2026-09-15 10:00 WIB',
    createdAt: '2026-03-01'
  }
];

export const PengelolaanAksesAdminView: React.FC = () => {
  const [users, setUsers] = useState<AdminAccessUser[]>(() => {
    const saved = localStorage.getItem('mlu_jambi_admin_access');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS;
  });

  const [activeAdminTab, setActiveAdminTab] = useState<'users' | 'media'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'Semua' | 'Admin' | 'Kanwil' | 'KPPN'>('Semua');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');

  // Password visibility map { [id]: boolean }
  const [visiblePasswords, setVisiblePasswords] = useState<{ [id: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminAccessUser | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State: Username, Password, Role (Admin / Kanwil / KPPN), Status Akses
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Admin' as 'Admin' | 'Kanwil' | 'KPPN',
    statusAkses: 'Aktif' as 'Aktif' | 'Nonaktif' | 'Terkunci'
  });

  useEffect(() => {
    localStorage.setItem('mlu_jambi_admin_access', JSON.stringify(users));
  }, [users]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyPassword = (id: string, pass: string) => {
    navigator.clipboard.writeText(pass);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('Password berhasil disalin ke papan klip.');
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextStatus = u.statusAkses === 'Aktif' ? 'Nonaktif' : 'Aktif';
        showToast(`Status akses ${u.username} diubah menjadi ${nextStatus}.`);
        return { ...u, statusAkses: nextStatus };
      }
      return u;
    }));
  };

  const handleGenerateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
    let res = '';
    for (let i = 0; i < 12; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password: res });
  };

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      password: '',
      role: 'Admin',
      statusAkses: 'Aktif'
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (user: AdminAccessUser) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: user.password,
      role: user.role,
      statusAkses: user.statusAkses
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      alert('Username dan Password wajib diisi.');
      return;
    }

    if (editingUser) {
      // Update
      const updated = users.map(u => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            username: formData.username.trim().toLowerCase(),
            password: formData.password,
            role: formData.role,
            statusAkses: formData.statusAkses
          };
        }
        return u;
      });
      setUsers(updated);
      showToast('Data akses admin berhasil diperbarui.');
    } else {
      // Check duplicate username
      if (users.some(u => u.username.toLowerCase() === formData.username.trim().toLowerCase())) {
        alert('Username sudah digunakan oleh akun lain. Gunakan username berbeda.');
        return;
      }

      const newUser: AdminAccessUser = {
        id: `adm-${Date.now()}`,
        username: formData.username.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        statusAkses: formData.statusAkses,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: 'Belum Pernah Login'
      };
      setUsers([newUser, ...users]);
      showToast('Akun akses admin baru berhasil diterbitkan.');
    }

    setIsFormModalOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    setDeleteConfirmId(null);
    showToast('Akun akses admin berhasil dihapus.');
  };

  // Filter based on username, role, or status
  const filteredUsers = users.filter(user => {
    const matchSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.statusAkses.toLowerCase().includes(searchQuery.toLowerCase());

    const matchRole = roleFilter === 'Semua' || user.role === roleFilter;
    const matchStatus = statusFilter === 'Semua' || user.statusAkses === statusFilter;

    return matchSearch && matchRole && matchStatus;
  });

  const totalAdmin = users.filter(u => u.role === 'Admin').length;
  const totalKanwil = users.filter(u => u.role === 'Kanwil').length;
  const totalKppn = users.filter(u => u.role === 'KPPN').length;
  const totalAktif = users.filter(u => u.statusAkses === 'Aktif').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#003366] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-blue-400/30 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Admin Sub-Module Navigation Switcher */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
              activeAdminTab === 'users'
                ? 'bg-[#003366] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4 text-amber-300" />
            <span>Kredensial & Hak Akses Admin</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeAdminTab === 'users' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {users.length} Akun
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('media')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
              activeAdminTab === 'media'
                ? 'bg-[#003366] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-emerald-300" />
            <span>Upload Logo & Gambar Portal</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeAdminTab === 'media' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              Logo & Media
            </span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 font-medium px-2">
          {activeAdminTab === 'users' ? (
            <span>Pengelolaan akun Admin, Kanwil, dan KPPN</span>
          ) : (
            <span>Upload logo resmi instansi & aset portal</span>
          )}
        </div>
      </div>

      {/* Render Module Content Based on Tab */}
      {activeAdminTab === 'media' ? (
        <UploadLogoGambarView />
      ) : (
        <>
          {/* Analytics Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Akun Pengguna
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono mt-1">
            {users.length} Akun
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            {totalAktif} akun aktif beroperasi
          </div>
        </div>

        <div className="bg-white rounded-xl border border-purple-200 p-4 shadow-2xs bg-purple-50/20">
          <div className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
            Role / Hak Akses Admin
          </div>
          <div className="text-3xl font-black text-purple-900 font-mono mt-1">
            {totalAdmin} Akun
          </div>
          <div className="text-[11px] text-purple-600 font-semibold mt-1">
            Administrator Sistem Penuh
          </div>
        </div>

        <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-2xs bg-blue-50/20">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Role / Hak Akses Kanwil
          </div>
          <div className="text-3xl font-black text-[#003366] font-mono mt-1">
            {totalKanwil} Akun
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">
            Tingkat Kantor Wilayah DJPb
          </div>
        </div>

        <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-2xs bg-amber-50/20">
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            Role / Hak Akses KPPN
          </div>
          <div className="text-3xl font-black text-amber-800 font-mono mt-1">
            {totalKppn} Akun
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            Satker KPPN Lingkup Wilayah
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#003366] to-[#002244] text-white">
              <KeyRound className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base md:text-lg font-extrabold text-slate-900 tracking-tight">
                PENGELOLAAN AKSES ADMIN & HAK PENGGUNA
              </h1>
              <p className="text-xs text-slate-500">
                Kredensial login, peran hak akses (Admin, Kanwil, atau KPPN), dan kontrol status akses pengguna.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Tambah Akses Admin Baru</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari username, role, atau status akses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#003366]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter Role */}
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <span>Role / Hak Akses:</span>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setRoleFilter('Semua')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                    roleFilter === 'Semua' ? 'bg-[#003366] text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setRoleFilter('Admin')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                    roleFilter === 'Admin' ? 'bg-purple-700 text-white' : 'text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  Admin
                </button>
                <button
                  onClick={() => setRoleFilter('Kanwil')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                    roleFilter === 'Kanwil' ? 'bg-blue-700 text-white' : 'text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  Kanwil
                </button>
                <button
                  onClick={() => setRoleFilter('KPPN')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                    roleFilter === 'KPPN' ? 'bg-amber-600 text-white' : 'text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  KPPN
                </button>
              </div>
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <span>Status Akses:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium"
              >
                <option value="Semua">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#111827] text-white text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-3 text-center border-r border-slate-700/60 w-12">NO</th>
                <th className="py-3 px-4 border-r border-slate-700/60">USERNAME</th>
                <th className="py-3 px-4 border-r border-slate-700/60">PASSWORD</th>
                <th className="py-3 px-3 text-center border-r border-slate-700/60">ROLE / HAK AKSES</th>
                <th className="py-3 px-3 text-center border-r border-slate-700/60">STATUS AKSES</th>
                <th className="py-3 px-3 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Tidak ada akun admin yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* NO */}
                    <td className="py-3 px-3 text-center font-bold text-slate-600 border-r border-slate-100">
                      {idx + 1}
                    </td>

                    {/* USERNAME */}
                    <td className="py-3 px-4 border-r border-slate-100 font-mono">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{user.username}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                        Dibuat: {user.createdAt || '-'}
                      </div>
                    </td>

                    {/* PASSWORD */}
                    <td className="py-3 px-4 border-r border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 select-all">
                          {visiblePasswords[user.id] ? user.password : '••••••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(user.id)}
                          title={visiblePasswords[user.id] ? 'Sembunyikan Password' : 'Lihat Password'}
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        >
                          {visiblePasswords[user.id] ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopyPassword(user.id, user.password)}
                          title="Salin Password"
                          className="p-1 text-slate-500 hover:text-[#003366] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                        >
                          {copiedId === user.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* ROLE / HAK AKSES */}
                    <td className="py-3 px-3 text-center border-r border-slate-100">
                      {user.role === 'Admin' ? (
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold bg-purple-100 text-purple-900 border border-purple-300 shadow-2xs">
                          Admin
                        </span>
                      ) : user.role === 'Kanwil' ? (
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-900 border border-blue-300 shadow-2xs">
                          Kanwil
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                          KPPN
                        </span>
                      )}
                    </td>

                    {/* STATUS AKSES */}
                    <td className="py-3 px-3 text-center border-r border-slate-100">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        title="Klik untuk ubah status akses"
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                          user.statusAkses === 'Aktif'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-700 border border-rose-300 hover:bg-rose-200'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            user.statusAkses === 'Aktif' ? 'bg-emerald-600 animate-pulse' : 'bg-rose-500'
                          }`}
                        />
                        <span>{user.statusAkses}</span>
                      </button>
                    </td>

                    {/* AKSI */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          title="Ubah kredensial & hak akses"
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(user.id)}
                          title="Hapus akun admin"
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Password terenkripsi dengan standar pengamanan kredensial Single Sign On Kemenkeu.</span>
          </div>
          <div className="font-bold text-slate-800">
            Total {filteredUsers.length} Akun Pengguna Terdaftar
          </div>
        </div>
      </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Tambah / Ubah Akun Admin */}
      {/* ========================================================================= */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-5 bg-gradient-to-r from-[#003366] to-[#002244] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10 text-amber-300">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {editingUser ? 'Ubah Hak Akses Admin' : 'Tambah Akun Akses Admin Baru'}
                  </h3>
                  <p className="text-[11px] text-blue-100">
                    Konfigurasi Username, Password, Role (Admin, Kanwil, atau KPPN), dan Status Akses.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              {/* Field 1: Username */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: admin.kanwil.jambi atau operator.kppn.bungo"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Gunakan huruf kecil tanpa spasi.
                </span>
              </div>

              {/* Field 2: Password with Generator */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomPassword}
                    className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Generate Password Acak</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Masukkan kata sandi aman"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono"
                />
              </div>

              {/* Field 3: Role / Hak Akses (Admin, Kanwil, KPPN) */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Role / Hak Akses *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label
                    className={`flex flex-col items-center justify-center text-center p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.role === 'Admin'
                        ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold ring-1 ring-purple-500/30'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="Admin"
                      checked={formData.role === 'Admin'}
                      onChange={() => setFormData({
                        ...formData,
                        role: 'Admin'
                      })}
                      className="sr-only"
                    />
                    <div className="font-extrabold text-xs">Admin</div>
                    <div className="text-[9px] text-purple-700 font-semibold mt-0.5">Admin Utama</div>
                  </label>

                  <label
                    className={`flex flex-col items-center justify-center text-center p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.role === 'Kanwil'
                        ? 'border-[#003366] bg-blue-50 text-blue-950 font-bold ring-1 ring-blue-500/30'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="Kanwil"
                      checked={formData.role === 'Kanwil'}
                      onChange={() => setFormData({
                        ...formData,
                        role: 'Kanwil'
                      })}
                      className="sr-only"
                    />
                    <div className="font-extrabold text-xs">Kanwil</div>
                    <div className="text-[9px] text-blue-700 font-semibold mt-0.5">Tingkat Wilayah</div>
                  </label>

                  <label
                    className={`flex flex-col items-center justify-center text-center p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.role === 'KPPN'
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold ring-1 ring-amber-500/30'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="KPPN"
                      checked={formData.role === 'KPPN'}
                      onChange={() => setFormData({
                        ...formData,
                        role: 'KPPN'
                      })}
                      className="sr-only"
                    />
                    <div className="font-extrabold text-xs">KPPN</div>
                    <div className="text-[9px] text-amber-700 font-semibold mt-0.5">Satker Wilayah</div>
                  </label>
                </div>
              </div>

              {/* Field 4: Status Akses */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Status Akses *
                </label>
                <select
                  value={formData.statusAkses}
                  onChange={(e) => setFormData({ ...formData, statusAkses: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#003366] hover:bg-[#002244] text-white rounded-xl font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  {editingUser ? 'Simpan Perubahan' : 'Terbitkan Akun Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Konfirmasi Hapus */}
      {/* ========================================================================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-sm w-full space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-900 text-sm">Hapus Akun Akses Admin?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Kredensial login ini akan dinonaktifkan permanen dari basis data sistem.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirmId)}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
