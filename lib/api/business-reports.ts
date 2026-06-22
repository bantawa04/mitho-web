import API from "@/config/api"
import type { ISuccessResponse } from "@/types/response"
import type {
  AdminBusinessReportListResponse,
  BusinessInformationReport,
  CreateBusinessReportPayload,
  ListAdminBusinessReportsParams,
  ResolveBusinessReportPayload,
} from "@/types/business-reports"

function toListParams(params: ListAdminBusinessReportsParams) {
  return {
    page: params.page,
    per_page: params.perPage,
    status: params.status || undefined,
    reason: params.reason || undefined,
    business_id: params.businessId || undefined,
    search: params.search || undefined,
  }
}

export async function createBusinessReport(
  businessId: string,
  payload: CreateBusinessReportPayload,
): Promise<BusinessInformationReport> {
  const { data } = await API.post<ISuccessResponse<BusinessInformationReport>>(
    `/businesses/${businessId.trim()}/reports`,
    {
      reason: payload.reason,
      suggestedCorrection: payload.suggestedCorrection || undefined,
      note: payload.note || undefined,
      reporterEmail: payload.reporterEmail || undefined,
    },
  )
  return data.data
}

export async function listAdminBusinessReports(
  params: ListAdminBusinessReportsParams,
): Promise<AdminBusinessReportListResponse> {
  const { data } = await API.get<ISuccessResponse<AdminBusinessReportListResponse>>(
    "/admin/reported-content",
    { params: toListParams(params) },
  )
  return data.data
}

export async function getAdminBusinessReport(id: string): Promise<BusinessInformationReport> {
  const { data } = await API.get<ISuccessResponse<BusinessInformationReport>>(
    `/admin/reported-content/${id.trim()}`,
  )
  return data.data
}

export async function resolveAdminBusinessReport(
  id: string,
  payload: ResolveBusinessReportPayload,
): Promise<BusinessInformationReport> {
  const { data } = await API.put<ISuccessResponse<BusinessInformationReport>>(
    `/admin/reported-content/${id.trim()}/resolve`,
    { resolutionNote: payload.resolutionNote },
  )
  return data.data
}

export async function rejectAdminBusinessReport(
  id: string,
  payload: ResolveBusinessReportPayload,
): Promise<BusinessInformationReport> {
  const { data } = await API.put<ISuccessResponse<BusinessInformationReport>>(
    `/admin/reported-content/${id.trim()}/reject`,
    { resolutionNote: payload.resolutionNote },
  )
  return data.data
}
