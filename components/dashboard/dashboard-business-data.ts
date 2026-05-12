export type ManagedBusinessStatus = "active" | "setup-needed" | "claim-pending"
export type ManagedBusinessRole = "owner" | "manager"
export type DashboardScenario = "empty" | "single" | "multi"

export interface ManagedBusiness {
  id: string
  name: string
  location: string
  status: ManagedBusinessStatus
  role?: ManagedBusinessRole
  claimStatus?: "pending-review"
  profileCompleteness?: number
  lastActivity?: string
  reviewCount?: number
}

export const DASHBOARD_MOCK_BUSINESSES: Record<DashboardScenario, ManagedBusiness[]> = {
  empty: [],
  single: [
    {
      id: "the-himalayan-kitchen",
      name: "The Himalayan Kitchen",
      location: "Thamel, Kathmandu",
      status: "active",
      role: "owner",
      profileCompleteness: 86,
      lastActivity: "2 new reviews this week",
      reviewCount: 47,
    },
  ],
  multi: [
    {
      id: "the-himalayan-kitchen",
      name: "The Himalayan Kitchen",
      location: "Thamel, Kathmandu",
      status: "active",
      role: "owner",
      profileCompleteness: 86,
      lastActivity: "2 new reviews this week",
      reviewCount: 47,
    },
    {
      id: "patan-sekuwa-house",
      name: "Patan Sekuwa House",
      location: "Patan, Lalitpur",
      status: "setup-needed",
      role: "owner",
      profileCompleteness: 54,
      lastActivity: "Photos and hours still missing",
      reviewCount: 12,
    },
    {
      id: "new-road-momo-corner",
      name: "New Road Momo Corner",
      location: "New Road, Kathmandu",
      status: "claim-pending",
      role: "manager",
      claimStatus: "pending-review",
      profileCompleteness: 0,
      lastActivity: "Claim submitted 3 days ago",
      reviewCount: 0,
    },
  ],
}

export function getDashboardScenario(value?: string | null): DashboardScenario {
  if (value === "empty" || value === "single" || value === "multi") return value
  return "multi"
}

export function getManagedBusinesses(scenario: DashboardScenario) {
  return DASHBOARD_MOCK_BUSINESSES[scenario]
}

export function getManagedBusinessById(scenario: DashboardScenario, id: string) {
  return DASHBOARD_MOCK_BUSINESSES[scenario].find((business) => business.id === id)
}

export function getManagedBusinessByIdAny(id: string) {
  return Object.values(DASHBOARD_MOCK_BUSINESSES)
    .flat()
    .find((business) => business.id === id)
}
