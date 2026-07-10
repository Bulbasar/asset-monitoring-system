"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/Button";
import { LogOut, User, Sun, Moon, Menu } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <header className="h-16 bg-header border-b border-header px-4 flex items-center justify-between transition-colors duration-300 flex-shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-secondary transition-colors flex-shrink-0 cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
        )}
        <h2 className="text-base sm:text-lg font-semibold text-header truncate">
          Welcome back,{" "}
          <span className="text-primary">
            {profile?.display_name || user?.email?.split("@")[0] || "User"}
          </span>
        </h2>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-secondary hover:bg-muted transition-colors duration-300 border border-border"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          ) : (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          )}
        </button>

        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span className="max-w-[120px] truncate">
            {profile?.display_name || "Loading..."}
          </span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={signOut}
          className="flex items-center gap-1 sm:gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  );
}
