import { notFound } from 'next/navigation';
import { supabase } from '@/lib/db';
import { getNGOById } from '@/lib/ngos';
import { haversineDistance } from '@/lib/geo';
import { Alert } from '@/types/alert';
import { NGO } from '@/types/ngo';
import AlertSummary from '@/components/AlertSummary';
import MapView from '@/components/MapView';
import AlertImage from '@/components/AlertImage';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface AlertPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getAlert(id: string): Promise<{ alert: Alert; ngo: NGO | null }> {
  const { data: alert, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !alert) {
    notFound();
  }

  let ngo: NGO | null = null;
  if (alert.nearest_ngo_id) {
    ngo = await getNGOById(alert.nearest_ngo_id);
  }

  return { alert, ngo };
}

export default async function AlertPage({ params }: AlertPageProps) {
  const { id } = await params;
  const { alert, ngo } = await getAlert(id);

  const distanceKm =
    ngo != null
      ? haversineDistance(alert.latitude, alert.longitude, ngo.latitude, ngo.longitude)
      : null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Alert #{alert.id.slice(0, 8)}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Created {new Date(alert.created_at || '').toLocaleString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-start md:justify-end">
            {ngo && (
              <Button asChild size="sm" className="font-semibold">
                <a
                  href={`mailto:${ngo.email}?subject=Rescue%20alert%20${encodeURIComponent(
                    alert.id.slice(0, 8)
                  )}&body=I%20am%20accepting%20this%20rescue%20alert.`}
                >
                  Accept Rescue
                </a>
              </Button>
            )}
            <Link href="/upload">
              <Button variant="outline" size="sm">
                New Alert
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <AlertImage alert={alert} />
            <AlertSummary alert={alert} ngo={ngo} />
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Location Map</h3>
              {ngo && distanceKm != null && (
                <p className="mb-3 text-xs md:text-sm text-muted-foreground">
                  Approx. distance from assigned NGO <span className="font-semibold">{ngo.name}</span>:
                  {' '}
                  <span className="font-semibold">{distanceKm.toFixed(1)} km</span>
                </p>
              )}
              <MapView
                latitude={alert.latitude}
                longitude={alert.longitude}
                markerLabel={`${alert.animal_type} - ${alert.injury_location}`}
              />
              <div className="mt-3 flex flex-wrap gap-2 justify-between">
                <Button asChild variant="outline" size="sm">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${alert.latitude},${alert.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open in Google Maps
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${alert.latitude},${alert.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Navigate
                  </a>
                </Button>
              </div>
            </Card>

            {alert.kestra_execution_id && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Workflow Status</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Kestra workflow has been triggered
                </p>
                <p className="text-xs font-mono bg-muted p-2 rounded">
                  {alert.kestra_execution_id}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
