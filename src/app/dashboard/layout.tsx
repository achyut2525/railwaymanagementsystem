"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  Ticket, 
  Settings, 
  LogOut, 
  Menu, 
  Train, 
  User, 
  Calendar,
  History,
  CreditCard,
  PieChart,
  ChevronDown,
  Loader2,
  Users,
  ShieldCheck,
  Activity,
  Bell,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useUser, useFirestore, useMemoFirebase, useDoc } from "@/firebase";
import { signOut, getAuth } from "firebase/auth";
import { doc } from "firebase/firestore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get user profile from Firestore to check role
  const userProfileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  const userRole = userProfile?.role || "passenger";

  // Role-based route protection
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
      return;
    }

    if (!isProfileLoading && userProfile) {
      const isAdminPath = pathname.startsWith("/dashboard/admin");
      if (isAdminPath && userProfile.role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [user, isUserLoading, userProfile, isProfileLoading, pathname, router]);

  if (isUserLoading || (user && isProfileLoading)) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="relative h-20 w-20">
            <Loader2 className="h-20 w-20 text-primary animate-spin opacity-20" />
            <Train className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary animate-pulse" />
          </div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Initializing Terminal...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const passengerLinks = [
    { name: "Terminal", href: "/dashboard", icon: LayoutDashboard },
    { name: "Search Rails", href: "/dashboard/search", icon: Search },
    { name: "My Journeys", href: "/dashboard/bookings", icon: History },
  ];

  const adminLinks = [
    { name: "Intelligence", href: "/dashboard/admin", icon: PieChart },
    { name: "Manage Fleet", href: "/dashboard/admin/trains", icon: Train },
    { name: "Schedules", href: "/dashboard/admin/schedules", icon: Calendar },
    { name: "Bookings", href: "/dashboard/admin/bookings", icon: Ticket },
    { name: "Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Revenue", href: "/dashboard/admin/payments", icon: CreditCard },
    { name: "Audit Trail", href: "/dashboard/admin/logs", icon: ShieldCheck },
  ];

  const links = userRole === "admin" ? adminLinks : passengerLinks;

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-body">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transition-transform duration-300 transform lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
              <Train className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-headline font-black text-primary tracking-tighter text-nowrap">TrackBooker</span>
          </div>

          <div className="flex-1 px-6 py-4 space-y-2 overflow-y-auto">
            <p className="px-3 mb-4 text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] opacity-60">
              {userRole === "admin" ? "Administrative Core" : "Passenger Services"}
            </p>
            {links.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 group relative overflow-hidden",
                  pathname === link.href 
                    ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                onClick={() => setIsSidebarOpen(false)}
              >
                <link.icon className={cn(
                  "h-5 w-5 transition-transform duration-300 group-hover:rotate-12",
                  pathname === link.href ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                )} />
                {link.name}
              </Link>
            ))}
          </div>

          <div className="p-6 border-t border-border space-y-3">
            {userRole === "passenger" && (
              <div className="mb-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-[8px] font-black uppercase tracking-widest text-primary mb-1">Wallet Balance</p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-black tracking-tight">₹4,250.00</p>
                  <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <Wallet className="h-3 w-3 text-primary" />
                  </div>
                </div>
              </div>
            )}
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start gap-4 h-12 rounded-2xl font-bold transition-all duration-200",
                pathname === (userRole === "admin" ? "/dashboard/admin/settings" : "/dashboard/settings") 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary"
              )}
              onClick={() => router.push(userRole === "admin" ? "/dashboard/admin/settings" : "/dashboard/settings")}
            >
              <Settings className="h-5 w-5" />
              Settings
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-4 h-12 rounded-2xl font-bold text-destructive hover:bg-destructive/10 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-12 border-b border-border bg-card/70 backdrop-blur-xl sticky top-0 z-30 transition-all">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden hover:bg-secondary rounded-xl" 
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="ml-auto flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full border border-border">
              <Activity className="h-3 w-3 text-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Server Node: NDLS-01</span>
            </div>
            
            <ThemeToggle />
            
            <div className="h-8 w-px bg-border mx-1" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-14 flex items-center gap-3 px-3 hover:bg-secondary/80 rounded-full transition-all duration-300 active:scale-95 group border border-transparent hover:border-border"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-black leading-tight tracking-tight">
                      {userProfile?.name || user.displayName || "User"}
                    </p>
                    <Badge variant="secondary" className="text-[8px] h-4 px-1.5 py-0 uppercase font-extrabold tracking-widest rounded-sm bg-primary/10 text-primary border-none mt-1">
                      {userRole}
                    </Badge>
                  </div>
                  <Avatar className="h-10 w-10 ring-2 ring-primary/10 transition-all group-hover:scale-110 shadow-lg">
                    <AvatarImage src={`https://picsum.photos/seed/${user.uid}/40/40`} />
                    <AvatarFallback className="bg-primary/5 text-primary font-black">
                      {(userProfile?.name || user.displayName || "U")[0]}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:translate-y-0.5 transition-transform" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 mt-3 p-3 rounded-2xl animate-scale-in border-border shadow-2xl">
                <DropdownMenuLabel className="font-normal px-3 py-4 bg-muted/30 rounded-xl mb-2">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-3">
                       <Avatar className="h-12 w-12 shadow-md">
                        <AvatarImage src={`https://picsum.photos/seed/${user.uid}/40/40`} />
                        <AvatarFallback className="bg-primary/5 text-primary font-black">
                          {(userProfile?.name || user.displayName || "U")[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5">
                        <p className="text-sm font-black tracking-tight">{userProfile?.name || user.displayName}</p>
                        <p className="text-[10px] font-medium text-muted-foreground truncate max-w-[150px]">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2 opacity-50" />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer flex items-center px-3 py-3 rounded-xl hover:bg-secondary font-bold text-sm">
                    <User className="mr-3 h-4 w-4 text-primary" />
                    <span>User Intelligence</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/bookings" className="cursor-pointer flex items-center px-3 py-3 rounded-xl hover:bg-secondary font-bold text-sm">
                    <Ticket className="mr-3 h-4 w-4 text-primary" />
                    <span>My Rail History</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={userRole === 'admin' ? "/dashboard/admin/settings" : "/dashboard/settings"} className="cursor-pointer flex items-center px-3 py-3 rounded-xl hover:bg-secondary font-bold text-sm">
                    <Settings className="mr-3 h-4 w-4 text-primary" />
                    <span>System Preferences</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 opacity-50" />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 cursor-pointer flex items-center px-3 py-3 rounded-xl font-bold text-sm">
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Terminate Session</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-12 bg-background/50">
          <div className="max-w-7xl mx-auto animate-slide-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
