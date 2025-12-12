'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LocationCaptureProps {
  onLocationCapture: (lat: number, lng: number) => void;
  latitude: number | null;
  longitude: number | null;
}

export default function LocationCapture({
  onLocationCapture,
  latitude,
  longitude
}: LocationCaptureProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationCapture(
          position.coords.latitude,
          position.coords.longitude
        );
        setLoading(false);
      },
      (error) => {
        setError('Unable to retrieve your location');
        setLoading(false);
        console.error('Geolocation error:', error);
      }
    );
  };

  useEffect(() => {
    // Auto-capture location on mount
    captureLocation();
  }, []);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Location</h3>
          <p className="text-sm text-muted-foreground">
            Your location helps us find the nearest rescue NGO
          </p>
        </div>

        {latitude && longitude ? (
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-center space-x-2 text-sm">
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium text-green-700">Location captured</span>
            </div>
            <div className="text-xs text-center text-muted-foreground font-mono">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            {loading ? 'Getting location...' : 'No location captured'}
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 text-center">{error}</div>
        )}

        <Button
          onClick={captureLocation}
          disabled={loading}
          className="w-full"
          variant="outline"
        >
          {loading ? 'Getting Location...' : 'Refresh Location'}
        </Button>
      </div>
    </Card>
  );
}
