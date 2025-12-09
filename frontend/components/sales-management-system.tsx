"use client"

import { useState, useEffect, useCallback } from "react"
import { Sidebar } from "@/components/sidebar"
import { FilterBar } from "@/components/filter-bar"
import { SummaryCards } from "@/components/summary-cards"
import { DataTable } from "@/components/data-table"
import { Pagination } from "@/components/pagination"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { salesAPI, SalesRecord, FilterOptions } from "@/lib/api"

export function SalesManagementSystem() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    customerRegion: [] as string[],
    gender: [] as string[],
    ageRange: [] as string[],
    productCategory: [] as string[],
    tags: [] as string[],
    paymentMethod: [] as string[],
    dateRange: { start: "", end: "" },
  })
  const [sortBy, setSortBy] = useState("customerName")
  const [currentPage, setCurrentPage] = useState(1)
  const [salesData, setSalesData] = useState<SalesRecord[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [summary, setSummary] = useState({
    totalUnits: 0,
    totalAmount: 0,
    totalDiscount: 0,
    salesRecordsCount: 0,
  })
  const pageSize = 10

  // Fetch filter options on mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = await salesAPI.getFilterOptions()
        setFilterOptions(options)
      } catch (err) {
        console.error("Failed to load filter options:", err)
      }
    }

    loadFilterOptions()
  }, [])

  // Fetch sales data whenever filters, search, sort, or page changes
  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await salesAPI.getSalesRecords({
          search: searchQuery,
          customerRegion: filters.customerRegion,
          gender: filters.gender,
          ageRange: filters.ageRange,
          productCategory: filters.productCategory,
          tags: filters.tags,
          paymentMethod: filters.paymentMethod,
          dateRangeStart: filters.dateRange.start,
          dateRangeEnd: filters.dateRange.end,
          sortBy,
          sortOrder: "asc",
          page: currentPage,
          pageSize,
        })

        setSalesData(result.data)
        setTotalPages(result.pagination.totalPages)
        setTotalCount(result.pagination.totalCount)

        // Update summary
        const stats = await salesAPI.getSalesSummary({
          customerRegion: filters.customerRegion.length > 0 ? filters.customerRegion : undefined,
          productCategory: filters.productCategory.length > 0 ? filters.productCategory : undefined,
        })

        setSummary({
          totalUnits: stats.totalUnits,
          totalAmount: stats.totalRevenue,
          totalDiscount: 0,
          salesRecordsCount: stats.totalSales,
        })
      } catch (err) {
        console.error("Failed to fetch sales data:", err)
        setError(
          err instanceof Error ? err.message : "Failed to fetch sales data"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchSalesData()
  }, [searchQuery, filters, sortBy, currentPage])

  const handleFilterChange = useCallback(
    (filterType: keyof typeof filters, value: string[] | { start: string; end: string }) => {
      setFilters((prev) => ({ ...prev, [filterType]: value }))
      setCurrentPage(1)
    },
    []
  )

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }, [])

  const handleSort = useCallback((sort: string) => {
    setSortBy(sort)
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  if (!filterOptions) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h1 className="text-xl font-semibold text-foreground">Sales Management System</h1>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Name, Phone no."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange as (filterType: string, value: string[] | { start: string; end: string }) => void}
            sortBy={sortBy}
            onSortChange={handleSort}
            filterOptions={filterOptions}
          />

          <SummaryCards summary={summary} />

          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading sales data...</p>
              </div>
            </div>
          ) : salesData.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground mb-2">No Results Found</p>
                <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
              </div>
            </div>
          ) : (
            <>
              <DataTable data={salesData} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </main>
      </div>
    </div>
  )
}
