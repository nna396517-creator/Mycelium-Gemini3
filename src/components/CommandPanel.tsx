// src/components/CommandPanel.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, Upload, AlertTriangle, Trash2, Bot, Minus, ChevronUp, ChevronRight, ChevronLeft, AArrowUp, AArrowDown, MapPin, ClipboardList, Stethoscope } from 'lucide-react';
import { Message, ReportingFormData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/LanguageContext';

const FONT_SIZES = [
  "text-xs md:text-sm", 
  "text-sm md:text-base", 
  "text-base md:text-lg",
  "text-lg md:text-xl"
];

// Markdown 渲染引擎
const MarkdownRenderer = ({ content, fontSizeClass }: { content: string, fontSizeClass: string }) => {
  if (!content) return null;

  const renderInline = (text: string): React.ReactNode[] => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|==[^=]+==|__[^_]+__|\*[^*]+\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="mx-1 px-1.5 py-0.5 rounded bg-zinc-800 text-red-300 font-mono text-[0.9em] border border-white/10">{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-blue-300 drop-shadow-[0_0_5px_rgba(59,130,246,0.3)]">{renderInline(part.slice(2, -2))}</strong>;
      }
      if (part.startsWith('==') && part.endsWith('==')) {
        return <span key={index} className="mx-0.5 px-1 rounded bg-yellow-500/20 text-yellow-200 border border-yellow-500/30">{renderInline(part.slice(2, -2))}</span>;
      }
      if (part.startsWith('__') && part.endsWith('__')) {
        return <u key={index} className="underline decoration-blue-500 decoration-2 underline-offset-4">{renderInline(part.slice(2, -2))}</u>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index} className="italic text-zinc-300 mr-0.5">{renderInline(part.slice(1, -1))}</em>;
      }
      return part;
    });
  };

  const lines = content.split('\n');

  return (
    <div className={cn("space-y-1.5 leading-relaxed text-zinc-100", fontSizeClass)}>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-2" />;

        const hMatch = line.match(/^(#{1,5})\s+(.+)/);
        if (hMatch) {
          const level = hMatch[1].length;
          const text = hMatch[2];
          const styles = {
            1: "text-[1.8em] font-bold text-blue-200 mt-6 mb-3 border-b border-blue-500/30 pb-2",
            2: "text-[1.5em] font-bold text-blue-300 mt-5 mb-2",
            3: "text-[1.3em] font-bold text-cyan-300 mt-4 mb-2",
            4: "text-[1.1em] font-bold text-cyan-400 mt-3 mb-1",
            5: "text-[1em] font-bold text-zinc-300 mt-2 mb-1 uppercase tracking-wider",
          }[level];
          return <div key={index} className={styles}>{renderInline(text)}</div>;
        }

        if (/^[\*\-]\s/.test(trimmed)) {
          return (
            <div key={index} className="flex gap-2 pl-2">
              <span className="text-blue-500 mt-[0.6em] w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              <div className="flex-1">{renderInline(trimmed.replace(/^[\*\-]\s/, ''))}</div>
            </div>
          );
        }
        
        const numMatch = trimmed.match(/^(\d+)\.\s(.+)/);
        if (numMatch) {
          return (
            <div key={index} className="flex gap-2 pl-2">
              <span className="font-mono text-blue-400 font-bold shrink-0">{numMatch[1]}.</span>
              <div className="flex-1">{renderInline(numMatch[2])}</div>
            </div>
          );
        }
        
        const alphaMatch = trimmed.match(/^([a-zA-Z])\.\s(.+)/);
        if (alphaMatch) {
          return (
            <div key={index} className="flex gap-2 pl-6">
              <span className="font-mono text-cyan-400 shrink-0">{alphaMatch[1]}.</span>
              <div className="flex-1">{renderInline(alphaMatch[2])}</div>
            </div>
          );
        }
        
        const romanMatch = trimmed.match(/^([ivxIVX]+)\.\s(.+)/);
        if (romanMatch) {
          return (
            <div key={index} className="flex gap-2 pl-8">
              <span className="font-mono text-zinc-400 italic shrink-0">{romanMatch[1]}.</span>
              <div className="flex-1">{renderInline(romanMatch[2])}</div>
            </div>
          );
        }

        return <div key={index} className="min-h-[1.5em]">{renderInline(line)}</div>;
      })}
    </div>
  );
};

