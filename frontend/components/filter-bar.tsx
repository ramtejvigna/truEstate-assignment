"use client"

import { RefreshCw, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FilterBarProps {
  filters: {
    customerRegion: string[]
    gender: string[]
    ageRange: string[]
    productCategory: string[]
    tags: string[]
    paymentMethod: string[]
    dateRange: { start: string; end: string }
  }
  onFilterChange: (filterType: string, value: string[] | { start: string; end: string }) => void
  sortBy: string
  onSortChange: (sort: string) => void
  filterOptions?: {
    customerRegion: string[]
    gender: string[]
    ageRanges: string[]
    productCategory: string[]
    tags: string[]
    paymentMethod: string[]
  }
}

const defaultFilterOptions = {
  customerRegion: ["North", "South", "East", "West"],
  gender: ["Male", "Female", "Other"],
  ageRanges: ["18-25", "26-35", "36-45", "46-55", "55+"],
  productCategory: ["Clothing", "Electronics", "Footwear", "Accessories"],
  tags: ["Premium", "Discounted", "New Arrival", "Best Seller", "Limited Edition"],
  paymentMethod: ["Cash", "Credit Card", "Debit Card", "UPI"],
}

const sortOptions = [
  { value: "customerName", label: "Customer Name (A-Z)" },
  { value: "dateNewest", label: "Date (Newest First)" },
  { value: "dateOldest", label: "Date (Oldest First)" },
  { value: "quantity", label: "Quantity (High to Low)" },
]

export function FilterBar({ filters, onFilterChange, sortBy, onSortChange, filterOptions: apiFilterOptions }: FilterBarProps) {
  const filterOptions = apiFilterOptions || defaultFilterOptions
  
  const handleCheckboxChange = (filterType: keyof typeof filters, value: string, checked: boolean) => {
    if (filterType === "dateRange") return

    const currentValues = filters[filterType] as string[]
    const newValues = checked ? [...currentValues, value] : currentValues.filter((v) => v !== value)
    onFilterChange(filterType, newValues)
  }

  const filterMap: Record<string, { key: keyof typeof filters; label: string }> = {
    customerRegion: { key: "customerRegion", label: "Customer Region" },
    gender: { key: "gender", label: "Gender" },
    ageRanges: { key: "ageRange", label: "Age Range" },
    productCategory: { key: "productCategory", label: "Product Category" },
    tags: { key: "tags", label: "Tags" },
    paymentMethod: { key: "paymentMethod", label: "Payment Method" },
  }

  return (
    <div className="flex items-center gap-3 mb-4 flex-wrap">
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <RefreshCw className="h-4 w-4" />
      </Button>

      {/* Filter Dropdowns */}
      {Object.entries(filterMap).map(([optionKey, { key, label }]) => {
        const options = filterOptions[optionKey as keyof typeof filterOptions] as string[]
        if (!options || options.length === 0) return null

        return (
          <DropdownMenu key={key}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 gap-2 bg-transparent">
                {label}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {options.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option}
                  checked={(filters[key] as string[]).includes(option)}
                  onCheckedChange={(checked) => handleCheckboxChange(key, option, checked)}
                >
                  {option}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      })}

      {/* Date Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9 gap-2 bg-transparent">
            Date
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="p-3 space-y-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Start Date</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) =>
                onFilterChange("dateRange", {
                  ...filters.dateRange,
                  start: e.target.value,
                })
              }
              className="w-full px-2 py-1 text-sm border border-input rounded-md bg-background"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">End Date</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) =>
                onFilterChange("dateRange", {
                  ...filters.dateRange,
                  end: e.target.value,
                })
              }
              className="w-full px-2 py-1 text-sm border border-input rounded-md bg-background"
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort Dropdown */}
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 gap-2 bg-transparent">
              Sort by: {sortOptions.find((o) => o.value === sortBy)?.label}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sortOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={sortBy === option.value}
                onCheckedChange={() => onSortChange(option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
