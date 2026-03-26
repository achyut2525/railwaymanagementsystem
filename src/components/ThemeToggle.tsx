"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(savedTheme || (isDark ? "dark" : "light"));
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      className="rounded-full h-10 w-10 transition-colors hover:bg-accent"
    >
      {theme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-primary" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-accent" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}