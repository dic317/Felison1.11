import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/theme-toggle";
import { Link } from "wouter";

export default function Header() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
      <nav className="relative z-10 container mx-auto px-4 py-6 max-w-md">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center animate-pulse-glow">
              <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 9.74s9-4.19 9-9.74V7l-10-5z"/>
                <path d="M8 11h8v2H8z"/>
                <path d="M10 7h4v2h-4z"/>
                <path d="M10 15h4v2h-4z"/>
              </svg>
            </div>
            <h1 className="tracking-wider font-extralight text-[21px]">FELISON</h1>
          </Link>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="glass-effect">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="glass-effect">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
