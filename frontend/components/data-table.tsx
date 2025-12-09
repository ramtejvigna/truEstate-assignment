"use client"

import { Copy } from "lucide-react"
import type { SalesRecord } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DataTableProps {
  data: SalesRecord[]
}

export function DataTable({ data }: DataTableProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table className="min-h-[70vh]">
        <TableHeader>
          <TableRow className="bg-muted/50 px-4 py-8">
            <TableHead className="font-medium">Transaction ID</TableHead>
            <TableHead className="font-medium">Date</TableHead>
            <TableHead className="font-medium">Customer ID</TableHead>
            <TableHead className="font-medium">Customer name</TableHead>
            <TableHead className="font-medium">Phone Number</TableHead>
            <TableHead className="font-medium">Gender</TableHead>
            <TableHead className="font-medium">Age</TableHead>
            <TableHead className="font-medium">Product Category</TableHead>
            <TableHead className="font-medium">Quantity</TableHead>
            <TableHead className="font-medium">Total Amount</TableHead>
            <TableHead className="font-medium">Customer region</TableHead>
            <TableHead className="font-medium">Product ID</TableHead>
            <TableHead className="font-medium">Employee name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                No records found
              </TableCell>
            </TableRow>
          ) : (
            data.map((record, index) => (
              <TableRow key={`${record.transactionId}-${index}`}>
                <TableCell className="font-mono text-sm">{record.transactionId}</TableCell>
                <TableCell>{formatDate(record.date)}</TableCell>
                <TableCell className="font-medium">{record.customerId}</TableCell>
                <TableCell>{record.customerName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{record.phoneNumber}</span>
                    <button
                      onClick={() => copyToClipboard(record.phoneNumber)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
                <TableCell>{record.gender}</TableCell>
                <TableCell>{record.age}</TableCell>
                <TableCell className="font-medium">{record.productCategory}</TableCell>
                <TableCell className="font-semibold">{record.quantity.toString().padStart(2, "0")}</TableCell>
                <TableCell className="font-semibold">₹ {record.totalAmount.toLocaleString()}</TableCell>
                <TableCell className="font-semibold">{record.customerRegion}</TableCell>
                <TableCell className="font-mono text-sm">{record.productId}</TableCell>
                <TableCell className="font-semibold">{record.employeeName}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
