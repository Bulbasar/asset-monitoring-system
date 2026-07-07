"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageTitle } from "@/components/layout/PageTitle";
import {
  FolderTree,
  Tag,
  Factory,
  Boxes,
  Truck,
  UserCog,
  Building,
  MapPin,
} from "lucide-react";

const cmsModules = [
  { name: "Categories", href: "/cms/categories", icon: FolderTree },
  { name: "Brands", href: "/cms/brands", icon: Tag },
  { name: "Manufacturers", href: "/cms/manufacturers", icon: Factory },
  { name: "Models", href: "/cms/models", icon: Boxes },
  { name: "Suppliers", href: "/cms/suppliers", icon: Truck },
  { name: "Roles", href: "/cms/roles", icon: UserCog },
  { name: "Departments", href: "/cms/departments", icon: Building },
  { name: "Locations", href: "/cms/locations", icon: MapPin },
];

// Sort modules alphabetically by name
const sortedModules = [...cmsModules].sort((a, b) =>
  a.name.localeCompare(b.name),
);

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if we're on the overview page
  const isOverview = pathname === "/cms";

  const getPageTitle = () => {
    if (isOverview) {
      return "Content Management System";
    }
    const module = sortedModules.find((m) => pathname === m.href);
    return module?.name || "CMS";
  };

  const getPageSubtitle = () => {
    if (isOverview) {
      return "Manage all your master data from one place";
    }
    const module = sortedModules.find((m) => pathname === m.href);
    return module ? `Manage ${module.name.toLowerCase()} in the system` : "";
  };

  return (
    <div>
      <PageTitle title={getPageTitle()} subtitle={getPageSubtitle()} />

      {/* Sub-navigation tabs */}
      <div className="mb-6 border-b border-border transition-colors duration-300">
        <nav className="flex gap-1 overflow-x-auto">
          {sortedModules.map((module) => {
            const isActive = pathname === module.href;
            const Icon = module.icon;
            return (
              <Link
                key={module.href}
                href={module.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-300 border-b-2 whitespace-nowrap",
                  isActive
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors duration-300",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                />
                {module.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {children}
    </div>
  );
}
