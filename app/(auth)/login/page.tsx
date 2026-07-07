"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  Sun,
  Moon,
  Building2,
  Shield,
  Lock,
  Mail,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", session.user.id)
            .maybeSingle();

          if (profile) {
            router.replace("/dashboard");
            return;
          } else {
            console.log("Profile not found for user, signing out");
            await supabase.auth.signOut();
          }
        }
        setIsCheckingAuth(false);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsCheckingAuth(false);
      }
    };

    checkSession();
  }, [router, supabase]);

  if (isCheckingAuth || !isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#121212] transition-colors duration-300">
        <div className="text-[#888888] dark:text-[#B0B0B0]">Loading...</div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profile) {
          router.replace("/dashboard");
        } else {
          setError("User profile not found. Please contact administrator.");
          setLoading(false);
          await supabase.auth.signOut();
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-[#121212] transition-colors duration-300">
      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-2 rounded-full bg-[#F4F4F4] dark:bg-[#2C2C2C] border border-[#E0E0E0] dark:border-[#444444] shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 z-50"
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon className="w-5 h-5 text-[#121212]" />
        ) : (
          <Sun className="w-5 h-5 text-[#E0E0E0]" />
        )}
      </button>

      <div className="relative w-full max-w-[420px]">
        {/* Logo/Brand section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#121212] dark:bg-[#E0E0E0] shadow-sm mb-4">
            <Building2 className="w-8 h-8 text-white dark:text-[#121212]" />
          </div>
          <h1 className="text-3xl font-bold text-[#121212] dark:text-[#E0E0E0] transition-colors duration-300">
            Asset Monitor
          </h1>
          <p className="text-sm text-[#888888] dark:text-[#B0B0B0] mt-1 transition-colors duration-300">
            Enterprise Asset Management System
          </p>
        </div>

        <Card className="relative overflow-hidden border border-[#E0E0E0] dark:border-[#444444] shadow-sm">
          {/* Decorative bar - monochromatic */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#121212] dark:bg-[#E0E0E0]" />

          <CardHeader className="space-y-1 pt-8">
            <CardTitle className="text-2xl font-semibold text-center text-[#121212] dark:text-[#E0E0E0] transition-colors duration-300">
              Welcome Back
            </CardTitle>
            <p className="text-sm text-[#888888] dark:text-[#B0B0B0] text-center transition-colors duration-300">
              Sign in to your account to continue
            </p>
          </CardHeader>

          <CardContent className="pt-2 pb-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#121212] dark:text-[#E0E0E0] mb-1.5 transition-colors duration-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888] dark:text-[#B0B0B0]" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-[#F4F4F4]/50 dark:bg-[#2C2C2C]/50 border-[#E0E0E0] dark:border-[#444444] focus:ring-2 focus:ring-[#121212]/20 dark:focus:ring-[#E0E0E0]/20 transition-all duration-200 text-[#121212] dark:text-[#E0E0E0] placeholder:text-[#888888] dark:placeholder:text-[#B0B0B0]"
                      placeholder="admin@example.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-[#121212] dark:text-[#E0E0E0] transition-colors duration-300">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-xs text-[#888888] dark:text-[#B0B0B0] hover:text-[#121212] dark:hover:text-[#E0E0E0] transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888] dark:text-[#B0B0B0]" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-[#F4F4F4]/50 dark:bg-[#2C2C2C]/50 border-[#E0E0E0] dark:border-[#444444] focus:ring-2 focus:ring-[#121212]/20 dark:focus:ring-[#E0E0E0]/20 transition-all duration-200 text-[#121212] dark:text-[#E0E0E0] placeholder:text-[#888888] dark:placeholder:text-[#B0B0B0]"
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm p-3 rounded-lg border border-red-200 dark:border-red-800/30">
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#121212] dark:bg-[#E0E0E0] hover:bg-[#333333] dark:hover:bg-[#FFFFFF] text-white dark:text-[#121212] shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] group"
                disabled={loading}
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E0E0E0] dark:border-[#444444]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-3 bg-white dark:bg-[#121212] text-[#888888] dark:text-[#B0B0B0] transition-colors duration-300">
                    Secure Access
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-[#888888] dark:text-[#B0B0B0] transition-colors duration-300">
                <Shield className="w-3 h-3" />
                <span>Protected by Supabase Authentication</span>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-[#B0B0B0] dark:text-[#888888] mt-6 transition-colors duration-300">
          © {new Date().getFullYear()} Asset Monitor. All rights reserved.
        </p>
      </div>
    </div>
  );
}
