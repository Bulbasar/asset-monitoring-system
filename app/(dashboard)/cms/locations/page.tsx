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
import { Plus, Edit, Trash2, Check, Loader2, Lock, Eye } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PaginatedTable } from "@/components/ui/PaginatedTable";
import { usePermission } from "@/hooks/usePermissions";
import { Location } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { handleDuplicateError } from "@/lib/validation";

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    building: "",
    floor: "",
    room: "",
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

  const canView = hasPermission("location.view");
  const canManage = hasPermission("location.manage");

  const loadLocations = useCallback(async () => {
    if (!canView) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setLocations(data || []);
    } catch (error: any) {
      console.error("Error loading locations:", error);
      toast.error("Failed to load locations", { position: "top-center" });
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [canView, supabase]);

  useEffect(() => {
    if (canView) {
      loadLocations();
    } else {
      setIsInitialLoad(false);
    }
  }, [canView, loadLocations]);

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
      if (editingLocation) {
        const { error } = await supabase
          .from("locations")
          .update(formData)
          .eq("id", editingLocation.id);

        if (error) {
          if (handleDuplicateError(error, "Location")) {
            setIsSubmitting(false);
            return;
          }
          throw error;
        }
        toast.success("Location updated successfully!", {
          position: "top-center",
        });
      } else {
        const { error } = await supabase
          .from("locations")
          .insert([{ ...formData, is_active: true }]);

        if (error) {
          if (handleDuplicateError(error, "Location")) {
            setIsSubmitting(false);
            return;
          }
          throw error;
        }
        toast.success("Location created successfully!", {
          position: "top-center",
        });
      }

      await loadLocations();
      closeModal();
    } catch (error: any) {
      console.error("Error saving location:", error);
      toast.error(error.message || "Failed to save location", {
        position: "top-center",
      });
      setFormErrors({ submit: error.message || "Failed to save location" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;
    if (!validateForm()) return;

    const isEditing = !!editingLocation;
    openConfirmDialog({
      type: isEditing ? "update" : "create",
      title: isEditing ? "Update Location" : "Create Location",
      description: isEditing
        ? `Are you sure you want to update the location "${formData.name}"?`
        : `Are you sure you want to create a new location "${formData.name}"?`,
      variant: "info",
      onConfirmAction: performSubmit,
    });
  };

  const handleDelete = async (id: string) => {
    if (!canManage) return;

    try {
      const { error } = await supabase
        .from("locations")
        .update({ is_active: false, deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      toast.success("Location deleted successfully!", {
        position: "top-center",
      });
      await loadLocations();
    } catch (error: any) {
      console.error("Error deleting location:", error);
      toast.error(error.message || "Failed to delete location", {
        position: "top-center",
      });
    }
  };

  const openModal = (location?: Location) => {
    if (location) {
      setEditingLocation(location);
      setFormData({
        code: location.code,
        name: location.name,
        description: location.description || "",
        building: location.building || "",
        floor: location.floor || "",
        room: location.room || "",
      });
    } else {
      setEditingLocation(null);
      setFormData({
        code: "",
        name: "",
        description: "",
        building: "",
        floor: "",
        room: "",
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLocation(null);
    setFormData({
      code: "",
      name: "",
      description: "",
      building: "",
      floor: "",
      room: "",
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
      title: `Delete Location "${name}"`,
      description: `Are you sure you want to delete the location "${name}"? This action cannot be undone.`,
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
              You don't have permission to view locations. Please contact your
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
              {locations.length}
            </strong>
          </span>
          <span>
            Active:{" "}
            <strong className="text-green-600 dark:text-green-400">
              {locations.filter((l) => l.is_active).length}
            </strong>
          </span>
        </div>
        {canManage && (
          <Button
            onClick={() => openModal()}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Location
          </Button>
        )}
      </div>

      <PaginatedTable
        data={locations}
        searchFields={["name", "code", "building"]}
        searchPlaceholder="Search locations..."
      >
        {(paginatedData) => (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Code</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Building</TableHeaderCell>
                <TableHeaderCell>Floor/Room</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">
                  Actions
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="text-foreground font-medium">
                    {location.code}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {location.name}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {location.building || "-"}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {location.floor && location.room
                      ? `${location.floor} / ${location.room}`
                      : location.floor || location.room || "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        location.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                      )}
                    >
                      {location.is_active ? (
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
                            onClick={() => openModal(location)}
                            className="hover:bg-secondary"
                            title="Edit location"
                          >
                            <Edit className="w-4 h-4 text-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteConfirm(location.id, location.name)
                            }
                            className="hover:bg-destructive/10"
                            title="Delete location"
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
        title={editingLocation ? "Edit Location" : "Add Location"}
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
            disabled={!!editingLocation}
            className="uppercase"
            placeholder="e.g., LOC-001"
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
            placeholder="e.g., Main Office"
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
            label="Building"
            value={formData.building}
            onChange={(e) =>
              setFormData({ ...formData, building: e.target.value })
            }
            placeholder="e.g., Tower A"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Floor"
              value={formData.floor}
              onChange={(e) =>
                setFormData({ ...formData, floor: e.target.value })
              }
              placeholder="e.g., 5th"
            />
            <Input
              label="Room"
              value={formData.room}
              onChange={(e) =>
                setFormData({ ...formData, room: e.target.value })
              }
              placeholder="e.g., 501"
            />
          </div>
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
                  {editingLocation ? "Updating..." : "Creating..."}
                </>
              ) : editingLocation ? (
                "Update Location"
              ) : (
                "Create Location"
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
