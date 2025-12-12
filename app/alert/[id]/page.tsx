import { notFound } from 'next/navigation';
import { supabase } from '@/lib/db';
import { getNGOById } from '@/lib/ngos';
import { Alert } from '@/types/alert';
import { NGO } from '@/types/ngo';
import AlertSummary from '@/components/AlertSummary';
import MapView from '@/components/MapView';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
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

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Alert #{alert.id.slice(0, 8)}</h1>
            <p className="text-sm text-muted-foreground">
              Created {new Date(alert.created_at || '').toLocaleString()}
            </p>
          </div>
          <Link href="/upload">
            <Button variant="outline">New Alert</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="relative w-full aspect-video">
                <Image
                  src={alert.image_url}
                  alt={`Injured ${alert.animal_type}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Card>

            <AlertSummary alert={alert} ngo={ngo} />
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Location Map</h3>
              <MapView
                latitude={alert.latitude}
                longitude={alert.longitude}
                markerLabel={`${alert.animal_type} - ${alert.injury_location}`}
              />
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
