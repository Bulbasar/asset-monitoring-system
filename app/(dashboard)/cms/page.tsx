"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Database } from "lucide-react";

export default function CMSPage() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 text-center">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-secondary mb-4">
            <Database className="w-8 h-8 text-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Welcome to CMS
          </h3>
          <p className="text-sm text-muted-foreground">
            Select a module from the tabs above to start managing your data.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground">
              Categories
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground">
              Brands
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground">
              Manufacturers
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground">
              Models
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground">
              Suppliers
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground">
              Roles
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground">
              Departments
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground">
              Locations
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
