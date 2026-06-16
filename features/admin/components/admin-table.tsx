"use client"

import type { ReactNode } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const DEFAULT_ADMIN_PAGE_SIZE = 10
export const ADMIN_PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

export interface AdminTableColumn<TData> {
  id: string
  label: string
  className?: string
  cellClassName?: string
  cell: (item: TData) => ReactNode
}

interface AdminTableProps<TData> {
  columns: AdminTableColumn<TData>[]
  data: TData[]
  rowKey: (item: TData) => string
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  leftToolbarContent?: ReactNode
  rightToolbarContent?: ReactNode
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
  resultSummary: string
  emptyTitle: string
  emptyDescription: string
  isLoading?: boolean
}

export function AdminTable<TData>({
  columns,
  data,
  rowKey,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  leftToolbarContent,
  rightToolbarContent,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = ADMIN_PAGE_SIZE_OPTIONS,
  resultSummary,
  emptyTitle,
  emptyDescription,
  isLoading = false,
}: AdminTableProps<TData>) {
  const paginationPages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className="space-y-4 pb-12">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 rounded-lg border-border bg-white pl-10 shadow-none"
            />
          </div>
          {leftToolbarContent ? <div className="flex shrink-0 items-center gap-3">{leftToolbarContent}</div> : null}
        </div>
        {rightToolbarContent ? <div className="flex shrink-0 items-center gap-3">{rightToolbarContent}</div> : null}
      </div>

      <section className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={column.className ?? "text-xs font-medium text-muted-foreground"}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={columns.length} className="px-6 py-12 text-center text-sm text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              data.map((item) => (
                <TableRow key={rowKey(item)} className="border-border text-sm hover:bg-muted/60">
                  {columns.map((column) => (
                    <TableCell key={column.id} className={column.cellClassName}>
                      {column.cell(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={columns.length} className="px-6 py-12 text-center">
                  <p className="font-medium text-foreground">{emptyTitle}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{emptyDescription}</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex flex-col gap-4 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <p className="text-sm text-muted-foreground">{resultSummary}</p>
            {onPageSizeChange ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page</span>
                <Select
                  value={String(pageSize ?? DEFAULT_ADMIN_PAGE_SIZE)}
                  onValueChange={(value) => onPageSizeChange(Number(value))}
                >
                  <SelectTrigger className="h-9 w-[78px] rounded-lg border-border bg-white shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pageSizeOptions.map((option) => (
                      <SelectItem key={option} value={String(option)}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>

          {totalPages > 1 ? (
            <Pagination className="mx-0 w-auto justify-start sm:justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault()
                      if (currentPage > 1) onPageChange(currentPage - 1)
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {paginationPages.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(event) => {
                        event.preventDefault()
                        onPageChange(page)
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault()
                      if (currentPage < totalPages) onPageChange(currentPage + 1)
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </div>
      </section>
    </div>
  )
}
