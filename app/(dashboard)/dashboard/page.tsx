"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PageTitle } from "@/components/layout/PageTitle";
import { Package, Wrench, Users, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalAssets: number;
  activeAssets: number;
  maintenanceDue: number;
  totalUsers: number;
  recentTransactions: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAssets: 0,
    activeAssets: 0,
    maintenanceDue: 0,
    totalUsers: 0,
    recentTransactions: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);

      const [
        { count: totalAssets },
        { count: activeAssets },
        { count: maintenanceDue },
        { count: totalUsers },
        { count: recentTransactions },
      ] = await Promise.all([
        supabase.from("assets").select("*", { count: "exact", head: true }),
        supabase
          .from("assets")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true),
        supabase
          .from("maintenance_logs")
          .select("*", { count: "exact", head: true })
          .gte("next_maintenance_date", new Date().toISOString().split("T")[0]),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true),
        supabase
          .from("asset_transactions")
          .select("*", { count: "exact", head: true })
          .gte(
            "created_at",
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          ),
      ]);

      setStats({
        totalAssets: totalAssets || 0,
        activeAssets: activeAssets || 0,
        maintenanceDue: maintenanceDue || 0,
        totalUsers: totalUsers || 0,
        recentTransactions: recentTransactions || 0,
      });
      setLoading(false);
    };

    loadStats();
  }, []);

  const statsCards = [
    { title: "Total Assets", value: stats.totalAssets, icon: Package },
    { title: "Active Assets", value: stats.activeAssets, icon: TrendingUp },
    { title: "Maintenance Due", value: stats.maintenanceDue, icon: Wrench },
    { title: "Total Users", value: stats.totalUsers, icon: Users },
  ];

  return (
    <>
      <PageTitle
        title="Dashboard"
        subtitle="Overview of your asset monitoring system"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground transition-colors duration-300">
                      {stat.title}
                    </p>
                    {loading ? (
                      <div className="h-8 w-20 bg-muted animate-pulse rounded mt-1"></div>
                    ) : (
                      <p className="text-2xl font-bold text-foreground transition-colors duration-300">
                        {stat.value}
                      </p>
                    )}
                  </div>
                  <div className="p-3 rounded-full bg-secondary">
                    <Icon className="w-6 h-6 text-foreground transition-colors duration-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent activity</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Quick actions will appear here
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
