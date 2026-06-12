import API from "@/config/api"
import type { ISuccessResponse } from "@/types/response"
import type {
  AdminGalleryItem,
  AdminGalleryListResponse,
  ListAdminGalleryParams,
  RejectGalleryItemPayload,
} from "@/types/gallery"

export async function listAdminGallery(
  params: ListAdminGalleryParams,
): Promise<AdminGalleryListResponse> {
  const { data } = await API.get<ISuccessResponse<AdminGalleryListResponse>>("/admin/gallery", {
    params,
  })
  return data.data
}

export async function approveAdminGalleryItem(id: string): Promise<AdminGalleryItem> {
  const { data } = await API.put<ISuccessResponse<AdminGalleryItem>>(`/admin/gallery/${id}/approve`)
  return data.data
}

export async function rejectAdminGalleryItem(
  id: string,
  payload: RejectGalleryItemPayload,
): Promise<AdminGalleryItem> {
  const { data } = await API.put<ISuccessResponse<AdminGalleryItem>>(
    `/admin/gallery/${id}/reject`,
    payload,
  )
  return data.data
}
