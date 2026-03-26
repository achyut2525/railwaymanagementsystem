
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Train, Mail, Lock, ArrowRight, Info, ShieldCheck, Database, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const getFriendlyErrorMessage = (error: any) => {
    const code = error?.code || "";
    if (code === "auth/invalid-credential") return "The email or password you entered is incorrect.";
    if (code === "auth/user-not-found") return "No account found with this email.";
    if (code === "auth/wrong-password") return "Incorrect password.";
    if (code === "auth/too-many-requests") return "Too many failed attempts. Please try again later.";
    return error.message?.replace("Firebase: ", "") || "An unexpected error occurred.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;

        toast({
          title: "Welcome back!",
          description: `Logged in as ${userData.name}`,
        });

        if (role === "admin") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: getFriendlyErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Train className="h-8 w-8 text-primary-foreground" />
            </div>
            <span className="text-3xl font-headline font-extrabold text-primary tracking-tighter">TrackBooker</span>
          </Link>
          <h2 className="text-2xl font-bold font-headline tracking-tight">Sign in to your account</h2>
          <p className="text-muted-foreground mt-2">Access your personalized railway dashboard</p>
        </div>

        <Card className="border-none shadow-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Credentials</CardTitle>
            <CardDescription>Enter your email and password to log in</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      className="pl-10" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10" 
                      required 
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 shadow-md" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" /> Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <ShieldCheck className="h-3 w-3" /> Administrator Access Guide
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="admin-access" className="border-none bg-primary/5 rounded-lg px-3">
                  <AccordionTrigger className="text-xs font-bold py-3 hover:no-underline">
                    How to access Admin Dashboard?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground space-y-3 pb-4">
                    <div className="flex gap-2">
                      <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">1</div>
                      <p><Link href="/register" className="text-primary font-bold underline">Register</Link> a new account first.</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">2</div>
                      <p>Go to your <span className="font-bold">Firebase Console</span> &gt; <span className="font-bold">Firestore Database</span>.</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">3</div>
                      <p>Locate your document in the <code className="bg-primary/10 px-1 rounded">users</code> collection.</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">4</div>
                      <p>Update the <code className="bg-primary/10 px-1 rounded">role</code> field from <span className="italic">"passenger"</span> to <span className="font-bold text-primary italic">"admin"</span>.</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">5</div>
                      <p>Log out and sign back in to see the Admin Dashboard.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t py-4">
            <p className="text-sm text-muted-foreground">
              New to TrackBooker? <Link href="/register" className="text-primary font-bold hover:underline">Register Now</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
