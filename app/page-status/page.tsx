import { readFile } from "node:fs/promises"
import path from "node:path"
import type { Metadata } from "next"
import { CATEGORY_METADATA } from "@/components/categories/category-taxonomy"
import { CITY_METADATA } from "@/components/cities/city-taxonomy"
import { ownedCollections, publicCollections } from "@/components/collections/collection-data"
import { mockCustomerProfile } from "@/components/profile/profile-data"

type PageStatus = "completed" | "pending"

interface PageStatusEntry {
  route: string
  description: string
  status: PageStatus
}

interface PageStatusGroup {
  phase: string
  section: string
  items: PageStatusEntry[]
}

const SAMPLE_ROUTE_MAP: Record<string, string> = {
  "/business/[slug]": mockCustomerProfile.recentReviews[0]?.publicHref ?? "/business/demo-empty",
  "/categories/[slug]": `/categories/${CATEGORY_METADATA[0]?.slug ?? "restaurants"}`,
  "/cities/[slug]": `/cities/${CITY_METADATA[0]?.slug ?? "kathmandu"}`,
  "/collections/[id]": `/collections/${ownedCollections[0]?.id ?? "best-pizza-places"}`,
  "/collections/[id]/edit": `/collections/${ownedCollections[0]?.id ?? "best-pizza-places"}/edit`,
  "/collections/[id]/copy": `/collections/${ownedCollections[0]?.id ?? "best-pizza-places"}/copy`,
  "/users/[username]": `/users/${mockCustomerProfile.username}`,
  "/users/[username]/collections/[id]": `/users/${publicCollections[0]?.owner.username ?? "nabin-eats"}/collections/${publicCollections[0]?.id ?? "kathmandu-momo-crawl"}`,
}

export const metadata: Metadata = {
  title: "Page Status | Mitho Cha!",
  description: "Development tracker view of completed and pending pages.",
}

function parseTracker(markdown: string) {
  const groups: PageStatusGroup[] = []
  const lines = markdown.split(/\r?\n/)
  const routePattern = /^- \[(x| )\] `([^`]+)`\s+(.*)$/

  let currentPhase = ""
  let currentSection = ""
  let stopParsing = false

  for (const line of lines) {
    if (line.startsWith("## Cross-cutting decisions to track") || line.startsWith("## Notes")) {
      stopParsing = true
    }

    if (stopParsing) {
      break
    }

    if (line.startsWith("## ")) {
      currentPhase = line.replace(/^##\s+/, "").trim()
      currentSection = ""
      continue
    }

    if (line.startsWith("### ")) {
      currentSection = line.replace(/^###\s+/, "").trim()
      continue
    }

    const match = line.match(routePattern)

    if (!match || !currentPhase || !currentSection) {
      continue
    }

    const [, rawStatus, route, description] = match
    const status: PageStatus = rawStatus === "x" ? "completed" : "pending"
    const lastGroup = groups[groups.length - 1]

    if (!lastGroup || lastGroup.phase !== currentPhase || lastGroup.section !== currentSection) {
      groups.push({
        phase: currentPhase,
        section: currentSection,
        items: [{ route, description: description.trim(), status }],
      })
      continue
    }

    lastGroup.items.push({ route, description: description.trim(), status })
  }

  return groups
}

async function getStatusGroups() {
  const trackerPath = path.join(process.cwd(), "PRODUCT_PAGES_TODO.md")
  const trackerContents = await readFile(trackerPath, "utf8")
  const parsedGroups = parseTracker(trackerContents)

  return {
    completed: parsedGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.status === "completed"),
      }))
      .filter((group) => group.items.length > 0),
    pending: parsedGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.status === "pending"),
      }))
      .filter((group) => group.items.length > 0),
  }
}

function getHrefForRoute(route: string) {
  return SAMPLE_ROUTE_MAP[route] ?? route
}

function StatusGroupList({
  title,
  groups,
  linkCompleted,
}: {
  title: string
  groups: PageStatusGroup[]
  linkCompleted: boolean
}) {
  return (
    <section className="mb-4">
      <h2 className="font-bold mb-3">{title}</h2>
      {groups.length === 0 ? (
        <p>None</p>
      ) : (
        groups.map((group) => (
          <section className="mb-2 font-bold" key={`${title}-${group.phase}-${group.section}`}>
            <h3 className="mb-2 font-bold">{group.phase} / {group.section}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={`${group.phase}-${group.section}-${item.route}`} >
                  {linkCompleted ? (
                    <a href={getHrefForRoute(item.route)} className="mb-2">
                     ✅ <span >{item.route}</span> - <span className="font-semibold">{item.description}</span>
                    </a>
                  ) : (
                    <>
                      ❌<code>{item.route}</code> -  <span className="font-semibold">{item.description}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </section>
  )
}

export default async function PageStatusRoute() {
  const { completed, pending } = await getStatusGroups()

  return (
    <main className="px-5">
      <h1>Page status</h1>
      <p className="mb-2">Completed pages come from the tracker and are linked. Pending pages come from the same tracker and are shown as plain text only.</p>

      <StatusGroupList title="Completed" groups={completed} linkCompleted />
      <StatusGroupList title="Pending" groups={pending} linkCompleted={false} />
    </main>
  )
}
