// src/components/MapCanvas.tsx
'use client';

import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { AnalysisResult } from '@/lib/types';
import { useState, useCallback } from 'react';

const containerStyle = {
  width: '100%',
  height: '100vh' // 全螢幕地圖
};

// 預設中心點 (台北車站)
const defaultCenter = {
  lat: 25.0478,
  lng: 121.5170
};

// 地圖深色模式樣式 (看起來比較有科技感/災難指揮感)
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
];

interface MapCanvasProps {
  scenario: AnalysisResult | null;
}

export default function MapCanvas({ scenario }: MapCanvasProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "" // 記得在 .env.local 設定
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  if (!isLoaded) return <div className="w-full h-screen bg-zinc-900 flex items-center justify-center text-white">Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={16}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles: darkMapStyle,
        disableDefaultUI: true, // 隱藏多餘按鈕，讓介面乾淨
        zoomControl: false,
      }}
    >
      {/* 只有當 scenario 存在時，才渲染任務標記點 */}
      {scenario?.suggestedTasks.map((task) => (
        <Marker
          key={task.id}
          position={task.targetLocation}
          title={task.role}
          icon={{
            // 根據角色給不同顏色的點
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
