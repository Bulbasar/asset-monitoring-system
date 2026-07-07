"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/providers/ThemeProvider";

interface Permission {
  id: string;
  code: string;
  name: string;
  module: string;
  description?: string;
}

interface PermissionManagerProps {
  roleId: string;
  onSave?: () => void;
}

export function PermissionManager({ roleId, onSave }: PermissionManagerProps) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Set<string>>(
    new Set(),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const { theme } = useTheme();
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, [roleId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load all permissions
      const { data: allPermissions, error: permError } = await supabase
        .from("permissions")
        .select("*")
        .order("module", { ascending: true })
        .order("name", { ascending: true });

      if (permError) throw permError;

      // Load role's current permissions
      const { data: rolePerms, error: rolePermError } = await supabase
        .from("role_permissions")
        .select("permission_id")
        .eq("role_id", roleId);

      if (rolePermError) throw rolePermError;

      setPermissions(allPermissions || []);
      setRolePermissions(
        new Set(rolePerms?.map((rp) => rp.permission_id) || []),
      );
    } catch (error: any) {
      console.error("Error loading permissions:", error);
      toast.error("Failed to load permissions");
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permissionId: string) => {
    const newSet = new Set(rolePermissions);
    if (newSet.has(permissionId)) {
      newSet.delete(permissionId);
    } else {
      newSet.add(permissionId);
    }
    setRolePermissions(newSet);
  };

  const savePermissions = async () => {
    setSaving(true);
    try {
      // Get current permissions for this role
      const { data: currentPerms, error: fetchError } = await supabase
        .from("role_permissions")
        .select("permission_id")
        .eq("role_id", roleId);

      if (fetchError) throw fetchError;

      const currentSet = new Set(
        currentPerms?.map((p) => p.permission_id) || [],
      );
      const newSet = rolePermissions;

      // Find permissions to add and remove
      const toAdd = [...newSet].filter((id) => !currentSet.has(id));
      const toRemove = [...currentSet].filter((id) => !newSet.has(id));

      // Add new permissions
      if (toAdd.length > 0) {
        const { error: addError } = await supabase
          .from("role_permissions")
          .insert(
            toAdd.map((permission_id) => ({ role_id: roleId, permission_id })),
          );

        if (addError) throw addError;
      }

      // Remove permissions
      if (toRemove.length > 0) {
        const { error: removeError } = await supabase
          .from("role_permissions")
          .delete()
          .eq("role_id", roleId)
          .in("permission_id", toRemove);

        if (removeError) throw removeError;
      }

      toast.success("Permissions updated successfully!");
      if (onSave) onSave();
    } catch (error: any) {
      console.error("Error saving permissions:", error);
      toast.error(error.message || "Failed to save permissions");
    } finally {
      setSaving(false);
    }
  };

  const modules = ["all", ...new Set(permissions.map((p) => p.module))];
  const filteredPermissions = permissions.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.module.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule =
      selectedModule === "all" || p.module === selectedModule;
    return matchesSearch && matchesModule;
  });

  const groupedPermissions = filteredPermissions.reduce(
    (acc, p) => {
      if (!acc[p.module]) acc[p.module] = [];
      acc[p.module].push(p);
      return acc;
    },
    {} as Record<string, Permission[]>,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-[#888888] dark:text-[#B0B0B0]" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "w-full rounded-lg border px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 transition-all duration-200",
              isDark
                ? "bg-[#121212] border-[#444444] text-[#E0E0E0] placeholder:text-[#B0B0B0] focus:ring-[#E0E0E0]/20"
                : "bg-white border-[#E0E0E0] text-[#121212] placeholder:text-[#888888] focus:ring-[#121212]/20",
            )}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] dark:text-[#B0B0B0] hover:text-[#121212] dark:hover:text-[#E0E0E0]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          className={cn(
            "rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 transition-all duration-200",
            isDark
              ? "bg-[#121212] border-[#444444] text-[#E0E0E0] focus:ring-[#E0E0E0]/20"
              : "bg-white border-[#E0E0E0] text-[#121212] focus:ring-[#121212]/20",
          )}
        >
          {modules.map((module) => (
            <option key={module} value={module}>
              {module === "all" ? "All Modules" : module}
            </option>
          ))}
        </select>
      </div>

      {/* Permissions Grid */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {Object.entries(groupedPermissions).length === 0 ? (
          <div className="text-center py-8 text-[#888888] dark:text-[#B0B0B0]">
            No permissions found
          </div>
        ) : (
          Object.entries(groupedPermissions).map(([module, perms]) => (
            <div key={module} className="space-y-2">
              <h4 className="text-sm font-medium text-[#888888] dark:text-[#B0B0B0] uppercase tracking-wider">
                {module}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {perms.map((permission) => {
                  const isChecked = rolePermissions.has(permission.id);
                  return (
                    <button
                      key={permission.id}
                      onClick={() => togglePermission(permission.id)}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 text-left",
                        isChecked
                          ? isDark
                            ? "border-[#E0E0E0] bg-[#2C2C2C]"
                            : "border-[#121212] bg-[#F4F4F4]"
                          : isDark
                            ? "border-[#444444] hover:border-[#E0E0E0] hover:bg-[#2C2C2C]"
                            : "border-[#E0E0E0] hover:border-[#121212] hover:bg-[#F4F4F4]",
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all duration-200",
                          isChecked
                            ? isDark
                              ? "bg-[#E0E0E0] border-[#E0E0E0]"
                              : "bg-[#121212] border-[#121212]"
                            : isDark
                              ? "border-[#444444]"
                              : "border-[#E0E0E0]",
                        )}
                      >
                        {isChecked && (
                          <Check
                            className={cn(
                              "w-3 h-3",
                              isDark ? "text-[#121212]" : "text-white",
                            )}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={cn(
                            "text-sm font-medium truncate",
                            isDark ? "text-[#E0E0E0]" : "text-[#121212]",
                          )}
                        >
                          {permission.name}
                        </div>
                        <div
                          className={cn(
                            "text-xs truncate",
                            isDark ? "text-[#B0B0B0]" : "text-[#888888]",
                          )}
                        >
                          {permission.code}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats and Save */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E0E0E0] dark:border-[#444444]">
        <div className="text-sm text-[#888888] dark:text-[#B0B0B0]">
          {rolePermissions.size} of {permissions.length} permissions selected
        </div>
        <Button
          onClick={savePermissions}
          disabled={saving}
          className="min-w-[120px]"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Permissions"
          )}
        </Button>
      </div>
    </div>
  );
}
