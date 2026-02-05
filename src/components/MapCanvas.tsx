// src/components/MapCanvas.tsx
'use client';

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { AnalysisResult } from '@/lib/types';
import { useState, useCallback, useMemo } from 'react';

// 樣式設定
const containerStyle = {
  width: '100%',
  height: '100vh'
};

const defaultCenter = {
  lat: 25.0478,
  lng: 121.5170
};

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
];

interface MapCanvasProps {
  scenario: AnalysisResult | null;
}

export default function MapCanvas({ scenario }: MapCanvasProps) {
  // 1. 檢查是否有 API Key
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const isMockMode = !apiKey || apiKey === "YOUR_KEY_HERE" || apiKey === "";

  // 2. 如果有 Key，嘗試載入 Google Maps SDK
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || "", // 即使是空字串也要傳，不然 hook 會報錯，反正我們會用 isMockMode 擋掉
    // 只有在非 Mock 模式才真正去載入，避免 console 噴錯
    preventGoogleFontsLoading: isMockMode
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  // --- 模擬模式渲染邏輯 ---
  if (isMockMode || loadError) {
    return (
      <div className="w-full h-screen bg-[#242f3e] relative overflow-hidden flex items-center justify-center text-zinc-500 select-none">
        
        {/* 假的地圖背景 (用 CSS Grid 畫出網格感，模擬科技地圖) */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }} 
        />
        
        {/* 中心點標記 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="text-8xl opacity-5 font-bold tracking-widest text-white">OFFLINE MAP</div>
        </div>

        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="w-full h-[5px] bg-green-500/30 blur-sm absolute top-0 animate-scan" />
        </div>

        {/* 渲染模擬的任務點 (Dots) */}
        {scenario?.suggestedTasks.map((task) => {
          // 簡單的經緯度投影 hack：把 (lat, lng) 映射到螢幕中心附近的 offset
          // 假設中心是 (25.0478, 121.5170)，每 0.001 度大約偏移 5% 螢幕寬度
          const latDiff = task.targetLocation.lat - defaultCenter.lat;
          const lngDiff = task.targetLocation.lng - defaultCenter.lng;
          
          // 放大倍率，讓點點分開一點
          const scale = 4000; 
          
          const top = 50 - (latDiff * scale); //緯度越大越上面 (top 越小)
          const left = 50 + (lngDiff * scale);

          const color = task.role === 'RESCUER' ? 'bg-red-500' : task.role === 'MEDIC' ? 'bg-green-500' : 'bg-blue-500';

          return (
            <div
              key={task.id}
              className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)] flex items-center justify-center z-10 animate-bounce ${color}`}
              style={{ top: `${top}%`, left: `${left}%` }}
            >
              <div className={`w-2 h-2 rounded-full bg-white animate-ping`} />
            </div>
          );
        })}
      </div>
    );
  }

  // --- 真實 Google Maps 模式 ---
  if (!isLoaded) return <div className="w-full h-screen bg-zinc-900 flex items-center justify-center text-white">Loading Google Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={16}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles: darkMapStyle,
        disableDefaultUI: true,
        zoomControl: false,
      }}
    >
      {scenario?.suggestedTasks.map((task) => (
        <Marker
          key={task.id}
          position={task.targetLocation}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: task.role === 'RESCUER' ? '#ef4444' : task.role === 'MEDIC' ? '#22c55e' : '#3b82f6',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff',
          }}
        />
      ))}
    </GoogleMap>
  );
}
