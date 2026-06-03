"use client"

import { useEffect, useMemo } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useDistricts, useMunicipalities, useProvinces } from "@/hooks/use-nepal-admin"
import type { Municipality } from "@/types/nepal-admin"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BusinessLocationFieldsProps {
  form: UseFormReturn<any>
  inputClassName: string
  selectTriggerClassName: string
}

export function BusinessLocationFields({ form, inputClassName, selectTriggerClassName }: BusinessLocationFieldsProps) {
  const provinceId = form.watch("provinceId") as string
  const districtId = form.watch("districtId") as string
  const municipalityId = form.watch("municipalityId") as string
  const wardNo = form.watch("wardNo") as string

  const provinceValue = provinceId ? Number(provinceId) : null
  const districtValue = districtId ? Number(districtId) : null

  const provincesQuery = useProvinces()
  const districtsQuery = useDistricts(provinceValue)
  const municipalitiesQuery = useMunicipalities(districtValue)

  const selectedMunicipality = useMemo<Municipality | null>(
    () => municipalitiesQuery.data?.find((item) => String(item.id) === municipalityId) ?? null,
    [municipalitiesQuery.data, municipalityId],
  )

  useEffect(() => {
    const options = districtsQuery.data ?? []
    if (!provinceId) {
      if (districtId) form.setValue("districtId", "", { shouldValidate: true })
      if (municipalityId) form.setValue("municipalityId", "", { shouldValidate: true })
      if (wardNo) form.setValue("wardNo", "", { shouldValidate: true })
      return
    }

    if (districtId && !options.some((item) => String(item.id) === districtId)) {
      form.setValue("districtId", "", { shouldValidate: true })
      form.setValue("municipalityId", "", { shouldValidate: true })
      form.setValue("wardNo", "", { shouldValidate: true })
    }
  }, [districtId, districtsQuery.data, form, municipalityId, provinceId, wardNo])

  useEffect(() => {
    const options = municipalitiesQuery.data ?? []
    if (!districtId) {
      if (municipalityId) form.setValue("municipalityId", "", { shouldValidate: true })
      if (wardNo) form.setValue("wardNo", "", { shouldValidate: true })
      return
    }

    if (municipalityId && !options.some((item) => String(item.id) === municipalityId)) {
      form.setValue("municipalityId", "", { shouldValidate: true })
      form.setValue("wardNo", "", { shouldValidate: true })
    }
  }, [districtId, form, municipalitiesQuery.data, municipalityId, wardNo])

  useEffect(() => {
    if (!selectedMunicipality || !wardNo || !/^\d+$/.test(wardNo)) return
    if (Number(wardNo) > selectedMunicipality.wards) {
      form.setValue("wardNo", String(selectedMunicipality.wards), { shouldValidate: true })
    }
  }, [form, selectedMunicipality, wardNo])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="provinceId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Province / State</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={provincesQuery.isLoading}>
              <FormControl>
                <SelectTrigger className={selectTriggerClassName}>
                  <SelectValue placeholder={provincesQuery.isLoading ? "Loading..." : "Choose a province"} />
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
            <FormLabel>District</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={!provinceId || districtsQuery.isLoading}>
              <FormControl>
                <SelectTrigger className={selectTriggerClassName}>
                  <SelectValue placeholder={!provinceId ? "Choose a province first" : districtsQuery.isLoading ? "Loading..." : "Choose a district"} />
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
            <FormLabel>City / Municipality</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={!districtId || municipalitiesQuery.isLoading}>
              <FormControl>
                <SelectTrigger className={selectTriggerClassName}>
                  <SelectValue placeholder={!districtId ? "Choose a district first" : municipalitiesQuery.isLoading ? "Loading..." : "Choose a municipality"} />
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
            <FormLabel>Ward No.</FormLabel>
            <FormControl>
              <Input
                {...field}
                inputMode="numeric"
                type="number"
                min={1}
                max={selectedMunicipality?.wards}
                placeholder={selectedMunicipality ? `1-${selectedMunicipality.wards}` : "Choose a municipality first"}
                className={inputClassName}
                disabled={!selectedMunicipality}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="area"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Area / Neighbourhood</FormLabel>
            <FormControl>
              <Input {...field} className={inputClassName} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="landmark"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Landmark</FormLabel>
            <FormControl>
              <Input {...field} className={inputClassName} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="addressLine1"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Address Line 1</FormLabel>
            <FormControl>
              <Input {...field} className={inputClassName} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="addressLine2"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Address Line 2</FormLabel>
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
