"use client"

import { AlertTriangle } from "lucide-react"
import { MithoButton } from "@/components/mitho/mitho-button"
import { useToast } from "@/hooks/use-toast"
import { useAuthSnapshot } from "@/hooks/use-auth-session"
import { useCancelAccountDeletion } from "@/hooks/use-account-deletion"
import { extractApiErrorMessage } from "@/lib/api-error-utils"

export function DeletionPendingBanner() {
  const { authUser } = useAuthSnapshot()
  const cancelDeletion = useCancelAccountDeletion()
  const { toast } = useToast()

  if (!authUser?.accountPendingDeletion || !authUser.deletionFinalizeAt) return null

  const finalizeDate = new Date(authUser.deletionFinalizeAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleReactivate = () => {
    cancelDeletion.mutate(undefined, {
      onSuccess: () => {
        toast({ title: "Account reactivated", description: "Your deletion request has been cancelled." })
      },
      onError: (error) => {
        toast({ title: "Could not reactivate", description: extractApiErrorMessage(error), variant: "destructive" })
      },
    })
  }

  return (
    <div className="border-b border-warning/20 bg-warning/8 px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
          <p className="text-sm font-medium text-foreground">
            Your account is scheduled for deletion on {finalizeDate}. Sign back in within the grace window to cancel.
          </p>
        </div>
        <MithoButton
          size="sm"
          variant="outline-secondary"
          onClick={handleReactivate}
          loading={cancelDeletion.isPending}
          disabled={cancelDeletion.isPending}
        >
          Reactivate account
        </MithoButton>
      </div>
    </div>
  )
}
