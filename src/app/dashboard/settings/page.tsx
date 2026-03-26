"use client";

import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  Smartphone,
  CreditCard,
  Train,
  Heart,
  Settings,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function UserSettingsPage() {
  const { user } = useUser();
  const db = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile } = useDoc(userProfileRef);

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-headline font-black tracking-tight">Account Intelligence</h1>
          <p className="text-muted-foreground font-medium italic mt-1">Refine your travel preferences and security settings.</p>
        </div>
        <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Wallet Balance</p>
            <p className="text-2xl font-black text-primary">₹4,250.00</p>
          </div>
          <Button size="sm" className="ml-4 h-10 px-6 font-bold uppercase text-[10px] tracking-widest rounded-xl">Recharge</Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-primary/5 shadow-xl overflow-hidden group">
            <CardHeader className="bg-muted/30 border-b p-8">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-all duration-300">
                  <User className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div>
                  <CardTitle className="font-black text-2xl tracking-tight">Profile Intelligence</CardTitle>
                  <CardDescription className="font-medium">Information used for PNR assignment and booking.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
                  <Input id="name" defaultValue={profile?.name || ""} className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-primary shadow-inner" />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Auth Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ""} disabled className="h-12 rounded-xl bg-muted/20 border-none opacity-60" />
                </div>
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verified Mobile Number</Label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" className="pl-12 h-12 rounded-xl bg-muted/30 border-none shadow-inner" placeholder="+91 98765 43210" />
                </div>
              </div>
              <Button className="h-12 px-8 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">Sync Profile Updates</Button>
            </CardContent>
          </Card>

          <Card className="border-primary/5 shadow-xl">
            <CardHeader className="p-8">
              <CardTitle className="font-black text-2xl tracking-tight flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-primary" /> Security & Access
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-8">
              <div className="flex items-center justify-between p-6 rounded-2xl bg-secondary/30">
                <div className="space-y-1">
                  <Label className="text-base font-bold">Multi-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground font-medium">Adds an critical extra layer of security to your PNRs.</p>
                </div>
                <Switch />
              </div>
              <Separator className="opacity-50" />
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Credential Update</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input type="password" placeholder="New Password" className="h-12 rounded-xl bg-muted/30 border-none" />
                  <Input type="password" placeholder="Verify Password" className="h-12 rounded-xl bg-muted/30 border-none" />
                </div>
                <Button variant="outline" className="h-12 px-8 font-bold border-primary/20 text-primary hover:bg-primary/5">Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Card className="border-primary/5 shadow-xl bg-primary/5">
            <CardHeader>
              <CardTitle className="font-black text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" /> Travel Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <PreferenceItem label="Veg Food Preference" defaultChecked />
              <PreferenceItem label="Window Seat Priority" defaultChecked />
              <PreferenceItem label="Lower Berth Only" />
              <PreferenceItem label="Wheelchair Access" />
            </CardContent>
          </Card>

          <Card className="border-primary/5 shadow-xl">
            <CardHeader>
              <CardTitle className="font-black text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" /> Notification Hub
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">SMS Delay Alerts</p>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">Email Invoices</p>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">Platform Broadcasts</p>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100 bg-red-500/5 dark:bg-red-500/10 shadow-xl overflow-hidden">
            <div className="h-1 bg-red-500 w-full" />
            <CardHeader>
              <CardTitle className="font-black text-lg text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[10px] text-muted-foreground leading-relaxed font-medium uppercase tracking-wider">Permanent deletion of account and all associated PNR history and travel metrics.</p>
              <Button variant="destructive" className="w-full h-11 font-black uppercase text-[10px] tracking-widest rounded-xl">Deactivate Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PreferenceItem({ label, defaultChecked }: any) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <span className="text-sm font-bold text-foreground/80 group-hover:text-primary transition-colors">{label}</span>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
