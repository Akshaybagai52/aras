'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ImageUploader from '@/components/ImageUploader';
import LocationCapture from '@/components/LocationCapture';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocationCapture = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSubmit = async () => {
    if (!selectedImage || latitude === null || longitude === null) {
      setError('Please select an image and allow location access');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('latitude', latitude.toString());
      formData.append('longitude', longitude.toString());

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process alert');
      }

      const data = await response.json();
      router.push(`/alert/${data.alertId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">🐾 A.R.A.S</h1>
          <p className="text-xl text-muted-foreground">
            Animal Rescue Alert System
          </p>
          <p className="text-sm text-muted-foreground">
            Help save injured animals by reporting their location
          </p>
        </div>

        {loading ? (
          <Card className="p-6 space-y-4">
            <div className="text-center space-y-2">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <h3 className="text-lg font-semibold">Analyzing Image...</h3>
              <p className="text-sm text-muted-foreground">
                AI is detecting the animal and injury details
              </p>
            </div>
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </Card>
        ) : (
          <>
            <ImageUploader
              onImageSelect={setSelectedImage}
              selectedImage={selectedImage}
            />

            <LocationCapture
              onLocationCapture={handleLocationCapture}
              latitude={latitude}
              longitude={longitude}
            />

            {error && (
              <Card className="p-4 bg-destructive/10 border-destructive">
                <p className="text-sm text-destructive text-center">{error}</p>
              </Card>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!selectedImage || latitude === null || longitude === null}
              className="w-full"
              size="lg"
            >
              Submit Alert
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By submitting, you agree to share this information with nearby rescue NGOs
            </p>
          </>
        )}
      </div>
    </div>
  );
}
