"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="flex items-center justify-center h-full p-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Something went wrong
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="text-sm text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-theme transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={handleSidebarToggle} />
        <main className="flex-1 p-6 overflow-y-auto bg-theme transition-colors duration-300">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
