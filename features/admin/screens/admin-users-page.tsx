"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ChevronRight, Eye, Pencil, Plus, Trash2 } from "lucide-react"
import { AdminConfirmModal } from "@/features/admin/components/admin-modal"
import { AdminEditUserModal } from "@/features/admin/components/admin-edit-user-modal"
import { AdminInviteUserModal } from "@/features/admin/components/admin-invite-user-modal"
import { AdminRoleEditorModal } from "@/features/admin/components/admin-role-editor-modal"
import { AdminRowActions } from "@/features/admin/components/admin-row-actions"
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge"
import { AdminTable, type AdminTableColumn } from "@/features/admin/components/admin-table"
import { AdminUserDetailModal } from "@/features/admin/components/admin-user-detail-modal"
import { adminRoleTypeOptions, type AdminRoleType } from "@/features/admin/data/admin-data"
import { formatDate, userStatusOptions, type UserStatusFilter } from "@/features/admin/utils/admin-users-utils"
import { getRoleTypePresentation, getUserStatusPresentation } from "@/features/admin/utils/admin-status-utils"
import { useAdminUsers, useDeleteAdminUser, useInviteAdminUser, useReplaceAdminUserRoles, useUpdateAdminUser } from "@/hooks/use-admin-users"
import { useAdminPermissions, useAdminRoles, useCreateAdminRole, useDeleteAdminRole, useUpdateAdminRole } from "@/hooks/use-admin-roles"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import type { AdminRole } from "@/types/admin-roles"
import type { AdminUserItem, InviteAdminUserPayload } from "@/types/admin-users"
import type { EditAdminUserFormValues } from "@/lib/validators/admin"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const pageSize = 6
type UsersTab = "users" | "roles"

