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
import { Model } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    model_number: "",
    description: "",
    brand_id: "",
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

  const canView = hasPermission("model.view");
  const canManage = hasPermission("model.manage");

  const loadData = useCallback(async () => {
    if (!canView) return;

    setLoading(true);
    try {
      const [modelsRes, brandsRes] = await Promise.all([
        supabase
          .from("models")
          .select(
            `
            *,
            brands(name)
          `,
          )
          .order("name", { ascending: true }),
        supabase.from("brands").select("id, name").eq("is_active", true),
      ]);

      if (modelsRes.error) throw modelsRes.error;
      if (brandsRes.error) throw brandsRes.error;

      setModels(modelsRes.data || []);
      setBrands(brandsRes.data || []);
    } catch (error: any) {
      console.error("Error loading models:", error);
      toast.error("Failed to load models");
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
    if (!formData.brand_id) errors.brand_id = "Brand is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const performSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (editingModel) {
        const { error } = await supabase
          .from("models")
          .update(formData)
          .eq("id", editingModel.id);
        if (error) throw error;
        toast.success("Model updated successfully!");
      } else {
        const { error } = await supabase
          .from("models")
          .insert([{ ...formData, is_active: true }]);
        if (error) throw error;
        toast.success("Model created successfully!");
      }

      await loadData();
      closeModal();
    } catch (error: any) {
      console.error("Error saving model:", error);
      toast.error(error.message || "Failed to save model");
      setFormErrors({ submit: error.message || "Failed to save model" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;
    if (!validateForm()) return;

    const isEditing = !!editingModel;
    openConfirmDialog({
      type: isEditing ? "update" : "create",
      title: isEditing ? "Update Model" : "Create Model",
      description: isEditing
        ? `Are you sure you want to update the model "${formData.name}"?`
        : `Are you sure you want to create a new model "${formData.name}"?`,
      variant: "info",
      onConfirmAction: performSubmit,
    });
  };

  const handleDelete = async (id: string) => {
    if (!canManage) return;

    try {
      const { error } = await supabase
        .from("models")
        .update({ is_active: false, deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;

      toast.success("Model deleted successfully!");
      await loadData();
    } catch (error: any) {
      console.error("Error deleting model:", error);
      toast.error(error.message || "Failed to delete model");
    }
  };

  const openModal = (model?: Model) => {
    if (model) {
      setEditingModel(model);
      setFormData({
        code: model.code,
        name: model.name,
        model_number: model.model_number || "",
        description: model.description || "",
        brand_id: model.brand_id,
      });
    } else {
      setEditingModel(null);
      setFormData({
        code: "",
        name: "",
        model_number: "",
        description: "",
        brand_id: "",
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingModel(null);
    setFormData({
      code: "",
      name: "",
      model_number: "",
      description: "",
      brand_id: "",
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
      title: `Delete Model "${name}"`,
      description: `Are you sure you want to delete the model "${name}"? This action cannot be undone.`,
      variant: "danger",
    });
  };

  const filteredModels = models.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.model_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.brands?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
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
              You don't have permission to view models. Please contact your
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
            placeholder="Search models..."
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
            Add Model
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-[#888888] dark:text-[#B0B0B0]">
        <span>
          Total:{" "}
          <strong className="text-[#121212] dark:text-[#E0E0E0]">
            {models.length}
          </strong>
        </span>
        <span>
          Active:{" "}
          <strong className="text-green-600 dark:text-green-400">
            {models.filter((m) => m.is_active).length}
          </strong>
        </span>
        {searchTerm && (
          <span>
            Results:{" "}
            <strong className="text-[#121212] dark:text-[#E0E0E0]">
              {filteredModels.length}
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
                <TableHeaderCell>Model #</TableHeaderCell>
                <TableHeaderCell>Brand</TableHeaderCell>
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
                      Loading models...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredModels.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-[#888888] dark:text-[#B0B0B0]"
                  >
                    {searchTerm ? (
                      <>
                        No models found matching "<strong>{searchTerm}</strong>"
                      </>
                    ) : (
                      <>
                        No models found.{" "}
                        {canManage && (
                          <button
                            onClick={() => openModal()}
                            className="text-[#121212] dark:text-[#E0E0E0] hover:underline"
                          >
                            Create your first model!
                          </button>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredModels.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell className="font-medium text-[#121212] dark:text-[#E0E0E0]">
                      {model.code}
                    </TableCell>
                    <TableCell className="text-[#121212] dark:text-[#E0E0E0]">
                      {model.name}
                    </TableCell>
                    <TableCell className="text-[#121212] dark:text-[#E0E0E0]">
                      {model.model_number || "-"}
                    </TableCell>
                    <TableCell className="text-[#121212] dark:text-[#E0E0E0]">
                      {model.brands?.name || "-"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                          model.is_active
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                        )}
                      >
                        {model.is_active ? (
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
                              onClick={() => openModal(model)}
                              className="hover:bg-[#F4F4F4] dark:hover:bg-[#2C2C2C]"
                              title="Edit model"
                            >
                              <Edit className="w-4 h-4 text-[#121212] dark:text-[#E0E0E0]" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteConfirm(model.id, model.name)
                              }
                              className="hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Delete model"
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
        title={editingModel ? "Edit Model" : "Add Model"}
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
            disabled={!!editingModel}
            className="uppercase"
            placeholder="e.g., MDL-001"
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
            placeholder="e.g., iPhone 15"
          />
          <Input
            label="Model Number"
            value={formData.model_number}
            onChange={(e) =>
              setFormData({ ...formData, model_number: e.target.value })
            }
            placeholder="e.g., A2846"
          />
          <SearchableSelect
            label="Brand"
            options={brands.map((b) => ({
              value: b.id,
              label: b.name,
            }))}
            value={formData.brand_id}
            onChange={(value) => {
              setFormData({ ...formData, brand_id: value });
              setFormErrors({ ...formErrors, brand_id: "" });
            }}
            error={formErrors.brand_id}
            required
            placeholder="Search and select brand..."
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Brief description of the model"
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
                  {editingModel ? "Updating..." : "Creating..."}
                </>
              ) : editingModel ? (
                "Update Model"
              ) : (
                "Create Model"
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
