"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { StatusChip } from "@/components/status-chip"

const mockBills = [
  {
    id: 1,
    number: "PB-2024-001",
    date: "2024-12-28",
    supplier: "Raw Materials Ltd",
    total: 150000,
    status: "paid",
  },
  {
    id: 2,
    number: "PB-2024-002",
    date: "2024-12-27",
    supplier: "Component Suppliers",
    total: 85000,
    status: "due",
  },
  {
    id: 3,
    number: "PB-2024-003",
    date: "2024-12-26",
    supplier: "Quality Imports",
    total: 220000,
    status: "overdue",
  },
]

export function SupplierBillsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [bills] = useState(mockBills)

  const filteredBills = bills.filter(
    (bill) =>
      bill.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by bill number or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Link href="/supplier-bills/add" className="w-full sm:w-auto">
              <Button className="w-full hover:bg-secondary hover:text-secondary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                New Bill
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBills.map((bill) => (
              <Link key={bill.id} href={`/supplier-bills/edit/${bill.id}`}>
                <div className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors cursor-pointer h-full bg-white flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{bill.number}</p>
                    <StatusChip status={bill.status} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</div>
                    <p className="font-medium">{bill.date}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Supplier</div>
                    <p className="font-medium">{bill.supplier}</p>
                  </div>
                  <div className="space-y-1 pt-4 border-t mt-auto">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</div>
                    <p className="text-lg font-bold text-primary">LKR {bill.total.toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
