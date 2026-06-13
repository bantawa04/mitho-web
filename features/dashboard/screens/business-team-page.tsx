"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, MailPlus, Trash2, Users } from "lucide-react"
import { useForm } from "react-hook-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MithoButton } from "@/components/mitho/mitho-button"
import { useMyBusiness } from "@/hooks/use-businesses"
import { useBusinessMemberships, useRemoveBusinessMembership, useUpdateBusinessMembership } from "@/hooks/use-business-memberships"
import { useBusinessInvitations, useCreateBusinessInvitation, useRevokeBusinessInvitation } from "@/hooks/use-business-invitations"
import { useToast } from "@/hooks/use-toast"
import { extractApiErrorMessage } from "@/lib/api-error-utils"
import { inviteStaffSchema, type InviteStaffFormValues } from "@/lib/validators/business-invitation"

const sectionCardClass = "rounded-xl border border-border bg-white shadow-sm"

function roleBadgeClass(role: string) {
  return role === "owner"
    ? "inline-flex items-center rounded-full bg-brand-deep-green/10 px-2.5 py-0.5 text-xs font-semibold text-brand-deep-green"
    : "inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground"
}

function statusBadgeClass(status: string) {
  return status === "active"
    ? "inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700"
    : "inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700"
}

interface InviteDialogProps {
  businessId: string
  disabled: boolean
}

function InviteDialog({ businessId, disabled }: InviteDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { toast } = useToast()
  const mutation = useCreateBusinessInvitation(businessId)
  const form = useForm<InviteStaffFormValues>({
    resolver: zodResolver(inviteStaffSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: InviteStaffFormValues) {
    try {
      await mutation.mutateAsync({ email: values.email })
      toast({ title: "Invitation sent", description: `An invitation has been sent to ${values.email}.` })
      form.reset()
      setOpen(false)
    } catch (error) {
      toast({ title: "Could not send invitation", description: extractApiErrorMessage(error), variant: "destructive" })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <MithoButton size="sm" disabled={disabled}>
          <MailPlus className="h-4 w-4" />
          Invite staff
        </MithoButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a staff member</DialogTitle>
          <DialogDescription>
            They will receive an email invitation to join this business workspace as staff.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <MithoButton type="button" variant="outline-secondary" onClick={() => setOpen(false)}>
                Cancel
              </MithoButton>
              <MithoButton type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Send invitation
              </MithoButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export function TeamRoutePage({ businessId }: { businessId: string }) {
  const { toast } = useToast()
  const { entry } = useMyBusiness(businessId)
  const membershipRole = entry?.membershipRole
  const isOwner = membershipRole === "owner"

  const membershipsQuery = useBusinessMemberships(businessId)
  const invitationsQuery = useBusinessInvitations(businessId)
  const updateMutation = useUpdateBusinessMembership(businessId)
  const removeMutation = useRemoveBusinessMembership(businessId)
  const revokeMutation = useRevokeBusinessInvitation(businessId)

  async function handleRoleChange(membershipId: string, role: "owner" | "staff") {
    try {
      await updateMutation.mutateAsync({ membershipId, payload: { role } })
      toast({ title: "Role updated" })
    } catch (error) {
      toast({ title: "Could not update role", description: extractApiErrorMessage(error), variant: "destructive" })
    }
  }

  async function handleRemove(membershipId: string) {
    try {
      await removeMutation.mutateAsync(membershipId)
      toast({ title: "Member removed" })
    } catch (error) {
      toast({ title: "Could not remove member", description: extractApiErrorMessage(error), variant: "destructive" })
    }
  }

  async function handleRevoke(invitationId: string) {
    try {
      await revokeMutation.mutateAsync(invitationId)
      toast({ title: "Invitation revoked" })
    } catch (error) {
      toast({ title: "Could not revoke invitation", description: extractApiErrorMessage(error), variant: "destructive" })
    }
  }

  const pendingInvitations = (invitationsQuery.data ?? []).filter((inv) => inv.status === "pending")

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="type-section-title text-foreground">Team</h2>
            <p className="type-meta mt-1">Manage who has access to this business workspace.</p>
          </div>
        </div>
        {isOwner && <InviteDialog businessId={businessId} disabled={false} />}
      </div>

      <section className={sectionCardClass}>
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">Members</h3>
        </div>

        {membershipsQuery.isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : membershipsQuery.isError ? (
          <div className="p-5 text-sm text-danger">Could not load members. Please refresh to try again.</div>
        ) : (membershipsQuery.data?.length ?? 0) === 0 ? (
          <div className="p-5 text-sm text-muted-foreground">No members found.</div>
        ) : (
          <ul className="divide-y divide-border">
            {membershipsQuery.data?.map((m) => (
              <li key={m.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                    {m.userId.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={roleBadgeClass(m.role)}>{m.role}</span>
                      <span className={statusBadgeClass(m.status)}>{m.status}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{m.userId}</p>
                  </div>
                </div>

                {isOwner && (
                  <div className="flex items-center gap-2">
                    <Select
                      defaultValue={m.role}
                      onValueChange={(role) => handleRoleChange(m.id, role as "owner" | "staff")}
                      disabled={updateMutation.isPending}
                    >
                      <SelectTrigger className="h-8 w-28 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <MithoButton variant="ghost" size="sm" className="h-8 w-8 p-0 text-danger hover:text-danger">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove member</span>
                        </MithoButton>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove this member?</AlertDialogTitle>
                          <AlertDialogDescription>
                            They will lose access to this business workspace immediately.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemove(m.id)}
                            className="bg-danger text-white hover:bg-danger/90"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {isOwner && (
        <section className={sectionCardClass}>
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Pending invitations</h3>
          </div>

          {invitationsQuery.isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : pendingInvitations.length === 0 ? (
            <div className="p-5 text-sm text-muted-foreground">No pending invitations.</div>
          ) : (
            <ul className="divide-y divide-border">
              {pendingInvitations.map((inv) => (
                <li key={inv.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{inv.email}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Invited as {inv.role} · expires {new Date(inv.expiresAt).toLocaleDateString()}
                    </p>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <MithoButton variant="outline-secondary" size="sm" disabled={revokeMutation.isPending}>
                        Revoke
                      </MithoButton>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Revoke this invitation?</AlertDialogTitle>
                        <AlertDialogDescription>
                          The invitation to {inv.email} will be cancelled and can no longer be accepted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRevoke(inv.id)}>Revoke invitation</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
