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
  Mail,
  Phone,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PaginatedTable } from "@/components/ui/PaginatedTable";
import { usePermission } from "@/hooks/usePermissions";
import { Supplier } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { handleDuplicateError } from "@/lib/validation";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    website_url: "",
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

  const canView = hasPermission("supplier.view");
  const canManage = hasPermission("supplier.manage");

  const loadSuppliers = useCallback(async () => {
    if (!canView) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error: any) {
      console.error("Error loading suppliers:", error);
      toast.error("Failed to load suppliers", { position: "top-center" });
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [canView, supabase]);

  useEffect(() => {
    if (canView) {
      loadSuppliers();
    } else {
      setIsInitialLoad(false);
    }
  }, [canView, loadSuppliers]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const performSubmit = async () => {
    setIsSubmitting(true);

    try {
      const supplierData = {
        ...formData,
        supplier_code: editingSupplier ? undefined : `SUP-${Date.now()}`,
        is_active: true,
      };

      if (editingSupplier) {
        const { error } = await supabase
          .from("suppliers")
          .update(formData)
          .eq("id", editingSupplier.id);

        if (error) {
          if (handleDuplicateError(error, "Supplier")) {
            setIsSubmitting(false);
            return;
          }
          throw error;
        }
        toast.success("Supplier updated successfully!", {
          position: "top-center",
        });
      } else {
        const { error } = await supabase
          .from("suppliers")
          .insert([supplierData]);

        if (error) {
          if (handleDuplicateError(error, "Supplier")) {
            setIsSubmitting(false);
            return;
          }
          throw error;
        }
        toast.success("Supplier created successfully!", {
          position: "top-center",
        });
      }

      await loadSuppliers();
      closeModal();
    } catch (error: any) {
      console.error("Error saving supplier:", error);
      toast.error(error.message || "Failed to save supplier", {
        position: "top-center",
      });
      setFormErrors({ submit: error.message || "Failed to save supplier" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;
    if (!validateForm()) return;

    const isEditing = !!editingSupplier;
    openConfirmDialog({
      type: isEditing ? "update" : "create",
      title: isEditing ? "Update Supplier" : "Create Supplier",
      description: isEditing
        ? `Are you sure you want to update the supplier "${formData.name}"?`
        : `Are you sure you want to create a new supplier "${formData.name}"?`,
      variant: "info",
      onConfirmAction: performSubmit,
    });
  };

  const handleDelete = async (id: string) => {
    if (!canManage) return;

    try {
      const { error } = await supabase
        .from("suppliers")
        .update({ is_active: false, deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      toast.success("Supplier deleted successfully!", {
        position: "top-center",
      });
      await loadSuppliers();
    } catch (error: any) {
      console.error("Error deleting supplier:", error);
      toast.error(error.message || "Failed to delete supplier", {
        position: "top-center",
      });
    }
  };

  const openModal = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({
        name: supplier.name,
        contact_person: supplier.contact_person || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
        website_url: supplier.website_url || "",
      });
    } else {
      setEditingSupplier(null);
      setFormData({
        name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
        website_url: "",
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
    setFormData({
      name: "",
      contact_person: "",
      email: "",
      phone: "",
      address: "",
      website_url: "",
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
      title: `Delete Supplier "${name}"`,
      description: `Are you sure you want to delete the supplier "${name}"? This action cannot be undone.`,
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
              You don't have permission to view suppliers. Please contact your
              administrator.
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
              {suppliers.length}
            </strong>
          </span>
          <span>
            Active:{" "}
            <strong className="text-green-600 dark:text-green-400">
              {suppliers.filter((s) => s.is_active).length}
            </strong>
          </span>
        </div>
        {canManage && (
          <Button
            onClick={() => openModal()}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Supplier
          </Button>
        )}
      </div>

      <PaginatedTable
        data={suppliers}
        searchFields={["name", "supplier_code", "contact_person", "email"]}
        searchPlaceholder="Search suppliers..."
      >
        {(paginatedData) => (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Code</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Contact</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Phone</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">
                  Actions
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="text-foreground font-medium">
                    {supplier.supplier_code}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {supplier.name}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {supplier.contact_person || "-"}
                  </TableCell>
                  <TableCell>
                    {supplier.email ? (
                      <a
                        href={`mailto:${supplier.email}`}
                        className="text-foreground hover:underline inline-flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        {supplier.email}
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {supplier.phone ? (
                      <a
                        href={`tel:${supplier.phone}`}
                        className="text-foreground hover:underline inline-flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        {supplier.phone}
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        supplier.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                      )}
                    >
                      {supplier.is_active ? (
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
                            onClick={() => openModal(supplier)}
                            className="hover:bg-secondary"
                            title="Edit supplier"
                          >
                            <Edit className="w-4 h-4 text-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteConfirm(supplier.id, supplier.name)
                            }
                            className="hover:bg-destructive/10"
                            title="Delete supplier"
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
        title={editingSupplier ? "Edit Supplier" : "Add Supplier"}
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
            label="Name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setFormErrors({ ...formErrors, name: "" });
            }}
            error={formErrors.name}
            required
            placeholder="e.g., ABC Supplies"
          />
          <Input
            label="Contact Person"
            value={formData.contact_person}
            onChange={(e) =>
              setFormData({ ...formData, contact_person: e.target.value })
            }
            placeholder="e.g., John Doe"
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="contact@example.com"
          />
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="+1 234 567 8900"
          />
          <Input
            label="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="123 Main St, City, Country"
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
                  {editingSupplier ? "Updating..." : "Creating..."}
                </>
              ) : editingSupplier ? (
                "Update Supplier"
              ) : (
                "Create Supplier"
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
