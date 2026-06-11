import API from "@/config/api"
import type { AuthUser } from "@/types/auth"
import type { ISuccessResponse } from "@/types/response"

export interface PublicProfileReviewPreview {
  id: string
  businessName: string
  location: string
  rating: number
  date: string
  excerpt: string
  publicHref: string
}

export interface PublicProfileData {
  userId: string
  name: string
  username: string
  avatarUrl: string | null
  joinedLabel: string
  bio: string
  reviewCount: number
  collectionCount: number
  followerCount: number
  isFollowedByCurrentUser: boolean
  citiesExplored: number
  recentPublicReviews: PublicProfileReviewPreview[]
}

export interface UsernameSuggestion {
  username: string
}

export interface UsernameAvailability {
  username: string
  available: boolean
}

export async function getUsernameSuggestion(): Promise<UsernameSuggestion> {
  const { data } = await API.get<ISuccessResponse<UsernameSuggestion>>("/auth/username-suggestion")
  return data.data
}

export async function checkUsernameAvailability(username: string): Promise<UsernameAvailability> {
  const { data } = await API.get<ISuccessResponse<UsernameAvailability>>("/auth/username-availability", {
    params: { username },
  })
  return data.data
}

export async function completeProfile(username: string): Promise<AuthUser> {
  const { data } = await API.post<ISuccessResponse<AuthUser>>("/auth/complete-profile", { username })
  return data.data
}

export async function getPublicProfile(username: string): Promise<PublicProfileData> {
  const { data } = await API.get<ISuccessResponse<PublicProfileData>>(`/users/${username}`)
  return data.data
}
