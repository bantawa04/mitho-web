"use client"

import { useMemo } from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDistricts, useMunicipalities, useProvinces } from "@/hooks/use-nepal-admin"
import type { EstablishmentType } from "@/types/establishment-types"
import type { PlaceSearchResult } from "@/types/place-import"

export interface NormalizeRowState {
  provinceId: number | null
  districtId: number | null
  municipalityId: number | null
  wardNo: number | null
  establishmentTypeId: string
}

interface PlaceImportNormalizeRowProps {
  place: PlaceSearchResult
  value: NormalizeRowState
  establishmentTypes: EstablishmentType[]
  onChange: (next: NormalizeRowState) => void
}

const NONE = "__none__"
const BLANK_WARD = "__blank_ward__"

export function PlaceImportNormalizeRow({ place, value, establishmentTypes, onChange }: PlaceImportNormalizeRowProps) {
  const provincesQuery = useProvinces()
  const districtsQuery = useDistricts(value.provinceId)
  const municipalitiesQuery = useMunicipalities(value.districtId)

  const selectedMunicipality = useMemo(
    () => municipalitiesQuery.data?.find((item) => item.id === value.municipalityId),
    [municipalitiesQuery.data, value.municipalityId],
  )
  const wardOptions = useMemo(
    () => (selectedMunicipality ? Array.from({ length: selectedMunicipality.wards }, (_, index) => index + 1) : []),
    [selectedMunicipality],
  )

  return (
    <TableRow className="border-border align-top text-sm">
      <TableCell className="min-w-[180px] py-3">
        <p className="font-medium text-foreground">{place.name}</p>
        {place.formattedAddress ? (
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{place.formattedAddress}</p>
        ) : null}
      </TableCell>

      <TableCell className="py-3">
        <Select
          value={value.provinceId ? String(value.provinceId) : ""}
          onValueChange={(next) =>
            onChange({ ...value, provinceId: Number(next), districtId: null, municipalityId: null, wardNo: null })
          }
        >
          <SelectTrigger className="h-9 w-[150px] rounded-lg border-border bg-white shadow-none">
            <SelectValue placeholder="Province" />
          </SelectTrigger>
          <SelectContent>
            {(provincesQuery.data ?? []).map((province) => (
              <SelectItem key={province.id} value={String(province.id)}>
                {province.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      <TableCell className="py-3">
        <Select
          value={value.districtId ? String(value.districtId) : ""}
          onValueChange={(next) => onChange({ ...value, districtId: Number(next), municipalityId: null, wardNo: null })}
          disabled={!value.provinceId}
        >
          <SelectTrigger className="h-9 w-[150px] rounded-lg border-border bg-white shadow-none">
            <SelectValue placeholder="District" />
          </SelectTrigger>
          <SelectContent>
            {(districtsQuery.data ?? []).map((district) => (
              <SelectItem key={district.id} value={String(district.id)}>
                {district.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      <TableCell className="py-3">
        <Select
          value={value.municipalityId ? String(value.municipalityId) : ""}
          onValueChange={(next) => onChange({ ...value, municipalityId: Number(next), wardNo: null })}
          disabled={!value.districtId}
        >
          <SelectTrigger className="h-9 w-[170px] rounded-lg border-border bg-white shadow-none">
            <SelectValue placeholder="Municipality" />
          </SelectTrigger>
          <SelectContent>
            {(municipalitiesQuery.data ?? []).map((municipality) => (
              <SelectItem key={municipality.id} value={String(municipality.id)}>
                {municipality.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      <TableCell className="py-3">
        <Select
          value={value.municipalityId ? (value.wardNo ? String(value.wardNo) : BLANK_WARD) : ""}
          onValueChange={(next) => onChange({ ...value, wardNo: next === BLANK_WARD ? null : Number(next) })}
          disabled={!value.municipalityId}
        >
          <SelectTrigger className="h-9 w-[90px] rounded-lg border-border bg-white shadow-none">
            <SelectValue placeholder="Ward (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={BLANK_WARD}>Leave blank</SelectItem>
            {wardOptions.map((ward) => (
              <SelectItem key={ward} value={String(ward)}>
                {ward}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      <TableCell className="py-3">
        <Select
          value={value.establishmentTypeId || NONE}
          onValueChange={(next) => onChange({ ...value, establishmentTypeId: next === NONE ? "" : next })}
        >
          <SelectTrigger className="h-9 w-[160px] rounded-lg border-border bg-white shadow-none">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>No type</SelectItem>
            {establishmentTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  )
}
