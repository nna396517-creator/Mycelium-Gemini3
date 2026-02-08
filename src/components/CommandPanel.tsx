// src/components/CommandPanel.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, Upload, AlertTriangle, Trash2, Bot, Minus, ChevronUp, ChevronRight, ChevronLeft, AArrowUp, AArrowDown } from 'lucide-react';
import { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/LanguageContext';

// 字體大小設定檔
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

interface CommandPanelProps {
  messages: Message[];
  isAnalyzing: boolean;
  onUpload: (file: File) => void;
  onClear: () => void;
  onSendMessage: (text: string) => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

export default function CommandPanel({ 
  messages, 
  isAnalyzing, 
  onUpload, 
  onClear, 
  onSendMessage,
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
  
  const { t } = useLanguage();

  // 改用 t.suggested 讀取翻譯，(t as any) 用來繞過尚未更新的型別檢查
  const SUGGESTED_QUERIES = [
    { label: (t as any).suggested.cprLabel, value: (t as any).suggested.cprValue },
    { label: (t as any).suggested.fireLabel, value: (t as any).suggested.fireValue },
    { label: (t as any).suggested.quakeLabel, value: (t as any).suggested.quakeValue },
    { label: (t as any).suggested.floodLabel, value: (t as any).suggested.floodValue },
    { label: (t as any).suggested.kitLabel, value: (t as any).suggested.kitValue },
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
          
          {/* 字體調整區 */}
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

          {/* 功能按鈕區 */}
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
