"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ChevronRight, Eye, Pencil, Plus, Trash2 } from "lucide-react"
import { AdminConfirmModal, AdminModal } from "@/features/admin/components/admin-modal"
import { AdminRowActions } from "@/features/admin/components/admin-row-actions"
import { AdminTable, type AdminTableColumn } from "@/features/admin/components/admin-table"
import {
  adminInternalUserStatusOptions,
  adminPermissionActions,
  adminPermissionMatrix,
  adminRoleTypeOptions,
  mockAdminInternalUsers,
  mockAdminRoles,
  type AdminPermissionAction,
  type AdminInternalUserItem,
  type AdminInternalUserStatus,
  type AdminPermissionResource,
  type AdminRoleItem,
  type AdminRolePermissions,
  type AdminRoleType,
} from "@/features/admin/data/admin-data"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const pageSize = 6

type UsersTab = "users" | "roles"

function getUserStatusTone(status: AdminInternalUserStatus) {
  switch (status) {
    case "Invited":
      return "bg-amber-50 text-amber-700 border-amber-100"
    case "Active":
      return "bg-emerald-50 text-emerald-700 border-emerald-100"
    case "Disabled":
      return "bg-stone-100 text-stone-700 border-stone-200"
  }
}

function getRoleTypeTone(type: AdminRoleType) {
  switch (type) {
    case "System":
      return "bg-sky-50 text-sky-700 border-sky-100"
    case "Custom":
      return "bg-brand-soft-beige/80 text-brand-dark-green border-brand-deep-green/10"
  }
}

function buildDefaultPermissions() {
  return {
    resources: Object.fromEntries(
      adminPermissionMatrix.map(({ resource }) => [resource, {}]),
    ) as Record<AdminPermissionResource, Partial<Record<AdminPermissionAction, boolean>>>,
    notifications: false,
  }
}

function clonePermissions(permissions: AdminRolePermissions): AdminRolePermissions {
  return {
    resources: Object.fromEntries(
      adminPermissionMatrix.map(({ resource }) => [
        resource,
        { ...(permissions.resources[resource] ?? {}) },
      ]),
    ) as Record<AdminPermissionResource, Partial<Record<AdminPermissionAction, boolean>>>,
    notifications: permissions.notifications,
  }
}

function getEnabledPermissionLabels(permissions: AdminRolePermissions) {
  return adminPermissionMatrix.flatMap(({ resource, label, actions }) => {
    const enabledActions = actions.filter((action) => permissions.resources[resource]?.[action])
    return enabledActions.length > 0 ? [`${label}: ${enabledActions.join(", ")}`] : []
  })
}

