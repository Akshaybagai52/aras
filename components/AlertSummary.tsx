'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/types/alert';
import { NGO } from '@/types/ngo';

interface AlertSummaryProps {
  alert: Alert;
  ngo: NGO | null;
}

export default function AlertSummary({ alert, ngo }: AlertSummaryProps) {
  const getSeverityBadgeClasses = (severity: number) => {
    if (severity >= 4) return 'bg-red-100 text-red-800 border-red-200';
    if (severity >= 3) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  const statusSteps = ['Reported', 'NGO Assigned', 'Rescuer En Route', 'Rescued'];

  const getCurrentStepIndex = () => {
    switch (alert.status) {
      case 'pending':
        return 0;
      case 'notified':
        return 1;
      case 'in_progress':
        return 2;
      case 'resolved':
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getCurrentStepIndex();

  return (
    <Card className="p-6 space-y-5">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg md:text-xl font-semibold tracking-tight">Alert status</h2>
          <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground">
            Current: {statusSteps[currentStep]}
          </span>
        </div>

        <ol className="flex items-center justify-between gap-2 text-[10px] md:text-xs">
          {statusSteps.map((label, index) => {
            const isActive = index <= currentStep;
            return (
              <li key={label} className="flex flex-1 items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold ${
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-muted'
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={
                    isActive
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                  }
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-muted/40 p-3 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Animal Info
          </p>
          <p className="text-sm font-semibold">{alert.animal_type}</p>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-muted-foreground">Severity</span>
            <Badge
              variant="outline"
              className={`text-[11px] ${getSeverityBadgeClasses(alert.severity)}`}
            >
              Level {alert.severity}/5
            </Badge>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/40 p-3 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Injury Info
          </p>
          <p className="text-sm font-semibold break-words">
            {alert.injury_location}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Coordinates: {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
          </p>
        </div>

        <div className="rounded-lg border bg-muted/40 p-3 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            NGO & Contact
          </p>
          {ngo ? (
            <>
              <p className="text-sm font-semibold">{ngo.name}</p>
              <p className="text-[11px] text-muted-foreground">{ngo.email}</p>
            </>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              No NGO has been auto-assigned yet. Our network is reviewing this alert.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-md bg-muted/60 px-3 py-2 text-[11px] md:text-xs text-muted-foreground flex items-start gap-2">
        <span aria-hidden="true">💚</span>
        <p>
          This animal is currently being monitored by our rescue network. If you are
          nearby and it is safe, please stay at a distance and keep an eye on them
          until help arrives.
        </p>
      </div>
    </Card>
  );
}
