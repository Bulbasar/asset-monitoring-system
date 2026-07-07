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
  Database,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Assets", href: "/assets", icon: Package },
  { name: "CMS", href: "/cms", icon: Database },
  { name: "Maintenance", href: "/maintenance", icon: Wrench },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Users", href: "/users", icon: Users },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <aside className="w-64 min-h-screen flex flex-col flex-shrink-0 bg-sidebar text-sidebar border-r border-sidebar transition-colors duration-300">
      <div className="p-4 border-b border-sidebar">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sidebar border border-sidebar">
            <Building2 className="w-5 h-5 text-sidebar" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar">AMS</h1>
            <p className="text-xs text-muted-foreground">
              Asset Monitoring System
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0 transition-colors duration-200",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-sidebar text-xs text-muted-foreground">
        v0.1.0
      </div>
    </aside>
  );
}
