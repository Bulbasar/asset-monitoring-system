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
  Mail,
  Phone,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { usePermission } from "@/hooks/usePermissions";
import { Supplier } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
      toast.error("Failed to load suppliers");
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
        if (error) throw error;
        toast.success("Supplier updated successfully!");
      } else {
        const { error } = await supabase
          .from("suppliers")
          .insert([supplierData]);
        if (error) throw error;
        toast.success("Supplier created successfully!");
      }

      await loadSuppliers();
      closeModal();
    } catch (error: any) {
      console.error("Error saving supplier:", error);
      toast.error(error.message || "Failed to save supplier");
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

      toast.success("Supplier deleted successfully!");
      await loadSuppliers();
    } catch (error: any) {
      console.error("Error deleting supplier:", error);
      toast.error(error.message || "Failed to delete supplier");
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

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.supplier_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()),
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888] dark:text-[#B0B0B0]" />
          <Input
            className="pl-9"
            placeholder="Search suppliers..."
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
            Add Supplier
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-[#888888] dark:text-[#B0B0B0]">
        <span>
          Total:{" "}
          <strong className="text-[#121212] dark:text-[#E0E0E0]">
            {suppliers.length}
          </strong>
        </span>
        <span>
          Active:{" "}
          <strong className="text-green-600 dark:text-green-400">
            {suppliers.filter((s) => s.is_active).length}
          </strong>
        </span>
        {searchTerm && (
          <span>
            Results:{" "}
            <strong className="text-[#121212] dark:text-[#E0E0E0]">
              {filteredSuppliers.length}
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2 text-[#888888] dark:text-[#B0B0B0]">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading suppliers...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-[#888888] dark:text-[#B0B0B0]"
                  >
                    {searchTerm ? (
                      <>
                        No suppliers found matching "
                        <strong>{searchTerm}</strong>"
                      </>
                    ) : (
                      <>
                        No suppliers found.{" "}
                        {canManage && (
                          <button
                            onClick={() => openModal()}
                            className="text-[#121212] dark:text-[#E0E0E0] hover:underline"
                          >
                            Create your first supplier!
                          </button>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium text-[#121212] dark:text-[#E0E0E0]">
                      {supplier.supplier_code}
                    </TableCell>
                    <TableCell className="text-[#121212] dark:text-[#E0E0E0]">
                      {supplier.name}
                    </TableCell>
                    <TableCell className="text-[#121212] dark:text-[#E0E0E0]">
                      {supplier.contact_person || "-"}
                    </TableCell>
                    <TableCell>
                      {supplier.email ? (
                        <a
                          href={`mailto:${supplier.email}`}
                          className="text-[#121212] dark:text-[#E0E0E0] hover:underline inline-flex items-center gap-1"
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
                          className="text-[#121212] dark:text-[#E0E0E0] hover:underline inline-flex items-center gap-1"
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
                              className="hover:bg-[#F4F4F4] dark:hover:bg-[#2C2C2C]"
                              title="Edit supplier"
                            >
                              <Edit className="w-4 h-4 text-[#121212] dark:text-[#E0E0E0]" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteConfirm(supplier.id, supplier.name)
                              }
                              className="hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Delete supplier"
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
        title={editingSupplier ? "Edit Supplier" : "Add Supplier"}
        className="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formErrors.submit && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-sm text-red-600 dark:text-red-400">
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
