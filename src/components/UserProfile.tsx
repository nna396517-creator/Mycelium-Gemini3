// src/components/UserProfile.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut, Shield } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { cn } from '@/lib/utils';

interface UserProfileProps {
  onLogout: () => void;
}

export default function UserProfile({ onLogout }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);

  // 點擊外部關閉選單
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* 1. 觸發按鈕 (Icon) */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-zinc-400 hover:text-white hover:bg-white/10 transition-all",
          isOpen && "border-blue-500 text-blue-400 bg-blue-500/10"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <User size={16} />
      </Button>

      {/* 2. 彈出選單 (Dropdown) */}
      {isOpen && (
        <div className="absolute top-10 right-0 w-48 p-1 bg-black/90 border border-white/20 rounded-xl backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-50">
          
          {/* User Info Header */}
          <div className="p-3 border-b border-white/10 mb-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 rounded bg-blue-500/20 text-blue-400">
                <Shield size={12} />
              </div>
              <span className="text-[10px] text-blue-400 font-bold tracking-wider">
                {t.user.role}
              </span>
            </div>
            <div className="text-sm font-mono text-white pl-1">
              ADMIN
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 p-2 text-xs text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors font-mono"
          >
            <LogOut size={14} />
            {t.user.logout}
          </button>
        </div>
      )}
    </div>
  );
}
