"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function usePermission() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadPermissions = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase.rpc("has_permission", { p_code: "" });

        // We need a different approach - let's get all user permissions
        const { data: profile } = await supabase
          .from("profiles")
          .select("role_id")
          .eq("id", user.id)
          .single();

        if (profile) {
          const { data: perms } = await supabase
            .from("role_permissions")
            .select("permission_id")
            .eq("role_id", profile.role_id);

          if (perms) {
            const { data: permCodes } = await supabase
              .from("permissions")
              .select("code")
              .in(
                "id",
                perms.map((p) => p.permission_id),
              );

            setPermissions(permCodes?.map((p) => p.code) || []);
          }
        }
      }

      setLoading(false);
    };

    loadPermissions();
  }, []);

  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  return { permissions, hasPermission, loading };
}