export function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<UsersTab>("users")

  const [usersQuery, setUsersQuery] = useState("")
  const [usersStatusFilter, setUsersStatusFilter] = useState<UserStatusFilter>("All")
  const [usersPage, setUsersPage] = useState(1)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const debouncedUsersQuery = useDebouncedValue(usersQuery, 300)

  const [rolesQuery, setRolesQuery] = useState("")
  const debouncedRolesQuery = useDebouncedValue(rolesQuery, 300)
  const [rolesTypeFilter, setRolesTypeFilter] = useState<"All" | AdminRoleType>("All")
  const [rolesPage, setRolesPage] = useState(1)
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null)
  const [roleEditorOpen, setRoleEditorOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null)

  const usersResult = useAdminUsers({
    page: usersPage,
    per_page: pageSize,
    query: debouncedUsersQuery || undefined,
    status: usersStatusFilter !== "All" ? usersStatusFilter : undefined,
  })
  const rolesResult = useAdminRoles()
  const permissionsResult = useAdminPermissions()

  const inviteUser = useInviteAdminUser()
  const updateUser = useUpdateAdminUser()
  const replaceUserRoles = useReplaceAdminUserRoles()
  const deleteUser = useDeleteAdminUser()
  const createRole = useCreateAdminRole()
  const updateRole = useUpdateAdminRole()
  const deleteRole = useDeleteAdminRole()

  const users = usersResult.data?.users ?? []
  const usersMeta = usersResult.data?.meta
  const roles = rolesResult.data ?? []
  const allPermissions = permissionsResult.data ?? []

  useEffect(() => { setUsersPage(1) }, [usersQuery, usersStatusFilter])

  const selectedUser = useMemo(() => users.find((u) => u.id === selectedUserId) ?? null, [users, selectedUserId])
  const editingUser = useMemo(() => users.find((u) => u.id === editingUserId) ?? null, [users, editingUserId])
  const userPendingDelete = useMemo(() => users.find((u) => u.id === deleteUserId) ?? null, [users, deleteUserId])

  const filteredRoles = useMemo(() => {
    const q = debouncedRolesQuery.trim().toLowerCase()
    return roles.filter((role) => {
      const matchesType = rolesTypeFilter === "All" || (role.isSystem ? "System" : "Custom") === rolesTypeFilter
      const matchesQuery = q.length === 0 || [role.name, ...role.permissions.map((p) => p.name)].join(" ").toLowerCase().includes(q)
      return matchesType && matchesQuery
    })
  }, [roles, debouncedRolesQuery, rolesTypeFilter])

  const rolesTotalPages = Math.max(1, Math.ceil(filteredRoles.length / pageSize))

  useEffect(() => { setRolesPage(1) }, [debouncedRolesQuery, rolesTypeFilter])
  useEffect(() => { if (rolesPage > rolesTotalPages) setRolesPage(rolesTotalPages) }, [rolesPage, rolesTotalPages])

  const paginatedRoles = useMemo(() => {
    const start = (rolesPage - 1) * pageSize
    return filteredRoles.slice(start, start + pageSize)
  }, [filteredRoles, rolesPage])

  const rolePendingDelete = useMemo(() => roles.find((r) => r.id === deleteRoleId) ?? null, [roles, deleteRoleId])

  const usersResultSummary = useMemo(() => {
    if (!usersMeta) return ""
    const { page, perPage, totalItems } = usersMeta
    if (totalItems === 0) return "No internal users match this search."
    const from = (page - 1) * perPage + 1
    const to = Math.min(page * perPage, Number(totalItems))
    return `Showing ${from}–${to} of ${totalItems}`
  }, [usersMeta])

  const rolesResultSummary =
    filteredRoles.length === 0
      ? "No roles match this search."
      : `Showing ${(rolesPage - 1) * pageSize + 1}–${Math.min(rolesPage * pageSize, filteredRoles.length)} of ${filteredRoles.length}`

  const userColumns = useMemo<AdminTableColumn<AdminUserItem>[]>(
    () => [
      {
        id: "name",
        label: "Name",
        className: "px-6 text-xs font-medium text-muted-foreground",
        cellClassName: "px-6 py-2.5 align-top",
        cell: (user) => <p className="text-sm font-semibold text-foreground">{user.fullName || user.email}</p>,
      },
      {
        id: "email",
        label: "Email",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top text-sm text-muted-foreground",
        cell: (user) => user.email,
      },
      {
        id: "role",
        label: "Role",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top text-sm text-foreground",
        cell: (user) => user.roles.map((r) => r.name).join(", ") || "Unassigned",
      },
      {
        id: "status",
        label: "Status",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top",
        cell: (user) => (
          <AdminStatusBadge {...getUserStatusPresentation(user.status)} />
        ),
      },
      {
        id: "joined",
        label: "Joined",
        className: "text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 align-top text-sm text-muted-foreground",
        cell: (user) => formatDate(user.createdAt),
      },
      {
        id: "actions",
        label: "Actions",
        className: "pr-6 text-right text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 pr-6 align-top text-right",
        cell: (user) => (
          <div className="flex justify-end">
            <AdminRowActions
              items={[
                { label: "View", icon: <Eye className="h-4 w-4" />, onSelect: () => setSelectedUserId(user.id) },
                { label: "Edit", icon: <Pencil className="h-4 w-4" />, onSelect: () => setEditingUserId(user.id) },
                { label: "Delete", icon: <Trash2 className="h-4 w-4" />, onSelect: () => setDeleteUserId(user.id), variant: "destructive" },
              ]}
            />
          </div>
        ),
      },
    ],
    [],
  )

  const roleColumns = useMemo<AdminTableColumn<AdminRole>[]>(
    () => [
      {
        id: "name",
        label: "Name",
        className: "px-6 text-xs font-medium text-muted-foreground",
        cellClassName: "px-6 py-2.5 align-top",
        cell: (role) => (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">{role.name}</p>
            <AdminStatusBadge {...getRoleTypePresentation(role.isSystem)} />
          </div>
        ),
      },
      {
        id: "actions",
        label: "Actions",
        className: "pr-6 text-right text-xs font-medium text-muted-foreground",
        cellClassName: "py-2.5 pr-6 align-top text-right",
        cell: (role) => (
          <div className="flex justify-end">
            <AdminRowActions
              items={[
                {
                  label: "Edit",
                  icon: <Pencil className="h-4 w-4" />,
                  onSelect: () => { setEditingRole(role); setRoleEditorOpen(true) },
                },
                {
                  label: "Delete",
                  icon: <Trash2 className="h-4 w-4" />,
                  onSelect: () => { if (!role.isSystem) setDeleteRoleId(role.id) },
                  variant: "destructive",
                },
              ]}
            />
          </div>
        ),
      },
    ],
    [],
  )

  async function handleInviteUser(payload: InviteAdminUserPayload) {
    await inviteUser.mutateAsync(payload)
    setInviteModalOpen(false)
  }

  async function handleSaveUser(values: EditAdminUserFormValues) {
    if (!editingUser) return

    await updateUser.mutateAsync({
      id: editingUser.id,
      payload: {
        firstName: values.firstName || undefined,
        lastName: values.lastName || undefined,
        email: values.email,
      },
    })
    await replaceUserRoles.mutateAsync({ id: editingUser.id, roleIds: values.roleIds })
    setEditingUserId(null)
  }

  async function handleDeleteUser() {
    if (!userPendingDelete) return
    await deleteUser.mutateAsync(userPendingDelete.id)
    setDeleteUserId(null)
    if (selectedUserId === userPendingDelete.id) setSelectedUserId(null)
  }

  async function handleSaveRole(name: string, description: string | undefined, permissionIds: string[]) {
    if (editingRole) {
      await updateRole.mutateAsync({ id: editingRole.id, payload: { name, description, permissionIds } })
    } else {
      await createRole.mutateAsync({ name, description, permissionIds })
    }
    setRoleEditorOpen(false)
    setEditingRole(null)
  }

  async function handleDeleteRole() {
    if (!rolePendingDelete) return
    await deleteRole.mutateAsync(rolePendingDelete.id)
    setDeleteRoleId(null)
  }

  return (
    <>
      <div className="space-y-6">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/admin" className="transition-colors hover:text-brand-dark-green">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-brand-dark-green">Users</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-brand-dark-green">Users</h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Manage internal staff accounts, role access, and who can operate Mitho&apos;s admin workspace.
            </p>
          </div>
        </section>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as UsersTab)} className="space-y-5">
          <TabsList className="h-11 rounded-xl bg-muted p-1">
            <TabsTrigger value="users" className="rounded-lg px-5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-none">
              Users
            </TabsTrigger>
            <TabsTrigger value="roles" className="rounded-lg px-5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-none">
              Roles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <AdminTable
              columns={userColumns}
              data={users}
              rowKey={(user) => user.id}
              searchValue={usersQuery}
              onSearchChange={(q) => { setUsersQuery(q); setUsersPage(1) }}
              searchPlaceholder="Search users by name, email, or role"
              leftToolbarContent={
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                  <Select value={usersStatusFilter} onValueChange={(v) => { setUsersStatusFilter(v as UserStatusFilter); setUsersPage(1) }}>
                    <SelectTrigger className="h-11 w-[190px] rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      {userStatusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              }
              rightToolbarContent={
                <Button
                  type="button"
                  size="lg"
                  className="h-11 rounded-xl bg-brand-dark-green px-5 text-white hover:bg-brand-dark-green/92"
                  onClick={() => setInviteModalOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add user
                </Button>
              }
              currentPage={usersPage}
              totalPages={usersMeta?.totalPages ?? 1}
              onPageChange={setUsersPage}
              resultSummary={usersResultSummary}
              emptyTitle="No users match this view."
              emptyDescription="Try clearing the search or choosing a broader status filter."
            />
          </TabsContent>

          <TabsContent value="roles">
            <AdminTable
              columns={roleColumns}
              data={paginatedRoles}
              rowKey={(role) => role.id}
              searchValue={rolesQuery}
              onSearchChange={setRolesQuery}
              searchPlaceholder="Search roles by name or permission"
              leftToolbarContent={
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">Type</span>
                  <Select value={rolesTypeFilter} onValueChange={(v) => setRolesTypeFilter(v as "All" | AdminRoleType)}>
                    <SelectTrigger className="h-11 w-[190px] rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      {adminRoleTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              }
              rightToolbarContent={
                <Button
                  type="button"
                  size="lg"
                  className="h-11 rounded-xl bg-brand-dark-green px-5 text-white hover:bg-brand-dark-green/92"
                  onClick={() => { setEditingRole(null); setRoleEditorOpen(true) }}
                >
                  <Plus className="h-4 w-4" />
                  Add new role
                </Button>
              }
              currentPage={rolesPage}
              totalPages={rolesTotalPages}
              onPageChange={setRolesPage}
              resultSummary={rolesResultSummary}
              emptyTitle="No roles match this view."
              emptyDescription="Try a different role name or broader type filter."
            />
          </TabsContent>
        </Tabs>
      </div>

      <AdminInviteUserModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
        roles={roles}
        isPending={inviteUser.isPending}
        onInvite={handleInviteUser}
      />

      <AdminUserDetailModal user={selectedUser} onClose={() => setSelectedUserId(null)} />

      <AdminEditUserModal
        open={editingUser !== null}
        onOpenChange={(open) => { if (!open) setEditingUserId(null) }}
        user={editingUser}
        roles={roles}
        isPending={updateUser.isPending || replaceUserRoles.isPending}
        onSave={handleSaveUser}
      />

      <AdminConfirmModal
        open={userPendingDelete !== null}
        onOpenChange={(open) => { if (!open) setDeleteUserId(null) }}
        title="Delete user"
        description={
          userPendingDelete
            ? `Remove ${userPendingDelete.fullName || userPendingDelete.email} from the internal admin workspace. This action cannot be undone.`
            : "Remove this internal user from the admin workspace."
        }
        confirmLabel={deleteUser.isPending ? "Deleting…" : "Delete user"}
        onConfirm={handleDeleteUser}
      />

      <AdminRoleEditorModal
        open={roleEditorOpen}
        onOpenChange={(open) => { setRoleEditorOpen(open); if (!open) setEditingRole(null) }}
        editingRole={editingRole}
        allPermissions={allPermissions}
        isPending={createRole.isPending || updateRole.isPending}
        onSave={handleSaveRole}
      />

      <AdminConfirmModal
        open={rolePendingDelete !== null}
        onOpenChange={(open) => { if (!open) setDeleteRoleId(null) }}
        title="Delete role"
        description={
          rolePendingDelete
            ? `Remove the "${rolePendingDelete.name}" role. Users with this role will lose the associated permissions.`
            : "Remove this role from the internal role list."
        }
        confirmLabel={deleteRole.isPending ? "Deleting…" : "Delete role"}
        onConfirm={handleDeleteRole}
      />
    </>
  )
}
