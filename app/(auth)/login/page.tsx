"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useTheme } from "@/components/providers/ThemeProvider";
import { toast } from "sonner";
import {
  Sun,
  Moon,
  Building2,
  Shield,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
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

  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      toast.error("Please enter your email address", {
        duration: 2000,
        position: "top-center",
      });
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      toast.error("Please enter a valid email address", {
        duration: 2000,
        position: "top-center",
      });
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      toast.error("Please enter your password", {
        duration: 2000,
        position: "top-center",
      });
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters", {
        duration: 2000,
        position: "top-center",
      });
      isValid = false;
    }

    return isValid;
  };

  if (isCheckingAuth || !isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    toast.loading("Signing in...", {
      id: "login",
      position: "top-center",
    });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      toast.dismiss("login");

      if (error) {
        // Don't reveal if email or password is wrong - generic error
        toast.error("Invalid email or password. Please try again.", {
          duration: 3000,
          position: "top-center",
        });
        setPasswordError("Invalid credentials");
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
          toast.success("Welcome back!", {
            id: "login-success",
            duration: 1500, // Short duration - quick dismiss
            position: "top-center",
          });
          // Small delay to let toast show before redirect
          setTimeout(() => {
            router.replace("/dashboard");
          }, 500);
        } else {
          toast.error("User profile not found. Please contact administrator.", {
            duration: 3000,
            position: "top-center",
          });
          setLoading(false);
          await supabase.auth.signOut();
        }
      }
    } catch (err: any) {
      toast.dismiss("login");
      toast.error("An error occurred during login. Please try again.", {
        duration: 3000,
        position: "top-center",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-theme transition-colors duration-300">
      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-2 rounded-full bg-secondary border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 z-50"
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon className="w-5 h-5 text-foreground" />
        ) : (
          <Sun className="w-5 h-5 text-foreground" />
        )}
      </button>

      <div className="relative w-full max-w-[420px]">
        {/* Logo/Brand section */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-sm mb-4"
            style={{ backgroundColor: "rgb(var(--primary))" }}
          >
            <Building2
              className="w-8 h-8"
              style={{ color: "rgb(var(--primary-foreground))" }}
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground transition-colors duration-300">
            Asset Monitor
          </h1>
          <p className="text-sm text-muted-foreground mt-1 transition-colors duration-300">
            Enterprise Asset Management System
          </p>
        </div>

        <Card className="relative overflow-hidden border border-border shadow-sm">
          {/* Decorative bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

          <CardHeader className="space-y-1 pt-8">
            <CardTitle className="text-2xl font-semibold text-center text-foreground transition-colors duration-300">
              Welcome Back
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center transition-colors duration-300">
              Sign in to your account to continue
            </p>
          </CardHeader>

          <CardContent className="pt-2 pb-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-foreground mb-1.5 transition-colors duration-300">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      className={`pl-10 ${emailError ? "border-destructive focus:ring-destructive/40" : ""}`}
                      placeholder="admin@example.com"
                      required
                      autoComplete="email"
                      disabled={loading}
                    />
                  </div>
                  {emailError && (
                    <p className="mt-1 text-sm text-destructive">
                      {emailError}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-foreground transition-colors duration-300">
                      Password <span className="text-destructive">*</span>
                    </label>
                    <button
                      type="button"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      className={`pl-10 pr-10 ${passwordError ? "border-destructive focus:ring-destructive/40" : ""}`}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="mt-1 text-sm text-destructive">
                      {passwordError}
                    </p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full group" disabled={loading}>
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
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-3 bg-card text-muted-foreground transition-colors duration-300">
                    Secure Access
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground transition-colors duration-300">
                <Shield className="w-3 h-3" />
                <span>Protected by Supabase Authentication</span>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6 transition-colors duration-300">
          © {new Date().getFullYear()} Asset Monitor. All rights reserved.
        </p>
      </div>
    </div>
  );
}
