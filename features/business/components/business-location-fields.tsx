"use client"

import { useMemo } from "react"
import type { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form"
import { useDistricts, useMunicipalities, useProvinces } from "@/hooks/use-nepal-admin"
import type { District, Municipality, Province } from "@/types/nepal-admin"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RequiredLabel } from "@/components/ui/required-label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type LocationSelection = {
  province?: Pick<Province, "id" | "name"> | null
  district?: Pick<District, "id" | "name"> | null
  municipality?: Pick<Municipality, "id" | "name" | "wards"> | null
}

interface BusinessLocationFieldsProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>
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

export function BusinessLocationFields<TFieldValues extends FieldValues>({
  form,
  inputClassName,
  selectTriggerClassName,
  selectedLocation,
}: BusinessLocationFieldsProps<TFieldValues>) {
  const provinceIdField = "provinceId" as Path<TFieldValues>
  const districtIdField = "districtId" as Path<TFieldValues>
  const municipalityIdField = "municipalityId" as Path<TFieldValues>
  const wardNoField = "wardNo" as Path<TFieldValues>
  const areaField = "area" as Path<TFieldValues>
  const nearestLandmarkField = "nearestLandmark" as Path<TFieldValues>
  const addressNoteField = "addressNote" as Path<TFieldValues>
  const emptyFieldValue = "" as PathValue<TFieldValues, Path<TFieldValues>>

  const provinceId = String(form.watch(provinceIdField) ?? "")
  const districtId = String(form.watch(districtIdField) ?? "")
  const municipalityId = String(form.watch(municipalityIdField) ?? "")
  const wardNo = String(form.watch(wardNoField) ?? "")

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
        name={provinceIdField}
        render={({ field }) => (
          <FormItem>
            <RequiredLabel>Province / State</RequiredLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value)
                form.setValue(districtIdField, emptyFieldValue, { shouldDirty: true })
                form.setValue(municipalityIdField, emptyFieldValue, { shouldDirty: true })
                form.setValue(wardNoField, emptyFieldValue, { shouldDirty: true })
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
        name={districtIdField}
        render={({ field }) => (
          <FormItem>
            <RequiredLabel>District</RequiredLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value)
                form.setValue(municipalityIdField, emptyFieldValue, { shouldDirty: true })
                form.setValue(wardNoField, emptyFieldValue, { shouldDirty: true })
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
        name={municipalityIdField}
        render={({ field }) => (
          <FormItem>
            <RequiredLabel>City / Municipality</RequiredLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value)
                form.setValue(wardNoField, emptyFieldValue, { shouldDirty: true })
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
        name={wardNoField}
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
        name={areaField}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Area</FormLabel>
            <FormControl>
              <Input {...field} className={inputClassName} placeholder="Narshing Chowk, Thamel" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={nearestLandmarkField}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nearest landmark</FormLabel>
            <FormControl>
              <Input {...field} className={inputClassName} placeholder="e.g., Next to Nepal Bank" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={addressNoteField}
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
