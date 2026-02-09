// src/components/MapCanvas.tsx
'use client';

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { AnalysisResult } from '@/lib/types';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Heart, Plus, Home, Shield, Navigation } from 'lucide-react';

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

// Mock Mode 用的輔助元件
const MockMarker = ({ pt, center, type, color, icon }: any) => {
    const latDiff = pt.lat - center.lat;
    const lngDiff = pt.lng - center.lng;
    const scale = 8000;
    const top = 50 - (latDiff * scale);
    const left = 50 + (lngDiff * scale);

    if (top < 0 || top > 100 || left < 0 || left > 100) return null;

    return (
        <div 
            className={`absolute flex flex-col items-center justify-center ${color}`}
            style={{ top: `${top}%`, left: `${left}%` }}
        >
            <div className="bg-black/50 p-1 rounded-full border border-white/20 backdrop-blur-sm">
                {icon}
            </div>
        </div>
    );
}

// 產生隨機座標
const generateRandomPoints = (center: { lat: number, lng: number }, count: number, spread: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `pt-${i}`,
    lat: center.lat + (Math.random() - 0.5) * spread,
    lng: center.lng + (Math.random() - 0.5) * spread
  }));
};

interface MapCanvasProps {
  scenario: AnalysisResult | null;
  userLocation?: { lat: number, lng: number } | null;
}

export default function MapCanvas({ scenario, userLocation }: MapCanvasProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const isMockMode = !apiKey || apiKey === "YOUR_KEY_HERE" || apiKey === "";

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || "", 
    preventGoogleFontsLoading: isMockMode
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  // [修正] 使用 State 來儲存隨機設施座標，避免 SSR/CSR 不一致
  const [facilities, setFacilities] = useState<{
      aeds: any[];
      hospitals: any[];
      shelters: any[];
      bunkers: any[];
  }>({
      aeds: [],
      hospitals: [],
      shelters: [],
      bunkers: []
  });

  // [修正] 將隨機生成邏輯移至 useEffect，確保只在 Client 端執行
  useEffect(() => {
    const center = userLocation || defaultCenter;
    setFacilities({
      aeds: generateRandomPoints(center, 5, 0.005),
      hospitals: generateRandomPoints(center, 2, 0.008),
      shelters: generateRandomPoints(center, 3, 0.006),
      bunkers: generateRandomPoints(center, 2, 0.004)
    });
  }, [userLocation]);

  const mapIcons = useMemo(() => {
    if (!isLoaded) return null;

    return {
      AED: {
        path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
        fillColor: "#ef4444",
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: "#ffffff",
        scale: 1.5,
        anchor: new google.maps.Point(12, 12)
      },
      SHELTER: {
        path: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
        fillColor: "#3b82f6",
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: "#ffffff",
        scale: 1.2,
        anchor: new google.maps.Point(12, 12)
      },
      BUNKER: {
        path: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z",
        fillColor: "#f59e0b",
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: "#ffffff",
        scale: 1.2,
        anchor: new google.maps.Point(12, 12)
      },
      HOSPITAL: {
        path: "M3 3h18v18H3z",
        fillColor: "#ffffff",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#ef4444",
        scale: 1.2,
        anchor: new google.maps.Point(12, 12)
      },
      USER: {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        fillColor: "#0ea5e9",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#ffffff",
        scale: 6
      }
    };
  }, [isLoaded]);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  // Mock Mode
  if (isMockMode || loadError) {
    const currentCenter = userLocation || defaultCenter;
    return (
      <div className="w-full h-screen bg-[#242f3e] relative overflow-hidden flex items-center justify-center text-zinc-500 select-none">
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="text-8xl opacity-5 font-bold tracking-widest text-white">OFFLINE MAP</div>
        </div>
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="w-full h-[5px] bg-green-500/30 blur-sm absolute top-0 animate-scan" />
        </div>

        {/* User Icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
             <Navigation className="text-sky-400 fill-sky-400/20 animate-pulse" size={32} style={{ transform: 'rotate(-45deg)' }} />
             <div className="absolute -inset-4 border border-sky-500/30 rounded-full animate-ping"></div>
        </div>

        {/* Facilities */}
        {facilities.aeds.map(pt => <MockMarker key={pt.id} pt={pt} center={currentCenter} type="AED" color="text-red-500" icon={<Heart size={16} className="fill-red-500"/>} />)}
        {facilities.hospitals.map(pt => <MockMarker key={pt.id} pt={pt} center={currentCenter} type="HOSPITAL" color="text-white bg-red-500" icon={<Plus size={16} strokeWidth={4} />} />)}
        {facilities.shelters.map(pt => <MockMarker key={pt.id} pt={pt} center={currentCenter} type="SHELTER" color="text-blue-400" icon={<Home size={16} />} />)}
        {facilities.bunkers.map(pt => <MockMarker key={pt.id} pt={pt} center={currentCenter} type="BUNKER" color="text-yellow-500" icon={<Shield size={16} />} />)}

        {/* Tasks */}
        {scenario?.suggestedTasks?.filter(task => task.coordinates?.lat).map((task) => {
            const latDiff = task.coordinates!.lat - currentCenter.lat;
            const lngDiff = task.coordinates!.lng - currentCenter.lng;
            const scale = 8000; 
            const top = 50 - (latDiff * scale); 
            const left = 50 + (lngDiff * scale);
            const color = task.role === 'RESCUER' ? 'bg-red-500' : task.role === 'MEDIC' ? 'bg-green-500' : 'bg-blue-500';
            return (
              <div key={task.id} className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)] flex items-center justify-center z-10 animate-bounce ${color}`} style={{ top: `${top}%`, left: `${left}%` }}>
                <div className={`w-2 h-2 rounded-full bg-white animate-ping`} />
              </div>
            );
        })}
      </div>
    );
  }

  // Google Maps Mode
  if (!isLoaded || !mapIcons) return <div className="w-full h-screen bg-zinc-900 flex items-center justify-center text-white">Loading Google Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={userLocation || defaultCenter}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles: darkMapStyle,
        disableDefaultUI: true,
        zoomControl: false,
      }}
    >
        {/* 1. User Position */}
        {userLocation && (
            <Marker position={userLocation} icon={mapIcons.USER} zIndex={100} />
        )}

        {/* 2. Facilities */}
        {facilities.aeds.map(pt => (
            <Marker key={pt.id} position={pt} icon={mapIcons.AED} label={{ text: "+", color: "white", fontWeight: "bold" }} />
        ))}
        {facilities.hospitals.map(pt => (
            <Marker key={pt.id} position={pt} icon={mapIcons.HOSPITAL} label={{ text: "+", color: "red", fontWeight: "bold", fontSize: "16px" }} />
        ))}
        {facilities.shelters.map(pt => (
            <Marker key={pt.id} position={pt} icon={mapIcons.SHELTER} />
        ))}
        {facilities.bunkers.map(pt => (
            <Marker key={pt.id} position={pt} icon={mapIcons.BUNKER} />
        ))}

        {/* 3. Tasks */}
        {scenario?.suggestedTasks?.filter(task => task.coordinates?.lat).map((task) => (
            <Marker
                key={task.id}
                position={task.coordinates!}
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
