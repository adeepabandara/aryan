"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Customer = {
  id: string
  name: string
  phone: string | null
  email: string
  address: string | null
  city: string | null
  country: string | null
  postalCode: string | null
  createdAt: string
  _count?: {
    invoices: number
  }
}

export function CustomersList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers")
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      }
    } catch (error) {
      console.error("Error fetching customers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchQuery)),
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center py-8 text-muted-foreground">Loading customers...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-4 md:pt-0">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Link href="/customers/add" className="w-full sm:w-auto">
              <Button className="w-full hover:bg-secondary hover:text-secondary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                {customers.length === 0 ? "No customers yet. Add your first customer!" : "No customers found"}
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <Link key={customer.id} href={`/customers/edit/${customer.id}`}>
                  <div className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors cursor-pointer h-full bg-white">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-lg">{customer.name}</div>
                      {customer._count && customer._count.invoices > 0 && (
                        <Badge variant="outline" className="shrink-0">
                          {customer._count.invoices} invoice{customer._count.invoices !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>{customer.email}</div>
                      {customer.phone && <div>{customer.phone}</div>}
                      {customer.city && customer.country && (
                        <div>{customer.city}, {customer.country}</div>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
