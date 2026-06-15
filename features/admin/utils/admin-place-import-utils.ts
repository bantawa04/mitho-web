import type {
  PlaceImportAddressReviewStatus,
  PlaceImportBatch,
  PlaceImportCandidate,
  PlaceImportDuplicateStatus,
  PlaceImportStatus,
} from "@/types/place-import"

export function getPlaceImportStatusPresentation(status: PlaceImportStatus) {
  switch (status) {
    case "imported":
      return { label: "Imported", tone: "border-emerald-100 bg-emerald-50 text-emerald-700" }
    case "rejected":
      return { label: "Rejected", tone: "border-rose-100 bg-rose-50 text-rose-700" }
    case "pending":
    default:
      return { label: "Pending", tone: "border-slate-200 bg-slate-50 text-slate-700" }
  }
}

export function getPlaceImportDuplicatePresentation(status: PlaceImportDuplicateStatus) {
  switch (status) {
    case "matched":
      return { label: "Linked", tone: "border-emerald-100 bg-emerald-50 text-emerald-700" }
    case "warning":
      return { label: "Duplicate Warning", tone: "border-amber-100 bg-amber-50 text-amber-700" }
    case "clear":
      return { label: "No Match Found", tone: "border-slate-200 bg-slate-50 text-slate-700" }
    case "pending":
    default:
      return { label: "Check Pending", tone: "border-slate-200 bg-slate-50 text-slate-700" }
  }
}

export function getPlaceImportAddressPresentation(status: PlaceImportAddressReviewStatus) {
  switch (status) {
    case "normalized":
      return { label: "Address Ready", tone: "border-emerald-100 bg-emerald-50 text-emerald-700" }
    case "needs_attention":
      return { label: "Needs Address Review", tone: "border-amber-100 bg-amber-50 text-amber-700" }
    case "pending":
    default:
      return { label: "Address Pending", tone: "border-slate-200 bg-slate-50 text-slate-700" }
  }
}

export function getPlaceImportBatchStatusPresentation(status: PlaceImportBatch["status"]) {
  switch (status) {
    case "failed":
      return { label: "Failed", tone: "border-rose-100 bg-rose-50 text-rose-700" }
    case "fetched":
    default:
      return { label: "Fetched", tone: "border-emerald-100 bg-emerald-50 text-emerald-700" }
  }
}

export function formatPlaceImportBatchBias(batch: Pick<PlaceImportBatch, "latitude" | "longitude" | "radiusMeters">) {
  if (typeof batch.latitude !== "number" || typeof batch.longitude !== "number") {
    return "No location bias"
  }

  const coords = `${batch.latitude.toFixed(4)}, ${batch.longitude.toFixed(4)}`
  if (typeof batch.radiusMeters === "number" && batch.radiusMeters > 0) {
    return `${coords} · ${batch.radiusMeters.toLocaleString()}m`
  }
  return coords
}

export function formatPlaceImportCandidateLocation(candidate: Pick<PlaceImportCandidate, "addressLine1" | "addressLine2" | "wardNo" | "municipality" | "district" | "province">) {
  return [
    candidate.addressLine1,
    candidate.addressLine2,
    candidate.wardNo ? `Ward ${candidate.wardNo}` : undefined,
    candidate.municipality?.name || undefined,
    candidate.district?.name || undefined,
    candidate.province?.name || undefined,
  ]
    .filter((value): value is string => Boolean(value && value.trim()))
    .join(", ")
}

export function formatDuplicateHintSummary(candidate: Pick<PlaceImportCandidate, "duplicateHints">) {
  if (candidate.duplicateHints.length === 0) return "No likely matches"
  if (candidate.duplicateHints.length === 1) return "1 likely match"
  return `${candidate.duplicateHints.length} likely matches`
}
