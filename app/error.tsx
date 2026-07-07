"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Home, RefreshCw, Building2 } from "lucide-react";
import { toast } from "sonner";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
    toast.error("Something went wrong. Please try again.", {
      position: "top-center",
      duration: 4000,
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-theme transition-colors duration-300">
      <div className="relative w-full max-w-md">
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
            Oops!
          </h1>
          <p className="text-sm text-muted-foreground mt-1 transition-colors duration-300">
            Something went wrong
          </p>
        </div>

        <Card className="relative overflow-hidden border border-border shadow-sm">
          {/* Decorative bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-destructive" />

          <CardHeader className="space-y-1 pt-8">
            <CardTitle className="text-2xl font-semibold text-center text-foreground transition-colors duration-300">
              Application Error
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center transition-colors duration-300">
              We encountered an unexpected error. Please try again or contact
              support if the problem persists.
            </p>
          </CardHeader>

          <CardContent className="pt-2 pb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={reset}
                className="w-full flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  variant="ghost"
                  className="w-full flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-3 bg-card text-muted-foreground transition-colors duration-300">
                  Error Details
                </span>
              </div>
            </div>

            <div className="bg-destructive/5 rounded-lg p-3 border border-destructive/20">
              <p className="text-xs text-destructive font-mono break-all">
                {error.message || "An unknown error occurred"}
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
