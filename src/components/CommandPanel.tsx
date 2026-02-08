// src/components/CommandPanel.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, Upload, AlertTriangle, Trash2, Bot, Minus, ChevronUp } from 'lucide-react'; 
import { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/LanguageContext';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAnalyzing]);

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

  return (
    <div className={cn(
      "flex flex-col h-full bg-gradient-to-b from-zinc-900/95 to-black/95 backdrop-blur-2xl text-white border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500",
      
      // [修正重點] 圓角與 Padding 的 RWD 分流
      // Mobile: 貼底，所以上方要圓角 (rounded-t-2xl)，底部直角。需要安全區 Padding。
      "rounded-t-2xl pb-[env(safe-area-inset-bottom)]",
      
      // Desktop: 懸浮，所以全圓角 (rounded-xl)。不需要安全區 Padding。
      "md:rounded-xl md:pb-0",

      // 最小化時，強制移除 padding (讓高度準確為 60px)
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

          {/* 最小化按鈕 */}
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
                  "p-3 rounded-xl text-sm backdrop-blur-md border shadow-lg transition-all",
                  msg.role === 'user' 
                    ? "bg-blue-950/40 border-blue-500/30 text-blue-100 rounded-tr-none shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                    : "bg-zinc-900/60 border-white/10 text-zinc-100 rounded-tl-none shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                )}>
                  {msg.attachmentUrl && (
                    <img src={msg.attachmentUrl} alt="uploaded" className="mb-2 rounded-lg max-h-40 object-cover border border-white/10" />
                  )}
                  
                  <div className="whitespace-pre-wrap leading-relaxed tracking-wide">{msg.content}</div>

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
        <div className="p-3 bg-black/60 border-t border-white/10 backdrop-blur-xl shrink-0 z-10">
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
