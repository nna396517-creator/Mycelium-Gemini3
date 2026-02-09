// src/components/WeatherCard.tsx
'use client';

import { CloudRain, CloudSun, Wind, Droplets, Sun, CloudLightning, Thermometer } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { AnalysisResult } from '@/lib/types';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface WeatherCardProps {
  scenario: AnalysisResult | null;
}

export default function WeatherCard({ scenario }: WeatherCardProps) {
  const { t: rawT } = useLanguage();
  const t = rawT as any;
  
  const [time, setTime] = useState(new Date());

  // 時鐘跳動
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 根據劇本決定天氣資料 (Mock Logic)
  const getWeather = () => {
    if (!scenario) {
      // 預設天氣 (台北/一般)
      return {
        temp: 28,
        humidity: 65,
        wind: 3,
        precip: 10,
        condition: 'cloudy',
        icon: <CloudSun className="text-yellow-400" size={32} />,
        label: t.weather.conditions.cloudy
      };
    }

    const { riskFactors } = scenario;

    // 火災劇本：高溫、乾燥、強風
    if (riskFactors.fireHazard > 80) {
      return {
        temp: 36,
        humidity: 20,
        wind: 8, // 強風助長火勢
        precip: 0,
        condition: 'sunny',
        icon: <Sun className="text-orange-500 animate-pulse" size={32} />,
        label: t.weather.conditions.sunny
      };
    }

    // 水災劇本：低溫、極高濕度、豪雨
    if (riskFactors.structuralDamage < 50 && riskFactors.humanDanger > 80) { // 假設這是水災特徵
       return {
        temp: 22,
        humidity: 99,
        wind: 12,
        precip: 100,
        condition: 'rainy',
        icon: <CloudRain className="text-blue-400" size={32} />,
        label: t.weather.conditions.rainy
      };
    }

    // 地震/倒塌劇本：多雲/陰天 (便於搜救)
    return {
        temp: 24,
        humidity: 70,
        wind: 2,
        precip: 20,
        condition: 'clear',
        icon: <CloudSun className="text-zinc-300" size={32} />,
        label: t.weather.conditions.cloudy
    };
  };

  const weather = getWeather();

  return (
    <div className="p-4 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 transition-all duration-500 hover:border-blue-500/30 group">
      
      {/* 標題與時間 */}
      <div className="flex justify-between items-start mb-3 border-b border-white/5 pb-2">
        <div>
            <h3 className="text-zinc-400 text-xs flex items-center gap-2 font-bold tracking-wider">
                <CloudSun size={14} className="text-cyan-400" /> {t.weather.title}
            </h3>
            <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                {scenario ? "TARGET_ZONE_SENSORS_ACTIVE" : "STATION_Taipei_A1"}
            </div>
        </div>
        <div className="text-right">
            <div className="text-lg font-mono font-bold text-white leading-none">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-[10px] text-zinc-600 font-mono">
                {time.toLocaleDateString()}
            </div>
        </div>
      </div>

      {/* 主要天氣狀態 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                {weather.icon}
            </div>
            <div>
                <div className="text-3xl font-bold text-white flex items-start">
                    {weather.temp}
                    <span className="text-sm text-zinc-500 mt-1">°C</span>
                </div>
                <div className={cn("text-xs font-bold tracking-widest uppercase", 
                    weather.condition === 'sunny' ? "text-orange-400" :
                    weather.condition === 'rainy' ? "text-blue-400" : "text-zinc-300"
                )}>
                    {weather.label}
                </div>
            </div>
        </div>
      </div>

      {/* 詳細數據 Grid */}
      <div className="grid grid-cols-3 gap-2">
        
        {/* 風速 */}
        <div className="bg-zinc-900/50 rounded p-2 border border-white/5 flex flex-col items-center justify-center">
            <div className="text-[10px] text-zinc-500 mb-1 flex items-center gap-1">
                <Wind size={10} /> {t.weather.wind}
            </div>
            <div className="text-sm font-mono text-white font-bold">
                {weather.wind} <span className="text-[10px] text-zinc-600">m/s</span>
            </div>
        </div>

        {/* 濕度 */}
        <div className="bg-zinc-900/50 rounded p-2 border border-white/5 flex flex-col items-center justify-center">
            <div className="text-[10px] text-zinc-500 mb-1 flex items-center gap-1">
                <Droplets size={10} /> {t.weather.humidity}
            </div>
            <div className="text-sm font-mono text-white font-bold">
                {weather.humidity}<span className="text-[10px] text-zinc-600">%</span>
            </div>
        </div>

        {/* 降雨機率 */}
        <div className="bg-zinc-900/50 rounded p-2 border border-white/5 flex flex-col items-center justify-center">
            <div className="text-[10px] text-zinc-500 mb-1 flex items-center gap-1">
                <CloudRain size={10} /> {t.weather.precip}
            </div>
            <div className="text-sm font-mono text-white font-bold">
                {weather.precip}<span className="text-[10px] text-zinc-600">%</span>
            </div>
        </div>

      </div>
    </div>
  );
}
