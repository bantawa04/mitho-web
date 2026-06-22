"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Send } from "lucide-react"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCreateBusinessReport } from "@/hooks/use-business-reports"
import { toast } from "@/hooks/use-toast"
import { extractApiErrorMessage } from "@/lib/api-error-utils"
import { businessReportSchema, type BusinessReportFormValues } from "@/lib/validators/business-report"
import type { BusinessReportReason } from "@/types/business-reports"

const reasonOptions: Array<{ value: BusinessReportReason; label: string; helper: string }> = [
  { value: "phone", label: "Phone number", helper: "Share the correct phone number if you know it." },
  { value: "address", label: "Address or location", helper: "Share the correct address, area, or landmark." },
  { value: "hours", label: "Opening hours", helper: "Tell us which hours look wrong." },
  { value: "website_social", label: "Website or social link", helper: "Paste the correct link or describe the issue." },
  { value: "business_closed", label: "Business is closed", helper: "Tell us if it appears temporarily or permanently closed." },
  { value: "duplicate", label: "Duplicate listing", helper: "Share the duplicate listing name or link." },
  { value: "wrong_photos", label: "Wrong photos", helper: "Describe which photos do not belong here." },
  { value: "other", label: "Other", helper: "Describe what looks incorrect." },
]

const inputClassName =
  "h-11 rounded-lg border-border bg-white px-4 shadow-none focus-visible:border-primary focus-visible:ring-primary/25"
const textareaClassName =
  "resize-none rounded-lg border-border bg-white px-4 py-3 shadow-none focus-visible:border-primary focus-visible:ring-primary/25"
const selectTriggerClassName =
  "h-11 w-full rounded-lg border-border bg-white px-4 shadow-none focus-visible:border-primary focus-visible:ring-primary/25"

interface ReportIncorrectInfoDialogProps {
  businessId: string
  businessName: string
  children: React.ReactNode
}

export function ReportIncorrectInfoDialog({ businessId, businessName, children }: ReportIncorrectInfoDialogProps) {
  const [open, setOpen] = useState(false)
  const mutation = useCreateBusinessReport(businessId)
  const form = useForm<BusinessReportFormValues>({
    resolver: zodResolver(businessReportSchema) as Resolver<BusinessReportFormValues>,
    defaultValues: {
      reason: "phone",
      suggestedCorrection: "",
      note: "",
      reporterEmail: "",
    },
  })

  const selectedReason = useWatch({ control: form.control, name: "reason" })
  const selectedOption = reasonOptions.find((option) => option.value === selectedReason) ?? reasonOptions[0]

  async function onSubmit(values: BusinessReportFormValues) {
    try {
      await mutation.mutateAsync({
        reason: values.reason,
        suggestedCorrection: values.suggestedCorrection?.trim() || undefined,
        note: values.note?.trim() || undefined,
        reporterEmail: values.reporterEmail?.trim() || undefined,
      })
      form.reset()
      setOpen(false)
      toast({
        title: "Report submitted",
        description: "Thanks. Our team will review this report.",
      })
    } catch (error) {
      toast({
        title: "Could not submit report",
        description: extractApiErrorMessage(error),
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>Report incorrect information</DialogTitle>
          <DialogDescription>
            Tell us what looks wrong on {businessName}. Reports are reviewed before any listing changes are made.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What is wrong?</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className={selectTriggerClassName}>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {reasonOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="flex gap-2 text-sm leading-6 text-muted-foreground">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    {selectedOption.helper}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="suggestedCorrection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suggested correction</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Share the correct information if you know it."
                      className={textareaClassName}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional note</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Add context that will help our team verify this."
                      className={textareaClassName}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reporterEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your email, optional</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      inputMode="email"
                      placeholder="you@example.com"
                      className={inputClassName}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
                <Send className="h-4 w-4" />
                {mutation.isPending ? "Submitting..." : "Submit report"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
