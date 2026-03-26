"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Printer, 
  XCircle, 
  History, 
  MapPin, 
  Calendar, 
  Ticket,
  Clock,
  Train,
  ChevronRight,
  Info,
  CheckCircle2,
  QrCode,
  Share2,
  User
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useUser } from "@/firebase";

export default function BookingsPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [mounted, setMounted] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState({ date: "2024-06-15", time: "06:00 AM" });

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setCurrentDateTime({
      date: now.toLocaleDateString('en-CA'), // YYYY-MM-DD
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    });
  }, []);

  const passengerName = user?.displayName || "John Doe";

  const bookings = [
    { 
      id: "BK-001", 
      pnr: "PNR-12345678", 
      train: "Gitanjali Express", 
      number: "12860",
      from: "Mumbai CST", 
      to: "Howrah JN", 
      date: mounted ? currentDateTime.date : "2024-06-15", 
      time: mounted ? currentDateTime.time : "06:00 AM",
      seat: "Coach S4 - Seat 42",
      passenger: passengerName,
      amount: "₹1,245.00",
      status: "Confirmed",
      type: "upcoming",
      coach: "S4",
      seatNum: "42",
      class: "Sleeper (SL)"
    },
    { 
      id: "BK-002", 
      pnr: "PNR-87654321", 
      train: "Deccan Queen", 
      number: "12124",
      from: "Pune JN", 
      to: "Mumbai CST", 
      date: "2024-05-10", 
      time: "07:15 AM",
      seat: "Coach C1 - Seat 04",
      passenger: passengerName,
      amount: "₹450.00",
      status: "Completed",
      type: "past"
    },
    { 
      id: "BK-003", 
      pnr: "PNR-45456767", 
      train: "Shatabdi Express", 
      number: "12001",
      from: "New Delhi", 
      to: "Chandigarh", 
      date: "2024-04-20", 
      time: "03:45 PM",
      seat: "Coach E2 - Seat 22",
      passenger: passengerName,
      amount: "₹820.00",
      status: "Cancelled",
      type: "past"
    }
  ];

  const handleCancel = (id: string) => {
    toast({
      title: "Cancellation Request Sent",
      description: "Our team will process your refund for booking PNR: " + id,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-headline font-black tracking-tight">My Journeys</h1>
        <p className="text-muted-foreground font-medium italic">Manage and review your Indian Railway history.</p>
      </div>

      <Tabs defaultValue="upcoming" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-10 max-w-md bg-secondary/50 p-1 rounded-2xl h-14">
          <TabsTrigger value="upcoming" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase text-[10px] tracking-widest">Active & Upcoming</TabsTrigger>
          <TabsTrigger value="past" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase text-[10px] tracking-widest">Journey Archive</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {bookings
            .filter(b => b.type === activeTab)
            .map((booking) => (
              <Card key={booking.id} className="overflow-hidden border-primary/5 shadow-lg group hover:shadow-xl transition-all">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    <div className="flex-1 p-8 space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary transition-colors">
                            <Train className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                          </div>
                          <div>
                            <h3 className="font-black text-xl tracking-tight">{booking.train}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-primary/20 text-primary">#{booking.number}</Badge>
                              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{booking.pnr}</span>
                            </div>
                          </div>
                        </div>
                        <Badge 
                          className={cn(
                            "px-4 py-1.5 font-black uppercase text-[10px] tracking-widest shadow-sm",
                            booking.status === "Confirmed" ? "bg-green-500 text-white" :
                            booking.status === "Cancelled" ? "bg-red-500 text-white" :
                            "bg-blue-500 text-white"
                          )}
                        >
                          {booking.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <JourneyPoint label="Passenger" value={booking.passenger} icon={User} />
                        <JourneyPoint label="Route" value={`${booking.from} → ${booking.to}`} icon={MapPin} />
                        <JourneyPoint label="Schedule" value={`${booking.date} @ ${booking.time}`} icon={Calendar} />
                        <JourneyPoint label="Assignment" value={booking.seat} icon={Ticket} />
                      </div>
                    </div>

                    <div className="p-8 bg-muted/30 lg:border-l flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 min-w-[240px]">
                      {booking.status === "Confirmed" ? (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="w-full h-12 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">
                                <QrCode className="mr-2 h-4 w-4" /> Digital E-Ticket
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-3xl border-none">
                              <DialogHeader className="bg-primary p-8 text-primary-foreground relative overflow-hidden">
                                <Train className="absolute -top-10 -right-10 h-48 w-48 opacity-10 rotate-12" />
                                <div className="relative z-10 flex items-center justify-between mb-8">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                                      <Train className="h-5 w-5" />
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">TrackBooker Rail</p>
                                      <DialogTitle className="text-xl font-black">Digital E-Ticket</DialogTitle>
                                    </div>
                                  </div>
                                  <Badge className="bg-white/20 text-white border-none text-[8px] uppercase tracking-widest font-black">Official</Badge>
                                </div>
                                <div className="flex justify-between items-end relative z-10">
                                  <div>
                                    <p className="text-[10px] font-black uppercase opacity-60 mb-1">PNR Number</p>
                                    <p className="text-2xl font-black tracking-widest font-mono">{booking.pnr}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[10px] font-black uppercase opacity-60 mb-1">Passenger</p>
                                    <p className="text-lg font-bold">{booking.passenger}</p>
                                  </div>
                                </div>
                                <DialogDescription className="sr-only">
                                  Details of your confirmed booking for PNR {booking.pnr} with passenger {booking.passenger}.
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="p-8 bg-background relative">
                                <div className="absolute -top-4 left-0 w-full flex justify-between px-8">
                                  <div className="h-8 w-8 rounded-full bg-primary -ml-12" />
                                  <div className="h-8 w-8 rounded-full bg-primary -mr-12" />
                                </div>
                                
                                <div className="flex flex-col items-center py-4 gap-6">
                                  <div className="p-6 bg-white rounded-3xl shadow-2xl border-2 border-dashed border-primary/20">
                                    <QRCodeSVG 
                                      value={JSON.stringify({
                                        pnr: booking.pnr,
                                        train: booking.train,
                                        passenger: booking.passenger,
                                        from: booking.from,
                                        to: booking.to,
                                        date: booking.date,
                                        seat: booking.seat
                                      })} 
                                      size={192}
                                      level="H"
                                      includeMargin={false}
                                    />
                                  </div>
                                  
                                  <div className="w-full space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <TicketStat label="Coach" value={booking.coach || "S4"} />
                                      <TicketStat label="Seat" value={booking.seatNum || "42"} />
                                      <TicketStat label="Class" value={booking.class || "SL"} />
                                      <TicketStat label="Status" value="Confirmed" active />
                                    </div>
                                    <div className="p-4 bg-muted/50 rounded-2xl flex items-center gap-3">
                                      <Info className="h-4 w-4 text-primary shrink-0" />
                                      <p className="text-[10px] font-medium text-muted-foreground">Please carry a valid ID proof for {booking.passenger} along with this digital ticket.</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <DialogFooter className="p-6 bg-secondary/30 flex gap-3 border-t sm:justify-start">
                                <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold"><Download className="mr-2 h-4 w-4" /> PDF</Button>
                                <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
                                <Button className="flex-1 rounded-xl h-12 font-bold shadow-lg shadow-primary/20"><Printer className="mr-2 h-4 w-4" /> Print</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:bg-destructive/10 w-full font-black uppercase text-[10px] tracking-widest"
                            onClick={() => handleCancel(booking.pnr)}
                          >
                            <XCircle className="mr-2 h-4 w-4" /> Cancel Trip
                          </Button>
                        </>
                      ) : (
                        <div className="text-center w-full">
                          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Fare Settled</p>
                          <p className="text-3xl font-headline font-black text-primary tracking-tighter">{booking.amount}</p>
                          <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary border-none text-[8px] uppercase tracking-widest font-black">Transaction Verified</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

          {bookings.filter(b => b.type === activeTab).length === 0 && (
            <div className="text-center py-32 bg-secondary/10 rounded-3xl border-2 border-dashed border-primary/5">
              <History className="mx-auto h-16 w-16 text-muted-foreground opacity-20 mb-6" />
              <p className="text-xl font-black tracking-tight">No Archive Found</p>
              <p className="text-muted-foreground text-sm font-medium mt-1">Your travel history for this category is currently empty.</p>
              <Link href="/dashboard/search">
                <Button className="mt-6 font-black uppercase text-[10px] tracking-widest px-8">Start Booking</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function JourneyPoint({ label, value, icon: Icon }: any) {
  return (
    <div className="space-y-1.5 group/point">
      <p className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2 tracking-[0.2em] group-hover/point:text-primary transition-colors">
        <Icon className="h-3 w-3" /> {label}
      </p>
      <p className="font-bold text-foreground/90 tracking-tight">{value}</p>
    </div>
  );
}

function TicketStat({ label, value, active }: any) {
  return (
    <div className="p-4 rounded-2xl bg-muted/30 border border-transparent hover:border-primary/20 transition-all">
      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</p>
      <p className={cn(
        "text-lg font-black",
        active ? "text-green-600" : "text-foreground"
      )}>{value}</p>
    </div>
  );
}
