"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
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
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Check,
  Loader2,
  Lock,
  Eye,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { usePermission } from "@/hooks/usePermissions";
import { Brand } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    manufacturer_id: "",
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "delete" | "create" | "update";
    id?: string;
    title: string;
    description: string;
    variant?: "danger" | "warning" | "info";
    onConfirmAction?: () => Promise<void>;
  }>({
    isOpen: false,
    type: "delete",
    title: "",
    description: "",
    variant: "danger",
  });
  const { hasPermission } = usePermission();
  const supabase = createClient();

  const canView = hasPermission("brand.view");
  const canManage = hasPermission("brand.manage");

  const loadData = useCallback(async () => {
    if (!canView) return;

    setLoading(true);
    try {
      const [brandsRes, manufacturersRes] = await Promise.all([
        supabase
          .from("brands")
          .select(
            `
            *,
            manufacturers(id, name)
          `,
          )
          .order("name", { ascending: true }),
        supabase
          .from("manufacturers")
          .select("id, name")
          .eq("is_active", true)
          .order("name", { ascending: true }),
      ]);

      if (brandsRes.error) throw brandsRes.error;
      if (manufacturersRes.error) throw manufacturersRes.error;

      setBrands(brandsRes.data || []);
      setManufacturers(manufacturersRes.data || []);
    } catch (error: any) {
      console.error("Error loading brands:", error);
      toast.error("Failed to load brands");
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [canView, supabase]);

  useEffect(() => {
    if (canView) {
      loadData();
    } else {
      setIsInitialLoad(false);
    }
  }, [canView, loadData]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.code.trim()) errors.code = "Code is required";
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.manufacturer_id)
      errors.manufacturer_id = "Manufacturer is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const performSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (editingBrand) {
        const { error } = await supabase
          .from("brands")
          .update({
            code: formData.code,
            name: formData.name,
            description: formData.description,
            manufacturer_id: formData.manufacturer_id,
          })
          .eq("id", editingBrand.id);

        if (error) throw error;
        toast.success("Brand updated successfully!");
      } else {
        const { error } = await supabase
          .from("brands")
          .insert([{ ...formData, is_active: true }]);

        if (error) throw error;
        toast.success("Brand created successfully!");
      }

      await loadData();
      closeModal();
    } catch (error: any) {
      console.error("Error saving brand:", error);
      toast.error(error.message || "Failed to save brand");
      setFormErrors({ submit: error.message || "Failed to save brand" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;
    if (!validateForm()) return;

    const isEditing = !!editingBrand;
    openConfirmDialog({
      type: isEditing ? "update" : "create",
      title: isEditing ? "Update Brand" : "Create Brand",
      description: isEditing
        ? `Are you sure you want to update the brand "${formData.name}"?`
        : `Are you sure you want to create a new brand "${formData.name}"?`,
      variant: "info",
      onConfirmAction: performSubmit,
    });
  };

  const handleDelete = async (id: string) => {
    if (!canManage) return;

    try {
      const { error } = await supabase
        .from("brands")
        .update({ is_active: false, deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      toast.success("Brand deleted successfully!");
      await loadData();
    } catch (error: any) {
      console.error("Error deleting brand:", error);
      toast.error(error.message || "Failed to delete brand");
    }
  };

  const openModal = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({
        code: brand.code,
        name: brand.name,
        description: brand.description || "",
        manufacturer_id: brand.manufacturer_id,
      });
    } else {
      setEditingBrand(null);
      setFormData({
        code: "",
        name: "",
        description: "",
        manufacturer_id: "",
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
    setFormData({
      code: "",
      name: "",
      description: "",
      manufacturer_id: "",
    });
    setFormErrors({});
    setIsSubmitting(false);
  };

  const openConfirmDialog = (props: {
    type: "delete" | "create" | "update";
    id?: string;
    title: string;
    description: string;
    variant?: "danger" | "warning" | "info";
    onConfirmAction?: () => Promise<void>;
  }) => {
    setConfirmDialog({
      isOpen: true,
      type: props.type,
      id: props.id,
      title: props.title,
      description: props.description,
      variant: props.variant || "danger",
      onConfirmAction: props.onConfirmAction,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      type: "delete",
      id: undefined,
      title: "",
      description: "",
      variant: "danger",
      onConfirmAction: undefined,
    });
  };

  const handleConfirmAction = async () => {
    if (confirmDialog.onConfirmAction) {
      await confirmDialog.onConfirmAction();
    } else if (confirmDialog.id && confirmDialog.type === "delete") {
      await handleDelete(confirmDialog.id);
    }
    closeConfirmDialog();
  };

  const handleDeleteConfirm = (id: string, name: string) => {
    openConfirmDialog({
      type: "delete",
      id,
      title: `Delete Brand "${name}"`,
      description: `Are you sure you want to delete the brand "${name}"? This action cannot be undone.`,
      variant: "danger",
    });
  };

  const filteredBrands = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.manufacturers?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isInitialLoad) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#888888] dark:text-[#B0B0B0]" />
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 text-center">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#121212] dark:text-[#E0E0E0] mb-2">
              Access Denied
            </h3>
            <p className="text-sm text-[#888888] dark:text-[#B0B0B0]">
              You don't have permission to view brands. Please contact your
              administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888] dark:text-[#B0B0B0]" />
          <Input
            className="pl-9"
            placeholder="Search brands by name, code, or manufacturer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
        {canManage && (
          <Button onClick={() => openModal()} className="flex-shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Add Brand
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-[#888888] dark:text-[#B0B0B0]">
        <span>
          Total:{" "}
          <strong className="text-[#121212] dark:text-[#E0E0E0]">
            {brands.length}
          </strong>
        </span>
        <span>
          Active:{" "}
          <strong className="text-green-600 dark:text-green-400">
            {brands.filter((b) => b.is_active).length}
          </strong>
        </span>
        {searchTerm && (
          <span>
            Results:{" "}
            <strong className="text-[#121212] dark:text-[#E0E0E0]">
              {filteredBrands.length}
            </strong>
          </span>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Code</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Manufacturer</TableHeaderCell>
                <TableHeaderCell>Description</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">
                  Actions
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2 text-[#888888] dark:text-[#B0B0B0]">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading brands...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredBrands.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-[#888888] dark:text-[#B0B0B0]"
                  >
                    {searchTerm ? (
                      <>
                        No brands found matching "<strong>{searchTerm}</strong>"
                      </>
                    ) : (
                      <>
                        No brands found.{" "}
                        {canManage && (
                          <button
                            onClick={() => openModal()}
                            className="text-[#121212] dark:text-[#E0E0E0] hover:underline"
                          >
                            Create your first brand!
                          </button>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredBrands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell className="font-medium text-[#121212] dark:text-[#E0E0E0]">
                      {brand.code}
                    </TableCell>
                    <TableCell className="text-[#121212] dark:text-[#E0E0E0]">
                      {brand.name}
                    </TableCell>
                    <TableCell className="text-[#121212] dark:text-[#E0E0E0]">
                      {brand.manufacturers?.name || "-"}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-[#121212] dark:text-[#E0E0E0]">
                      {brand.description || "-"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                          brand.is_active
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                        )}
                      >
                        {brand.is_active ? (
                          <>
                            <Check className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          "Inactive"
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {canManage ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openModal(brand)}
                              className="hover:bg-[#F4F4F4] dark:hover:bg-[#2C2C2C]"
                              title="Edit brand"
                            >
                              <Edit className="w-4 h-4 text-[#121212] dark:text-[#E0E0E0]" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteConfirm(brand.id, brand.name)
                              }
                              className="hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Delete brand"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="cursor-default"
                            title="View only"
                          >
                            <Eye className="w-4 h-4 text-[#888888] dark:text-[#B0B0B0]" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingBrand ? "Edit Brand" : "Add Brand"}
        className="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formErrors.submit && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-sm text-red-600 dark:text-red-400">
              {formErrors.submit}
            </div>
          )}
          <Input
            label="Code"
            value={formData.code}
            onChange={(e) => {
              setFormData({ ...formData, code: e.target.value.toUpperCase() });
              setFormErrors({ ...formErrors, code: "" });
            }}
            error={formErrors.code}
            required
            disabled={!!editingBrand}
            className="uppercase"
            placeholder="e.g., BR-001"
          />
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setFormErrors({ ...formErrors, name: "" });
            }}
            error={formErrors.name}
            required
            placeholder="e.g., Apple, Samsung, Dell"
          />
          <SearchableSelect
            label="Manufacturer"
            options={manufacturers.map((m) => ({
              value: m.id,
              label: m.name,
            }))}
            value={formData.manufacturer_id}
            onChange={(value) => {
              setFormData({ ...formData, manufacturer_id: value });
              setFormErrors({ ...formErrors, manufacturer_id: "" });
            }}
            error={formErrors.manufacturer_id}
            required
            placeholder="Search and select manufacturer..."
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Brief description of the brand"
          />
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E0E0E0] dark:border-[#444444]">
            <Button
              variant="ghost"
              onClick={closeModal}
              type="button"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {editingBrand ? "Updating..." : "Creating..."}
                </>
              ) : editingBrand ? (
                "Update Brand"
              ) : (
                "Create Brand"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={handleConfirmAction}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText={
          confirmDialog.type === "delete"
            ? "Delete"
            : confirmDialog.type === "create"
              ? "Create"
              : "Update"
        }
        cancelText="Cancel"
        variant={confirmDialog.variant || "danger"}
        isLoading={isSubmitting}
      />
    </div>
  );
}
