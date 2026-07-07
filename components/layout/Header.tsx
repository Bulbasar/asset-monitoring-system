"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/Button";
import { LogOut, User, Sun, Moon } from "lucide-react";

export function Header() {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full bg-header border-b border-header px-6 py-4 transition-colors duration-300 flex-shrink-0">
      <div className="flex items-center justify-between max-w-full">
        <div>
          <h2 className="text-xl font-semibold text-header">
            Welcome back,{" "}
            {profile?.display_name || user?.email?.split("@")[0] || "User"}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-secondary hover:bg-muted transition-colors duration-300 border border-border"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-foreground" />
            ) : (
              <Sun className="w-5 h-5 text-foreground" />
            )}
          </button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>{profile?.display_name || "Loading..."}</span>
          </div>
          <Button variant="secondary" size="sm" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
