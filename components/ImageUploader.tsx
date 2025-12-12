'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
}

export default function ImageUploader({ onImageSelect, selectedImage }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Upload Animal Photo</h3>
          <p className="text-sm text-muted-foreground">
            Take or upload a photo of the injured animal
          </p>
        </div>

        {preview ? (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
            <Image
              src={preview}
              alt="Selected animal"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-muted-foreground"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-muted-foreground">
              No image selected
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          capture="environment"
        />

        <Button onClick={handleClick} className="w-full" variant="outline">
          {preview ? 'Change Photo' : 'Select Photo'}
        </Button>
      </div>
    </Card>
  );
}
