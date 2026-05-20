import type { ReactNode } from "react"

export default function BusinessProtectedLayout({ children }: { children: ReactNode }) {
  return <div className="page-shell-business min-h-screen">{children}</div>
}
