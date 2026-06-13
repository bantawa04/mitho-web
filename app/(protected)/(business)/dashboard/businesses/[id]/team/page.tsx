import { TeamRoutePage } from "@/features/dashboard/screens/business-team-page"

interface Props {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params
  return <TeamRoutePage businessId={id.trim()} />
}
