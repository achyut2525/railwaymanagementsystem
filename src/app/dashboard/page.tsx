"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Train, 
  Calendar, 
  History, 
  Search, 
  ArrowRight, 
  Ticket, 
  Wallet, 
  Bell, 
  MapPin, 
  Activity,
  Sparkles,
  Navigation,
  Clock,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/firebase";
import { getTrainRecommendations, type TrainRecommendationOutput } from "@/ai/flows/train-recommendations-flow";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function PassengerDashboard() {
  const { user } = useUser();
  const [recommendations, setRecommendations] = useState<TrainRecommendationOutput | null>(null);
  const [pnrInput, setPnrInput] = useState("");
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  
  const upcomingBookings = [
    { 
      id: "1", 
      pnr: "PNR-12345678", 
      train: "Gitanjali Express", 
      from: "Mumbai CST", 
      to: "Howrah JN", 
      date: "2024-06-15", 
      status: "Confirmed",
      progress: 65,
      currentStation: "Nagpur JN",
      nextStation: "Durg",
      eta: "14:45",
      platform: "PF-3"
    },
  ];

  useEffect(() => {
    async function fetchRecs() {
      setIsLoadingRecs(true);
      try {
        const recs = await getTrainRecommendations({
          userId: user?.uid || "anon",
          preferredTravelTime: "Evening",
          pastRoutes: ["Mumbai to Delhi", "Pune to Bangalore"]
        });
        setRecommendations(recs);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingRecs(false);
      }
    }
    fetchRecs();
  }, [user?.uid]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">
            Namaste, {user?.displayName?.split(' ')[0] || 'Traveler'}!
          </h1>
          <p className="text-muted-foreground">Your Indian Railway journey at a glance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Wallet Balance</p>
            <p className="text-xl font-bold text-primary">₹4,250.00</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <Button variant="outline" size="icon" className="rounded-full relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-background" />
          </Button>
          <Link href="/dashboard/search">
            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Search className="mr-2 h-4 w-4" /> Book Trip
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <QuickStatCard 
          title="PNR Status" 
          value="Check" 
          icon={Activity} 
          color="blue"
          customElement={
            <div className="flex gap-2 mt-3">
              <Input 
                placeholder="Enter PNR" 
                className="h-8 text-xs bg-muted/50 border-none"
                value={pnrInput}
                onChange={(e) => setPnrInput(e.target.value)}
              />
              <Button size="sm" className="h-8 px-2">Go</Button>
            </div>
          }
        />
        <QuickStatCard title="Total Trips" value="12" subValue="Across 8 states" icon={MapPin} color="green" />
        <QuickStatCard title="Miles Traveled" value="4,250" subValue="KM this year" icon={Navigation} color="orange" />
        <QuickStatCard title="Wallet" value="₹4,250" subValue="Instant refund active" icon={Wallet} color="primary" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Live Tracking Section */}
          <Card className="overflow-hidden border-primary/10 shadow-xl bg-gradient-to-br from-card to-secondary/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline font-bold text-xl flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-500 animate-pulse" /> Live Journey Tracking
                </CardTitle>
                <CardDescription>Track your active train in real-time.</CardDescription>
              </div>
              <Badge className="bg-red-500/10 text-red-600 border-red-200">Live Updates</Badge>
            </CardHeader>
            <CardContent className="space-y-8">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Train className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{booking.train}</h4>
                        <p className="text-xs font-mono text-muted-foreground">{booking.pnr}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Arriving PF</p>
                      <p className="text-lg font-bold text-primary">{booking.platform}</p>
                    </div>
                  </div>

                  <div className="relative pt-8 pb-4">
                    <div className="h-2 w-full bg-secondary rounded-full relative overflow-hidden">
                      <div 
                        className="absolute left-0 top-0 h-full bg-primary transition-all duration-1000 ease-in-out" 
                        style={{ width: `${booking.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-4">
                      <div className="text-center">
                        <p className="text-sm font-bold">{booking.from}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Origin</p>
                      </div>
                      <div className="text-center bg-primary/10 px-4 py-1 rounded-full border border-primary/20 animate-bounce">
                        <p className="text-xs font-black text-primary">{booking.currentStation}</p>
                        <p className="text-[10px] text-primary/70 uppercase">Current</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold">{booking.to}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Destination</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Next Station</p>
                        <p className="text-sm font-bold">{booking.nextStation} at {booking.eta}</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" className="rounded-full text-xs font-bold">
                        Full Schedule <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="border-primary/5 shadow-lg bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> Smart Recommendations
                </CardTitle>
                <CardDescription>AI-picked routes based on your history.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingRecs ? (
                <div className="h-32 flex flex-col items-center justify-center gap-3">
                  <Sparkles className="h-8 w-8 text-primary animate-spin opacity-20" />
                  <p className="text-xs font-bold text-muted-foreground uppercase animate-pulse">Analyzing travel patterns...</p>
                </div>
              ) : recommendations ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    {recommendations.recommendations.map((rec, i) => (
                      <div key={i} className="p-4 rounded-xl bg-background border border-primary/10 hover:border-primary/30 transition-all cursor-pointer group shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="text-[8px] font-black uppercase bg-primary/10 text-primary">
                            {rec.matchScore}% Match
                          </Badge>
                          <Train className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <h5 className="font-bold text-sm">{rec.trainName}</h5>
                        <p className="text-[10px] text-muted-foreground mb-2">#{rec.trainNumber}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 italic">"{rec.reasoning}"</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-primary text-primary-foreground rounded-lg flex items-center gap-3 text-xs font-medium">
                    <InfoIcon className="h-4 w-4 shrink-0" />
                    {recommendations.travelTip}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="shadow-lg border-primary/5">
            <CardHeader>
              <CardTitle className="font-headline font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <QuickActionLink href="/dashboard/search" icon={Search} label="Search Trains" />
              <QuickActionLink href="/dashboard/bookings" icon={History} label="Journey History" />
              <QuickActionLink href="/dashboard/bookings" icon={Ticket} label="Download E-Tickets" />
              <QuickActionLink href="/dashboard/settings" icon={Wallet} label="Add Balance" />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-primary/5">
            <CardHeader>
              <CardTitle className="font-headline font-bold">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AlertItem 
                type="info" 
                title="Booking Confirmed" 
                desc="Gitanjali Express (PNR-12345678)" 
                time="2h ago" 
              />
              <AlertItem 
                type="warning" 
                title="Delay Alert" 
                desc="Shatabdi Exp is delayed by 15 mins" 
                time="5h ago" 
              />
              <AlertItem 
                type="success" 
                title="Refund Processed" 
                desc="₹450 credited to wallet" 
                time="Yesterday" 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuickStatCard({ title, value, subValue, icon: Icon, color, customElement }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-900/10",
    green: "text-green-600 bg-green-50 border-green-100 dark:bg-green-900/10",
    orange: "text-orange-600 bg-orange-50 border-orange-100 dark:bg-orange-900/10",
    primary: "text-primary bg-primary/5 border-primary/10",
  };

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className={cn("p-3 rounded-xl", colors[color])}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {subValue && <p className="text-[10px] text-muted-foreground font-bold">{subValue}</p>}
          </div>
        </div>
        {customElement}
      </CardContent>
    </Card>
  );
}

function QuickActionLink({ href, icon: Icon, label }: any) {
  return (
    <Link 
      href={href} 
      className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-primary/20 hover:bg-secondary transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm font-bold">{label}</span>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </Link>
  );
}

function AlertItem({ type, title, desc, time }: any) {
  const icons: any = {
    info: <Bell className="h-4 w-4 text-blue-500" />,
    warning: <Activity className="h-4 w-4 text-orange-500" />,
    success: <Ticket className="h-4 w-4 text-green-500" />,
  };

  return (
    <div className="flex gap-3">
      <div className="shrink-0 mt-1">{icons[type]}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold">{title}</p>
          <span className="text-[10px] text-muted-foreground">{time}</span>
        </div>
        <p className="text-[10px] text-muted-foreground line-clamp-1">{desc}</p>
      </div>
    </div>
  );
}

function InfoIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
