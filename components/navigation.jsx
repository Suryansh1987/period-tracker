"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CalendarDays, Home, Settings } from "lucide-react"; // BarChart3 isn't used (yet?)

// Might add more nav items later
const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Navigation() {
  const currentPath = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo/Brand Section */}
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <CalendarDays className="h-6 w-6 text-pink-500" />
            <span className="font-bold text-lg">Period Tracker</span>
          </Link>
        </div>

        {/* Navigation links */}
        <div className="flex flex-1 items-center justify-end space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                    isActive
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <link.icon className="h-4 w-4 mr-2" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
