import API from "@/config/api"
import type {
  AddCollectionItemPayload,
  CollectionRecord,
  CollectionsListResponse,
  CreateCollectionPayload,
  ListCollectionsParams,
  ReorderCollectionItemsPayload,
  UpdateCollectionItemPayload,
  UpdateCollectionPayload,
} from "@/types/collections"
import type { ISuccessResponse } from "@/types/response"

function mapListParams(params?: ListCollectionsParams) {
  if (!params) return undefined
  return {
    page: params.page,
    per_page: params.perPage,
    search: params.search || undefined,
    sort: params.sort || undefined,
    business_id: params.businessId || undefined,
    include_items: params.includeItems,
  }
}

function mapCreatePayload(payload: CreateCollectionPayload) {
  return {
    title: payload.title,
    description: payload.description || undefined,
    visibility: payload.visibility,
    initial_item: payload.initialItem
      ? {
          business_id: payload.initialItem.businessId,
          note: payload.initialItem.note || undefined,
        }
      : undefined,
  }
}

function mapUpdatePayload(payload: UpdateCollectionPayload) {
  return {
    title: payload.title,
    description: payload.description || undefined,
    visibility: payload.visibility,
  }
}

export async function listCollections(params?: ListCollectionsParams): Promise<CollectionsListResponse> {
  const { data } = await API.get<ISuccessResponse<CollectionsListResponse>>("/collections", {
    params: mapListParams(params),
  })
  return data.data
}

export async function getCollection(id: string): Promise<CollectionRecord> {
  const { data } = await API.get<ISuccessResponse<CollectionRecord>>(`/collections/${id.trim()}`)
  return data.data
}

export async function createCollection(payload: CreateCollectionPayload): Promise<CollectionRecord> {
  const { data } = await API.post<ISuccessResponse<CollectionRecord>>("/collections", mapCreatePayload(payload))
  return data.data
}

export async function updateCollection(id: string, payload: UpdateCollectionPayload): Promise<CollectionRecord> {
  const { data } = await API.put<ISuccessResponse<CollectionRecord>>(`/collections/${id.trim()}`, mapUpdatePayload(payload))
  return data.data
}

export async function deleteCollection(id: string): Promise<void> {
  await API.delete(`/collections/${id.trim()}`)
}

export async function addCollectionItem(id: string, payload: AddCollectionItemPayload): Promise<CollectionRecord> {
  const { data } = await API.post<ISuccessResponse<CollectionRecord>>(`/collections/${id.trim()}/items`, {
    business_id: payload.businessId,
    note: payload.note || undefined,
  })
  return data.data
}

export async function updateCollectionItem(collectionId: string, itemId: string, payload: UpdateCollectionItemPayload): Promise<CollectionRecord> {
  const { data } = await API.put<ISuccessResponse<CollectionRecord>>(`/collections/${collectionId.trim()}/items/${itemId.trim()}`, {
    note: payload.note || undefined,
  })
  return data.data
}

export async function deleteCollectionItem(collectionId: string, itemId: string): Promise<CollectionRecord> {
  const { data } = await API.delete<ISuccessResponse<CollectionRecord>>(`/collections/${collectionId.trim()}/items/${itemId.trim()}`)
  return data.data
}

export async function reorderCollectionItems(collectionId: string, payload: ReorderCollectionItemsPayload): Promise<CollectionRecord> {
  const { data } = await API.put<ISuccessResponse<CollectionRecord>>(`/collections/${collectionId.trim()}/items/reorder`, {
    item_ids: payload.itemIds,
  })
  return data.data
}

export async function copyCollection(collectionId: string): Promise<CollectionRecord> {
  const { data } = await API.post<ISuccessResponse<CollectionRecord>>(`/collections/${collectionId.trim()}/copy`)
  return data.data
}

export async function listPublicCollections(username: string, params?: Pick<ListCollectionsParams, "page" | "perPage">): Promise<CollectionsListResponse> {
  const { data } = await API.get<ISuccessResponse<CollectionsListResponse>>(`/users/${username}/collections`, {
    params: {
      page: params?.page,
      per_page: params?.perPage,
    },
  })
  return data.data
}

export async function getPublicCollection(username: string, id: string): Promise<CollectionRecord> {
  const { data } = await API.get<ISuccessResponse<CollectionRecord>>(`/users/${username}/collections/${id.trim()}`)
  return data.data
}
