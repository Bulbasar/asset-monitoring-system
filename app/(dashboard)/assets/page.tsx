"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/components/ui/Table";
import { Card, CardContent } from "@/components/ui/Card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { usePermission } from "@/hooks/usePermissions";

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = usePermission();
  const supabase = createClient();

  useEffect(() => {
    const loadAssets = async () => {
      const { data } = await supabase
        .from("assets")
        .select(
          `
          *,
          categories(name),
          locations(name),
          asset_statuses(name),
          asset_conditions(name)
        `,
        )
        .order("created_at", { ascending: false });

      setAssets(data || []);
      setLoading(false);
    };

    loadAssets();
  }, []);

  const canCreate = hasPermission("asset.create");

  return (
    <>
      <PageTitle
        title="Assets"
        subtitle="Manage your asset inventory"
        actions={
          canCreate && (
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Asset
            </Button>
          )
        }
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input className="pl-9" placeholder="Search assets..." />
            </div>
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Asset Code</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Category</TableHeaderCell>
                <TableHeaderCell>Location</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Condition</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    Loading assets...
                  </TableCell>
                </TableRow>
              ) : assets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No assets found. Create your first asset!
                  </TableCell>
                </TableRow>
              ) : (
                assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">
                      {asset.asset_code}
                    </TableCell>
                    <TableCell>{asset.asset_name}</TableCell>
                    <TableCell>{asset.categories?.name || "-"}</TableCell>
                    <TableCell>{asset.locations?.name || "-"}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {asset.asset_statuses?.name || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {asset.asset_conditions?.name || "-"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
