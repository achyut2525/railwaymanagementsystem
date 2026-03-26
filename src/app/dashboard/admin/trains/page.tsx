
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
  Edit, 
  Trash2, 
  MoreVertical, 
  Train,
  MapPin,
  Clock
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function ManageTrainsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const trains = [
    { id: "1", number: "12951", name: "Mumbai Rajdhani", route: "Mumbai to New Delhi", status: "Active", capacity: "1200 seats" },
    { id: "2", number: "12002", name: "Bhopal Shatabdi", route: "New Delhi to Bhopal", status: "Maintenance", capacity: "800 seats" },
    { id: "3", number: "12245", name: "Howrah Duronto", route: "Howrah to Bangalore", status: "Active", capacity: "1100 seats" },
    { id: "4", number: "22625", name: "Chennai Double Decker", route: "Chennai to Bangalore", status: "Active", capacity: "900 seats" },
  ];

  const handleDelete = (id: string) => {
    toast({
      title: "Train Deleted",
      description: "Successfully removed train #" + id + " from system.",
      variant: "destructive",
    });
  };

  const filteredTrains = trains.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.number.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Manage Trains</h1>
          <p className="text-muted-foreground">Add, update, or remove trains from the railway network.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Add New Train
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="font-headline">Fleet Directory</CardTitle>
              <CardDescription>Currently managing {trains.length} trains in operation.</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or #" 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px]">Train #</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrains.map((train) => (
                  <TableRow key={train.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono font-bold text-primary">{train.number}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Train className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{train.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {train.route}
                      </div>
                    </TableCell>
                    <TableCell>{train.capacity}</TableCell>
                    <TableCell>
                      <span className={
                        `px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          train.status === "Active" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                        }`
                      }>
                        {train.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Clock className="mr-2 h-4 w-4" /> Manage Schedule
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                            onClick={() => handleDelete(train.number)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Train
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
