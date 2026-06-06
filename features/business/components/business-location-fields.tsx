"use client"

import { useMemo } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useDistricts, useMunicipalities, useProvinces } from "@/hooks/use-nepal-admin"
import type { District, Municipality, Province } from "@/types/nepal-admin"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type LocationSelection = {
  province?: Pick<Province, "id" | "name"> | null
  district?: Pick<District, "id" | "name"> | null
  municipality?: Pick<Municipality, "id" | "name" | "wards"> | null
}

interface BusinessLocationFieldsProps {
  form: UseFormReturn<any>
  inputClassName: string
  selectTriggerClassName: string
  selectedLocation?: LocationSelection
}

function toNumericId(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && /^\d+$/.test(value)) return Number(value)
  return null
}

function isSelectedLocation<T extends { id: number }>(item: T | null | undefined, value: string) {
  return item ? String(item.id) === value : false
}

function SelectDisplay({ label, placeholder }: { label?: string; placeholder: string }) {
  if (label) {
    return <span data-slot="select-value">{label}</span>
  }

  return <SelectValue placeholder={placeholder} />
}

function RequiredLabel({ children }: { children: string }) {
  return (
    <FormLabel>
      {children} <span className="text-danger">*</span>
    </FormLabel>
  )
}

export function BusinessLocationFields({
  form,
  inputClassName,
  selectTriggerClassName,
  selectedLocation,
}: BusinessLocationFieldsProps) {
  const provinceId = String(form.watch("provinceId") ?? "")
  const districtId = String(form.watch("districtId") ?? "")
  const municipalityId = String(form.watch("municipalityId") ?? "")
  const wardNo = String(form.watch("wardNo") ?? "")

  const provinceValue = toNumericId(provinceId)
  const districtValue = toNumericId(districtId)

  const provincesQuery = useProvinces()
  const districtsQuery = useDistricts(provinceValue)
  const municipalitiesQuery = useMunicipalities(districtValue)

  const selectedProvince = useMemo(
    () =>
      provincesQuery.data?.find((item) => String(item.id) === provinceId) ??
      (isSelectedLocation(selectedLocation?.province, provinceId) ? selectedLocation?.province : null),
    [provincesQuery.data, provinceId, selectedLocation?.province],
  )

  const selectedDistrict = useMemo(
    () =>
      districtsQuery.data?.find((item) => String(item.id) === districtId) ??
      (isSelectedLocation(selectedLocation?.district, districtId) ? selectedLocation?.district : null),
    [districtsQuery.data, districtId, selectedLocation?.district],
  )

  const selectedMunicipality = useMemo<Municipality | null>(
    () =>
      municipalitiesQuery.data?.find((item) => String(item.id) === municipalityId) ??
      (isSelectedLocation(selectedLocation?.municipality, municipalityId)
        ? ({
            ...selectedLocation?.municipality,
            districtId: districtValue ?? 0,
            categoryId: 0,
            category: { id: 0, name: "", shortCode: "" },
          } as Municipality)
        : null),
    [municipalitiesQuery.data, municipalityId, selectedLocation?.municipality, districtValue],
  )
  const wardOptions = selectedMunicipality?.wards
    ? Array.from({ length: selectedMunicipality.wards }, (_, index) => String(index + 1))
    : []

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="provinceId"
        render={({ field }) => (
          <FormItem>
            <RequiredLabel>Province / State</RequiredLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value)
                form.setValue("districtId", "", { shouldDirty: true })
                form.setValue("municipalityId", "", { shouldDirty: true })
                form.setValue("wardNo", "", { shouldDirty: true })
              }}
              value={field.value}
              disabled={provincesQuery.isLoading}
            >
              <FormControl>
                <SelectTrigger className={selectTriggerClassName}>
                  <SelectDisplay
                    label={selectedProvince?.name}
                    placeholder={provincesQuery.isLoading ? "Loading..." : "Choose a province"}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {(provincesQuery.data ?? []).map((province) => (
                  <SelectItem key={province.id} value={String(province.id)}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="districtId"
        render={({ field }) => (
          <FormItem>
            <RequiredLabel>District</RequiredLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value)
                form.setValue("municipalityId", "", { shouldDirty: true })
                form.setValue("wardNo", "", { shouldDirty: true })
              }}
              value={field.value}
              disabled={!provinceId || districtsQuery.isLoading}
            >
              <FormControl>
                <SelectTrigger className={selectTriggerClassName}>
                  <SelectDisplay
                    label={selectedDistrict?.name}
                    placeholder={!provinceId ? "Choose a province first" : districtsQuery.isLoading ? "Loading..." : "Choose a district"}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {(districtsQuery.data ?? []).map((district) => (
                  <SelectItem key={district.id} value={String(district.id)}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="municipalityId"
        render={({ field }) => (
          <FormItem>
            <RequiredLabel>City / Municipality</RequiredLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value)
                form.setValue("wardNo", "", { shouldDirty: true })
              }}
              value={field.value}
              disabled={!districtId || municipalitiesQuery.isLoading}
            >
              <FormControl>
                <SelectTrigger className={selectTriggerClassName}>
                  <SelectDisplay
                    label={selectedMunicipality?.name}
                    placeholder={!districtId ? "Choose a district first" : municipalitiesQuery.isLoading ? "Loading..." : "Choose a municipality"}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {(municipalitiesQuery.data ?? []).map((municipality) => (
                  <SelectItem key={municipality.id} value={String(municipality.id)}>
                    {municipality.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="wardNo"
        render={({ field }) => (
          <FormItem>
            <RequiredLabel>Ward No.</RequiredLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={!selectedMunicipality}>
              <FormControl>
                <SelectTrigger className={selectTriggerClassName}>
                  <SelectDisplay
                    label={wardNo ? `Ward ${wardNo}` : undefined}
                    placeholder={selectedMunicipality ? "Choose a ward" : "Choose a municipality first"}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {wardOptions.map((ward) => (
                  <SelectItem key={ward} value={ward}>
                    Ward {ward}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="area"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Area</FormLabel>
            <FormControl>
              <Input {...field} className={inputClassName} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nearestLandmark"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nearest landmark</FormLabel>
            <FormControl>
              <Input {...field} className={inputClassName} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="addressNote"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Address note</FormLabel>
            <FormControl>
              <Input {...field} className={inputClassName} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
