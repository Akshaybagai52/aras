import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="inline-block text-6xl mb-4">🐾</div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              A.R.A.S
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground font-semibold">
              Animal Rescue Alert System
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Help save injured animals by reporting their location. Our AI-powered system
              detects injuries and automatically notifies the nearest rescue NGO.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link href="/upload">
              <Button size="lg" className="text-lg px-8 py-6">
                Report an Injured Animal
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="p-6 text-center space-y-4">
              <div className="text-4xl">📸</div>
              <h3 className="font-semibold text-xl">AI Detection</h3>
              <p className="text-sm text-muted-foreground">
                Upload a photo and our AI identifies the animal type and injury severity
              </p>
            </Card>
            
            <Card className="p-6 text-center space-y-4">
              <div className="text-4xl">📍</div>
              <h3 className="font-semibold text-xl">Location Based</h3>
              <p className="text-sm text-muted-foreground">
                We find the nearest rescue NGO within service range automatically
              </p>
            </Card>
            
            <Card className="p-6 text-center space-y-4">
              <div className="text-4xl">🔔</div>
              <h3 className="font-semibold text-xl">Instant Alerts</h3>
              <p className="text-sm text-muted-foreground">
                NGOs receive immediate email notifications with all rescue details
              </p>
            </Card>
          </div>

          {/* How it Works */}
          <div className="mt-16 space-y-8">
            <h2 className="text-3xl font-bold text-center">How It Works</h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="flex gap-4 items-start">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Take a Photo</h4>
                  <p className="text-sm text-muted-foreground">
                    Capture or upload an image of the injured animal
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">AI Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Our system analyzes the image to identify animal type and injury details
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Auto Notification</h4>
                  <p className="text-sm text-muted-foreground">
                    The nearest NGO is automatically notified with location and details
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
