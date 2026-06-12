import { PhotosRoutePage } from "@/features/dashboard/screens/business-route-pages"

interface DashboardBusinessPhotosPageProps {
  params: Promise<{ id: string }>
}

export default async function DashboardBusinessPhotosPage({ params }: DashboardBusinessPhotosPageProps) {
  const { id } = await params
  return <PhotosRoutePage businessId={id.trim()} />
}
