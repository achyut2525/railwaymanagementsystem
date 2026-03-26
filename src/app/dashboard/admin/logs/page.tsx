"use client";

import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Shield, 
  AlertTriangle, 
  User, 
  Terminal,
  Clock,
  Search,
  Lock,
  Settings
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SecurityLogsPage() {
  const logs = [
    { id: "1", user: "Admin (John Doe)", action: "Updated Train #12951 Schedule", timestamp: "2024-06-10 10:15:32", severity: "Low", ip: "192.168.1.1" },
    { id: "2", user: "System", action: "Automatic Backup Completed", timestamp: "2024-06-10 09:00:00", severity: "Info", ip: "N/A" },
    { id: "3", user: "Unknown", action: "Failed Login Attempt", timestamp: "2024-06-10 08:45:12", severity: "High", ip: "103.45.21.12" },
    { id: "4", user: "Admin (John Doe)", action: "Deleted User Account #982", timestamp: "2024-06-10 08:30:45", severity: "Medium", ip: "192.168.1.1" },
    { id: "5", user: "Admin (Raj)", action: "Modified System Settings", timestamp: "2024-06-10 07:15:00", severity: "Medium", ip: "192.168.1.5" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Security Logs</h1>
          <p className="text-muted-foreground">Monitor administrative actions and security events.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
          <Shield className="h-3 w-3" /> Audit Trail Active
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Actions</CardTitle>
            <Settings className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">Tracked this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <Lock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-orange-600">Investigating 2 IPs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Log Volume</CardTitle>
            <Terminal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2k</div>
            <p className="text-xs text-muted-foreground">System events logged</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search logs by action or user" className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Event</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        {log.user}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                    <TableCell>
                      <Badge className={
                        log.severity === "High" ? "bg-red-500 text-white" :
                        log.severity === "Medium" ? "bg-orange-500 text-white" :
                        "bg-blue-500 text-white"
                      }>
                        {log.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" /> {log.timestamp}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
