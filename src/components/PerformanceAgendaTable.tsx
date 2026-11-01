import React from 'react';
import { Clock, CheckCircle2, Megaphone, AlertCircle } from 'lucide-react';
import { PerformanceScheduleItem } from '../types';

interface PerformanceAgendaTableProps {
  scheduleItems?: PerformanceScheduleItem[];
  onToggleScheduleItem?: (id: number) => void;
  title?: string;
}

export const PerformanceAgendaTable: React.FC<PerformanceAgendaTableProps> = ({
  scheduleItems = [],
  onToggleScheduleItem,
  title = 'Perekaman Capaian IKI TW III 2026',
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden font-sans">
      {/* Alert banner for IKI */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center gap-2 text-xs text-amber-900 font-medium">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Perhatian:</strong> Pada saat rekam realisasi IKI Pegawai, wajib{' '}
          <span className="underline decoration-amber-700 font-bold">pilih bulan SEPTEMBER</span> pada aplikasi kinerja (Batas: 9 November 2026).
        </span>
      </div>

      {/* EXACT 1:1 TABLE (Navy Header + Amber Deadline Pills) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table Header: Deep Navy blue #183968, white bold uppercase */}
          <thead>
            <tr className="bg-[#183968] text-white text-[12px] font-bold tracking-wider select-none">
              <th className="py-3 px-4 w-16 text-center border-r border-[#244c85]">
                NO.
              </th>
              <th className="py-3 px-5 border-r border-[#244c85]">
                KEGIATAN / TAHAPAN PEREKAMAN CAPAIAN IKI TW III 2026
              </th>
              <th className="py-3 px-6 w-80 text-right">
                BATAS WAKTU PELAKSANAAN
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200/90 text-xs bg-white">
            {scheduleItems.map((item, idx) => (
              <tr
                key={item.id}
                className={`hover:bg-blue-50/25 transition-colors ${
                  item.isCompleted ? 'bg-slate-50/40' : 'bg-white'
                }`}
              >
                {/* NO. Column (Centered, bold) */}
                <td className="py-4 px-4 text-center align-middle font-bold text-slate-800 text-sm border-r border-slate-100">
                  {idx + 1}
                </td>

                {/* KEGIATAN Column */}
                <td className="py-4 px-5 align-middle border-r border-slate-100">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      {onToggleScheduleItem && (
                        <button
                          type="button"
                          onClick={() => onToggleScheduleItem(item.id)}
                          title="Tandai selesai / belum"
                          className="text-slate-300 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
                        >
                          {item.isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-300 hover:border-emerald-500" />
                          )}
                        </button>
                      )}
                      <span
                        className={`font-bold text-slate-900 text-xs sm:text-[13px] leading-snug ${
                          item.isCompleted ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {item.activity}
                      </span>
                    </div>

                    {idx === 0 && (
                      <div className="pl-6 pt-0.5">
                        <span className="inline-flex items-center gap-1 border border-amber-300 bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[11px] font-bold">
                          ⚠️ Wajib: Pilih bulan SEPTEMBER pada aplikasi kinerja
                        </span>
                      </div>
                    )}

                    {item.subText && (
                      <p className="text-[11px] text-slate-500 pl-6 leading-relaxed font-normal">
                        {item.subText}
                      </p>
                    )}
                  </div>
                </td>

                {/* BATAS WAKTU Column (Right-aligned, amber pill) */}
                <td className="py-4 px-6 align-middle text-right">
                  <div className="inline-flex items-center gap-1.5 border border-[#f59e0b] bg-[#fffdf0] text-[#78350f] text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-[#d97706] shrink-0" />
                    <span>{item.deadline}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3 sm:p-4 bg-slate-50/70 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>Perekaman capaian realisasi IKI Pegawai Triwulan III Tahun 2026.</span>
        </div>
        <div className="font-semibold text-slate-700">
          Subbagian Penilaian Kinerja Kanwil Ditjen Perbendaharaan
        </div>
      </div>
    </div>
  );
};
