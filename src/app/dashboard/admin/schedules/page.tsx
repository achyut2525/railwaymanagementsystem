
"use client";

import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  MoreVertical,
  Filter
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function AdminSchedulesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const schedules = [
    { id: "1", train: "Mumbai Rajdhani", number: "12951", origin: "Mumbai Central", destination: "New Delhi", dep: "16:35", arr: "08:32", days: "Daily", status: "On Time" },
    { id: "2", train: "Bhopal Shatabdi", number: "12002", origin: "New Delhi", destination: "Bhopal JN", dep: "06:00", arr: "14:25", days: "Daily", status: "Delayed" },
    { id: "3", train: "Howrah Duronto", number: "12245", origin: "Howrah JN", destination: "Bangalore City", dep: "10:50", arr: "16:00", days: "Mon, Tue, Fri", status: "On Time" },
    { id: "4", train: "Golden Temple Mail", number: "12903", origin: "Mumbai Central", destination: "Amritsar JN", dep: "18:45", arr: "05:20", days: "Daily", status: "On Time" },
  ];

  const filteredSchedules = schedules.filter(s => 
    s.train.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.number.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Train Schedules</h1>
          <p className="text-muted-foreground">Configure and manage operational timings for the fleet.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Create Schedule
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by train name or number" 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" /> Filter Days
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Train</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead>Operating Days</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.map((schedule) => (
                  <TableRow key={schedule.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold">{schedule.train}</span>
                        <span className="text-xs text-primary font-mono">#{schedule.number}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-medium">{schedule.origin}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-medium">{schedule.destination}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{schedule.dep}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{schedule.arr}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-bold">
                        {schedule.days}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        schedule.status === "On Time" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                      }>
                        {schedule.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Timings</DropdownMenuItem>
                          <DropdownMenuItem>Assign Crew</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Suspend Schedule</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
