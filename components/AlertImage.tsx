"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Alert } from "@/types/alert";

interface AlertImageProps {
  alert: Alert;
}

function getSeverityPillClasses(severity: number) {
  if (severity >= 4) {
    return "bg-red-100/90 text-red-800 border border-red-200";
  }
  if (severity >= 3) {
    return "bg-amber-100/90 text-amber-800 border border-amber-200";
  }
  return "bg-emerald-100/90 text-emerald-800 border border-emerald-200";
}

function getSeverityLabel(severity: number) {
  if (severity >= 4) return "Critical";
  if (severity >= 3) return "Moderate";
  return "Low";
}

export default function AlertImage({ alert }: AlertImageProps) {
  const [open, setOpen] = useState(false);

  const severityClasses = getSeverityPillClasses(alert.severity);
  const severityLabel = getSeverityLabel(alert.severity);

  return (
    <>
      <Card
        className="overflow-hidden cursor-zoom-in"
        onClick={() => setOpen(true)}
        aria-label="View alert image in full screen"
      >
        <div className="relative w-full aspect-video">
          <Image
            src={alert.image_url}
            alt={`Injured ${alert.animal_type}`}
            fill
            className="object-cover"
            priority
          />
          <div className="pointer-events-none absolute inset-3 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow ${severityClasses}`}
              >
                {severityLabel} • Level {alert.severity}/5
              </span>
              <span className="inline-flex items-center rounded-full bg-background/90 px-3 py-1 text-[10px] font-medium text-muted-foreground shadow">
                Detected injury: {alert.injury_location}
              </span>
            </div>
            <div className="flex justify-end">
              <span className="inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-medium text-muted-foreground shadow">
                <span aria-hidden="true">
                  🔍
                </span>
                <span>Click image to zoom</span>
              </span>
            </div>
          </div>
        </div>
      </Card>

      {open && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-6 top-6 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-xs font-medium text-white hover:bg-black/80"
            >
              ×
            </button>
            <div className="relative w-full h-[60vh] md:h-[70vh] rounded-lg overflow-hidden bg-black">
              <Image
                src={alert.image_url}
                alt={`Injured ${alert.animal_type}`}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
