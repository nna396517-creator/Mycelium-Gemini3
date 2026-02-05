// src/app/page.tsx
'use client';

import { useState } from 'react';
import MapCanvas from '@/components/MapCanvas';
import CommandPanel from '@/components/CommandPanel';
import AuthOverlay from '@/components/AuthOverlay';
import { AnalysisResult, Message } from '@/lib/types';
import { DEMO_SCENARIO } from '@/data/mockScenarios';
import { Activity, Signal, Battery, Users } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentScenario, setCurrentScenario] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 取得翻譯物件 t
  const { t } = useLanguage(); 

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
      
      {/* 3. 頂部狀態列 */}
      <div className="absolute top-0 left-0 right-0 z-20 p-2 flex justify-between items-center bg-black/60 backdrop-blur border-b border-white/10">
        <div className="flex items-center gap-4 px-4">
            <span className="text-blue-400 font-bold tracking-widest text-lg">{t.header.title}</span>
            <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs border border-green-500/30 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> {t.header.status}
            </span>
        </div>

        <div className="flex items-center gap-4 px-4">
           {/* 只有登入後才顯示這些數據，不然畫面太亂？或者你想要登入前背景也有這些也可以保留 */}
           <div className="flex items-center gap-6 px-4 text-xs text-zinc-400 border-r border-white/10 pr-6">
              <div className="flex items-center gap-2"><Signal size={14}/> {t.stats.latency}: 12ms</div>
              <div className="flex items-center gap-2"><Activity size={14}/> CPU: Gemini-Pro-Vision</div>
              <div className="flex items-center gap-2"><Battery size={14}/> POWER: 98%</div>
           </div>
           <LanguageToggle /> 
        </div>
      </div>

      {/* 4. & 5. 面板：只有登入後才顯示互動面板，不然會被遮罩擋住看起來很怪 */}
      {isLoggedIn && (
        <>
          {/* 左側：指揮面板 */}
          <div className="absolute left-4 top-16 bottom-4 w-[400px] z-10 flex flex-col gap-2 animate-in fade-in slide-in-from-left-10 duration-700">
            <div className="flex-1 overflow-hidden rounded-xl border border-white/10 shadow-2xl bg-black/80 backdrop-blur-md">
              <CommandPanel messages={messages} isAnalyzing={isAnalyzing} onUpload={handleUpload} />
            </div>
          </div>

          {/* 右側：資源監控 */}
          <div className="absolute right-4 top-16 w-[300px] z-10 flex flex-col gap-4 animate-in fade-in slide-in-from-right-10 duration-700">
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
