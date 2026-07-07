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
  Edit,
  Trash2,
  Check,
  Loader2,
  Lock,
  Eye,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PaginatedTable } from "@/components/ui/PaginatedTable";
import { usePermission } from "@/hooks/usePermissions";
import { Manufacturer } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { handleDuplicateError } from "@/lib/validation";

export default function ManufacturersPage() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingManufacturer, setEditingManufacturer] =
    useState<Manufacturer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    website_url: "",
    country_of_origin: "",
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

  const canView = hasPermission("manufacturer.view");
  const canManage = hasPermission("manufacturer.manage");

  const loadManufacturers = useCallback(async () => {
    if (!canView) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("manufacturers")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setManufacturers(data || []);
    } catch (error: any) {
      console.error("Error loading manufacturers:", error);
      toast.error("Failed to load manufacturers", { position: "top-center" });
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [canView, supabase]);

  useEffect(() => {
    if (canView) {
      loadManufacturers();
    } else {
      setIsInitialLoad(false);
    }
  }, [canView, loadManufacturers]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.code.trim()) errors.code = "Code is required";
    if (!formData.name.trim()) errors.name = "Name is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const performSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (editingManufacturer) {
        const { error } = await supabase
          .from("manufacturers")
          .update(formData)
          .eq("id", editingManufacturer.id);

        if (error) {
          if (handleDuplicateError(error, "Manufacturer")) {
            setIsSubmitting(false);
            return;
          }
          throw error;
        }
        toast.success("Manufacturer updated successfully!", {
          position: "top-center",
        });
      } else {
        const { error } = await supabase
          .from("manufacturers")
          .insert([{ ...formData, is_active: true }]);

        if (error) {
          if (handleDuplicateError(error, "Manufacturer")) {
            setIsSubmitting(false);
            return;
          }
          throw error;
        }
        toast.success("Manufacturer created successfully!", {
          position: "top-center",
        });
      }

      await loadManufacturers();
      closeModal();
    } catch (error: any) {
      console.error("Error saving manufacturer:", error);
      toast.error(error.message || "Failed to save manufacturer", {
        position: "top-center",
      });
      setFormErrors({ submit: error.message || "Failed to save manufacturer" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;
    if (!validateForm()) return;

    const isEditing = !!editingManufacturer;
    openConfirmDialog({
      type: isEditing ? "update" : "create",
      title: isEditing ? "Update Manufacturer" : "Create Manufacturer",
      description: isEditing
        ? `Are you sure you want to update the manufacturer "${formData.name}"?`
        : `Are you sure you want to create a new manufacturer "${formData.name}"?`,
      variant: "info",
      onConfirmAction: performSubmit,
    });
  };

  const handleDelete = async (id: string) => {
    if (!canManage) return;

    try {
      const { error } = await supabase
        .from("manufacturers")
        .update({ is_active: false, deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      toast.success("Manufacturer deleted successfully!", {
        position: "top-center",
      });
      await loadManufacturers();
    } catch (error: any) {
      console.error("Error deleting manufacturer:", error);
      toast.error(error.message || "Failed to delete manufacturer", {
        position: "top-center",
      });
    }
  };

  const openModal = (manufacturer?: Manufacturer) => {
    if (manufacturer) {
      setEditingManufacturer(manufacturer);
      setFormData({
        code: manufacturer.code,
        name: manufacturer.name,
        description: manufacturer.description || "",
        website_url: manufacturer.website_url || "",
        country_of_origin: manufacturer.country_of_origin || "",
      });
    } else {
      setEditingManufacturer(null);
      setFormData({
        code: "",
        name: "",
        description: "",
        website_url: "",
        country_of_origin: "",
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingManufacturer(null);
    setFormData({
      code: "",
      name: "",
      description: "",
      website_url: "",
      country_of_origin: "",
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
      title: `Delete Manufacturer "${name}"`,
      description: `Are you sure you want to delete the manufacturer "${name}"? This action cannot be undone.`,
      variant: "danger",
    });
  };

  if (isInitialLoad) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 text-center">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-destructive/10 mb-4">
              <Lock className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Access Denied
            </h3>
            <p className="text-sm text-muted-foreground">
              You don't have permission to view manufacturers. Please contact
              your administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Total:{" "}
            <strong className="text-foreground font-semibold">
              {manufacturers.length}
            </strong>
          </span>
          <span>
            Active:{" "}
            <strong className="text-green-600 dark:text-green-400">
              {manufacturers.filter((m) => m.is_active).length}
            </strong>
          </span>
        </div>
        {canManage && (
          <Button
            onClick={() => openModal()}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Manufacturer
          </Button>
        )}
      </div>

      <PaginatedTable
        data={manufacturers}
        searchFields={["name", "code", "country_of_origin"]}
        searchPlaceholder="Search manufacturers..."
      >
        {(paginatedData) => (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Code</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Country</TableHeaderCell>
                <TableHeaderCell>Website</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">
                  Actions
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((manufacturer) => (
                <TableRow key={manufacturer.id}>
                  <TableCell className="text-foreground font-medium">
                    {manufacturer.code}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {manufacturer.name}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {manufacturer.country_of_origin || "-"}
                  </TableCell>
                  <TableCell>
                    {manufacturer.website_url ? (
                      <a
                        href={manufacturer.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:underline inline-flex items-center gap-1"
                      >
                        Visit
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        manufacturer.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                      )}
                    >
                      {manufacturer.is_active ? (
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
                            onClick={() => openModal(manufacturer)}
                            className="hover:bg-secondary"
                            title="Edit manufacturer"
                          >
                            <Edit className="w-4 h-4 text-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteConfirm(
                                manufacturer.id,
                                manufacturer.name,
                              )
                            }
                            className="hover:bg-destructive/10"
                            title="Delete manufacturer"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="cursor-default"
                          title="View only"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </PaginatedTable>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingManufacturer ? "Edit Manufacturer" : "Add Manufacturer"}
        className="max-w-md"
        staticBackdrop={true}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formErrors.submit && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
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
            disabled={!!editingManufacturer}
            className="uppercase"
            placeholder="e.g., MFR-001"
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
            placeholder="e.g., Apple Inc."
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Brief description"
          />
          <Input
            label="Country of Origin"
            value={formData.country_of_origin}
            onChange={(e) =>
              setFormData({ ...formData, country_of_origin: e.target.value })
            }
            placeholder="e.g., USA"
          />
          <Input
            label="Website URL"
            type="url"
            value={formData.website_url}
            onChange={(e) =>
              setFormData({ ...formData, website_url: e.target.value })
            }
            placeholder="https://example.com"
          />
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
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
                  {editingManufacturer ? "Updating..." : "Creating..."}
                </>
              ) : editingManufacturer ? (
                "Update Manufacturer"
              ) : (
                "Create Manufacturer"
              )}
            </Button>
          </div>
        </form>
      </Modal>

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
        staticBackdrop={true}
      />
    </div>
  );
}
