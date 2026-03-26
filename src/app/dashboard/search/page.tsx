"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Train, 
  ArrowRightLeft, 
  CheckCircle2,
  Armchair,
  MapPinned,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

interface Station {
  id: string;
  name: string;
  code: string;
}

export default function TrainSearchPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<any>(null);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Fetch stations from Firestore
  const stationsRef = useMemoFirebase(() => collection(db, "stations"), [db]);
  const { data: stationsData, isLoading: isStationsLoading } = useCollection<Station>(stationsRef);

  // Search state
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const mockTrains = [
    { id: "1", name: "Tejas Express", number: "22119", from: "Mumbai CSMT", to: "Karmali", dep: "05:50 AM", arr: "02:00 PM", duration: "8h 10m", price: 1540, seats: 45 },
    { id: "2", name: "Garib Rath", number: "12909", from: "Bandra Terminus", to: "H. Nizamuddin", dep: "05:30 PM", arr: "09:40 AM", duration: "16h 10m", price: 980, seats: 124 },
    { id: "3", name: "Vande Bharat", number: "22436", from: "New Delhi", to: "Varanasi", dep: "06:00 AM", arr: "02:00 PM", duration: "8h 00m", price: 2150, seats: 12 },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 1500);
  };

  const handleBookClick = (train: any) => {
    setSelectedTrain(train);
    setIsSeatModalOpen(true);
    setSelectedSeats([]);
  };

  const toggleSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      if (selectedSeats.length >= 6) {
        toast({
          title: "Limit Reached",
          description: "You can select up to 6 seats per booking.",
          variant: "destructive"
        });
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const finalizeBooking = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No Seats Selected",
        description: "Please select at least one seat to continue.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Booking Confirmed",
      description: `Booked ${selectedSeats.length} seat(s) on ${selectedTrain.name}. Redirecting to payment...`,
    });
    setIsSeatModalOpen(false);
  };

  const swapStations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-headline font-black tracking-tight">Search Trains</h1>
        <p className="text-muted-foreground font-medium italic">Find and book the best trains across the Indian Railway network.</p>
      </div>

      <Card className="bg-primary text-primary-foreground shadow-2xl border-none overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Train className="h-32 w-32" />
        </div>
        <CardContent className="pt-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end relative z-10">
            
            <StationAutocomplete 
              label="Source Station"
              value={source}
              onChange={setSource}
              stations={stationsData || []}
              placeholder="e.g. Mumbai Central"
              icon={<MapPin className="h-3 w-3" />}
            />
            
            <div className="relative">
              <StationAutocomplete 
                label="Destination"
                value={destination}
                onChange={setDestination}
                stations={stationsData || []}
                placeholder="e.g. New Delhi"
                icon={<MapPin className="h-3 w-3" />}
              />
              <Button 
                type="button"
                size="icon" 
                variant="ghost" 
                className="absolute right-0 bottom-0 text-white hover:bg-white/20 h-11 w-11 rounded-r-xl z-20"
                onClick={swapStations}
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 opacity-80">
                <Calendar className="h-3 w-3" /> Journey Date
              </label>
              <Input type="date" className="bg-white/10 border-white/20 text-white h-11 rounded-xl [color-scheme:dark]" required />
            </div>

            <Button type="submit" className="w-full h-11 bg-accent text-accent-foreground hover:bg-accent/90 shadow-xl font-black uppercase text-[10px] tracking-widest rounded-xl transition-all active:scale-95" disabled={isSearching || isStationsLoading}>
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" /> Initializing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4" /> Scan Rails
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {hasSearched && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black font-headline flex items-center gap-3 tracking-tight">
              <Train className="h-6 w-6 text-primary" /> Available Services
            </h2>
            <Badge variant="outline" className="font-black uppercase text-[10px] tracking-widest border-primary/20 text-primary px-4 py-1.5 bg-primary/5">
              {mockTrains.length} Express Routes
            </Badge>
          </div>
          <div className="grid gap-6">
            {mockTrains.map((train) => (
              <Card key={train.id} className="hover:shadow-2xl transition-all border-primary/5 overflow-hidden group rounded-3xl">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-8 flex-1 flex flex-col md:flex-row items-center justify-between gap-10">
                      <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="p-5 bg-primary/10 rounded-2xl group-hover:bg-primary transition-all duration-300">
                          <Train className="h-10 w-10 text-primary group-hover:text-primary-foreground transition-colors" />
                        </div>
                        <div>
                          <h3 className="font-black text-2xl tracking-tighter">{train.name}</h3>
                          <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase mt-1">Terminal #{train.number}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-12 text-center flex-1 justify-center">
                        <div className="flex flex-col">
                          <span className="text-3xl font-black tracking-tight">{train.dep}</span>
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{train.from}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 flex-1 max-w-[140px]">
                          <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em] bg-primary/10 px-3 py-1 rounded-full">{train.duration}</span>
                          <div className="w-full h-[3px] bg-muted relative rounded-full overflow-hidden">
                            <div className="absolute top-0 left-0 h-full bg-primary/20 w-full animate-pulse" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-primary bg-background shadow-xl" />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-3xl font-black tracking-tight">{train.arr}</span>
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{train.to}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center md:items-end gap-3">
                        <Badge className={cn(
                          "px-4 py-1.5 font-black text-[10px] uppercase tracking-widest shadow-sm",
                          train.seats < 20 ? "bg-red-500 text-white" : "bg-green-500 text-white"
                        )}>
                          {train.seats} VACANCIES
                        </Badge>
                        <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                          <CheckCircle2 className="h-4 w-4 text-green-500" /> Operational Accuracy
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-10 bg-muted/30 border-t md:border-t-0 md:border-l flex flex-row md:flex-col items-center justify-between md:justify-center gap-6 min-w-[240px]">
                      <div className="text-center md:text-right">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Fare Quote</p>
                        <p className="text-5xl font-headline font-black text-primary tracking-tighter">₹{train.price}</p>
                      </div>
                      <Button 
                        className="w-full font-black text-[10px] uppercase tracking-[0.2em] h-14 shadow-xl shadow-primary/20 rounded-2xl transition-all active:scale-95" 
                        onClick={() => handleBookClick(train)}
                      >
                        Reserve Spot
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Seat Selection Modal */}
      <Dialog open={isSeatModalOpen} onOpenChange={setIsSeatModalOpen}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
          <DialogHeader className="p-8 bg-primary text-primary-foreground relative overflow-hidden">
            <Train className="absolute -bottom-10 -right-10 h-48 w-48 opacity-10 rotate-12" />
            <DialogTitle className="font-headline font-black text-3xl uppercase tracking-tight relative z-10">Coach Configuration</DialogTitle>
            <DialogDescription className="text-primary-foreground/80 font-bold uppercase text-[10px] tracking-widest relative z-10">
              Select passenger seating for {selectedTrain?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-8 space-y-10">
            <div className="flex justify-center gap-8">
              <LegendItem color="bg-muted" label="Vacant" />
              <LegendItem color="bg-primary" label="Selected" />
              <LegendItem color="bg-muted/20 border-dashed border border-muted-foreground/30" label="Occupied" />
            </div>

            <div className="grid grid-cols-4 gap-5 max-w-sm mx-auto p-8 bg-secondary/30 rounded-3xl border-2 border-dashed border-primary/10 relative">
              {Array.from({ length: 16 }).map((_, i) => {
                const seatId = `A${i + 1}`;
                const isSelected = selectedSeats.includes(seatId);
                const isTaken = i % 5 === 0;

                return (
                  <button
                    key={seatId}
                    disabled={isTaken}
                    onClick={() => toggleSeat(seatId)}
                    className={cn(
                      "h-14 w-14 rounded-2xl flex items-center justify-center text-xs font-black transition-all transform active:scale-90 relative group/seat",
                      isTaken ? "opacity-20 cursor-not-allowed" :
                      isSelected ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/40 scale-110 z-10" :
                      "bg-background border-2 border-primary/5 hover:border-primary/40 text-muted-foreground hover:text-primary shadow-sm"
                    )}
                  >
                    <Armchair className={cn("h-6 w-6 transition-transform group-hover/seat:scale-110", isSelected ? "text-primary-foreground" : "text-primary/40")} />
                    <span className="absolute -bottom-1.5 -right-1.5 text-[8px] font-black opacity-30">{seatId}</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Manifest Assignment</span>
                <span className="text-sm font-black text-primary tracking-tight">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Pending Selection'}</span>
              </div>
              <div className="flex justify-between items-end border-t border-dashed pt-4 border-primary/20">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Settlement Amount</span>
                <span className="text-3xl font-headline font-black text-primary tracking-tighter">₹{(selectedSeats.length * (selectedTrain?.price || 0)).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 bg-muted/30 border-t flex flex-row gap-4">
            <Button variant="ghost" onClick={() => setIsSeatModalOpen(false)} className="flex-1 font-black uppercase text-[10px] tracking-widest h-14 rounded-2xl hover:bg-background transition-colors">Abort</Button>
            <Button 
              onClick={finalizeBooking} 
              className="flex-1 font-black uppercase tracking-[0.2em] text-[10px] h-14 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95"
              disabled={selectedSeats.length === 0}
            >
              Confirm & Settle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Reusable Autocomplete Component
function StationAutocomplete({ label, value, onChange, stations, placeholder, icon }: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  stations: Station[];
  placeholder: string;
  icon: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredStations = useMemo(() => {
    if (!value || value.length < 1) return [];
    // Escape special characters for regex safety
    const search = value.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return stations.filter(s => 
      s.name.toLowerCase().includes(value.toLowerCase()) || 
      s.code.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 8);
  }, [value, stations]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredStations.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev < filteredStations.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        selectStation(filteredStations[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const selectStation = (station: Station) => {
    onChange(station.name);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 opacity-80">
        {icon} {label}
      </label>
      <Input 
        placeholder={placeholder} 
        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-11 rounded-xl" 
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      {isOpen && filteredStations.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-card text-foreground rounded-xl shadow-2xl border border-border overflow-hidden z-50 animate-scale-in">
          {filteredStations.map((s, index) => (
            <button
              key={s.id}
              type="button"
              className={cn(
                "w-full px-4 py-3 flex items-center justify-between text-left transition-colors group border-b border-border/50 last:border-0",
                index === activeIndex ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
              )}
              onClick={() => selectStation(s)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-black tracking-tight">
                  <HighlightedText text={s.name} highlight={value} />
                </span>
                <div className={cn(
                  "flex items-center gap-1.5 opacity-60",
                  index === activeIndex ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  <MapPinned className="h-3 w-3" />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
                    <HighlightedText text={s.code} highlight={value} />
                  </span>
                </div>
              </div>
              <ChevronRight className={cn(
                "h-4 w-4 transition-transform group-hover:translate-x-1",
                index === activeIndex ? "text-primary-foreground" : "text-muted-foreground"
              )} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Highlight matching text component
function HighlightedText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) return <>{text}</>;
  // Escape special characters for regex safety
  const safeHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${safeHighlight})`, "gi"));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="underline decoration-2 underline-offset-2">{part}</span>
        ) : (
          part
        )
      )}
    </>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
      <div className={cn("h-5 w-5 rounded-lg shadow-sm", color)} />
      {label}
    </div>
  );
}
