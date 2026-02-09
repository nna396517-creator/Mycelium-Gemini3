// src/components/MapLegend.tsx
'use client';

import { Info, Heart, Plus, Home, Shield, Navigation } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { cn } from '@/lib/utils';

export default function MapLegend() {
  const { t: rawT } = useLanguage();
  const t = rawT as any;

  return (
    <div className="w-full p-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl shrink-0 mb-4 transition-all duration-300">
      
      {/* 標題 */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-2">
        <Info size={14} className="text-blue-400" />
        <span className="text-zinc-300 font-bold text-xs tracking-widest uppercase">
          {t.legend.title}
        </span>
      </div>

      {/* Grid 內容 */}
      <div className="grid grid-cols-3 gap-y-2 gap-x-1">
        
        {/* 第一排 */}
        <div className="flex items-center gap-1.5">
          <Navigation size={12} className="text-sky-400 fill-sky-400/20" />
          <span className="text-zinc-300 text-[11px] font-medium leading-none">{t.legend.user}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Heart size={12} className="text-red-500 fill-red-500" />
          <span className="text-zinc-300 text-[11px] font-medium leading-none">{t.legend.aed}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-red-500 rounded-[2px] flex items-center justify-center text-white font-bold text-[8px] leading-none pb-[1px]">+</div>
          <span className="text-zinc-300 text-[11px] font-medium leading-none">{t.legend.hospital}</span>
        </div>

        {/* 第二排 */}
        <div className="flex items-center gap-1.5">
          <Home size={12} className="text-blue-400" />
          <span className="text-zinc-300 text-[11px] font-medium leading-none">{t.legend.shelter}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Shield size={12} className="text-yellow-500" />
          <span className="text-zinc-300 text-[11px] font-medium leading-none">{t.legend.bunker}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border border-white bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.6)]"></div>
          <span className="text-zinc-300 text-[11px] font-medium leading-none">{t.legend.task}</span>
        </div>

      </div>
    </div>
  );
}
