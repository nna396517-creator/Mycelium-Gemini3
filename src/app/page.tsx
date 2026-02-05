// src/app/page.tsx
'use client';

import { useState } from 'react';
import MapCanvas from '@/components/MapCanvas';
import CommandPanel from '@/components/CommandPanel';
import { AnalysisResult, Message } from '@/lib/types';
import { DEMO_SCENARIO } from '@/data/mockScenarios';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentScenario, setCurrentScenario] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 核心功能：處理圖片上傳
  const handleUpload = async (file: File) => {
    // 1. 馬上把用戶傳的照片秀在對話框
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: '分析此區域災情，並分派任務。',
      attachmentUrl: URL.createObjectURL(file)
    };
    setMessages(prev => [...prev, userMsg]);
    setIsAnalyzing(true);

    // 2. 模擬 Gemini 思考 (3秒後回傳結果)
    setTimeout(() => {
      setIsAnalyzing(false);
      setCurrentScenario(DEMO_SCENARIO); // 觸發地圖紅點
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: DEMO_SCENARIO.situationSummary, // 來自 mockScenarios 的分析文字
        analysis: DEMO_SCENARIO
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 3000);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-zinc-950">
      
      {/* 1. 底層：全螢幕地圖 */}
      <div className="absolute inset-0 z-0">
        <MapCanvas scenario={currentScenario} />
      </div>

      {/* 2. 浮動介面：左側控制台 */}
      <div className="absolute left-4 top-4 bottom-4 w-[400px] z-10 flex flex-col gap-4">
        {/* Header 卡片 */}
        <div className="p-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Mycelium 菌絲體網絡
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Gemini 3 分散式韌性系統 | 連線穩定
          </p>
        </div>

        {/* 聊天與指令區 */}
        <div className="flex-1 overflow-hidden rounded-xl border border-white/10 shadow-2xl">
          <CommandPanel 
            messages={messages} 
            isAnalyzing={isAnalyzing} 
            onUpload={handleUpload} 
          />
        </div>
      </div>

    </main>
  );
}
