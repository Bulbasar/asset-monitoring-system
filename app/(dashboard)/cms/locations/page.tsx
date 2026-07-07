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
import { usePermission } from "@/hooks/usePermissions";
import { Location } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
      toast.error("Failed to load locations");
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
        if (error) throw error;
        toast.success("Location updated successfully!");
      } else {
        const { error } = await supabase
          .from("locations")
          .insert([{ ...formData, is_active: true }]);
        if (error) throw error;
        toast.success("Location created successfully!");
      }

      await loadLocations();
      closeModal();
    } catch (error: any) {
      console.error("Error saving location:", error);
      toast.error(error.message || "Failed to save location");
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

      toast.success("Location deleted successfully!");
      await loadLocations();
    } catch (error: any) {
      console.error("Error deleting location:", error);
      toast.error(error.message || "Failed to delete location");
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

  const filteredLocations = locations.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.building?.toLowerCase().includes(searchTerm.toLowerCase()),
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888] dark:text-[#B0B0B0]" />
          <Input
            className="pl-9"
            placeholder="Search locations..."
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
            Add Location
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-[#888888] dark:text-[#B0B0B0]">
        <span>
          Total:{" "}
          <strong className="text-[#121212] dark:text-[#E0E0E0]">
            {locations.length}
          </strong>
        </span>
        <span>
          Active:{" "}
          <strong className="text-green-600 dark:text-green-400">
            {locations.filter((l) => l.is_active).length}
          </strong>
        </span>
        {searchTerm && (
          <span>
            Results:{" "}
            <strong className="text-[#121212] dark:text-[#E0E0E0]">
              {filteredLocations.length}
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
                <TableHeaderCell>Building</TableHeaderCell>
                <TableHeaderCell>Floor/Room</TableHeaderCell>
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
                      Loading locations...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredLocations.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-[#888888] dark:text-[#B0B0B0]"
                  >
                    {searchTerm ? (
                      <>
                        No locations found matching "
                        <strong>{searchTerm}</strong>"
                      </>
                    ) : (
                      <>
                        No locations found.{" "}
                        {canManage && (
                          <button
                            onClick={() => openModal()}
                            className="text-[#121212] dark:text-[#E0E0E0] hover:underline"
                          >
                            Create your first location!
                          </button>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredLocations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium text-[#121212] dark:text-[#E0E0E0]">
                      {location.code}
                    </TableCell>
                    <TableCell className="text-[#121212] dark:text-[#E0E0E0]">
                      {location.name}
                    </TableCell>
                    <TableCell className="text-[#121212] dark:text-[#E0E0E0]">
                      {location.building || "-"}
                    </TableCell>
                    <TableCell className="text-[#121212] dark:text-[#E0E0E0]">
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
                              className="hover:bg-[#F4F4F4] dark:hover:bg-[#2C2C2C]"
                              title="Edit location"
                            >
                              <Edit className="w-4 h-4 text-[#121212] dark:text-[#E0E0E0]" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteConfirm(location.id, location.name)
                              }
                              className="hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Delete location"
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
        title={editingLocation ? "Edit Location" : "Add Location"}
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