// 內部表單元件
const ReportingForm = ({ onSubmit, t }: { onSubmit: (data: ReportingFormData) => void, t: any }) => {
    const [formData, setFormData] = useState<ReportingFormData>({
        damageItem: 'residential',
        disasterType: 'fire',
        description: '',
        needs: ''
    });
    const [locating, setLocating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetLocation = () => {
        setLocating(true);
        setError(null);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setFormData(prev => ({
                    ...prev,
                    location: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                }));
                setLocating(false);
            }, (error) => {
                console.error("Error getting location", error);
                setLocating(false);
                setFormData(prev => ({ ...prev, location: { lat: 25.0330, lng: 121.5654 } }));
            });
        } else {
            setLocating(false);
        }
    };

    const handleSubmit = () => {
        if (!formData.location) {
            setError(t.reporting.errorLocation);
            return;
        }
        onSubmit(formData);
    };

    return (
        <div className="bg-black/40 border border-white/10 rounded-lg p-3 space-y-3 mt-2 text-sm animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-2">
                <ClipboardList size={16} className="text-yellow-400"/>
                <span className="font-bold text-zinc-300">{t.reporting.formTitle}</span>
            </div>

            {/* 1. 地理位置 (必填) */}
            <div className="space-y-1">
                <label className="text-xs text-zinc-400 block flex justify-between">
                    {t.reporting.location}
                    <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                    <div className={cn(
                        "flex-1 border rounded px-2 py-1.5 text-zinc-300 font-mono text-xs flex items-center transition-colors",
                        formData.location ? "bg-zinc-900/50 border-green-500/30 text-green-400" : "bg-zinc-900/50 border-white/10"
                    )}>
                        {formData.location 
                            ? `${formData.location.lat.toFixed(4)}, ${formData.location.lng.toFixed(4)}` 
                            : <span className="text-zinc-600">Waiting for GPS...</span>}
                    </div>
                    <Button 
                        size="sm" variant="outline" 
                        className={cn(
                            "h-8 transition-colors",
                            formData.location ? "border-green-500/30 text-green-400 hover:bg-green-500/20" : "border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                        )}
                        onClick={handleGetLocation}
                        disabled={locating}
                    >
                        {locating ? <Loader2 className="animate-spin" size={14}/> : <MapPin size={14}/>}
                        <span className="ml-1 text-xs">{t.reporting.getLocation}</span>
                    </Button>
                </div>
            </div>

            {/* 2. 受損項目 (必填) */}
            <div className="space-y-1">
                <label className="text-xs text-zinc-400 block flex justify-between">
                    {t.reporting.damageItem}
                    <span className="text-red-500">*</span>
                </label>
                <select 
                    className="w-full bg-zinc-900/80 border border-white/10 rounded px-2 py-1.5 text-zinc-200 outline-none focus:border-blue-500/50"
                    value={formData.damageItem}
                    onChange={(e) => setFormData({...formData, damageItem: e.target.value})}
                >
                    <option value="residential">{t.reporting.damageOptions.residential}</option>
                    <option value="public">{t.reporting.damageOptions.public}</option>
                    <option value="terrain">{t.reporting.damageOptions.terrain}</option>
                    <option value="coast">{t.reporting.damageOptions.coast}</option>
                    <option value="road">{t.reporting.damageOptions.road}</option>
                    <option value="transport">{t.reporting.damageOptions.transport}</option>
                </select>
            </div>

            {/* 3. 災害類型 (必填) */}
            <div className="space-y-1">
                <label className="text-xs text-zinc-400 block flex justify-between">
                    {t.reporting.disasterType}
                    <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 pt-1">
                    {['fire', 'flood', 'other'].map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer group">
                            <input 
                                type="radio" 
                                name="disasterType"
                                value={type}
                                checked={formData.disasterType === type}
                                onChange={(e) => setFormData({...formData, disasterType: e.target.value})}
                                className="accent-blue-500"
                            />
                            <span className={cn(
                                "text-xs group-hover:text-white transition-colors",
                                formData.disasterType === type ? "text-blue-400 font-bold" : "text-zinc-400"
                            )}>{(t.reporting.disasterOptions as any)[type]}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* 4. 補充說明 */}
            <div className="space-y-1">
                <label className="text-xs text-zinc-400 block">{t.reporting.desc}</label>
                <textarea 
                    className="w-full bg-zinc-900/80 border border-white/10 rounded px-2 py-1.5 text-zinc-200 outline-none focus:border-blue-500/50 h-16 resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
            </div>

            {/* 5. 物資需求 */}
            <div className="space-y-1">
                <label className="text-xs text-zinc-400 block">{t.reporting.needs}</label>
                <input 
                    className="w-full bg-zinc-900/80 border border-white/10 rounded px-2 py-1.5 text-zinc-200 outline-none focus:border-blue-500/50"
                    value={formData.needs}
                    onChange={(e) => setFormData({...formData, needs: e.target.value})}
                />
            </div>

            {error && (
                <div className="text-xs text-red-400 font-bold flex items-center justify-center gap-2 animate-pulse">
                    <AlertTriangle size={12}/> {error}
                </div>
            )}

            <Button 
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-white mt-2"
                onClick={handleSubmit}
            >
                {t.reporting.submit}
            </Button>
        </div>
    );
}

interface CommandPanelProps {
  messages: Message[];
  isAnalyzing: boolean;
  onUpload: (file: File) => void;
  onClear: () => void;
  onSendMessage: (text: string) => void;
  onChoiceSelect: (choice: 'report' | 'consult') => void;
  onFormSubmit: (data: ReportingFormData) => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

export default function CommandPanel({ 
  messages, 
  isAnalyzing, 
  onUpload, 
  onClear, 
  onSendMessage,
  onChoiceSelect,
  onFormSubmit,
  isMinimized,
  onToggleMinimize 
}: CommandPanelProps) {
  const [input, setInput] = useState('');
  const [fontLevel, setFontLevel] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const suggestionsScrollRef = useRef<HTMLDivElement>(null);
  
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const { t: rawT } = useLanguage();
  const t = rawT as any;

  const SUGGESTED_QUERIES = [
    { label: t.suggested.cprLabel, value: t.suggested.cprValue },
    { label: t.suggested.fireLabel, value: t.suggested.fireValue },
    { label: t.suggested.quakeLabel, value: t.suggested.quakeValue },
    { label: t.suggested.floodLabel, value: t.suggested.floodValue },
    { label: t.suggested.kitLabel, value: t.suggested.kitValue },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAnalyzing]);

  const checkScroll = () => {
    if (suggestionsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = suggestionsScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
      // [修正] 重置 input 值，解決無法重複上傳同一張照片的問題
      e.target.value = '';
    }
  };

  const handleSend = () => {
    if (!input.trim() || isAnalyzing) return;
    onSendMessage(input);
    setInput('');
  };

  const handleScrollRight = () => {
    if (suggestionsScrollRef.current) {
      suggestionsScrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleScrollLeft = () => {
    if (suggestionsScrollRef.current) {
      suggestionsScrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-gradient-to-b from-zinc-900/95 to-black/95 backdrop-blur-2xl text-white border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500",
      "rounded-t-2xl pb-[env(safe-area-inset-bottom)]",
      "md:rounded-xl md:pb-0",
      isMinimized && "pb-0 md:pb-0"
    )}>
      
      {/* 頂部標題列 */}
      <div 
        className="flex items-center justify-between px-4 h-[60px] border-b border-white/10 bg-black/40 shrink-0 z-10 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={onToggleMinimize}
      >
        <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-cyan-500/20 text-cyan-400">
              <Bot size={14} />
            </div>
            <span className="text-xs font-bold tracking-widest text-zinc-300">GEMINI-3 COMMAND</span>
        </div>
        
        <div className="flex items-center gap-2">
          
          <div 
            className="flex items-center bg-white/5 rounded-lg border border-white/5 p-0.5"
            onClick={(e) => e.stopPropagation()} 
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10"
              onClick={() => setFontLevel(prev => Math.max(0, prev - 1))}
              disabled={fontLevel === 0}
              title="Smaller Font"
            >
              <AArrowDown size={14} />
            </Button>

            <div className="w-px h-3 bg-white/10 mx-0.5" />

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10"
              onClick={() => setFontLevel(prev => Math.min(FONT_SIZES.length - 1, prev + 1))}
              disabled={fontLevel === FONT_SIZES.length - 1}
              title="Larger Font"
            >
              <AArrowUp size={14} />
            </Button>
          </div>

          <div className="w-px h-3 bg-white/20 mx-1" />

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              title={t.chat.clearHistory}
            >
              <Trash2 size={14} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-blue-400 hover:text-white hover:bg-blue-500/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMinimize();
              }}
            >
              {isMinimized ? (
                <ChevronUp size={16} className="animate-pulse"/> 
              ) : (
                <Minus size={16} className="drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 opacity-50 shrink-0" />

      {/* 內容區域 */}
      <div className={cn("flex-1 flex flex-col min-h-0 transition-opacity duration-300", isMinimized ? "opacity-0 invisible" : "opacity-100 visible")}>
        
        {/* 訊息顯示區 */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-6 overscroll-contain 
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-black/20
          [&::-webkit-scrollbar-thumb]:bg-blue-500/20 
          [&::-webkit-scrollbar-thumb]:rounded-none 
          [&::-webkit-scrollbar-thumb]:border-[0.5px] 
          [&::-webkit-scrollbar-thumb]:border-blue-400/30
          hover:[&::-webkit-scrollbar-thumb]:bg-blue-500/50
          " 
          ref={scrollRef}
        >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center mt-10 opacity-50 space-y-4">
                <div className="w-16 h-16 rounded-full border border-blue-500/30 flex items-center justify-center animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10" />
                </div>
                <div className="text-center text-xs font-mono text-cyan-200/70 whitespace-pre-line leading-relaxed">
                  {t.chat.welcome}
                </div>
              </div>
            )}
            
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex flex-col max-w-[95%]", msg.role === 'user' ? "ml-auto items-end" : "items-start")}>
                <span className={cn(
                  "text-[10px] mb-1 font-mono tracking-wider opacity-70",
                  msg.role === 'user' ? "text-blue-400" : "text-green-400"
                )}>
                  {msg.role === 'user' ? 'COMMANDER' : 'GEMINI-3 AI'}
                </span>

                <div className={cn(
                  "p-3 rounded-xl backdrop-blur-md border shadow-lg transition-all",
                  FONT_SIZES[fontLevel], // 套用動態字體
                  msg.role === 'user' 
                    ? "bg-blue-950/40 border-blue-500/30 text-blue-100 rounded-tr-none shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                    : "bg-zinc-900/60 border-white/10 text-zinc-100 rounded-tl-none shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                )}>
                  {msg.attachmentUrl && (
                    <img src={msg.attachmentUrl} alt="uploaded" className="mb-2 rounded-lg max-h-40 object-cover border border-white/10" />
                  )}
                  
                  <MarkdownRenderer content={msg.content} fontSizeClass={FONT_SIZES[fontLevel]} />
                  
                  {/* 互動選擇按鈕 */}
                  {msg.interactive === 'choice' && (
                    <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-white/10">
                        <Button 
                            className="bg-red-900/40 border border-red-500/50 hover:bg-red-800/50 text-red-200 justify-start"
                            onClick={() => onChoiceSelect('report')}
                        >
                            <ClipboardList className="mr-2 h-4 w-4" />
                            {t.reporting.btnReport}
                        </Button>
                        <Button 
                            className="bg-blue-900/40 border border-blue-500/50 hover:bg-blue-800/50 text-blue-200 justify-start"
                            onClick={() => onChoiceSelect('consult')}
                        >
                            <Stethoscope className="mr-2 h-4 w-4" />
                            {t.reporting.btnConsult}
                        </Button>
                    </div>
                  )}

                  {/* 表單 */}
                  {msg.interactive === 'form' && (
                    <ReportingForm onSubmit={onFormSubmit} t={t} />
                  )}

                  {/* 表單提交成功 */}
                  {msg.interactive === 'form_submitted' && (
                    <div className="mt-2 p-2 bg-green-900/20 border border-green-500/30 rounded text-green-300 text-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        {t.reporting.submitted}
                    </div>
                  )}
                  
                  {msg.analysis && (
                    <div className="mt-4 pt-3 border-t border-white/10 space-y-3">
                      <div className="flex items-center gap-2 text-red-400 font-bold bg-red-950/30 p-2 rounded border border-red-500/20">
                        <AlertTriangle size={16} className="animate-pulse" />
                        <span className="text-xs tracking-widest">{t.stats.risk}: {msg.analysis.riskLevel}</span>
                      </div>
                      <div className="grid gap-2">
                        {msg.analysis.suggestedTasks.map((task, i) => (
                          <div key={task.id} 
                               className="flex items-start gap-3 p-2 rounded bg-black/40 border border-white/5 hover:border-blue-500/30 transition-colors">
                            <div className="mt-0.5 text-blue-500/50 font-mono text-[10px]">0{i+1}</div>
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded border font-mono", 
                                      task.role === 'RESCUER' ? "border-red-500/30 text-red-400 bg-red-500/10" :
                                      task.role === 'MEDIC' ? "border-green-500/30 text-green-400 bg-green-500/10" :
                                      "border-yellow-500/30 text-yellow-400 bg-yellow-500/10"
                                  )}>
                                      {task.role}
                                  </span>
                                </div>
                                <span className="text-xs text-zinc-300">{task.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isAnalyzing && (
              <div className="flex items-center gap-3 text-cyan-400/80 text-xs animate-pulse p-2">
                <Loader2 className="animate-spin" size={16} />
                <span className="font-mono tracking-widest">{t.chat.analyzing}</span>
              </div>
            )}
        </div>

        {/* 底部輸入區 */}
        <div className="p-3 bg-black/60 border-t border-white/10 backdrop-blur-xl shrink-0 z-10 flex flex-col gap-2">
          
          {/* 浮動建議按鈕列 */}
          <div className="relative group">
             
             {canScrollLeft && (
                <div className="hidden md:flex absolute left-0 top-0 bottom-1 w-16 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none items-center justify-start pl-1 z-20 animate-in fade-in duration-300">
                    <button 
                       onClick={handleScrollLeft}
                       className="pointer-events-auto p-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500 hover:text-white hover:shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all active:scale-90"
                    >
                       <ChevronLeft size={14} />
                    </button>
                </div>
             )}

             {/* 建議列表容器 */}
             <div 
               ref={suggestionsScrollRef}
               onScroll={checkScroll} 
               className="flex gap-2 overflow-x-auto pt-4 pb-2 px-1 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
             >
                {canScrollLeft && <div className="w-6 shrink-0 md:hidden"></div>}
                
                {SUGGESTED_QUERIES.map((q, i) => (
                   <button
                     key={i}
                     onClick={() => onSendMessage(q.value)}
                     disabled={isAnalyzing}
                     className={cn(
                       "shrink-0 px-4 py-2 rounded-full text-xs md:text-sm font-mono transition-all duration-300",
                       "bg-gradient-to-br from-blue-950/80 to-black/80",
                       "border border-blue-400/30 text-cyan-100/80",
                       "hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:border-blue-400/80 hover:text-white",
                       "active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                     )}
                   >
                     {q.label}
                   </button>
                ))}
                
                <div className="w-8 shrink-0 md:w-12"></div>
             </div>

             {canScrollRight && (
                <div className="hidden md:flex absolute right-0 top-0 bottom-1 w-16 bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none items-center justify-end pr-1 z-20 animate-in fade-in duration-300">
                    <button 
                       onClick={handleScrollRight}
                       className="pointer-events-auto p-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500 hover:text-white hover:shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all active:scale-90"
                    >
                       <ChevronRight size={14} />
                    </button>
                </div>
             )}
          </div>

          <div className="flex items-center gap-2 bg-zinc-900/80 p-1 rounded-lg border border-white/10 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0 text-zinc-400 hover:text-cyan-400"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
            >
              <Upload size={18} />
            </Button>
            
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder={t.chat.placeholder} 
              className="border-none bg-transparent text-white placeholder:text-zinc-600 focus-visible:ring-0 px-2 h-9 font-mono text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            
            <Button 
              size="icon" 
              className="h-8 w-8 bg-blue-600 hover:bg-blue-500 transition-colors"
              onClick={handleSend}
              disabled={!input.trim() || isAnalyzing}
            >
              <Send size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
