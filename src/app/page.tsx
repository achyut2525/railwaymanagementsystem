
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Train, Search, Calendar, ShieldCheck, ArrowRight } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "./lib/placeholder-images";

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === "hero-train");

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <Train className="h-6 w-6 text-primary" />
          <span className="font-headline font-bold text-xl tracking-tight text-primary">TrackBooker</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login">
            Login
          </Link>
          <Link href="/register">
            <Button size="sm" className="font-medium">Register</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl">
                <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none animate-fade-in">
                  Modern Railway Booking for the <span className="text-primary">Digital Age</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl dark:text-gray-400 animate-fade-in [animation-delay:200ms]">
                  TrackBooker makes train travel simple. Search, book, and manage your journeys with a seamless, intuitive platform.
                </p>
              </div>
              <div className="space-x-4 animate-fade-in [animation-delay:400ms]">
                <Link href="/dashboard">
                  <Button size="lg" className="px-8 bg-accent text-accent-foreground hover:bg-accent/90">
                    Book Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="px-8">
                    View Schedules
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          {heroImage && (
            <div className="absolute inset-0 -z-10 opacity-10 dark:opacity-20 pointer-events-none">
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center bg-background p-8 rounded-2xl shadow-sm border">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Smart Search</h3>
                <p className="text-muted-foreground">Find the best routes and trains across the country with real-time seat availability updates.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center bg-background p-8 rounded-2xl shadow-sm border">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Easy Scheduling</h3>
                <p className="text-muted-foreground">Flexible booking options with instant confirmation and digital tickets including QR codes.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center bg-background p-8 rounded-2xl shadow-sm border">
                <div className="p-3 bg-primary/10 rounded-full">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Secure Payments</h3>
                <p className="text-muted-foreground">Integrated payment tracking ensures your transactions are safe and always recorded.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6">
          <p className="text-sm text-muted-foreground">
            © 2024 TrackBooker Systems. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link className="text-sm hover:underline underline-offset-4" href="#">
              Privacy Policy
            </Link>
            <Link className="text-sm hover:underline underline-offset-4" href="#">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
