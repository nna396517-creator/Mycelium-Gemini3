// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import MapCanvas from '@/components/MapCanvas';
import CommandPanel from '@/components/CommandPanel';
import AuthOverlay from '@/components/AuthOverlay';
import { AnalysisResult, Message, ReportingFormData } from '@/lib/types';
import { SCENARIO_DATABASE, DEFAULT_SCENARIO } from '@/data/demoScenarios';
import { Activity, Signal, Battery, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import UserProfile from '@/components/UserProfile';
import { cn } from '@/lib/utils';

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
  
  // 暫存上傳的檔案名稱，用於後續分析選擇劇本
  const [pendingFileName, setPendingFileName] = useState<string | null>(null);

  // [修正] 強制轉型 t 為 any
  const { t: rawT, language } = useLanguage(); 
  const t = rawT as any;

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

  const [hoveredPoint, setHoveredPoint] = useState<RiskDataPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<number>(0);

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

  const getAIResponse = (input: string): string => {
    const text = input.toLowerCase();
    
    if (text.includes("cpr") || text.includes("心肺復甦")) {
      if (text.includes("how") || text.includes("step")) {
        return "**🚑 CPR Steps:**\n\n1. **Check Safety**: Ensure environment is safe.\n2. **Check Responsiveness**: Tap shoulders and shout.\n3. **Call 911**: Get AED.\n4. **Compressions**: Push hard and fast in center of chest (100-120/min).\n5. **Airway**: Tilt head, lift chin.\n6. **Breaths**: Give 2 rescue breaths.\n\n*Continue until help arrives.*";
      }
      return "**🚑 CPR 急救步驟指南：**\n\n1. **確認環境安全**：確保自己與患者不處於危險中。\n2. **叫**：拍打雙肩，確認患者意識。\n3. **叫**：指定旁人撥打 119 並取得 AED。\n4. **C (Compressions)**：胸外按壓，速率 100-120 下/分，深度 5-6 公分。\n5. **A (Airway)**：暢通呼吸道 (壓額抬下巴)。\n6. **B (Breathing)**：人工呼吸 (若不願意可持續按壓)。\n\n*持續操作直到醫護人員抵達。*";
    }
    
    if (text.includes("滅火") || text.includes("火災") || text.includes("fire") || text.includes("extinguisher")) {
      if (text.includes("fire") || text.includes("extinguisher")) {
         return "**🔥 Fire Extinguisher (PASS):**\n\n1. **Pull** the pin.\n2. **Aim** at the base of fire.\n3. **Squeeze** the lever.\n4. **Sweep** side to side.\n\n*Warning: Evacuate if fire is larger than a wastebasket.*";
      }
      return "**🔥 滅火器操作口訣 (拉、瞄、壓、掃)：**\n\n1. **拉**：拉開安全插梢。\n2. **瞄**：握住噴管，瞄準火源底部。\n3. **壓**：用力壓下握把。\n4. **掃**：向火源底部左右掃射。\n\n*注意：若火勢超過腰部高度，請立即放棄滅火並逃生。*";
    }
    
    if (text.includes("地震") || text.includes("躲") || text.includes("earthquake") || text.includes("shake")) {
      if (text.includes("earthquake")) {
        return "**🏚️ Earthquake Safety (Drop, Cover, Hold on):**\n\n1. **Drop** to your hands and knees.\n2. **Cover** your head and neck under a sturdy table.\n3. **Hold on** until shaking stops.\n\n*Do not run outside during shaking.*";
      }
      return "**🏚️ 地震避難三步驟 (DCH)：**\n\n1. **趴下 (Drop)**：降低重心，避免跌倒。\n2. **掩護 (Cover)**：躲在堅固桌下，保護頭部頸部。\n3. **穩住 (Hold on)**：抓住桌腳，隨桌子移動。\n\n*切記：不要急著衝出門外，注意掉落物。*";
    }
    
    if (text.includes("水災") || text.includes("淹水") || text.includes("flood") || text.includes("water")) {
      if (text.includes("flood") || text.includes("water")) {
        return "**🌊 Flood Response:**\n\n1. Move to higher ground immediately.\n2. Turn off utilities (gas/power) to prevent fires.\n3. Do not walk or drive through floodwaters.\n4. Prepare emergency kit.";
      }
      return "**🌊 水災應變措施：**\n\n1. 迅速往高處移動 (二樓以上)。\n2. 關閉瓦斯與電源總開關，避免觸電或氣爆。\n3. 準備三日份乾糧與飲用水。\n4. 若受困車內且水淹過輪胎，應立即棄車逃生。";
    }
    
    if (text.includes("避難包") || text.includes("kit") || text.includes("supplies")) {
      if (text.includes("kit") || text.includes("supplies")) {
        return "**🎒 Emergency Kit Checklist:**\n\n1. **Water & Food**: 3-day supply (non-perishable).\n2. **First Aid**: Bandages, antiseptics, meds.\n3. **Tools**: Flashlight (extra batteries), whistle, multi-tool.\n4. **Documents**: ID copies, cash, map.\n5. **Warmth**: Blanket, rain poncho.";
      }
      return "**🎒 緊急避難包建議清單：**\n\n1. **水與食物**：每人 3 公升水、能量棒、罐頭。\n2. **保暖與衣物**：輕便雨衣、暖暖包、替換衣物。\n3. **醫療用品**：急救箱、個人藥品。\n4. **工具**：手電筒 (含電池)、哨子、瑞士刀、行動電源。\n5. **證件**：身分證影本、現金。";
    }

    return `Command received: "${input}"\nSystem is updating parameters based on your input. Monitoring active sectors.`;
  };

  const selectScenario = (fileName: string): AnalysisResult | null => {
    const name = fileName.toLowerCase();
    
    if (name.includes('fire')) return SCENARIO_DATABASE['fire'];
    if (name.includes('crack')) return SCENARIO_DATABASE['crack']; 
    if (name.includes('collapse') || name.includes('earthquake')) return SCENARIO_DATABASE['earthquake'];
    if (name.includes('flood')) return SCENARIO_DATABASE['flood'];
    if (name.includes('rescue') || name.includes('volunteer')) return SCENARIO_DATABASE['rescue'];
    
    if (name.includes('disaster')) return SCENARIO_DATABASE['fire'];

    return null;
  };

  const handleUpload = async (file: File) => {
    setPendingFileName(file.name);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: t.chat.upload, 
      attachmentUrl: URL.createObjectURL(file)
    };
    setMessages(prev => [...prev, userMsg]);
    setIsAnalyzing(true);
    setIsPanelMinimized(false);

    setTimeout(() => {
        setIsAnalyzing(false);
        const choiceMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: t.reporting.choiceTitle,
            interactive: 'choice'
        };
        setMessages(prev => [...prev, choiceMsg]);
    }, 1500);
  };

  // [修正] 處理點擊選擇後的邏輯：先幫使用者發送訊息，再觸發 AI
  const handleChoiceSelect = (choice: 'report' | 'consult') => {
      
      // 1. 自動幫使用者發送一則對應的訊息
      const userText = choice === 'report' ? t.reporting.btnReport : t.reporting.btnConsult;
      const userMsg: Message = {
         id: Date.now().toString(),
         role: 'user',
         content: userText
      };
      setMessages(prev => [...prev, userMsg]);

      if (choice === 'consult') {
          setIsAnalyzing(true);
          setTimeout(() => {
              setIsAnalyzing(false);
              const matchedScenario = pendingFileName ? selectScenario(pendingFileName) : null;

              if (matchedScenario) {
                setCurrentScenario(matchedScenario);
                
                let newScore = 50;
                if (matchedScenario.riskLevel === 'CRITICAL') newScore = 95;
                else if (matchedScenario.riskLevel === 'HIGH') newScore = 85;
                else if (matchedScenario.riskLevel === 'MODERATE') newScore = 60;

                setRiskHistory(prev => {
                  const newPoint: RiskDataPoint = {
                      score: newScore, 
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      reason: matchedScenario.riskLevel.toLowerCase()
                  };
                  const newHistory = [...prev, newPoint];
                  return newHistory.slice(-10);
                });

                const summary = language === 'zh' 
                  ? matchedScenario.situationSummaryZh 
                  : matchedScenario.situationSummary;

                const aiMsg: Message = {
                  id: Date.now().toString(),
                  role: 'assistant',
                  content: summary, 
                  analysis: matchedScenario
                };
                setMessages(prev => [...prev, aiMsg]);
              
              } else {
                const warning = language === 'zh'
                  ? "⚠️ **影像關聯性警示**\n\n分析顯示此影像未包含可識別的災害特徵（火災、淹水、倒塌）。\n\n系統維持 **待命 (STANDBY)** 狀態。"
                  : "⚠️ **Image Relevance Alert**\n\nAnalysis indicates this image does not contain recognizable disaster patterns (Fire, Flood, Collapse).\n\nSystem maintains **STANDBY** status.";

                const aiMsg: Message = {
                  id: Date.now().toString(),
                  role: 'assistant',
                  content: warning
                };
                setMessages(prev => [...prev, aiMsg]);
              }
          }, 1500);

      } else {
          const formMsg: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: t.reporting.formTitle,
              interactive: 'form'
          };
          setMessages(prev => [...prev, formMsg]);
      }
  };

  const handleFormSubmit = (data: ReportingFormData) => {
      setMessages(prev => prev.map(msg => 
          msg.interactive === 'form' 
            ? { ...msg, interactive: 'form_submitted' as any, formData: data }
            : msg
      ));

      setTimeout(() => {
          const successMsg: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: t.reporting.aiFollowUp 
          };
          setMessages(prev => [...prev, successMsg]);
      }, 500);
  };

  const handleSendMessage = (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };
    setMessages(prev => [...prev, userMsg]);
    setIsPanelMinimized(false);

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      
      const responseText = getAIResponse(text);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText
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
            <span className="text-blue-400 font-bold tracking-widest text-sm md:text-lg whitespace-nowrap">MYCELIUM</span>
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
          {/* 左側指揮面板 */}
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
                onChoiceSelect={handleChoiceSelect} // [新增]
                onFormSubmit={handleFormSubmit}     // [新增]
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
                    
                    {tooltipPos !== null && hoveredPoint && (
                        <div 
                            className="absolute z-20 top-[-40px] -translate-x-1/2 bg-black/90 border border-blue-500/30 text-white text-[10px] p-2 rounded shadow-[0_0_10px_rgba(59,130,246,0.5)] whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-200"
                            style={{ left: `${tooltipPos}%` }}
                        >
                            <div className="font-bold text-blue-400">{hoveredPoint.time}</div>
                            <div className="text-zinc-300">
                                {(t.chart as any)[hoveredPoint.reason] || hoveredPoint.reason}
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

                        {riskHistory.map((pt, i) => {
                            const x = (i / (riskHistory.length - 1)) * 100;
                            const y = 100 - pt.score;
                            const isLast = i === riskHistory.length - 1;
                            const isHovered = hoveredPoint === pt;

                            return (
                                <g key={i}>
                                    <circle 
                                        cx={x} cy={y} r="8" 
                                        fill="transparent" 
                                        className="cursor-crosshair"
                                        onMouseEnter={() => {
                                            setHoveredPoint(pt);
                                            setTooltipPos(x);
                                        }}
                                    />
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
