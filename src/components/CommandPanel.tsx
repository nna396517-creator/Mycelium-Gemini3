// src/components/CommandPanel.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Upload, AlertTriangle, CheckCircle2, Mic } from 'lucide-react';
import { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/LanguageContext';

interface CommandPanelProps {
  messages: Message[];
  isAnalyzing: boolean;
  onUpload: (file: File) => void;
}

export default function CommandPanel({ messages, isAnalyzing, onUpload }: CommandPanelProps) {
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

  return (
    // 外框：加入更強的漸層邊框感與毛玻璃
    <div className="flex flex-col h-full bg-gradient-to-b from-zinc-900/90 to-black/90 backdrop-blur-xl text-white border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      
      {/* 頂部裝飾條 (Tech Header) */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 opacity-50" />

      {/* 訊息顯示區 */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-6">
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
              
              {/* 角色標籤 */}
              <span className={cn(
                "text-[10px] mb-1 font-mono tracking-wider opacity-70",
                msg.role === 'user' ? "text-blue-400" : "text-green-400"
              )}>
                {msg.role === 'user' ? 'COMMANDER' : 'GEMINI-3 AI'}
              </span>

              {/* 訊息框本體：高科技樣式 */}
              <div className={cn(
                "p-3 rounded-xl text-sm backdrop-blur-md border shadow-lg transition-all",
                msg.role === 'user' 
                  ? "bg-blue-950/40 border-blue-500/30 text-blue-100 rounded-tr-none shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                  : "bg-zinc-900/60 border-white/10 text-zinc-100 rounded-tl-none shadow-[0_0_15px_rgba(255,255,255,0.05)]"
              )}>
                {msg.attachmentUrl && (
                  <div className="relative mb-3 group">
                     <img src={msg.attachmentUrl} alt="uploaded" className="rounded-lg border border-white/10 max-h-40 object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end p-2">
                        <span className="text-[10px] font-mono text-white">IMG_SOURCE_RAW</span>
                     </div>
                  </div>
                )}
                
                <div className="whitespace-pre-wrap leading-relaxed tracking-wide">{msg.content}</div>

                {/* AI 分析結果卡片 */}
                {msg.analysis && (
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-3">
                    <div className="flex items-center gap-2 text-red-400 font-bold bg-red-950/30 p-2 rounded border border-red-500/20">
                      <AlertTriangle size={16} className="animate-pulse" />
                      <span className="text-xs tracking-widest">{t.stats.risk}: {msg.analysis.riskLevel}</span>
                    </div>
                    <div className="grid gap-2">
                      {msg.analysis.suggestedTasks.map((task, i) => (
                        <div key={task.id} 
                             className="flex items-start gap-3 p-2 rounded bg-black/40 border border-white/5 hover:border-blue-500/30 hover:bg-blue-900/10 transition-colors group">
                          <div className="mt-0.5 text-blue-500/50 group-hover:text-blue-400 font-mono text-[10px]">0{i+1}</div>
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
              <div className="relative">
                <Loader2 className="animate-spin" size={16} />
                <div className="absolute inset-0 blur-sm bg-cyan-400/50 animate-pulse" />
              </div>
              <span className="font-mono tracking-widest">{t.chat.analyzing}</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* 底部輸入區：更像控制台 */}
      <div className="p-3 bg-black/80 border-t border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-lg border border-white/10 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
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
            className="shrink-0 text-zinc-400 hover:text-cyan-400 hover:bg-cyan-950/30"
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            title={t.chat.upload}
          >
            <Upload size={18} />
          </Button>
          
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder={t.chat.placeholder} 
            className="border-none bg-transparent text-white placeholder:text-zinc-600 focus-visible:ring-0 px-2 h-9 font-mono text-sm"
            onKeyDown={(e) => e.key === 'Enter' && setInput('')}
          />
          
          <Button size="icon" className="h-8 w-8 bg-blue-600 hover:bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]">
            <Send size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
