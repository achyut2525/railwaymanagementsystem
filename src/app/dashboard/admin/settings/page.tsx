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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Settings, 
  Shield, 
  Globe, 
  Bell, 
  Database, 
  HardDrive,
  Moon,
  Sun,
  Palette
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <Settings className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure global application behavior and environment.</p>
        </div>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" /> General Configuration
            </CardTitle>
            <CardDescription>Basic system-wide operational settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">When enabled, only administrators can access the system.</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>System Name</Label>
                <Input defaultValue="TrackBooker Modern Rail" />
              </div>
              <div className="space-y-2">
                <Label>Support Email</Label>
                <Input defaultValue="support@trackbooker.com" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Security & Authentication
            </CardTitle>
            <CardDescription>Manage user registration and security policies.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Open Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new passengers to create accounts.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Multi-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require secondary verification for administrators.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-primary" /> Data & Storage
            </CardTitle>
            <CardDescription>Backup and database maintenance tools.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Daily Auto-Backups</Label>
                <p className="text-sm text-muted-foreground">Backup all Firestore data to cloud storage every 24h.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1">Export Database</Button>
              <Button variant="outline" className="flex-1">Clear Cache</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pb-8">
          <Button variant="outline">Reset to Defaults</Button>
          <Button className="px-8">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
