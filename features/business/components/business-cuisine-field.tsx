"use client"

import type { Control, FieldPath, FieldValues } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { useCuisines } from "@/hooks/use-cuisines"
import { cn } from "@/lib/utils"

const MAX_CUISINES = 3

interface BusinessCuisineFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label?: string
  description?: string
  className?: string
  chipsClassName?: string
  disabled?: boolean
  required?: boolean
}

export function BusinessCuisineField<TFieldValues extends FieldValues>({
  control,
  name,
  label = "Cuisines served",
  description = "Choose up to 3 cuisines.",
  className,
  chipsClassName,
  disabled = false,
  required = false,
}: BusinessCuisineFieldProps<TFieldValues>) {
  const anchorRef = useComboboxAnchor()
  const cuisinesQuery = useCuisines()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedIds = Array.isArray(field.value) ? (field.value as string[]) : []

        return (
          <FormItem className={className}>
            <FormLabel>
              {label}
              {required ? <span className="ml-1 text-danger">*</span> : null}
            </FormLabel>
            <FormControl>
              <Combobox<string, true>
                multiple
                value={selectedIds}
                onValueChange={(value) => field.onChange(value as string[])}
                disabled={disabled || cuisinesQuery.isLoading || cuisinesQuery.isError}
              >
                <ComboboxChips
                  ref={anchorRef}
                  className={cn(
                    "min-h-[44px] rounded-lg border-border bg-white px-3 py-2 shadow-none focus-within:border-primary focus-within:ring-primary/25",
                    chipsClassName,
                  )}
                >
                  {selectedIds.map((id) => {
                    const cuisine = cuisinesQuery.data?.find((item) => item.id === id)
                    return (
                      <ComboboxChip
                        key={id}
                        className="rounded-full bg-brand-soft-beige px-2.5 text-brand-dark-green"
                      >
                        {cuisine?.name ?? id}
                      </ComboboxChip>
                    )
                  })}
                  <ComboboxChipsInput
                    placeholder={
                      cuisinesQuery.isLoading
                        ? "Loading cuisines..."
                        : cuisinesQuery.isError
                          ? "Could not load cuisines"
                          : selectedIds.length >= MAX_CUISINES
                            ? "Maximum 3 cuisines selected"
                            : "Search cuisines..."
                    }
                    className="text-sm"
                  />
                </ComboboxChips>

                <ComboboxContent anchor={anchorRef}>
                  <ComboboxEmpty>No cuisines found.</ComboboxEmpty>
                  <ComboboxList>
                    {(cuisinesQuery.data ?? []).map((item) => {
                      const isSelected = selectedIds.includes(item.id)
                      const disableOption = !isSelected && selectedIds.length >= MAX_CUISINES
                      return (
                        <ComboboxItem key={item.id} value={item.id} disabled={disableOption}>
                          {item.name}
                        </ComboboxItem>
                      )
                    })}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </FormControl>
            <FormDescription>
              {cuisinesQuery.isError
                ? "Refresh the page and try again before submitting cuisines."
                : description}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
