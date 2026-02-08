// src/components/AuthOverlay.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Fingerprint, Lock, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { cn } from '@/lib/utils';
import ParticleBackground from './ParticleBackground';

interface AuthOverlayProps {
  onLogin: () => void;
}

export default function AuthOverlay({ onLogin }: AuthOverlayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [inputId, setInputId] = useState(''); // 儲存輸入的帳號
  const [error, setError] = useState(false);  // 錯誤狀態
  
  const { t } = useLanguage();

  const handleLogin = () => {
    // 2. 簡單的驗證邏輯：只允許 "admin" (不分大小寫)
    if (inputId.trim().toLowerCase() !== 'admin') {
      setError(true);
      return;
    }

    setError(false);
    setIsLoading(true);
    
    // 模擬驗證過程 (1.5秒)
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // 顯示成功狀態 0.8秒後進入系統
      setTimeout(() => {
        onLogin();
      }, 800);
    }, 1500);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm">
      
      {/* 1. 背景動畫 */}
      <ParticleBackground />

      {/* 專案名稱 */}
      <div className="absolute top-6 left-6 z-50">
        <span className="text-blue-400 font-bold tracking-widest text-sm md:text-lg whitespace-nowrap">
          MYCELIUM
        </span>
      </div>

      {/* 2. 語言切換按鈕 */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageToggle />
      </div>

      {/* 3. 登入卡片容器 */}
      <div className="relative z-10 w-full max-w-md group animate-in fade-in zoom-in-95 duration-500">
        
        {/* RGB 光暈層 */}
        <div 
          className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl blur opacity-30 transition duration-1000 animate-pulse"
          style={{ animationDuration: '3s' }}
        ></div>

        {/* 卡片本體 */}
        <div className="relative w-full p-8 py-12 bg-black/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl">
          
          {/* 頂部圖示 */}
          <div className="flex justify-center mb-8">
            <div className={cn(
              "p-4 rounded-full border-2 transition-all duration-500",
              isSuccess 
                ? "bg-green-500/20 border-green-500 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]" 
                : error 
                  ? "bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                  : "bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            )}>
              {isSuccess ? <ShieldCheck size={48} /> : error ? <AlertCircle size={48} /> : <Fingerprint size={48} />}
            </div>
          </div>

          {/* 標題 */}
          <div className="text-center mb-8 space-y-2">
            <h1 className="text-2xl font-bold tracking-widest text-white drop-shadow-md">
              {t.auth.title}
            </h1>
            <p className="text-xs text-zinc-400 font-mono tracking-wide">
              {t.auth.subtitle}
            </p>
          </div>

          {/* 表單區域 */}
          <div className="space-y-4">
            <div className="relative group">
              <Lock className={cn("absolute left-3 top-3 h-4 w-4 transition-colors z-20", error ? "text-red-500" : "text-zinc-500 group-focus-within:text-blue-400")} />
              <Input 
                value={inputId}
                onChange={(e) => {
                  setInputId(e.target.value);
                  if (error) setError(false); // 使用者開始打字時，取消錯誤狀態
                }}
                placeholder={t.auth.idPlaceholder}
                className={cn(
                  "pl-9 bg-zinc-900/50 text-white placeholder:text-zinc-600 transition-all duration-300",
                  "border-white/10 hover:border-white/20",
                  "focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500/50",
                  error && "border-red-500/50 focus-visible:ring-red-500 focus-visible:border-red-500"
                )}
                disabled={isLoading || isSuccess}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()} // 按 Enter 也可以登入
              />
            </div>

            {/* 錯誤訊息提示 */}
            <div className={cn("text-xs text-red-500 font-mono text-center h-4 transition-opacity duration-300", error ? "opacity-100" : "opacity-0")}>
              {t.auth.error}
            </div>

            <Button 
              className={cn(
                "w-full h-12 font-bold tracking-wider transition-all duration-300 shadow-lg",
                isSuccess 
                  ? "bg-green-600 hover:bg-green-500 text-white shadow-green-500/20" 
                  : error
                    ? "bg-red-600 hover:bg-red-500 text-white shadow-red-500/20"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20 hover:shadow-blue-500/40"
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
            <p className="text-[10px] text-zinc-600 font-mono flex items-center justify-center gap-2 opacity-50">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              SECURE CONNECTION :: ENCRYPTED VIA GEMINI-3
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
