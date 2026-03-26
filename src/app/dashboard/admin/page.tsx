"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell
} from "recharts";
import { 
  Users, 
  Train, 
  Ticket, 
  TrendingUp, 
  IndianRupee, 
  Activity,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  Download,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAdminInsights, type AdminInsightsOutput } from "@/ai/flows/admin-insights-flow";
import { cn } from "@/lib/utils";

const data = [
  { name: "Mon", bookings: 450, revenue: 240000 },
  { name: "Tue", bookings: 520, revenue: 310000 },
  { name: "Wed", bookings: 380, revenue: 210000 },
  { name: "Thu", bookings: 650, revenue: 420000 },
  { name: "Fri", bookings: 850, revenue: 580000 },
  { name: "Sat", bookings: 950, revenue: 640000 },
  { name: "Sun", bookings: 750, revenue: 520000 },
];

export default function AdminDashboard() {
  const [aiInsights, setAiInsights] = useState<AdminInsightsOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchInsights = async () => {
    setIsGenerating(true);
    try {
      const insights = await getAdminInsights({
        totalBookings: 5050,
        recentRevenue: 2920000,
        activeTrains: 124,
        occupancyRate: 78
      });
      setAiInsights(insights);
    } catch (error) {
      console.error("Failed to fetch AI insights:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">System Intelligence</h1>
          <p className="text-muted-foreground">Real-time operational metrics and AI-driven predictions.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="hover:bg-secondary">
            <Filter className="mr-2 h-4 w-4 text-primary" /> Filters
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-secondary">
            <Download className="mr-2 h-4 w-4 text-primary" /> Export
          </Button>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase px-3 py-1 bg-green-500/10 text-green-600 rounded-full border border-green-500/20 shadow-sm">
            <Activity className="h-3 w-3 animate-pulse" /> Live System
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Passengers" 
          value="12,450" 
          subValue="+20.1% from last month" 
          icon={Users} 
          color="primary"
          delay="0s"
        />
        <StatCard 
          title="Active Fleet" 
          value="124" 
          subValue="98.4% Efficiency" 
          icon={Train} 
          color="accent"
          delay="0.1s"
        />
        <StatCard 
          title="Tickets Issued" 
          value="5,050" 
          subValue="Weekly Peak Reached" 
          icon={Ticket} 
          color="blue"
          delay="0.2s"
        />
        <StatCard 
          title="Weekly Revenue" 
          value="₹29.2L" 
          subValue="+19.4% Growth" 
          icon={IndianRupee} 
          color="green"
          delay="0.3s"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-gradient-to-br from-card to-card/50 border-primary/10 shadow-lg animate-slide-up [animation-delay:0.4s]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline font-bold">Strategic Insights</CardTitle>
              <CardDescription>AI-generated predictions and network optimization.</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchInsights} 
              disabled={isGenerating}
              className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-all active:scale-95"
            >
              <Sparkles className={cn("mr-2 h-4 w-4", isGenerating && "animate-spin")} /> 
              {isGenerating ? "Analyzing..." : "Refresh Insights"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {aiInsights ? (
              <div className="space-y-6 animate-scale-in">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/10 shadow-sm">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black uppercase tracking-tight">Demand Forecast:</p>
                      <Badge className={cn(
                        "font-black uppercase text-[10px]",
                        aiInsights.demandLevel === 'Peak' ? "bg-red-500 text-white" : "bg-primary text-primary-foreground"
                      )}>
                        {aiInsights.demandLevel}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{aiInsights.predictionReasoning}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Strategic Actions</p>
                    <ul className="space-y-3">
                      {aiInsights.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-foreground/90 bg-secondary/30 p-2 rounded-lg border border-transparent hover:border-primary/20 transition-all cursor-default group">
                          <div className="h-2 w-2 rounded-full bg-primary shrink-0 group-hover:scale-125 transition-transform" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/10 flex flex-col justify-center items-center text-center shadow-inner">
                    <p className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-2">Weekly Revenue Opportunity</p>
                    <p className="text-4xl font-headline font-black text-green-700 tracking-tighter">{aiInsights.revenueOpportunity}</p>
                    <p className="text-xs text-muted-foreground mt-3 font-medium">Estimated impact if optimized</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                <div className="relative">
                  <Sparkles className="h-12 w-12 mb-4 animate-pulse text-primary opacity-20" />
                  <Sparkles className="h-6 w-6 absolute -top-2 -right-2 animate-bounce text-primary" />
                </div>
                <p className="text-sm font-bold tracking-tight">Scanning network data for patterns...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-lg animate-slide-up [animation-delay:0.5s]">
          <CardHeader>
            <CardTitle className="font-headline font-bold">Revenue Performance</CardTitle>
            <CardDescription>Financial growth across the platform.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 700}} />
                <Tooltip 
                  cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index > 3 ? 'hsl(var(--primary))' : 'hsl(var(--accent))'} className="transition-all duration-300 hover:opacity-80" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, subValue, icon: Icon, color, delay }: any) {
  const borderColors: any = {
    primary: "border-l-primary",
    accent: "border-l-accent",
    blue: "border-l-blue-500",
    green: "border-l-green-500",
  };

  const textColors: any = {
    primary: "text-primary",
    accent: "text-accent",
    blue: "text-blue-600",
    green: "text-green-600",
  };

  return (
    <Card className={cn("border-l-4 shadow-sm animate-slide-up transition-all hover:scale-[1.02] cursor-default", borderColors[color])} style={{ animationDelay: delay }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black font-headline tracking-tighter">{value}</div>
        <p className={cn("text-[10px] font-bold mt-1 flex items-center gap-1", textColors[color])}>
          {subValue.includes('+') && <ArrowUpRight className="h-3 w-3" />} {subValue}
        </p>
      </CardContent>
    </Card>
  );
}