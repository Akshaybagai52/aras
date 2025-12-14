import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/40 to-background text-foreground">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
          <Link href="#top" className="flex items-center gap-2 font-semibold">
            <span className="text-2xl">🐾</span>
            <span className="text-lg md:text-xl tracking-tight">A.R.A.S</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#about" className="hover:text-foreground transition-colors">
              About
            </a>
            <a href="#how" className="hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#network" className="hover:text-foreground transition-colors">
              Rescue Network
            </a>
            <a href="#contact" className="hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>

          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/upload">Upload Animal Image</Link>
          </Button>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:pt-12 space-y-20 md:space-y-24">
        {/* Hero Section */}
        <section
          id="about"
          className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center pt-4"
        >
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="text-base">⚡</span>
              <span>AI-assisted alerts for injured animals</span>
            </p>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
              Help Injured Animals Get Instant Rescue
            </h1>

            <p className="text-sm md:text-base text-muted-foreground max-w-xl">
              AI-assisted reporting connects injured animals to nearby rescuers fast. Share a
              photo, confirm the location, and the nearest NGO or rescuer is alerted within
              minutes.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="px-8 text-base md:text-lg">
                <Link href="/upload">Upload Animal Image</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-6 text-sm md:text-base"
              >
                <a href="#how">Learn How It Works</a>
              </Button>
            </div>

            <p className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
              <span>Free • Fast • 24/7 available across partner rescue networks</span>
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5 shadow-sm">
              <p className="text-xs font-medium text-muted-foreground">Animals Rescued</p>
              <p className="mt-2 text-3xl font-semibold">2,450+</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Successful rescues coordinated through our partner NGOs and volunteers.
              </p>
            </Card>
            <Card className="p-5 shadow-sm">
              <p className="text-xs font-medium text-muted-foreground">Critical Incidents</p>
              <p className="mt-2 text-3xl font-semibold">1 every 17s</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Urban areas report constant accidents involving street animals.
              </p>
            </Card>
            <Card className="p-5 shadow-sm sm:col-span-2">
              <p className="text-xs font-medium text-muted-foreground">Golden Hour Window</p>
              <p className="mt-2 text-3xl font-semibold">30 mins</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Your quick report can mean the difference between life and loss.
              </p>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section id="how" className="space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              How It Works
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to get injured animals immediate help.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  1
                </span>
                <span>Upload animal image</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Take a quick photo of the injured animal or upload one from your gallery.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  2
                </span>
                <span>AI detects injury & location</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Our AI analyses visible injuries and auto-fills the location so rescuers
                know exactly where to go.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  3
                </span>
                <span>Nearest NGO/rescuer alerted</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The closest NGO or registered rescuer receives an instant alert with
                photos, details, and live map.
              </p>
            </Card>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Impact Stats
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Real numbers from our growing rescue network.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6 text-center">
              <p className="text-xs font-medium text-muted-foreground">Animals Rescued</p>
              <p className="mt-3 text-3xl font-semibold">2,450+</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Dogs, cats, birds and more given a second chance.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <p className="text-xs font-medium text-muted-foreground">Active NGOs</p>
              <p className="mt-3 text-3xl font-semibold">150+</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Trusted animal welfare NGOs and independent rescuers.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <p className="text-xs font-medium text-muted-foreground">Avg Response Time</p>
              <p className="mt-3 text-3xl font-semibold">12 mins</p>
              <p className="mt-2 text-xs text-muted-foreground">
                From first report to a rescuer being on the move.
              </p>
            </Card>
          </div>
        </section>

        {/* Rescue Network */}
        <section id="network" className="space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Rescue Network
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Partner NGOs, vets, and independent rescuers who respond to your alerts.
            </p>
          </div>

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {[
              "Paws Care Foundation",
              "Street Savers NGO",
              "Compassionate Vets",
              "Hope for Strays",
              "City Animal Aid",
              "Healing Paws Clinic",
              "Safe Tails Network",
              "Rescue Riders"
            ].map((name) => (
              <Card
                key={name}
                className="items-center justify-center p-4 text-center text-xs font-medium"
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-base">
                  {name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 3)}
                </div>
                <span className="line-clamp-2 text-muted-foreground">{name}</span>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonial */}
        <section className="space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Stories from the field
            </h2>
          </div>

          <Card className="mx-auto flex max-w-3xl flex-col gap-6 p-6 md:p-8 md:flex-row md:items-center">
            <div className="flex items-center justify-center md:block">
              <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-primary to-muted flex items-center justify-center text-2xl">
                🐶
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm md:text-base text-muted-foreground">
                “We received an alert with a clear photo, exact location, and injury details.
                Our team reached the dog in under 15 minutes. Without that quick report
                through A.R.A.S, he might not have survived.”
              </p>
              <div className="text-sm font-medium">
                <p className="text-foreground">Riya Sharma</p>
                <p className="text-muted-foreground">Field Rescuer, Paws Care Foundation</p>
              </div>
            </div>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="space-y-4 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Ready to report an injured animal?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            It takes less than 30 seconds. Your report could be the reason an animal gets a
            second chance.
          </p>
          <div className="mt-4 flex justify-center">
            <Button asChild size="lg" className="px-10 text-base md:text-lg">
              <Link href="/upload">Report an Injured Animal Now</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        id="contact"
        className="border-t bg-background/80 text-xs md:text-sm text-muted-foreground"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2 max-w-sm">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <span className="text-xl">🐾</span>
              <span>A.R.A.S – Animal Rescue Alert System</span>
            </div>
            <p>
              Built to connect injured animals with nearby rescuers in seconds.
            </p>
            <p className="font-semibold text-foreground">
              Emergency helpline: <span className="font-mono">+91-800-000-ARAS</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-10">
            <div className="space-y-2">
              <h3 className="text-foreground font-semibold">Links</h3>
              <ul className="space-y-1">
                <li>
                  <a href="#about" className="hover:text-foreground">
                    About
                  </a>
                </li>
                <li>
                  <a href="#how" className="hover:text-foreground">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#network" className="hover:text-foreground">
                    Rescue Network
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-foreground font-semibold">Social</h3>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    X (Twitter)
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-foreground font-semibold">Contact</h3>
              <ul className="space-y-1">
                <li>support@aras-rescue.org</li>
                <li>Partnerships & volunteering welcome</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t py-3 text-center text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} A.R.A.S. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
