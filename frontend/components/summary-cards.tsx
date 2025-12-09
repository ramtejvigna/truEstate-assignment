import { Info } from "lucide-react"

interface SummaryCardsProps {
  summary: {
    totalUnits: number
    totalAmount: number
    totalDiscount: number
    salesRecordsCount: number
  }
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="border border-border rounded-lg px-4 py-3 min-w-40">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <span>Total units sold</span>
          <Info className="h-4 w-4" />
        </div>
        <div className="text-xl font-semibold text-foreground">{summary.totalUnits}</div>
      </div>

      <div className="border border-border rounded-lg px-4 py-3 min-w-40">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <span>Total Amount</span>
          <Info className="h-4 w-4" />
        </div>
        <div className="text-xl font-semibold text-foreground">
          ₹{summary.totalAmount.toLocaleString()} ({summary.salesRecordsCount} SRs)
        </div>
      </div>

      <div className="border border-border rounded-lg px-4 py-3 min-w-40">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <span>Total Discount</span>
          <Info className="h-4 w-4" />
        </div>
        <div className="text-xl font-semibold text-foreground">
          ₹{summary.totalDiscount.toLocaleString()} ({summary.salesRecordsCount} SRs)
        </div>
      </div>
    </div>
  )
}
