"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Home, ArrowLeft, Building2 } from "lucide-react";

export default function NotFound() {
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
            404
          </h1>
          <p className="text-sm text-muted-foreground mt-1 transition-colors duration-300">
            Oops! Page not found
          </p>
        </div>

        <Card className="relative overflow-hidden border border-border shadow-sm">
          {/* Decorative bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

          <CardHeader className="space-y-1 pt-8">
            <CardTitle className="text-2xl font-semibold text-center text-foreground transition-colors duration-300">
              Lost your way?
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center transition-colors duration-300">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </CardHeader>

          <CardContent className="pt-2 pb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/login" className="w-full sm:w-auto">
                <Button className="w-full flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Go to Login
                </Button>
              </Link>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-3 bg-card text-muted-foreground transition-colors duration-300">
                  Need help?
                </span>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground transition-colors duration-300">
              If you believe this is a mistake, please contact your
              administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
