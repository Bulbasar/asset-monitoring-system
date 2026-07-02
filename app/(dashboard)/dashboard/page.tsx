"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PageTitle } from "@/components/layout/PageTitle";
import {
  Package,
  Wrench,
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

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
    {
      title: "Total Assets",
      value: stats.totalAssets,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      loading,
    },
    {
      title: "Active Assets",
      value: stats.activeAssets,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      loading,
    },
    {
      title: "Maintenance Due",
      value: stats.maintenanceDue,
      icon: Wrench,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      loading,
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      loading,
    },
  ];

  return (
    <>
      <PageTitle
        title="Dashboard"
        subtitle="Overview of your asset monitoring system"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    {stat.loading ? (
                      <div className="h-8 w-20 bg-gray-200 animate-pulse rounded mt-1"></div>
                    ) : (
                      <p className="text-2xl font-bold">{stat.value}</p>
                    )}
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No recent activity</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-500">Quick actions will appear here</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
