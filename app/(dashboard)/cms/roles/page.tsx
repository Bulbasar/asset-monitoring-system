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
  Shield,
  Users,
  Eye,
  Key,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PermissionManager } from "@/components/cms/PermissionManager";
import { usePermission } from "@/hooks/usePermissions";
import { Role } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
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

  const canView = hasPermission("role.view");
  const canManage = hasPermission("role.manage");

  const loadRoles = useCallback(async () => {
    if (!canView) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("roles")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setRoles(data || []);
    } catch (error: any) {
      console.error("Error loading roles:", error);
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [canView, supabase]);

  useEffect(() => {
    if (canView) {
      loadRoles();
    } else {
      setIsInitialLoad(false);
    }
  }, [canView, loadRoles]);

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
      if (editingRole) {
        const { error } = await supabase
          .from("roles")
          .update(formData)
          .eq("id", editingRole.id);
        if (error) throw error;
        toast.success("Role updated successfully!");
      } else {
        const { error } = await supabase
          .from("roles")
          .insert([{ ...formData, is_active: true }]);
        if (error) throw error;
        toast.success("Role created successfully!");
      }

      await loadRoles();
      closeModal();
    } catch (error: any) {
      console.error("Error saving role:", error);
      toast.error(error.message || "Failed to save role");
      setFormErrors({ submit: error.message || "Failed to save role" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;
    if (!validateForm()) return;

    const isEditing = !!editingRole;
    openConfirmDialog({
      type: isEditing ? "update" : "create",
      title: isEditing ? "Update Role" : "Create Role",
      description: isEditing
        ? `Are you sure you want to update the role "${formData.name}"?`
        : `Are you sure you want to create a new role "${formData.name}"?`,
      variant: "info",
      onConfirmAction: performSubmit,
    });
  };

  const handleDelete = async (id: string) => {
    if (!canManage) return;

    try {
      const { error } = await supabase
        .from("roles")
        .update({ is_active: false, deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;

      toast.success("Role deleted successfully!");
      await loadRoles();
    } catch (error: any) {
      console.error("Error deleting role:", error);
      toast.error(error.message || "Failed to delete role");
    }
  };

  const openModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        code: role.code,
        name: role.name,
        description: role.description || "",
      });
    } else {
      setEditingRole(null);
      setFormData({ code: "", name: "", description: "" });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    setFormData({ code: "", name: "", description: "" });
    setFormErrors({});
    setIsSubmitting(false);
  };

  const openPermissionModal = (role: Role) => {
    setSelectedRole(role);
    setIsPermissionModalOpen(true);
  };

  const closePermissionModal = () => {
    setIsPermissionModalOpen(false);
    setSelectedRole(null);
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
      title: `Delete Role "${name}"`,
      description: `Are you sure you want to delete the role "${name}"? This action cannot be undone.`,
      variant: "danger",
    });
  };

  const filteredRoles = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase()),
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
              You don't have permission to view roles. Please contact your
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
            placeholder="Search roles..."
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
            Add Role
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-[#888888] dark:text-[#B0B0B0]">
        <span>
          Total:{" "}
          <strong className="text-[#121212] dark:text-[#E0E0E0]">
            {roles.length}
          </strong>
        </span>
        <span>
          Active:{" "}
          <strong className="text-green-600 dark:text-green-400">
            {roles.filter((r) => r.is_active).length}
          </strong>
        </span>
        {searchTerm && (
          <span>
            Results:{" "}
            <strong className="text-[#121212] dark:text-[#E0E0E0]">
              {filteredRoles.length}
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
                <TableHeaderCell>Role</TableHeaderCell>
                <TableHeaderCell>Description</TableHeaderCell>
                <TableHeaderCell>Users</TableHeaderCell>
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
                      Loading roles...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-[#888888] dark:text-[#B0B0B0]"
                  >
                    {searchTerm ? (
                      <>
                        No roles found matching "<strong>{searchTerm}</strong>"
                      </>
                    ) : (
                      <>
                        No roles found.{" "}
                        {canManage && (
                          <button
                            onClick={() => openModal()}
                            className="text-[#121212] dark:text-[#E0E0E0] hover:underline"
                          >
                            Create your first role!
                          </button>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium text-[#121212] dark:text-[#E0E0E0]">
                      {role.code}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "p-1.5 rounded-lg",
                            role.code === "admin"
                              ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                              : role.code === "encoder"
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                : role.code === "viewer"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                  : role.code === "maintenance"
                                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                                    : "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400",
                          )}
                        >
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-[#121212] dark:text-[#E0E0E0]">
                            {role.name}
                          </div>
                          <div className="text-xs text-[#888888] dark:text-[#B0B0B0]">
                            {role.code}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-[#121212] dark:text-[#E0E0E0]">
                      {role.description || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-[#888888] dark:text-[#B0B0B0]">
                        <Users className="w-4 h-4" />
                        <span>0</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                          role.is_active
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                        )}
                      >
                        {role.is_active ? (
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
                        {canManage && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openPermissionModal(role)}
                              className="hover:bg-[#F4F4F4] dark:hover:bg-[#2C2C2C]"
                              title="Manage permissions"
                            >
                              <Key className="w-4 h-4 text-[#121212] dark:text-[#E0E0E0]" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openModal(role)}
                              className="hover:bg-[#F4F4F4] dark:hover:bg-[#2C2C2C]"
                              title="Edit role"
                            >
                              <Edit className="w-4 h-4 text-[#121212] dark:text-[#E0E0E0]" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteConfirm(role.id, role.name)
                              }
                              className="hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Delete role"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </>
                        )}
                        {!canManage && (
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
        title={editingRole ? "Edit Role" : "Add Role"}
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
              setFormData({
                ...formData,
                code: e.target.value.toUpperCase(),
              });
              setFormErrors({ ...formErrors, code: "" });
            }}
            error={formErrors.code}
            required
            disabled={!!editingRole}
            className="uppercase"
            placeholder="e.g., ROLE-001"
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
            placeholder="e.g., Administrator"
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Brief description of the role"
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
                  {editingRole ? "Updating..." : "Creating..."}
                </>
              ) : editingRole ? (
                "Update Role"
              ) : (
                "Create Role"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Permission Manager Modal */}
      <Modal
        isOpen={isPermissionModalOpen}
        onClose={closePermissionModal}
        title={`Manage Permissions - ${selectedRole?.name || ""}`}
        className="max-w-4xl"
      >
        {selectedRole && (
          <PermissionManager
            roleId={selectedRole.id}
            onSave={() => {
              // Refresh data if needed
            }}
          />
        )}
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
