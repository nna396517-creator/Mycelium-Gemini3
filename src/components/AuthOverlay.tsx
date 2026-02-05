// src/components/AuthOverlay.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Fingerprint, Lock, ShieldCheck, Loader2, Globe } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { cn } from '@/lib/utils';

interface AuthOverlayProps {
  onLogin: () => void;
}

export default function AuthOverlay({ onLogin }: AuthOverlayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { t } = useLanguage();

  const handleLogin = () => {
    setIsLoading(true);
    
    // 模擬驗證過程 (1.5秒)
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // 顯示成功狀態 0.5秒後進入系統
      setTimeout(() => {
        onLogin();
      }, 800);
    }, 1500);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm">
      {/* 背景動態裝飾 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] animate-pulse" />
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* 登入卡片 */}
      <div className="relative w-full max-w-md p-8 bg-black/60 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl">
        
        {/* 頂部圖示 */}
        <div className="flex justify-center mb-8">
          <div className={cn(
            "p-4 rounded-full border-2 transition-all duration-500",
            isSuccess ? "bg-green-500/20 border-green-500 text-green-500" : "bg-blue-500/10 border-blue-500/50 text-blue-400"
          )}>
            {isSuccess ? <ShieldCheck size={48} /> : <Fingerprint size={48} />}
          </div>
        </div>

        {/* 標題 */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-2xl font-bold tracking-widest text-white">
            {t.auth.title}
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            {t.auth.subtitle}
          </p>
        </div>

        {/* 表單區域 */}
        <div className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder={t.auth.idPlaceholder}
              className="pl-9 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-blue-500"
              disabled={isLoading || isSuccess}
            />
          </div>

          <Button 
            className={cn(
              "w-full h-12 font-bold tracking-wider transition-all duration-300",
              isSuccess 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
            onClick={handleLogin}
            disabled={isLoading || isSuccess}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} /> {t.auth.verifying}
              </span>
            ) : isSuccess ? (
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} /> {t.auth.success}
              </span>
            ) : (
              t.auth.connect
            )}
          </Button>
        </div>

        {/* 底部裝飾字 */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-zinc-600 font-mono">
            SECURE CONNECTION :: ENCRYPTED VIA GEMINI-3
          </p>
        </div>
      </div>
    </div>
  );
}
