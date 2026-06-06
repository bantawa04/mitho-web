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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
              className="h-11 rounded-xl border-brand-deep-green/10 bg-white pl-10 shadow-none"
            />
          </div>
          {leftToolbarContent ? <div className="flex shrink-0 items-center gap-3">{leftToolbarContent}</div> : null}
        </div>
        {rightToolbarContent ? <div className="flex shrink-0 items-center gap-3">{rightToolbarContent}</div> : null}
      </div>

      <section className="overflow-hidden rounded-[1.9rem] border border-brand-deep-green/10 bg-white shadow-[0_12px_30px_rgba(10,70,53,0.05)]">
        <Table>
          <TableHeader>
            <TableRow className="border-brand-deep-green/10 hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={column.className ?? "py-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55"}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="border-brand-deep-green/10 hover:bg-transparent">
                <TableCell colSpan={columns.length} className="px-6 py-12 text-center text-sm text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              data.map((item) => (
                <TableRow key={rowKey(item)} className="border-brand-deep-green/10 hover:bg-brand-soft-beige/14">
                  {columns.map((column) => (
                    <TableCell key={column.id} className={column.cellClassName}>
                      {column.cell(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-brand-deep-green/10 hover:bg-transparent">
                <TableCell colSpan={columns.length} className="px-6 py-12 text-center">
                  <p className="font-semibold text-brand-dark-green">{emptyTitle}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{emptyDescription}</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex flex-col gap-4 border-t border-brand-deep-green/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">{resultSummary}</p>

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
