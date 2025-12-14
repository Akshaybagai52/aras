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
  const [uploadError, setUploadError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/40 to-background">
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-10 space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <span className="text-lg" aria-hidden="true">
              ←
            </span>
            <span>Back</span>
          </button>
          <p className="text-xs font-medium text-muted-foreground">
            Step 1 of 2
          </p>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Upload Animal Image
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Start by sharing a clear photo of the injured animal so rescuers know what to
            expect.
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
            <div className="grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start">
              <ImageUploader
                onImageSelect={setSelectedImage}
                selectedImage={selectedImage}
                errorMessage={uploadError}
                onError={setUploadError}
              />

              <Card className="p-5 space-y-3">
                <h2 className="text-sm font-semibold tracking-tight">
                  For best results
                </h2>
                <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                  <li>Make sure the animal is clearly visible in the frame.</li>
                  <li>Include the injured area if it is safe to do so.</li>
                  <li>Keep a safe distance — do not touch or move the animal.</li>
                </ul>
              </Card>
            </div>

            <div className="flex items-center gap-2 rounded-md bg-muted/60 px-3 py-2 text-[11px] md:text-xs text-muted-foreground">
              <span aria-hidden="true">🔒</span>
              <p>
                Images are encrypted and used only to coordinate rescue efforts. We do not
                share them publicly.
              </p>
            </div>

            <div id="location" className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-tight">
                  Step 2 of 2: Confirm location
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  We only share approximate location with verified rescuers.
                </p>
              </div>
              <LocationCapture
                onLocationCapture={handleLocationCapture}
                latitude={latitude}
                longitude={longitude}
              />
            </div>

            {error && (
              <p className="text-xs text-destructive text-center">{error}</p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={!selectedImage}
                onClick={() => {
                  const el = document.getElementById('location');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                Continue
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!selectedImage || latitude === null || longitude === null}
                size="lg"
              >
                Submit Alert
              </Button>
            </div>

            <p className="text-[11px] text-center text-muted-foreground">
              By submitting, you agree to share this information securely with nearby rescue
              NGOs and registered rescuers.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
