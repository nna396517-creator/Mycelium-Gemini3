// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import MapCanvas from '@/components/MapCanvas';
import CommandPanel from '@/components/CommandPanel';
import AuthOverlay from '@/components/AuthOverlay';
import { AnalysisResult, Message } from '@/lib/types';
import { DEMO_SCENARIO } from '@/data/mockScenarios';
import { Activity, Signal, Battery, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import UserProfile from '@/components/UserProfile';
import { cn } from '@/lib/utils';

// 定義圖表數據點的結構
interface RiskDataPoint {
  score: number;
  time: string;
  reason: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentScenario, setCurrentScenario] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);
  const [isRiskDetailsOpen, setIsRiskDetailsOpen] = useState(false);
  const { t } = useLanguage(); 

  // 升級 riskHistory 的資料結構，加入時間與事件
  const [riskHistory, setRiskHistory] = useState<RiskDataPoint[]>([
    { score: 20, time: "09:00", reason: "patrol" },
    { score: 30, time: "09:15", reason: "vibration" },
    { score: 25, time: "09:30", reason: "clear" },
    { score: 40, time: "09:45", reason: "smoke" },
    { score: 35, time: "10:00", reason: "falseAlarm" },
    { score: 50, time: "10:15", reason: "aftershock" },
    { score: 45, time: "10:30", reason: "structure" },
    { score: 60, time: "10:45", reason: "collapse" },
    { score: 55, time: "11:00", reason: "rescue" },
    { score: 65, time: "11:15", reason: "gas" },
  ]);

  // 記錄目前滑鼠指到的資料點
  const [hoveredPoint, setHoveredPoint] = useState<RiskDataPoint | null>(null);
  // 記錄 tooltip 的位置 (X 座標百分比)
  const [tooltipPos, setTooltipPos] = useState<number>(0);

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

    // 模擬 API 呼叫延遲
    setTimeout(() => {
      setIsAnalyzing(false);
      setCurrentScenario(DEMO_SCENARIO);
      
      // 更新圖表時，推入完整的物件資料
      setRiskHistory(prev => {
        const newPoint: RiskDataPoint = {
            score: 89, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reason: "critical" // 使用 key -> 未來可改成 AI 分析的簡述
        };
        const newHistory = [...prev, newPoint];
        return newHistory.slice(-10);
      });

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
              "fixed left-0 w-full z-30 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] flex flex-col",
              "bottom-0", 
              isPanelMinimized ? "h-[60px]" : "h-[45dvh]",
              "md:left-4 md:w-[400px] md:top-16 md:bottom-auto",
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
            
              {/* LOCAL RISK INDEX 卡片 */}
            <div className="p-4 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-zinc-400 text-xs flex items-center gap-2">
                        <Activity size={14} className="text-red-500"/> {t.stats.risk}
                    </h3>
                </div>

                <div className="mb-4 border-b border-white/5 pb-2">
                    <button 
                      onClick={() => setIsRiskDetailsOpen(!isRiskDetailsOpen)}
                      className="flex items-center justify-between w-full text-[10px] text-zinc-500 hover:text-blue-400 transition-colors py-1"
                    >
                        <span className="font-bold tracking-wider">{t.stats.calcWeights}</span>
                        {isRiskDetailsOpen ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                    </button>

                    <div className={cn(
                        "grid transition-all duration-300 ease-in-out overflow-hidden",
                        isRiskDetailsOpen ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0 mt-0"
                    )}>
                        <div className="min-h-0 space-y-2">
                            {[
                                { label: "STRUCTURAL DAMAGE", score: currentScenario?.riskFactors?.structuralDamage || 0 },
                                { label: "HUMAN DANGER", score: currentScenario?.riskFactors?.humanDanger || 0 },
                                { label: "FIRE HAZARD", score: currentScenario?.riskFactors?.fireHazard || 0 },
                            ].map((factor, idx) => (
                                <div key={idx} className="flex justify-between items-center text-[10px]">
                                    <span className="text-zinc-400">{factor.label}</span>
                                    <span className="font-mono text-white">{factor.score}</span>
                                </div>
                            ))}
                            
                            <div className="pt-1 text-[9px] text-zinc-600 italic font-mono">
                                * Weights: Human(50%) + Structure(30%) + Fire(20%)
                            </div>
                        </div>
                    </div>
                </div>

                {/* SVG 折線趨勢圖 */}
                <div className="relative h-24 w-full mb-1 group" onMouseLeave={() => setHoveredPoint(null)}>
                    
                    {/* Tooltip 資訊框 */}
                    {hoveredPoint && (
                        <div 
                            className="absolute z-20 top-[-40px] -translate-x-1/2 bg-black/90 border border-blue-500/30 text-white text-[10px] p-2 rounded shadow-[0_0_10px_rgba(59,130,246,0.5)] whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-200"
                            style={{ left: `${tooltipPos}%` }}
                        >
                            <div className="font-bold text-blue-400">{hoveredPoint.time}</div>
                            
                            <div className="text-zinc-300">
                                {(t as any).chart?.[hoveredPoint.reason] || hoveredPoint.reason}
                            </div>
                            
                            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-blue-500/30 rotate-45"></div>
                        </div>
                    )}

                    <div className="absolute inset-0 grid grid-cols-4 gap-4 opacity-20 pointer-events-none">
                        <div className="border-r border-dashed border-zinc-600"></div>
                        <div className="border-r border-dashed border-zinc-600"></div>
                        <div className="border-r border-dashed border-zinc-600"></div>
                    </div>
                    <div className="absolute inset-0 grid grid-rows-2 gap-4 opacity-20 pointer-events-none">
                        <div className="border-b border-dashed border-zinc-600"></div>
                    </div>

                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        
                        <path 
                            d={`
                              M 0 100 
                              ${riskHistory.map((pt, i) => `L ${(i / (riskHistory.length - 1)) * 100} ${100 - pt.score}`).join(' ')} 
                              L 100 100 Z
                            `}
                            fill="url(#lineGradient)"
                            className="transition-all duration-500 ease-in-out"
                        />

                        <polyline
                            points={riskHistory.map((pt, i) => `${(i / (riskHistory.length - 1)) * 100},${100 - pt.score}`).join(' ')}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-all duration-500 ease-in-out drop-shadow-[0_0_4px_rgba(59,130,246,0.8)]"
                        />

                        {/* 互動節點 (透明感應區 + 懸浮效果) */}
                        {riskHistory.map((pt, i) => {
                            const x = (i / (riskHistory.length - 1)) * 100;
                            const y = 100 - pt.score;
                            const isLast = i === riskHistory.length - 1;
                            const isHovered = hoveredPoint === pt;

                            return (
                                <g key={i}>
                                    {/* 透明的大圓圈，用來增加滑鼠感應範圍 */}
                                    <circle 
                                        cx={x} cy={y} r="8" 
                                        fill="transparent" 
                                        className="cursor-crosshair"
                                        onMouseEnter={() => {
                                            setHoveredPoint(pt);
                                            setTooltipPos(x);
                                        }}
                                    />
                                    {/* 視覺上的小圓點 */}
                                    <circle 
                                        cx={x} cy={y} r={isHovered ? 4 : (isLast ? 3 : 2)}
                                        className={cn(
                                            "transition-all duration-200",
                                            isHovered ? "fill-white stroke-blue-500 stroke-2" : (isLast ? "fill-blue-400 animate-pulse" : "fill-blue-500/50")
                                        )}
                                    />
                                </g>
                            );
                        })}
                    </svg>
                </div>
                
                <div className="flex justify-between items-end">
                    <span className="text-2xl font-bold text-red-500 animate-pulse">
                        {currentScenario?.riskLevel || 'STANDBY'}
                    </span>
                    <div className="text-right">
                        <div className="text-[10px] text-zinc-500 mb-[-2px]">CURRENT</div>
                        {/* 這裡要存取 .score */}
                        <span className="text-2xl font-bold text-red-500">
                            {riskHistory[riskHistory.length - 1].score}%
                        </span>
                    </div>
                </div>
            </div>
            
            {/* RESOURCES 卡片 */}
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
