// src/components/CommandPanel.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Upload, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Message } from '@/lib/types';
import { cn } from '@/lib/utils'; // shadcn 的工具

interface CommandPanelProps {
  messages: Message[];
  isAnalyzing: boolean;
  onUpload: (file: File) => void;
}

export default function CommandPanel({ messages, isAnalyzing, onUpload }: CommandPanelProps) {
  const [input, setInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 訊息自動捲動到底部
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
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-md text-white">
      {/* 訊息顯示區 */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-zinc-400 mt-10 text-sm">
              <p>Gemini 3 災難韌性系統已連線。</p>
              <p>請上傳現場影像以開始分析。</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex flex-col max-w-[90%]", msg.role === 'user' ? "ml-auto items-end" : "items-start")}>
              
              {/* 訊息框本體 */}
              <div className={cn(
                "p-3 rounded-2xl text-sm",
                msg.role === 'user' ? "bg-blue-600 text-white" : "bg-zinc-800/80 border border-white/10 text-zinc-100"
              )}>
                {/* 如果有圖片附件 */}
                {msg.attachmentUrl && (
                  <img src={msg.attachmentUrl} alt="uploaded" className="mb-2 rounded-lg max-h-40 object-cover border border-white/20" />
                )}
                
                {/* 文字內容 */}
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* 如果這則訊息包含 AI 分析結果，顯示特殊的分析卡片 */}
                {msg.analysis && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-red-400 font-bold">
                      <AlertTriangle size={16} />
                      風險等級: {msg.analysis.riskLevel}
                    </div>
                    <div className="space-y-1">
                      {msg.analysis.suggestedTasks.map(task => (
                        <div key={task.id} className="flex items-center gap-2 text-xs bg-black/30 p-2 rounded border border-white/5">
                          <CheckCircle2 size={12} className="text-green-500" />
                          <span className="font-mono text-blue-300">[{task.role}]</span>
                          <span>{task.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* AI 思考中的動畫 */}
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-zinc-400 text-xs animate-pulse">
              <Loader2 className="animate-spin" size={14} />
              Gemini 3 正在進行多模態推理...
            </div>
          )}
        </div>
      </ScrollArea>

      {/* 底部輸入區 */}
      <div className="p-3 border-t border-white/10 bg-black/60">
        <div className="flex gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button 
            variant="outline" 
            size="icon" 
            className="shrink-0 bg-transparent border-white/20 hover:bg-white/10 text-white"
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
          >
            <Upload size={18} />
          </Button>
          
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="輸入現場指令..." 
            className="bg-transparent border-white/20 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && input) {
                // 這裡目前還沒寫純文字發送邏輯，Demo 先主打圖片上傳
                setInput('');
              }
            }}
          />
          
          <Button size="icon" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
