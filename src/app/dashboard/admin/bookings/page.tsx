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
  Search, 
  MoreVertical, 
  Ticket,
  MapPin,
  Calendar,
  XCircle,
  CheckCircle,
  Eye,
  Download,
  Filter
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function AdminBookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const bookings = [
    { id: "1", pnr: "PNR-12345678", passenger: "John Doe", train: "Mumbai Rajdhani", route: "Mumbai to Delhi", date: "2024-06-15", status: "Confirmed", amount: "₹4,250" },
    { id: "2", pnr: "PNR-87654321", passenger: "Jane Smith", train: "Bhopal Shatabdi", route: "Delhi to Bhopal", date: "2024-06-16", status: "Pending", amount: "₹1,800" },
    { id: "3", pnr: "PNR-45456767", passenger: "Raj Kumar", train: "Howrah Duronto", route: "Howrah to Bangalore", date: "2024-06-17", status: "Cancelled", amount: "₹3,100" },
    { id: "4", pnr: "PNR-22334455", passenger: "Anita Devi", train: "Chennai Express", route: "Chennai to Mumbai", date: "2024-06-18", status: "Confirmed", amount: "₹2,400" },
  ];

  const filteredBookings = bookings.filter(b => 
    b.pnr.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.passenger.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">All Bookings</h1>
          <p className="text-muted-foreground">Monitor and manage all ticket transactions system-wide.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by PNR or Passenger Name" 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" /> Filter By Status
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-bold">PNR</TableHead>
                  <TableHead>Passenger</TableHead>
                  <TableHead>Journey</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono font-bold text-primary">{booking.pnr}</TableCell>
                    <TableCell className="font-medium">{booking.passenger}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{booking.train}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {booking.route}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {booking.date}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">{booking.amount}</TableCell>
                    <TableCell>
                      <Badge className={
                        booking.status === "Confirmed" ? "bg-green-100 text-green-700" :
                        booking.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }>
                        {booking.status}
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
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle className="mr-2 h-4 w-4" /> Confirm Booking
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <XCircle className="mr-2 h-4 w-4" /> Cancel Booking
                          </DropdownMenuItem>
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
