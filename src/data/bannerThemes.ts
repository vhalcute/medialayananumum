export interface BannerColorTheme {
  id: string;
  name: string;
  tagline: string;
  gradientClass: string;
  starColor: string;
  accentBadgeClass: string;
  primaryButtonClass: string;
  secondaryButtonClass: string;
  previewColors: string[];
}

export const BANNER_COLOR_THEMES: BannerColorTheme[] = [
  {
    id: 'treasury-navy',
    name: 'Midnight Treasury (Standar Kanwil)',
    tagline: 'Kombinasi Navy Pekat, Deep Cyan, & Aksen Bintang Jambi',
    gradientClass: 'bg-gradient-to-r from-[#031d2e] via-[#002b49] to-[#021522]',
    starColor: '#1a3c42',
    accentBadgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    primaryButtonClass: 'bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-bold',
    secondaryButtonClass: 'bg-[#002138]/70 hover:bg-[#002e4d] text-white border-slate-600/50',
    previewColors: ['#031d2e', '#002b49', '#f59e0b']
  },
  {
    id: 'oceanic-teal',
    name: 'Oceanic Teal & Marine Dark',
    tagline: 'Gradasi Biru Kehijauan Samudra yang Menyejukkan & Modern',
    gradientClass: 'bg-gradient-to-r from-[#042f2e] via-[#0f766e] to-[#083344]',
    starColor: '#115e59',
    accentBadgeClass: 'bg-teal-400/20 text-teal-200 border-teal-400/30',
    primaryButtonClass: 'bg-[#14b8a6] hover:bg-[#0d9488] text-slate-950 font-bold',
    secondaryButtonClass: 'bg-[#042f2e]/70 hover:bg-[#0f766e]/40 text-white border-teal-500/40',
    previewColors: ['#042f2e', '#0f766e', '#14b8a6']
  },
  {
    id: 'emerald-wbk',
    name: 'Emerald WBK (Zona Integritas)',
    tagline: 'Hijau Zamrud Berwibawa Melambangkan Bebas Korupsi & Pelayanan Prima',
    gradientClass: 'bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#022c22]',
    starColor: '#047857',
    accentBadgeClass: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    primaryButtonClass: 'bg-[#10b981] hover:bg-[#059669] text-slate-950 font-bold',
    secondaryButtonClass: 'bg-[#022c22]/70 hover:bg-[#064e3b]/50 text-white border-emerald-600/40',
    previewColors: ['#064e3b', '#065f46', '#10b981']
  },
  {
    id: 'royal-sapphire',
    name: 'Royal Sapphire & Gold',
    tagline: 'Biru Safir Kemenkeu dengan Aksen Keemasan Nagara Dana Rakca',
    gradientClass: 'bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#1e1b4b]',
    starColor: '#2563eb',
    accentBadgeClass: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    primaryButtonClass: 'bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-bold',
    secondaryButtonClass: 'bg-[#172554]/70 hover:bg-[#1e3a8a]/50 text-white border-blue-400/30',
    previewColors: ['#172554', '#1e3a8a', '#f59e0b']
  },
  {
    id: 'cyber-indigo',
    name: 'Twilight Indigo & Neon Slate',
    tagline: 'Gradasi Futuristik Era Digital Treasury & Layanan Cloud Cepat',
    gradientClass: 'bg-gradient-to-r from-[#0f172a] via-[#312e81] to-[#1e1b4b]',
    starColor: '#4338ca',
    accentBadgeClass: 'bg-violet-400/20 text-violet-200 border-violet-400/30',
    primaryButtonClass: 'bg-[#818cf8] hover:bg-[#6366f1] text-slate-950 font-bold',
    secondaryButtonClass: 'bg-[#0f172a]/70 hover:bg-[#312e81]/40 text-white border-indigo-400/40',
    previewColors: ['#0f172a', '#312e81', '#818cf8']
  },
  {
    id: 'crimson-amber',
    name: 'Sunset Crimson & Bronze Amber',
    tagline: 'Warna Hangat Penuh Energi dan Semangat Pelayanan Terdepan',
    gradientClass: 'bg-gradient-to-r from-[#450a0a] via-[#7f1d1d] to-[#1c1917]',
    starColor: '#991b1b',
    accentBadgeClass: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    primaryButtonClass: 'bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-bold',
    secondaryButtonClass: 'bg-[#450a0a]/70 hover:bg-[#7f1d1d]/50 text-white border-rose-500/30',
    previewColors: ['#450a0a', '#7f1d1d', '#f59e0b']
  },
  {
    id: 'obsidian-carbon',
    name: 'Obsidian Carbon & Platinum',
    tagline: 'Nuansa Gelap Premium, Bersih, Berkelas, dan Fokus Konten',
    gradientClass: 'bg-gradient-to-r from-[#09090b] via-[#18181b] to-[#27272a]',
    starColor: '#3f3f46',
    accentBadgeClass: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30',
    primaryButtonClass: 'bg-[#e4e4e7] hover:bg-white text-slate-950 font-bold',
    secondaryButtonClass: 'bg-[#18181b]/80 hover:bg-[#27272a] text-white border-zinc-700',
    previewColors: ['#09090b', '#18181b', '#e4e4e7']
  },
  {
    id: 'electric-blue',
    name: 'Pacific Sky & Deep Blue',
    tagline: 'Perpaduan Biru Langit Khatulistiwa dan Biru Laut Nusantara',
    gradientClass: 'bg-gradient-to-r from-[#082f49] via-[#0284c7] to-[#0c4a6e]',
    starColor: '#0369a1',
    accentBadgeClass: 'bg-cyan-300/20 text-cyan-200 border-cyan-400/30',
    primaryButtonClass: 'bg-[#38bdf8] hover:bg-[#0ea5e9] text-slate-950 font-bold',
    secondaryButtonClass: 'bg-[#082f49]/70 hover:bg-[#0284c7]/40 text-white border-cyan-400/30',
    previewColors: ['#082f49', '#0284c7', '#38bdf8']
  }
];

export const DEFAULT_BANNER_THEME_ID = 'treasury-navy';

export function getBannerTheme(id?: string | null): BannerColorTheme {
  const found = BANNER_COLOR_THEMES.find(t => t.id === id);
  return found || BANNER_COLOR_THEMES[0];
}
