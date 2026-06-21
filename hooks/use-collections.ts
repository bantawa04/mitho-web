"use client"

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  addCollectionItem,
  copyCollection,
  createCollection,
  deleteCollection,
  deleteCollectionItem,
  getCollection,
  getPublicCollection,
  listCollections,
  listPublicCollections,
  reorderCollectionItems,
  updateCollection,
  updateCollectionItem,
} from "@/lib/api/collections"
import { queryKeys } from "@/lib/api/query-keys"
import type {
  AddCollectionItemPayload,
  CreateCollectionPayload,
  ListCollectionsParams,
  ReorderCollectionItemsPayload,
  UpdateCollectionItemPayload,
  UpdateCollectionPayload,
} from "@/types/collections"

export function useCollections(params?: ListCollectionsParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.collections.list(params),
    queryFn: () => listCollections(params),
    enabled: options?.enabled ?? true,
  })
}

export function useCollectionPicker(
  params: Pick<ListCollectionsParams, "businessId" | "search" | "sort">,
  options?: { enabled?: boolean; perPage?: number },
) {
  const perPage = options?.perPage ?? 20
  const queryParams = {
    businessId: params.businessId,
    includeItems: false,
    search: params.search || undefined,
    sort: params.sort ?? "recent",
  }

  return useInfiniteQuery({
    queryKey: queryKeys.collections.picker(queryParams),
    queryFn: ({ pageParam }) =>
      listCollections({
        ...queryParams,
        page: pageParam,
        perPage,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
    enabled: options?.enabled ?? true,
  })
}

export function useCollection(id: string | undefined) {
  const cleanId = id?.trim()
  return useQuery({
    queryKey: queryKeys.collections.detail(cleanId ?? ""),
    queryFn: () => getCollection(cleanId!),
    enabled: Boolean(cleanId),
  })
}

export function usePublicCollections(username: string | undefined, params?: Pick<ListCollectionsParams, "page" | "perPage">) {
  const cleanUsername = username?.trim()
  return useQuery({
    queryKey: queryKeys.collections.publicList(cleanUsername ?? "", params),
    queryFn: () => listPublicCollections(cleanUsername!, params),
    enabled: Boolean(cleanUsername),
  })
}

export function usePublicCollection(username: string | undefined, id: string | undefined) {
  const cleanUsername = username?.trim()
  const cleanId = id?.trim()
  return useQuery({
    queryKey: queryKeys.collections.publicDetail(cleanUsername ?? "", cleanId ?? ""),
    queryFn: () => getPublicCollection(cleanUsername!, cleanId!),
    enabled: Boolean(cleanUsername) && Boolean(cleanId),
  })
}

export function useCreateCollection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCollectionPayload) => createCollection(payload),
    onSuccess: (collection) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.all })
      queryClient.setQueryData(queryKeys.collections.detail(collection.id), collection)
    },
  })
}

export function useUpdateCollection(id: string) {
  const queryClient = useQueryClient()
  const cleanId = id.trim()
  return useMutation({
    mutationFn: (payload: UpdateCollectionPayload) => updateCollection(cleanId, payload),
    onSuccess: (collection) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.all })
      queryClient.setQueryData(queryKeys.collections.detail(cleanId), collection)
    },
  })
}

export function useDeleteCollection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.all })
    },
  })
}

export function useAddCollectionItem(collectionId: string) {
  const queryClient = useQueryClient()
  const cleanId = collectionId.trim()
  return useMutation({
    mutationFn: (payload: AddCollectionItemPayload) => addCollectionItem(cleanId, payload),
    onSuccess: (collection) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.all })
      queryClient.setQueryData(queryKeys.collections.detail(cleanId), collection)
    },
  })
}

export function useUpdateCollectionItem(collectionId: string, itemId: string) {
  const queryClient = useQueryClient()
  const cleanCollectionId = collectionId.trim()
  const cleanItemId = itemId.trim()
  return useMutation({
    mutationFn: (payload: UpdateCollectionItemPayload) => updateCollectionItem(cleanCollectionId, cleanItemId, payload),
    onSuccess: (collection) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.all })
      queryClient.setQueryData(queryKeys.collections.detail(cleanCollectionId), collection)
    },
  })
}

export function useDeleteCollectionItem(collectionId: string) {
  const queryClient = useQueryClient()
  const cleanCollectionId = collectionId.trim()
  return useMutation({
    mutationFn: (itemId: string) => deleteCollectionItem(cleanCollectionId, itemId),
    onSuccess: (collection) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.all })
      queryClient.setQueryData(queryKeys.collections.detail(cleanCollectionId), collection)
    },
  })
}

export function useReorderCollectionItems(collectionId: string) {
  const queryClient = useQueryClient()
  const cleanCollectionId = collectionId.trim()
  return useMutation({
    mutationFn: (payload: ReorderCollectionItemsPayload) => reorderCollectionItems(cleanCollectionId, payload),
    onSuccess: (collection) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.all })
      queryClient.setQueryData(queryKeys.collections.detail(cleanCollectionId), collection)
    },
  })
}

export function useCopyCollection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (collectionId: string) => copyCollection(collectionId),
    onSuccess: (collection) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.all })
      queryClient.setQueryData(queryKeys.collections.detail(collection.id), collection)
    },
  })
}
