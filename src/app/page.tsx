// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import MapCanvas from '@/components/MapCanvas';
import CommandPanel from '@/components/CommandPanel';
import AuthOverlay from '@/components/AuthOverlay';
import { AnalysisResult, Message } from '@/lib/types';
import { DEMO_SCENARIO } from '@/data/mockScenarios';
import { Activity, Signal, Battery, Users } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import UserProfile from '@/components/UserProfile';
import { cn } from '@/lib/utils';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentScenario, setCurrentScenario] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);
  const { t } = useLanguage(); 

  // 真實電量偵測
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.floor(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.floor(battery.level * 100));
        });
      });
    }
  }, []);

  const handleUpload = async (file: File) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: t.chat.userPrompt,
      attachmentUrl: URL.createObjectURL(file)
    };
    setMessages(prev => [...prev, userMsg]);
    setIsAnalyzing(true);
    setIsPanelMinimized(false); // 自動展開

    setTimeout(() => {
      setIsAnalyzing(false);
      setCurrentScenario(DEMO_SCENARIO);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: DEMO_SCENARIO.situationSummary,
        analysis: DEMO_SCENARIO
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 3000);
  };

  const handleSendMessage = (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };
    setMessages(prev => [...prev, userMsg]);
    setIsPanelMinimized(false); // 自動展開

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Command received: "${text}"\nSystem is updating parameters based on your input. Monitoring active sectors.`
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  return (
    <main className="relative w-full h-[100dvh] overflow-hidden bg-zinc-950 text-white font-mono selection:bg-blue-500/30">
      
      {!isLoggedIn && (
        <AuthOverlay onLogin={() => setIsLoggedIn(true)} />
      )}

      {/* 底層：地圖 */}
      <div className="absolute inset-0 z-0">
        <MapCanvas scenario={currentScenario} />
      </div>

      {/* 視覺特效層 */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <div className="absolute inset-0 z-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]"></div>
      
      {/* 頂部狀態列 */}
      <div className="absolute top-0 left-0 right-0 z-20 p-2 md:p-3 flex justify-between items-center bg-black/60 backdrop-blur border-b border-white/10 transition-all">
        <div className="flex items-center gap-2 md:gap-4 px-2 md:px-4">
            <span className="text-blue-400 font-bold tracking-widest text-sm md:text-lg whitespace-nowrap">MYCELIUM v3</span>
            <span className="hidden md:flex px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs border border-green-500/30 items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> {t.header.status}
            </span>
            <div className="md:hidden w-2 h-2 rounded-full bg-green-500 animate-pulse ml-1"/> 
        </div>

        <div className="flex items-center gap-2 md:gap-4 px-2 md:px-4">
           <div className="flex items-center gap-4 md:gap-6 px-2 md:px-4 text-[10px] md:text-xs text-zinc-400 border-r border-white/10 pr-4 md:pr-6">
              <div className="hidden md:flex items-center gap-2"><Signal size={14}/> {t.stats.latency}: 12ms</div>
              <div className="hidden md:flex items-center gap-2"><Activity size={14}/> CPU: Gemini-3</div>
              <div className="flex items-center gap-1 md:gap-2">
                  <Battery size={14} className={batteryLevel < 20 ? "text-red-500" : "text-green-400"}/> 
                  <span>{batteryLevel}%</span>
              </div>
           </div>
           <UserProfile onLogout={handleLogout} />
           <div className="scale-90 md:scale-100 origin-right">
             <LanguageToggle /> 
           </div>
        </div>
      </div>

      {isLoggedIn && (
        <>
          {/* 左側指揮面板 - [RWD 分流設定] */}
          <div 
            className={cn(
              // 基礎樣式：固定定位、寬度、層級、動畫
              "fixed left-0 w-full z-30 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] flex flex-col",
              
              // --- 手機版 (Mobile) 設定：貼底 ---
              "bottom-0", 
              // 高度：最小化時 60px，展開時 45dvh
              isPanelMinimized ? "h-[60px]" : "h-[45dvh]",
              
              // --- 電腦版 (Desktop) 設定：貼頂 ---
              // md:top-16: 距離頂部 4rem (避開狀態列)
              // md:bottom-auto: 取消手機版的 bottom-0
              "md:left-4 md:w-[400px] md:top-16 md:bottom-auto",
              
              // 電腦版高度：最小化時 60px，展開時 80vh
              isPanelMinimized 
                ? "md:h-[60px]" 
                : "md:h-[80vh]"
            )}
          >
            <div className="flex-1 overflow-hidden h-full">
              <CommandPanel 
                messages={messages} 
                isAnalyzing={isAnalyzing} 
                onUpload={handleUpload} 
                onClear={handleClearHistory}
                onSendMessage={handleSendMessage}
                isMinimized={isPanelMinimized}
                onToggleMinimize={() => setIsPanelMinimized(!isPanelMinimized)}
              />
            </div>
          </div>

          {/* 右側資源面板 */}
          <div className="hidden md:flex absolute right-4 top-16 w-[300px] z-10 flex-col gap-4 animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="p-4 bg-black/80 backdrop-blur-md rounded-xl border border-white/10">
                <h3 className="text-zinc-400 text-xs mb-3 flex items-center gap-2">
                    <Activity size={14} className="text-red-500"/> {t.stats.risk}
                </h3>
                <div className="flex items-end gap-1 h-24 mb-2">
                    {[40, 65, 30, 80, 50, 90, 45, 70, 60, 85].map((h, i) => (
                        <div key={i} className="flex-1 bg-red-500/20 hover:bg-red-500/50 transition-all rounded-t-sm relative group">
                            <div style={{height: `${h}%`}} className="absolute bottom-0 w-full bg-red-500/50 group-hover:bg-red-400"></div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-2xl font-bold text-red-500">
                    <span>CRITICAL</span>
                    <span>89%</span>
                </div>
            </div>

            <div className="p-4 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 space-y-4">
                <h3 className="text-zinc-400 text-xs flex items-center gap-2">
                    <Users size={14} className="text-blue-500"/> {t.stats.resources}
                </h3>
                
                <div className="space-y-1">
                    <div className="flex justify-between text-xs mb-1"><span>{t.stats.medic}</span> <span className="text-blue-400">3/5</span></div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[60%]"></div>
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between text-xs mb-1"><span>{t.stats.supply}</span> <span className="text-yellow-400">8/10</span></div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 w-[80%]"></div>
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between text-xs mb-1"><span>{t.stats.heavy}</span> <span className="text-red-400">1/1</span></div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 w-[100%] animate-pulse"></div>
                    </div>
                </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
