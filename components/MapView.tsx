'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  latitude: number;
  longitude: number;
  markerLabel?: string;
}

export default function MapView({ latitude, longitude, markerLabel = 'Alert Location' }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map only once
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([latitude, longitude], 13);

      // Add OpenStreetMap tiles (free)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);

      // Create custom icon
      const icon = L.icon({
        iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDI0IDM2Ij48cGF0aCBmaWxsPSIjZWYzNDM0IiBkPSJNMTIgMEMyIDAgMCA2IDAgMTJjMCAxMCAxMiAyNCAxMiAyNFMyNCAyMiAyNCAxMmMwLTYtMi0xMi0xMi0xMnoiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
        iconSize: [32, 48],
        iconAnchor: [16, 48],
        popupAnchor: [0, -48]
      });

      // Add marker
      L.marker([latitude, longitude], { icon })
        .addTo(mapInstanceRef.current)
        .bindPopup(markerLabel)
        .openPopup();
    } else {
      // Update existing map
      mapInstanceRef.current.setView([latitude, longitude], 13);
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, markerLabel]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] rounded-lg overflow-hidden border shadow-sm"
    />
  );
}
