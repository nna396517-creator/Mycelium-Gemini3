// src/components/LanguageToggle.tsx
'use client';

import { useLanguage } from '@/components/LanguageContext';
import { cn } from '@/lib/utils';

export default function LanguageToggle() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    // 外層容器：負責接收點擊事件，並作為定位基準
    // group: 用於 hover 效果
    // cursor-pointer & onClick: 實現全區域點擊切換
    <div 
      onClick={toggleLanguage}
      className="relative flex items-center w-[104px] h-8 p-0.5 bg-black/50 border border-white/20 rounded-full font-mono backdrop-blur-md cursor-pointer group select-none"
    >
      
      {/* 滑動的白色背景塊 */}
      <div
        className={cn(
          "absolute inset-y-0.5 w-[calc(50%-2px)] bg-white rounded-full shadow-sm",
          "transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]", // 使用特製的貝茲曲線讓滑動更Q彈
          lang === 'en' ? "left-[calc(50%+1px)]" : "left-0.5" // 根據語言狀態改變位置
        )}
      />

      {/* 文字層：中文 */}
      <span
        className={cn(
          "relative z-10 w-1/2 text-center text-xs transition-colors duration-300",
          lang === 'zh'
            ? "text-black font-bold" // 選中時：黑色、加粗
            : "text-zinc-400 group-hover:text-white" // 未選中時：灰色，滑鼠懸停變白
        )}
      >
        中文
      </span>

      {/* 文字層：EN */}
      <span
        className={cn(
          "relative z-10 w-1/2 text-center text-xs transition-colors duration-300",
          lang === 'en'
            ? "text-black font-bold" // 選中時：黑色、加粗
            : "text-zinc-400 group-hover:text-white" // 未選中時：灰色，滑鼠懸停變白
        )}
      >
        EN
      </span>
    </div>
  );
}
