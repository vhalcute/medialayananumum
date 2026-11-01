import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  ShoppingCart,
  Minus,
  Trash2,
  Printer,
  Search,
  Check,
  Package,
  Layers
} from 'lucide-react';
import { AtkItem, AtkRequest } from '../../types';

interface AtkRequestViewProps {
  catalog: AtkItem[];
  requests: AtkRequest[];
  onAddRequest: (req: Omit<AtkRequest, 'id' | 'requestDate'>) => void;
  onUpdateStatus: (id: string, status: AtkRequest['status']) => void;
  onPrintRequest: (req: AtkRequest) => void;
  activeRole: 'pegawai' | 'kasubbag' | 'admin';
}

export const AtkRequestView: React.FC<AtkRequestViewProps> = ({
  catalog,
  requests,
  onAddRequest,
  onUpdateStatus,
  onPrintRequest,
  activeRole,
}) => {
  const [cart, setCart] = useState<{ [code: string]: number }>({});
  const [requesterName, setRequesterName] = useState('');
  const [division, setDivision] = useState('Bidang PPA I');
  const [purpose, setPurpose] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const cartItemCodes = Object.keys(cart).filter(code => cart[code] > 0);
  const totalCartUnits = cartItemCodes.reduce((sum, code) => sum + cart[code], 0);

  const updateCartQty = (code: string, delta: number) => {
    const current = cart[code] || 0;
    const targetItem = catalog.find(i => i.code === code);
    const maxStock = targetItem ? targetItem.stock : 99;
    const next = Math.max(0, Math.min(maxStock, current + delta));
    setCart(prev => ({ ...prev, [code]: next }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requesterName || !purpose || cartItemCodes.length === 0) return;

    const items = cartItemCodes.map(code => {
      const item = catalog.find(i => i.code === code)!;
      return {
        code: item.code,
        name: item.name,
        qty: cart[code],
        unit: item.unit,
      };
    });

    onAddRequest({
      requesterName,
      division,
      items,
      purpose,
      status: 'Menunggu Kasubbag',
    });

    setCart({});
    setPurpose('');
    setRequesterName('');
  };

  const filteredCatalog = catalog.filter(item => 
    item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    item.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
    item.code.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700"></span>
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Subbagian TURT</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">Permintaan Barang Persediaan (ATK)</h1>
          <p className="text-xs text-slate-500">
            Katalog perlengkapan administrasi kantor & bahan habis pakai untuk menunjang kegiatan operasional Kanwil Jambi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-blue-50 text-blue-900 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-blue-200">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{totalCartUnits} Unit di Keranjang</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Catalog Items (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-slate-900">Katalog Barang Persediaan Tersedia</h2>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari ATK..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredCatalog.map(item => {
              const qtyInCart = cart[item.code] || 0;
              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-lg p-3.5 hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono text-slate-400">{item.code}</span>
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs">{item.name}</h3>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Satuan: <span className="font-semibold text-slate-700">{item.unit}</span> · Stok Gudang: <span className="font-bold text-emerald-700">{item.stock}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Pilih Jumlah:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.code, -1)}
                        disabled={qtyInCart === 0}
                        className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 flex items-center justify-center text-slate-700 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-xs font-bold text-slate-900 w-5 text-center">
                        {qtyInCart}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.code, 1)}
                        disabled={qtyInCart >= item.stock}
                        className="w-7 h-7 rounded bg-blue-700 hover:bg-blue-800 disabled:opacity-30 flex items-center justify-center text-white cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Request Form & Cart (Right column) */}
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm space-y-4 sticky top-20">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <ShoppingCart className="w-4 h-4 text-blue-700" />
              <span>Formulir Bon Permintaan ATK</span>
            </h3>

            {/* Selected Items List in Cart */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Daftar Barang Dipilih:</label>
              {cartItemCodes.length > 0 ? (
                <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-lg p-2 bg-slate-50 text-xs">
                  {cartItemCodes.map(code => {
                    const item = catalog.find(i => i.code === code)!;
                    return (
                      <div key={code} className="py-1.5 flex items-center justify-between">
                        <div className="pr-2 truncate">
                          <div className="font-semibold text-slate-800 truncate">{item.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{item.unit}</div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="font-mono font-bold text-blue-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {cart[code]}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(code, -cart[code])}
                            className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center border border-dashed border-slate-200 rounded-lg text-xs text-slate-400">
                  Keranjang kosong. Klik (+) pada barang di katalog untuk menambahkan.
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Pemohon *</label>
              <input
                type="text"
                required
                placeholder="Nama Lengkap Pegawai"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Kerja / Bidang *</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Bidang PPA I">Bidang PPA I</option>
                <option value="Bidang PPA II">Bidang PPA II</option>
                <option value="Bidang PAPK">Bidang PAPK</option>
                <option value="Bidang SKKI">Bidang SKKI</option>
                <option value="Bagian Umum (Subbag TURT / Kepeg / Keu / PK)">Bagian Umum</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Peruntukan / Keperluan *</label>
              <textarea
                required
                rows={2}
                placeholder="Contoh: Pencetakan Berkas SP2D dan Buku Laporan Kinerja TW III"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <button
              type="submit"
              disabled={cartItemCodes.length === 0 || !requesterName || !purpose}
              className="w-full py-2.5 bg-[#003366] hover:bg-[#002244] disabled:opacity-40 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              Ajukan Permintaan ATK ke Kasubbag
            </button>
          </form>
        </div>
      </div>

      {/* Requests History */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Riwayat Pengajuan Bon ATK</h2>
            <p className="text-xs text-slate-500">Status persetujuan dan pengambilan barang di Gudang BMN.</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {requests.map(req => (
            <div key={req.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-slate-800">{req.id}</span>
                  <span className="text-slate-400 text-xs">·</span>
                  <span className="text-xs text-slate-500">{req.requestDate}</span>
                </div>
                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                  {req.requesterName} <span className="font-normal text-slate-500">({req.division})</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{req.purpose}</p>

                {/* Items chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {req.items.map((i, idx) => (
                    <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200">
                      {i.name} ({i.qty} {i.unit})
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                  req.status === 'Siap Diambil'
                    ? 'bg-emerald-100 text-emerald-800'
                    : req.status === 'Disetujui'
                    ? 'bg-blue-100 text-blue-800'
                    : req.status === 'Menunggu Kasubbag'
                    ? 'bg-amber-100 text-amber-800'
                    : req.status === 'Selesai'
                    ? 'bg-slate-100 text-slate-700'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {req.status}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onPrintRequest(req)}
                    title="Cetak Bon Pengeluaran ATK Resmi"
                    className="p-1.5 text-slate-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors inline-flex cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>

                  {(activeRole === 'kasubbag' || activeRole === 'admin') && req.status === 'Menunggu Kasubbag' && (
                    <button
                      onClick={() => onUpdateStatus(req.id, 'Disetujui')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold cursor-pointer"
                    >
                      Setujui
                    </button>
                  )}
                  {(activeRole === 'kasubbag' || activeRole === 'admin') && req.status === 'Disetujui' && (
                    <button
                      onClick={() => onUpdateStatus(req.id, 'Siap Diambil')}
                      className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded text-[11px] font-bold cursor-pointer"
                    >
                      Siap Diambil
                    </button>
                  )}
                  {req.status === 'Siap Diambil' && (
                    <button
                      onClick={() => onUpdateStatus(req.id, 'Selesai')}
                      className="px-2.5 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded text-[11px] font-bold cursor-pointer"
                    >
                      Tandai Selesai
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
