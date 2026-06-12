import API from "@/config/api"
import type { ISuccessResponse } from "@/types/response"
import type {
  AddGalleryItemsPayload,
  BusinessGalleryItem,
  UpdateGalleryItemPayload,
} from "@/types/gallery"

export async function listBusinessGallery(businessId: string): Promise<BusinessGalleryItem[]> {
  const { data } = await API.get<ISuccessResponse<BusinessGalleryItem[]>>(
    `/businesses/${businessId}/gallery`,
  )
  return data.data
}

export async function addGalleryItems(
  businessId: string,
  payload: AddGalleryItemsPayload,
): Promise<BusinessGalleryItem[]> {
  const { data } = await API.post<ISuccessResponse<BusinessGalleryItem[]>>(
    `/businesses/${businessId}/gallery`,
    payload,
  )
  return data.data
}

export async function updateGalleryItem(
  businessId: string,
  attachmentId: string,
  payload: UpdateGalleryItemPayload,
): Promise<BusinessGalleryItem> {
  const { data } = await API.patch<ISuccessResponse<BusinessGalleryItem>>(
    `/businesses/${businessId}/gallery/${attachmentId}`,
    payload,
  )
  return data.data
}

export async function deleteGalleryItem(businessId: string, attachmentId: string): Promise<void> {
  await API.delete(`/businesses/${businessId}/gallery/${attachmentId}`)
}
