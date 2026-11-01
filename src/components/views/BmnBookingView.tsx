import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Check,
  X,
  Printer,
  Calendar,
  Layers,
  Edit2,
  Trash2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { BmnItem, BmnBorrowing } from '../../types';

interface BmnBookingViewProps {
  items: BmnItem[];
  borrowings: BmnBorrowing[];
  onAddBorrowing: (borrowing: Omit<BmnBorrowing, 'id'>) => void;
  onUpdateBorrowing: (borrowing: BmnBorrowing) => void;
  onDeleteBorrowing: (id: string) => void;
  onUpdateStatus: (id: string, status: BmnBorrowing['status']) => void;
  onPrintBorrowing: (b: BmnBorrowing) => void;
  activeRole: 'pegawai' | 'kasubbag' | 'admin';
}

export const BmnBookingView: React.FC<BmnBookingViewProps> = ({
  items,
  borrowings,
  onAddBorrowing,
  onUpdateBorrowing,
  onDeleteBorrowing,
  onUpdateStatus,
  onPrintBorrowing,
  activeRole,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states:
  // 1. Nama Barang
  // 2. Nama Peminjam
  // 3. Jumlah Unit
  // 4. Bagian/Bidang
  // 5. Tanggal Pinjam
  const [itemName, setItemName] = useState(items[0]?.name || 'Kamera Mirrorless Sony Alpha A7 IV (Dokumentasi)');
  const [itemCode, setItemCode] = useState(items[0]?.code || 'BMN-EL-001');
  const [borrowerName, setBorrowerName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [division, setDivision] = useState('Bagian Umum (Subbagian TURT)');
  const [borrowDate, setBorrowDate] = useState('2026-10-31');
  const [searchFilter, setSearchFilter] = useState('');

  // Handle opening form for Create
  const handleOpenAddForm = () => {
    setEditingId(null);
    setItemName(items[0]?.name || 'Kamera Mirrorless Sony Alpha A7 IV (Dokumentasi)');
    setItemCode(items[0]?.code || 'BMN-EL-001');
    setBorrowerName('');
    setQuantity(1);
    setDivision('Bagian Umum (Subbagian TURT)');
    setBorrowDate('2026-10-31');
    setShowForm(true);
  };

  // Handle opening form for Ubah (Edit)
  const handleOpenEditForm = (borrowing: BmnBorrowing) => {
    setEditingId(borrowing.id);
    setItemName(borrowing.itemName);
    setItemCode(borrowing.itemCode || 'BMN-EL-001');
    setBorrowerName(borrowing.borrowerName);
    setQuantity(borrowing.quantity);
    setDivision(borrowing.division);
    setBorrowDate(borrowDateToYmd(borrowing.borrowDate));
    setShowForm(true);
    // Scroll to top of form smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const borrowDateToYmd = (dateStr: string) => {
    if (!dateStr) return '2026-10-31';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    return '2026-10-31';
  };

  // Handle submit (Create or Update)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !borrowerName || !quantity) return;

    if (editingId) {
      // Find original to preserve status, id, purpose
      const original = borrowings.find(b => b.id === editingId);
      const updated: BmnBorrowing = {
        id: editingId,
        itemName,
        itemCode: itemCode || original?.itemCode || 'BMN-EL-001',
        borrowerName,
        quantity: Number(quantity),
        division,
        borrowDate,
        purpose: original?.purpose || 'Kegiatan operasional kedinasan Kanwil DJPb Prov. Jambi',
        returnPlanDate: original?.returnPlanDate || borrowDate,
        status: original?.status || 'Menunggu',
      };
      onUpdateBorrowing(updated);
    } else {
      onAddBorrowing({
        itemCode: itemCode || 'BMN-EL-001',
        itemName,
        quantity: Number(quantity),
        borrowerName,
        division,
        purpose: 'Kegiatan operasional kedinasan Kanwil DJPb Prov. Jambi',
        borrowDate,
        returnPlanDate: borrowDate,
        status: 'Menunggu',
      });
    }

    // Reset
    setShowForm(false);
    setEditingId(null);
    setBorrowerName('');
  };

  // Quick select from catalog
  const handleQuickSelectCatalog = (item: BmnItem) => {
    setItemName(item.name);
    setItemCode(item.code);
    setEditingId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const itemToDelete = borrowings.find(b => b.id === deleteConfirmId);

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onDeleteBorrowing(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const filteredBorrowings = borrowings.filter(b =>
    b.itemName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    b.borrowerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    b.division.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700"></span>
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Subbagian TURT</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">Peminjaman Barang</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pelayanan peminjaman barang inventaris kantor, peralatan IT, audio visual, dan penunjang kegiatan kedinasan Kanwil Jambi.
          </p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditingId(null);
            } else {
              handleOpenAddForm();
            }
          }}
          className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>{showForm ? 'Tutup Formulir' : '+ Tambah Peminjaman Barang'}</span>
        </button>
      </div>

      {/* Form Card (Add / Ubah) */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              {editingId ? (
                <>
                  <Edit2 className="w-4 h-4 text-amber-600" />
                  <span>Ubah Data Peminjaman Barang</span>
                  <span className="text-xs font-mono font-normal text-slate-500">({editingId})</span>
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 text-blue-700" />
                  <span>Formulir Peminjaman Barang</span>
                </>
              )}
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Subbagian TURT Kanwil DJPb Prov. Jambi</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Nama Barang */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Barang *</label>
              <div className="space-y-1.5">
                <select
                  value={itemName}
                  onChange={(e) => {
                    const found = items.find(i => i.name === e.target.value);
                    setItemName(e.target.value);
                    if (found) setItemCode(found.code);
                  }}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-medium focus:border-blue-700 focus:outline-hidden"
                >
                  <optgroup label="Pilih dari Katalog BMN / Inventaris">
                    {items.map(item => (
                      <option key={item.id} value={item.name}>
                        {item.name} (Tersedia: {item.availableQty} unit)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Pilihan Lainnya">
                    <option value="Kamera DSLR & Lensa Cadangan">Kamera DSLR & Lensa Cadangan</option>
                    <option value="Laptop Operasional Kegiatan (Core i7)">Laptop Operasional Kegiatan (Core i7)</option>
                    <option value="Printer Portabel Wireless">Printer Portabel Wireless</option>
                    <option value="Set Mikrofon Wireless & Receiver">Set Mikrofon Wireless & Receiver</option>
                    <option value="Proyektor Portabel HD">Proyektor Portabel HD</option>
                    <option value="Lainnya (Tulis Manual)">Lainnya (Tulis Manual)</option>
                  </optgroup>
                </select>

                {itemName === 'Lainnya (Tulis Manual)' && (
                  <input
                    type="text"
                    required
                    placeholder="Ketik Nama Barang yang dipinjam..."
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-blue-400 bg-blue-50/30 focus:border-blue-700 focus:outline-hidden"
                  />
                )}
              </div>
            </div>

            {/* 2. Nama Peminjam */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Peminjam *</label>
              <input
                type="text"
                required
                placeholder="Nama Lengkap Peminjam / Pegawai"
                value={borrowerName}
                onChange={(e) => setBorrowerName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:outline-hidden"
              />
            </div>

            {/* 3. Jumlah Unit */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Unit *</label>
              <input
                type="number"
                min="1"
                max="50"
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:outline-hidden"
              />
            </div>

            {/* 4. Bagian / Bidang */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bagian / Bidang *</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-medium focus:border-blue-700 focus:outline-hidden"
              >
                <option value="Bagian Umum (Subbagian TURT)">Bagian Umum - Subbagian TURT</option>
                <option value="Bagian Umum (Subbagian Kepegawaian)">Bagian Umum - Subbagian Kepegawaian</option>
                <option value="Bagian Umum (Subbagian Keuangan)">Bagian Umum - Subbagian Keuangan</option>
                <option value="Bagian Umum (Subbagian Penilaian Kinerja)">Bagian Umum - Subbagian Penilaian Kinerja</option>
                <option value="Bagian Umum (Tim Kehumasan)">Bagian Umum - Tim Kehumasan</option>
                <option value="Bidang Pembinaan Pelaksanaan Anggaran I (PPA I)">Bidang Pembinaan Pelaksanaan Anggaran I (PPA I)</option>
                <option value="Bidang Pembinaan Pelaksanaan Anggaran II (PPA II)">Bidang Pembinaan Pelaksanaan Anggaran II (PPA II)</option>
                <option value="Bidang Pembinaan Akuntansi & Pelaporan Keuangan (PAPK)">Bidang Pembinaan Akuntansi & Pelaporan Keuangan (PAPK)</option>
                <option value="Bidang Supervisi KPPN dan Kepatuhan Internal (SKKI)">Bidang Supervisi KPPN dan Kepatuhan Internal (SKKI)</option>
              </select>
            </div>

            {/* 5. Tanggal Pinjam */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Pinjam *</label>
              <input
                type="date"
                required
                value={borrowDate}
                onChange={(e) => setBorrowDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{editingId ? 'Simpan Perubahan' : 'Simpan Peminjaman Barang'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Catalog of BMN items - Quick select */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-blue-700" />
            <span>Katalog Barang & Peralatan BMN Tersedia</span>
          </h2>
          <span className="text-[11px] text-slate-500">Klik "Pinjam" untuk mengisi data otomatis</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between hover:border-blue-400 hover:shadow-xs transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-mono text-slate-500 font-semibold text-[10px]">{item.code}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                    {item.category}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-xs">{item.name}</h3>
                <p className="text-[11px] text-slate-500 mt-1">{item.condition} · Lokasi: {item.location}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-500">Tersedia: </span>
                  <span className="font-bold text-emerald-700">{item.availableQty}</span>
                  <span className="text-slate-400"> / {item.totalQty} unit</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickSelectCatalog(item)}
                  className="px-3 py-1 text-xs text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                >
                  Pinjam
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Table:
          Contains: Nama Barang, Nama Peminjam, Jumlah Unit, Bagian/Bidang, Tanggal Pinjam, Ubah, Hapus */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Daftar Peminjaman Barang</h2>
            <p className="text-xs text-slate-500">
              Data peminjaman barang dan inventaris kantor Kanwil DJPb Prov. Jambi.
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari barang, peminjam, atau bidang..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:border-blue-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#002b49] text-white font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 text-center w-12">NO</th>
                <th className="py-3 px-4 min-w-[200px]">NAMA BARANG</th>
                <th className="py-3 px-4 min-w-[170px]">NAMA PEMINJAM</th>
                <th className="py-3 px-3 text-center min-w-[100px]">JUMLAH UNIT</th>
                <th className="py-3 px-4 min-w-[180px]">BAGIAN / BIDANG</th>
                <th className="py-3 px-3.5 text-center min-w-[120px]">TANGGAL PINJAM</th>
                <th className="py-3 px-4 text-center min-w-[160px]">AKSI (UBAH / HAPUS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBorrowings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada data peminjaman barang yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredBorrowings.map((b, index) => (
                  <tr key={b.id} className="hover:bg-blue-50/40 transition-colors">
                    {/* NO */}
                    <td className="py-3 px-3 text-center font-bold text-slate-700 align-middle">
                      {index + 1}
                    </td>

                    {/* NAMA BARANG */}
                    <td className="py-3 px-4 align-middle">
                      <div className="font-bold text-slate-900">{b.itemName}</div>
                      {b.itemCode && (
                        <div className="font-mono text-[10px] text-blue-700 mt-0.5">{b.itemCode}</div>
                      )}
                    </td>

                    {/* NAMA PEMINJAM */}
                    <td className="py-3 px-4 font-semibold text-slate-900 align-middle">
                      {b.borrowerName}
                    </td>

                    {/* JUMLAH UNIT */}
                    <td className="py-3 px-3 text-center align-middle whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-900 rounded font-bold border border-blue-200 text-xs">
                        {b.quantity} Unit
                      </span>
                    </td>

                    {/* BAGIAN / BIDANG */}
                    <td className="py-3 px-4 text-slate-700 align-middle">
                      <span className="inline-block bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                        {b.division}
                      </span>
                    </td>

                    {/* TANGGAL PINJAM */}
                    <td className="py-3 px-3.5 text-center font-medium text-slate-800 align-middle whitespace-nowrap">
                      {b.borrowDate}
                    </td>

                    {/* AKSI: UBAH, HAPUS (+ CETAK) */}
                    <td className="py-3 px-4 text-center align-middle whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Tombol Ubah */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditForm(b)}
                          title="Ubah data peminjaman ini"
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Ubah</span>
                        </button>

                        {/* Tombol Hapus */}
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(b.id)}
                          title="Hapus data peminjaman ini"
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-xs transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus</span>
                        </button>

                        {/* Tombol Cetak Dokumen */}
                        <button
                          type="button"
                          onClick={() => onPrintBorrowing(b)}
                          title="Cetak Berita Acara Peminjaman"
                          className="p-1 text-slate-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for HAPUS */}
      {deleteConfirmId && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900">Konfirmasi Hapus Peminjaman Barang</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Apakah Anda yakin ingin menghapus data peminjaman barang ini?
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-2.5 text-xs text-slate-700 space-y-1">
                  <div><span className="font-semibold">Nama Barang:</span> {itemToDelete.itemName}</div>
                  <div><span className="font-semibold">Nama Peminjam:</span> {itemToDelete.borrowerName}</div>
                  <div><span className="font-semibold">Jumlah Unit:</span> {itemToDelete.quantity} Unit</div>
                  <div><span className="font-semibold">Tanggal Pinjam:</span> {itemToDelete.borrowDate}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
