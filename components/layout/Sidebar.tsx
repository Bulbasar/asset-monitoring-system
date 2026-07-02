"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Package,
  FolderTree,
  Tag,
  Factory,
  Boxes,
  Truck,
  Wrench,
  ArrowLeftRight,
  Users,
  BarChart3,
  Settings,
  Building2,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Assets", href: "/assets", icon: Package },
  { name: "Categories", href: "/categories", icon: FolderTree },
  { name: "Brands", href: "/brands", icon: Tag },
  { name: "Manufacturers", href: "/manufacturers", icon: Factory },
  { name: "Models", href: "/models", icon: Boxes },
  { name: "Suppliers", href: "/suppliers", icon: Truck },
  { name: "Maintenance", href: "/maintenance", icon: Wrench },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Users", href: "/users", icon: Users },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 min-h-screen flex flex-col transition-colors duration-300">
      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              AMS
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Asset Monitoring System
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-400 dark:text-gray-500",
                    )}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-slate-700 text-xs text-gray-400 dark:text-gray-500">
        v0.1.0
      </div>
    </aside>
  );
}
