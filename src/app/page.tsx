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

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentScenario, setCurrentScenario] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 取得翻譯物件 t
  const { t } = useLanguage(); 

  // --- 真實電量偵測邏輯 ---
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  useEffect(() => {
    // 檢查瀏覽器是否支援 battery API
    // 注意: Safari 不支援，所以預設給 100
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.floor(battery.level * 100));
        // 監聽電量變化
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
      content: t.chat.userPrompt, // 使用翻譯的提示詞
      attachmentUrl: URL.createObjectURL(file)
    };
    setMessages(prev => [...prev, userMsg]);
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      setCurrentScenario(DEMO_SCENARIO);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: DEMO_SCENARIO.situationSummary, // 這裡通常是後端回傳，暫時維持 Mock
        analysis: DEMO_SCENARIO
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 3000);
  };

  // 登出函式
  const handleLogout = () => {
    setIsLoggedIn(false);
    // 如果想要登出後清空對話紀錄，也可以在這裡 setMessages([])
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-zinc-950 text-white font-mono selection:bg-blue-500/30">
      
      {/* 登入遮罩：未登入前的預設顯示 */}
      {!isLoggedIn && (
        <AuthOverlay onLogin={() => setIsLoggedIn(true)} />
      )}

      {/* 1. 底層：地圖 */}
      <div className="absolute inset-0 z-0">
        <MapCanvas scenario={currentScenario} />
      </div>

      {/* 2. 視覺特效層：掃描線與暗角 */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <div className="absolute inset-0 z-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]"></div>
      
      {/* 3. 頂部狀態列 (RWD: 手機版調整 padding 與隱藏部分資訊) */}
      <div className="absolute top-0 left-0 right-0 z-20 p-2 md:p-3 flex justify-between items-center bg-black/60 backdrop-blur border-b border-white/10 transition-all">
        {/* 左側：標題 */}
        <div className="flex items-center gap-2 md:gap-4 px-2 md:px-4">
            <span className="text-blue-400 font-bold tracking-widest text-sm md:text-lg whitespace-nowrap">MYCELIUM v3</span>
            <span className="hidden md:flex px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs border border-green-500/30 items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> {t.header.status}
            </span>
            {/* 手機版只顯示綠燈圓點 */}
            <div className="md:hidden w-2 h-2 rounded-full bg-green-500 animate-pulse ml-1"/> 
        </div>

        {/* 右側：數據與工具 */}
        <div className="flex items-center gap-2 md:gap-4 px-2 md:px-4">
           {/* RWD: 系統數據在手機版隱藏 CPU/Latency，只保留電量 */}
           <div className="flex items-center gap-4 md:gap-6 px-2 md:px-4 text-[10px] md:text-xs text-zinc-400 border-r border-white/10 pr-4 md:pr-6">
              <div className="hidden md:flex items-center gap-2"><Signal size={14}/> {t.stats.latency}: 12ms</div>
              <div className="hidden md:flex items-center gap-2"><Activity size={14}/> CPU: Gemini-3</div>
              {/* 電量顯示：手機版非常需要 */}
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
          {/* 4. 左側指揮面板 (RWD 重點)
            Desktop: left-4 top-16 w-[400px]
            Mobile:  bottom-0 w-full h-[45vh] (半屏抽屜式)
          */}
          <div className="absolute 
                          left-0 bottom-0 w-full h-[45vh] rounded-t-2xl border-t border-white/20
                          md:left-4 md:top-16 md:bottom-4 md:w-[400px] md:h-auto md:rounded-xl md:border md:border-white/10
                          z-10 flex flex-col gap-2 
                          animate-in slide-in-from-bottom-10 duration-700 shadow-2xl overflow-hidden">
            <div className="flex-1 overflow-hidden bg-black/80 backdrop-blur-md h-full">
              <CommandPanel messages={messages} isAnalyzing={isAnalyzing} onUpload={handleUpload} />
            </div>
          </div>

          {/* 5. 右側資源面板 (RWD 重點)
            Desktop: 顯示
            Mobile:  隱藏 (hidden)
          */}
          <div className="hidden md:flex absolute right-4 top-16 w-[300px] z-10 flex-col gap-4 animate-in fade-in slide-in-from-right-10 duration-700">
            {/* 這裡維持原本的內容 */}
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
