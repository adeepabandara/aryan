"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"

const mockSuppliers = [
  { id: 1, code: "SUP-001", name: "Raw Materials Ltd", contact: "9876543210" },
  { id: 2, code: "SUP-002", name: "Component Suppliers", contact: "9876543211" },
  { id: 3, code: "SUP-003", name: "Quality Imports", contact: "9876543212" },
]

export function SuppliersList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [suppliers] = useState(mockSuppliers)

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by supplier code or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Link href="/suppliers/add" className="w-full sm:w-auto">
              <Button className="w-full hover:bg-secondary hover:text-secondary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuppliers.map((supplier) => (
              <Link key={supplier.id} href={`/suppliers/edit/${supplier.id}`}>
                <div className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors cursor-pointer h-full bg-white">
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Code</div>
                    <div className="font-semibold">{supplier.code}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</div>
                    <div className="font-medium">{supplier.name}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</div>
                    <div className="font-medium">{supplier.contact}</div>
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
