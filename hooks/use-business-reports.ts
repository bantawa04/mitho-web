"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createBusinessReport,
  getAdminBusinessReport,
  listAdminBusinessReports,
  rejectAdminBusinessReport,
  resolveAdminBusinessReport,
} from "@/lib/api/business-reports"
import { queryKeys } from "@/lib/api/query-keys"
import type {
  CreateBusinessReportPayload,
  ListAdminBusinessReportsParams,
  ResolveBusinessReportPayload,
} from "@/types/business-reports"

export function useCreateBusinessReport(businessId: string) {
  return useMutation({
    mutationFn: (payload: CreateBusinessReportPayload) => createBusinessReport(businessId, payload),
  })
}

export function useAdminBusinessReports(params: ListAdminBusinessReportsParams) {
  return useQuery({
    queryKey: queryKeys.admin.reportedContent.list(params),
    queryFn: () => listAdminBusinessReports(params),
  })
}

export function useAdminBusinessReport(id: string | null) {
  return useQuery({
    queryKey: queryKeys.admin.reportedContent.detail(id),
    queryFn: () => getAdminBusinessReport(id ?? ""),
    enabled: Boolean(id),
  })
}

export function useResolveAdminBusinessReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ResolveBusinessReportPayload }) =>
      resolveAdminBusinessReport(id, payload),
    onSuccess: (report) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reportedContent.all })
      queryClient.setQueryData(queryKeys.admin.reportedContent.detail(report.id), report)
    },
  })
}

export function useRejectAdminBusinessReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ResolveBusinessReportPayload }) =>
      rejectAdminBusinessReport(id, payload),
    onSuccess: (report) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reportedContent.all })
      queryClient.setQueryData(queryKeys.admin.reportedContent.detail(report.id), report)
    },
  })
}