export function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<UsersTab>("users")

  const [usersQuery, setUsersQuery] = useState("")
  const [usersStatusFilter, setUsersStatusFilter] = useState<"All" | AdminInternalUserStatus>("All")
  const [usersPage, setUsersPage] = useState(1)
  const [users, setUsers] = useState(mockAdminInternalUsers)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [inviteName, setInviteName] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRoleId, setInviteRoleId] = useState(mockAdminRoles[0]?.id ?? "")
  const [inviteNotifyByEmail, setInviteNotifyByEmail] = useState(true)

  const [rolesQuery, setRolesQuery] = useState("")
  const [rolesTypeFilter, setRolesTypeFilter] = useState<"All" | AdminRoleType>("All")
  const [rolesPage, setRolesPage] = useState(1)
  const [roles, setRoles] = useState(mockAdminRoles)
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null)
  const [roleEditorOpen, setRoleEditorOpen] = useState(false)
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null)
  const [roleName, setRoleName] = useState("")
  const [rolePermissions, setRolePermissions] = useState<AdminRolePermissions>(buildDefaultPermissions())

  const roleById = useMemo(() => new Map(roles.map((role) => [role.id, role])), [roles])

  const filteredUsers = useMemo(() => {
    const normalizedQuery = usersQuery.trim().toLowerCase()

    return users.filter((user) => {
      const role = roleById.get(user.roleId)
      const matchesStatus = usersStatusFilter === "All" ? true : user.status === usersStatusFilter
      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : [user.name, user.email, role?.name ?? ""].join(" ").toLowerCase().includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
  }, [roleById, users, usersQuery, usersStatusFilter])

  const usersTotalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))

  useEffect(() => {
    setUsersPage(1)
  }, [usersQuery, usersStatusFilter])

  useEffect(() => {
    if (usersPage > usersTotalPages) setUsersPage(usersTotalPages)
  }, [usersPage, usersTotalPages])

  const paginatedUsers = useMemo(() => {
    const startIndex = (usersPage - 1) * pageSize
    return filteredUsers.slice(startIndex, startIndex + pageSize)
  }, [filteredUsers, usersPage])

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [selectedUserId, users],
  )

  const userPendingDelete = useMemo(
    () => users.find((user) => user.id === deleteUserId) ?? null,
    [deleteUserId, users],
  )

  const usersResultSummary =
    filteredUsers.length === 0
      ? "No internal users match this search."
      : `Showing ${(usersPage - 1) * pageSize + 1}-${Math.min(usersPage * pageSize, filteredUsers.length)} of ${filteredUsers.length}`

  const userColumns = useMemo<AdminTableColumn<AdminInternalUserItem>[]>(
    () => [
      {
        id: "name",
        label: "Name",
        className: "px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "px-6 py-5 align-top",
        cell: (user) => <p className="text-sm font-semibold text-brand-dark-green">{user.name}</p>,
      },
      {
        id: "email",
        label: "Email",
        className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 align-top text-sm text-muted-foreground",
        cell: (user) => user.email,
      },
      {
        id: "role",
        label: "Role",
        className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 align-top text-sm text-brand-dark-green",
        cell: (user) => roleById.get(user.roleId)?.name ?? "Unassigned",
      },
      {
        id: "status",
        label: "Status",
        className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 align-top",
        cell: (user) => (
          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getUserStatusTone(user.status)}`}>
            {user.status}
          </span>
        ),
      },
      {
        id: "joined",
        label: "Joined",
        className: "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 align-top text-sm text-muted-foreground",
        cell: (user) => user.joinedAt,
      },
      {
        id: "actions",
        label: "Actions",
        className: "py-4 pr-6 text-right text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 pr-6 align-top text-right",
        cell: (user) => (
          <div className="flex justify-end">
            <AdminRowActions
              items={[
                {
                  label: "View",
                  icon: <Eye className="h-4 w-4" />,
                  onSelect: () => setSelectedUserId(user.id),
                },
                {
                  label: "Delete",
                  icon: <Trash2 className="h-4 w-4" />,
                  onSelect: () => setDeleteUserId(user.id),
                  variant: "destructive",
                },
              ]}
            />
          </div>
        ),
      },
    ],
    [roleById],
  )

  const filteredRoles = useMemo(() => {
    const normalizedQuery = rolesQuery.trim().toLowerCase()

    return roles.filter((role) => {
      const matchesType = rolesTypeFilter === "All" ? true : role.type === rolesTypeFilter
      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : [role.name, role.type, ...getEnabledPermissionLabels(role.permissions), role.permissions.notifications ? "Notifications" : ""]
              .join(" ")
              .toLowerCase()
              .includes(normalizedQuery)

      return matchesType && matchesQuery
    })
  }, [roles, rolesQuery, rolesTypeFilter])

  const rolesTotalPages = Math.max(1, Math.ceil(filteredRoles.length / pageSize))

  useEffect(() => {
    setRolesPage(1)
  }, [rolesQuery, rolesTypeFilter])

  useEffect(() => {
    if (rolesPage > rolesTotalPages) setRolesPage(rolesTotalPages)
  }, [rolesPage, rolesTotalPages])

  const paginatedRoles = useMemo(() => {
    const startIndex = (rolesPage - 1) * pageSize
    return filteredRoles.slice(startIndex, startIndex + pageSize)
  }, [filteredRoles, rolesPage])

  const rolePendingDelete = useMemo(
    () => roles.find((role) => role.id === deleteRoleId) ?? null,
    [deleteRoleId, roles],
  )

  const rolesResultSummary =
    filteredRoles.length === 0
      ? "No roles match this search."
      : `Showing ${(rolesPage - 1) * pageSize + 1}-${Math.min(rolesPage * pageSize, filteredRoles.length)} of ${filteredRoles.length}`

  const roleColumns = useMemo<AdminTableColumn<AdminRoleItem>[]>(
    () => [
      {
        id: "name",
        label: "Name",
        className: "px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "px-6 py-5 align-top",
        cell: (role) => (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-brand-dark-green">{role.name}</p>
            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getRoleTypeTone(role.type)}`}>
              {role.type}
            </span>
          </div>
        ),
      },
      {
        id: "actions",
        label: "Actions",
        className: "py-4 pr-6 text-right text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55",
        cellClassName: "py-5 pr-6 align-top text-right",
        cell: (role) => (
          <div className="flex justify-end">
            <AdminRowActions
              items={[
                {
                  label: "Edit",
                  icon: <Pencil className="h-4 w-4" />,
                  onSelect: () => {
                    setEditingRoleId(role.id)
                    setRoleName(role.name)
                    setRolePermissions(clonePermissions(role.permissions))
                    setRoleEditorOpen(true)
                  },
                },
                {
                  label: "Delete",
                  icon: <Trash2 className="h-4 w-4" />,
                  onSelect: () => setDeleteRoleId(role.id),
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

  const selectedUserRole = selectedUser ? roleById.get(selectedUser.roleId) ?? null : null

  function resetInviteForm() {
    setInviteName("")
    setInviteEmail("")
    setInviteRoleId(roles[0]?.id ?? "")
    setInviteNotifyByEmail(true)
  }

  function handleInviteUser() {
    if (!inviteName.trim() || !inviteEmail.trim() || !inviteRoleId) return

    const nextUser: AdminInternalUserItem = {
      id: `admin-user-${crypto.randomUUID()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      roleId: inviteRoleId,
      status: "Invited",
      joinedAt: "May 21, 2026 · 5:30 PM",
      notifyByEmail: inviteNotifyByEmail,
    }

    setUsers((current) => [nextUser, ...current])
    setInviteModalOpen(false)
    resetInviteForm()
  }

  function handleDeleteUser() {
    if (!userPendingDelete) return
    setUsers((current) => current.filter((user) => user.id !== userPendingDelete.id))
    setDeleteUserId(null)
    if (selectedUserId === userPendingDelete.id) setSelectedUserId(null)
  }

  function handleOpenCreateRole() {
    setEditingRoleId(null)
    setRoleName("")
    setRolePermissions(buildDefaultPermissions())
    setRoleEditorOpen(true)
  }

  function handleSaveRole() {
    if (!roleName.trim()) return

    if (editingRoleId) {
      setRoles((current) =>
        current.map((role) =>
          role.id === editingRoleId
            ? {
                ...role,
                name: roleName.trim(),
                permissions: clonePermissions(rolePermissions),
              }
            : role,
        ),
      )
    } else {
      const newRole: AdminRoleItem = {
        id: `role-${crypto.randomUUID()}`,
        name: roleName.trim(),
        type: "Custom",
        permissions: clonePermissions(rolePermissions),
      }
      setRoles((current) => [newRole, ...current])
    }

    setRoleEditorOpen(false)
    setEditingRoleId(null)
    setRoleName("")
    setRolePermissions(buildDefaultPermissions())
  }

  function handleDeleteRole() {
    if (!rolePendingDelete) return
    const fallbackRoleId =
      roles.find((role) => role.id !== rolePendingDelete.id && role.type === "System")?.id ??
      roles.find((role) => role.id !== rolePendingDelete.id)?.id ??
      ""

    setRoles((current) => current.filter((role) => role.id !== rolePendingDelete.id))
    if (fallbackRoleId) {
      setUsers((current) =>
        current.map((user) => (user.roleId === rolePendingDelete.id ? { ...user, roleId: fallbackRoleId } : user)),
      )
    }
    setDeleteRoleId(null)
  }

  function togglePermission(resource: AdminPermissionResource, action: AdminPermissionAction, checked: boolean) {
    setRolePermissions((current) => ({
      ...current,
      resources: {
        ...current.resources,
        [resource]: {
          ...current.resources[resource],
          [action]: checked,
        },
      },
    }))
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
              Manage internal staff accounts, role access, and who can operate Mitho’s admin workspace.
            </p>
          </div>
        </section>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as UsersTab)} className="space-y-5">
          <TabsList className="h-11 rounded-xl bg-brand-soft-beige/55 p-1">
            <TabsTrigger
              value="users"
              className="rounded-[0.8rem] px-5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-brand-dark-green data-[state=active]:shadow-none"
            >
              Users
            </TabsTrigger>
            <TabsTrigger
              value="roles"
              className="rounded-[0.8rem] px-5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-brand-dark-green data-[state=active]:shadow-none"
            >
              Roles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <AdminTable
              columns={userColumns}
              data={paginatedUsers}
              rowKey={(user) => user.id}
              searchValue={usersQuery}
              onSearchChange={setUsersQuery}
              searchPlaceholder="Search users by name, email, or role"
              leftToolbarContent={
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                  <Select value={usersStatusFilter} onValueChange={(value) => setUsersStatusFilter(value as "All" | AdminInternalUserStatus)}>
                    <SelectTrigger className="h-11 w-[190px] rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      {adminInternalUserStatusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
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
              totalPages={usersTotalPages}
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
                  <Select value={rolesTypeFilter} onValueChange={(value) => setRolesTypeFilter(value as "All" | AdminRoleType)}>
                    <SelectTrigger className="h-11 w-[190px] rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      {adminRoleTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
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
                  onClick={handleOpenCreateRole}
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

      <AdminModal
        open={inviteModalOpen}
        onOpenChange={(open) => {
          setInviteModalOpen(open)
          if (!open) resetInviteForm()
        }}
        title="Invite user"
        description="Create a new internal admin/staff account invite and assign the right role from the start."
        confirmLabel="Send invite"
        onConfirm={handleInviteUser}
        isConfirmDisabled={!inviteName.trim() || !inviteEmail.trim() || !inviteRoleId}
        size="lg"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="invite-name">Name</Label>
            <Input
              id="invite-name"
              value={inviteName}
              onChange={(event) => setInviteName(event.target.value)}
              placeholder="Full name"
              className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
              placeholder="name@mithocha.com"
              className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={inviteRoleId} onValueChange={setInviteRoleId}>
            <SelectTrigger className="h-11 w-full rounded-xl border-brand-deep-green/10 bg-white shadow-none">
              <SelectValue placeholder="Choose a role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-brand-deep-green/10 bg-brand-soft-beige/16 px-4 py-4">
          <div>
            <p className="text-sm font-semibold text-brand-dark-green">Send invite email</p>
            <p className="mt-1 text-sm text-muted-foreground">Notify the user immediately so they can activate their account.</p>
          </div>
          <Switch checked={inviteNotifyByEmail} onCheckedChange={setInviteNotifyByEmail} />
        </div>
      </AdminModal>

      <AdminModal
        open={selectedUser !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedUserId(null)
        }}
        title="User details"
        description="Inspect the internal user record and assigned access from one place."
        showFooter={false}
        size="lg"
      >
        {selectedUser ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Name</p>
                <p className="text-sm font-semibold text-brand-dark-green">{selectedUser.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Email</p>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Role</p>
                <p className="text-sm font-semibold text-brand-dark-green">{selectedUserRole?.name ?? "Unassigned"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Joined</p>
                <p className="text-sm text-muted-foreground">{selectedUser.joinedAt}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-brand-deep-green/10 bg-brand-soft-beige/18 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Status</p>
                <span className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getUserStatusTone(selectedUser.status)}`}>
                  {selectedUser.status}
                </span>
              </div>
              <div className="rounded-2xl border border-brand-deep-green/10 bg-brand-soft-beige/18 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Invite notifications</p>
                <p className="mt-2 text-sm font-semibold text-brand-dark-green">{selectedUser.notifyByEmail ? "Enabled" : "Disabled"}</p>
              </div>
            </div>

            <div className="space-y-2 border-t border-brand-deep-green/10 pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Assigned permissions</p>
              <div className="flex flex-wrap gap-2">
                {selectedUserRole
                  ? getEnabledPermissionLabels(selectedUserRole.permissions).map((permission) => (
                    <span
                      key={permission}
                      className="inline-flex rounded-full border border-brand-deep-green/10 bg-white px-3 py-1.5 text-sm text-brand-dark-green"
                    >
                      {permission}
                    </span>
                  ))
                  : null}
                {selectedUserRole?.permissions.notifications ? (
                  <span className="inline-flex rounded-full border border-brand-deep-green/10 bg-white px-3 py-1.5 text-sm text-brand-dark-green">
                    Notifications
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </AdminModal>

      <AdminConfirmModal
        open={userPendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteUserId(null)
        }}
        title="Delete user"
        description={
          userPendingDelete
            ? `Remove ${userPendingDelete.name} from the internal admin workspace. This is a mock delete flow for now.`
            : "Remove this internal user from the admin workspace."
        }
        confirmLabel="Delete user"
        onConfirm={handleDeleteUser}
      />

      <AdminModal
        open={roleEditorOpen}
        onOpenChange={(open) => {
          setRoleEditorOpen(open)
          if (!open) {
            setEditingRoleId(null)
            setRoleName("")
            setRolePermissions(buildDefaultPermissions())
          }
        }}
        title={editingRoleId ? "Edit role" : "Add new role"}
        description="Define a role name and choose the grouped permissions this role can access."
        confirmLabel="Save role"
        onConfirm={handleSaveRole}
        isConfirmDisabled={!roleName.trim()}
        size="xl"
      >
        <div className="space-y-2">
          <Label htmlFor="role-name">Name</Label>
          <Input
            id="role-name"
            value={roleName}
            onChange={(event) => setRoleName(event.target.value)}
            placeholder="Role name"
            className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
          />
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-brand-dark-green">Permissions</p>
            <p className="text-sm text-muted-foreground">Read covers both list access and individual detail access.</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-brand-deep-green/10">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-brand-deep-green/10 bg-brand-soft-beige/18">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">
                      Resource
                    </th>
                    {adminPermissionActions.map((action) => (
                      <th
                        key={action}
                        className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55"
                      >
                        {action}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {adminPermissionMatrix.map(({ resource, label, actions }) => (
                    <tr key={resource} className="border-b border-brand-deep-green/10 last:border-b-0">
                      <td className="px-4 py-4 text-sm font-semibold text-brand-dark-green">{label}</td>
                      {adminPermissionActions.map((action) => {
                        const isSupported = actions.includes(action)
                        return (
                          <td key={`${resource}-${action}`} className="px-4 py-4 text-center">
                            {isSupported ? (
                              <Checkbox
                                checked={Boolean(rolePermissions.resources[resource]?.[action])}
                                onCheckedChange={(checked) => togglePermission(resource, action, checked === true)}
                                className="mx-auto border-brand-deep-green/18 text-white data-[state=checked]:border-brand-orange data-[state=checked]:bg-brand-orange"
                              />
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-brand-deep-green/10 bg-brand-soft-beige/16 px-4 py-4">
            <div>
              <p className="text-sm font-semibold text-brand-dark-green">Notifications</p>
              <p className="mt-1 text-sm text-muted-foreground">Allow this role to access admin notification workflows.</p>
            </div>
            <Switch
              checked={rolePermissions.notifications}
              onCheckedChange={(checked) =>
                setRolePermissions((current) => ({
                  ...current,
                  notifications: checked,
                }))
              }
            />
          </div>
        </div>
      </AdminModal>

      <AdminConfirmModal
        open={rolePendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteRoleId(null)
        }}
        title="Delete role"
        description={
          rolePendingDelete
            ? `Remove the ${rolePendingDelete.name} role from the internal role list. This is a mock delete flow for now.`
            : "Remove this role from the internal role list."
        }
        confirmLabel="Delete role"
        onConfirm={handleDeleteRole}
      />
    </>
  )
}
