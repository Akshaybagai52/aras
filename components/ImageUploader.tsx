'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  errorMessage?: string | null;
  onError?: (message: string | null) => void;
}

export default function ImageUploader({
  onImageSelect,
  selectedImage,
  errorMessage,
  onError,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onError?.('Unsupported file type. Please upload an image.');
      return;
    }

    onError?.(null);
    onImageSelect(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Upload Animal Image</h3>
          <p className="text-sm text-muted-foreground">
            Upload or take a photo of the injured animal.
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
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/40 bg-muted/40 px-6 py-10 text-center cursor-pointer"
            onClick={handleClick}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) {
                handleFile(file);
              }
            }}
          >
            <div className="flex items-center gap-3 text-3xl">
              <span aria-hidden="true">📷</span>
              <span aria-hidden="true">🖼️</span>
            </div>
            <p className="text-sm font-medium text-foreground">
              Upload or take a photo of the injured animal
            </p>
            <p className="text-xs text-muted-foreground">
              Drag & drop an image here, or tap to browse
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

        <div className="space-y-2">
          <Button onClick={handleClick} className="w-full" size="lg">
            {preview ? 'Change Photo' : 'Upload Photo'}
          </Button>
          {errorMessage && (
            <p className="text-xs text-destructive text-center">{errorMessage}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
