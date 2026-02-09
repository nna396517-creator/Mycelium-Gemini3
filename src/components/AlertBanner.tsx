// src/components/AlertBanner.tsx
'use client';

import { AlertTriangle, Megaphone, X } from 'lucide-react';
import { EmergencyAlert } from '@/lib/types';
import { useLanguage } from '@/components/LanguageContext';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface AlertBannerProps {
  alert: EmergencyAlert | null;
  onClose: () => void;
}

export default function AlertBanner({ alert, onClose }: AlertBannerProps) {
  // 1. 確保 language 被正確取出
  const { language, t: rawT } = useLanguage();
  const t = rawT as any;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (alert) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [alert]);

  if (!alert || !visible) return null;

  const isEmergency = alert.level === 'EMERGENCY';

  // 2. 預先計算好要顯示的文字，確保邏輯單純
  const displayTitle = language === 'zh' ? alert.titleZh : alert.title;
  const displayMessage = language === 'zh' ? alert.messageZh : alert.message;

  return (
    <div 
      // [關鍵修正] 加入 key={language} 
      // 這會強制 React 在語言切換時 "銷毀並重建" 此元件
      // 確保文字一定會更新，且不會有殘留的舊狀態
      key={`${alert.id}-${language}`} 
      className={cn(
        "fixed top-[60px] md:top-[60px] left-0 right-0 z-50 transform transition-all duration-500 ease-out shadow-[0_0_50px_rgba(255,0,0,0.5)]",
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}
    >
      <div className={cn(
        "w-full px-4 py-3 flex items-center justify-between border-b border-white/20 backdrop-blur-xl",
        isEmergency 
          ? "bg-red-600/90 text-white animate-pulse-slow" 
          : "bg-yellow-600/90 text-white"
      )}>
        
        {/* 左側圖示與標題 */}
        <div className="flex items-center gap-3 md:gap-6 overflow-hidden">
            <div className="shrink-0 p-2 bg-white/20 rounded-full animate-bounce">
                {isEmergency ? <Megaphone size={24} /> : <AlertTriangle size={24} />}
            </div>
            
            <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4 min-w-0">
                <span className="text-lg md:text-xl font-black tracking-widest uppercase whitespace-nowrap">
                    {displayTitle}
                </span>
                <span className="text-sm md:text-base font-mono opacity-90 truncate">
                    {displayMessage}
                </span>
            </div>
        </div>

        {/* 右側關閉按鈕 */}
        <button 
            onClick={() => {
                setVisible(false);
                setTimeout(onClose, 500); 
            }}
            className="shrink-0 ml-4 p-2 hover:bg-white/20 rounded-full transition-colors border border-white/30"
            title={t.alerts.dismiss}
        >
            <span className="sr-only">{t.alerts.dismiss}</span>
            <X size={20} />
        </button>
      </div>
      
      {/* 跑馬燈裝飾條 */}
      <div className="h-1 w-full bg-striped-pattern animate-move-stripes opacity-50"></div>
    </div>
  );
}
