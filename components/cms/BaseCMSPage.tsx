"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

interface BaseCMSPageProps<T> {
  fetchData: () => Promise<T[]>;
  permission: string;
  moduleName: string;
  renderContent: (props: {
    data: T[];
    loading: boolean;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    canManage: boolean;
    refresh: () => Promise<void>;
    openModal: (item?: T) => void;
    handleDelete: (id: string) => Promise<void>;
  }) => React.ReactNode;
}

export function BaseCMSPage<T>({
  fetchData,
  permission,
  moduleName,
  renderContent,
}: BaseCMSPageProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [canView, setCanView] = useState<boolean | null>(null);
  const [canManage, setCanManage] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    // This would need to be implemented with your permission system
    // For now, we'll assume the permission is passed in
    setCanView(true);
    setCanManage(true);
    setIsInitialLoad(false);
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchData();
      setData(result);
      toast.success(`${moduleName} refreshed successfully`);
    } catch (error) {
      toast.error(`Failed to refresh ${moduleName}`);
    } finally {
      setLoading(false);
    }
  }, [fetchData, moduleName]);

  useEffect(() => {
    if (canView) {
      refresh();
    }
  }, [canView, refresh]);

  // Don't show anything during initial permission check
  if (isInitialLoad) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Access denied - no flash, just show the message
  if (canView === false) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 text-center">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You don't have permission to view {moduleName.toLowerCase()}.
              Please contact your administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return renderContent({
    data,
    loading,
    searchTerm,
    setSearchTerm,
    canManage,
    refresh,
    openModal: () => {},
    handleDelete: async () => {},
  });
}
