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
  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return 'destructive';
    if (severity >= 3) return 'default';
    return 'secondary';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'notified':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'resolved':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold">Alert Details</h2>
          <Badge variant={getStatusColor(alert.status)}>
            {alert.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Animal Type</p>
            <p className="font-semibold">{alert.animal_type}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Severity</p>
            <Badge variant={getSeverityColor(alert.severity)}>
              Level {alert.severity}/5
            </Badge>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground">Injury Location</p>
            <p className="font-semibold">{alert.injury_location}</p>
          </div>
        </div>

        {ngo && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">
              Assigned NGO
            </p>
            <div className="space-y-1">
              <p className="font-semibold">{ngo.name}</p>
              <p className="text-sm text-muted-foreground">{ngo.email}</p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">Location</p>
          <p className="text-xs font-mono">
            {alert.latitude.toFixed(6)}, {alert.longitude.toFixed(6)}
          </p>
        </div>
      </div>
    </Card>
  );
}
