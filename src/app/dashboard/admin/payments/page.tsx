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
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { 
  IndianRupee, 
  TrendingUp, 
  CreditCard, 
  CheckCircle,
  Clock,
  ArrowUpRight,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const revenueData = [
  { month: "Jan", revenue: 4500000 },
  { month: "Feb", revenue: 5200000 },
  { month: "Mar", revenue: 4800000 },
  { month: "Apr", revenue: 6100000 },
  { month: "May", revenue: 7500000 },
  { month: "Jun", revenue: 8200000 },
];

export default function AdminPaymentsPage() {
  const transactions = [
    { id: "TX-1001", pnr: "PNR-12345678", amount: "₹4,250", method: "UPI", status: "Success", date: "2024-06-10 14:30" },
    { id: "TX-1002", pnr: "PNR-87654321", amount: "₹1,800", method: "Credit Card", status: "Success", date: "2024-06-10 15:45" },
    { id: "TX-1003", pnr: "PNR-45456767", amount: "₹3,100", method: "Net Banking", status: "Failed", date: "2024-06-10 16:20" },
    { id: "TX-1004", pnr: "PNR-22334455", amount: "₹2,400", method: "UPI", status: "Success", date: "2024-06-10 17:10" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Revenue & Payments</h1>
          <p className="text-muted-foreground">Track financial performance and transaction history.</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" /> Download Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (MTD)</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹82,45,000</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3" /> +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Ticket Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2,140</div>
            <p className="text-xs text-muted-foreground mt-1">Steady across all routes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-xs text-green-600 mt-1">UPI leading in speed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Refunds</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1.2L</div>
            <p className="text-xs text-red-600 mt-1">14 cases require attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Revenue Growth</CardTitle>
            <CardDescription>Monthly income trends for the current year.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} dot={{r: 4, fill: 'hsl(var(--primary))'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>PNR</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-xs">{tx.pnr}</TableCell>
                      <TableCell className="font-bold">{tx.amount}</TableCell>
                      <TableCell>
                        <Badge className={
                          tx.status === "Success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }>
                          {tx.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Button variant="link" className="w-full mt-4">View All Transactions</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
