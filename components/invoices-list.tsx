"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"
import { SkeletonLoader } from "@/components/skeleton-loader"
import { StatusChip } from "@/components/status-chip"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Invoice = {
  id: string
  invoiceNumber: string
  customerId: string
  subtotal: number
  taxPercentage: number
  taxAmount: number
  grandTotal: number
  status: string
  invoiceDate: string
  dueDate: string
  createdAt: string
  customer: {
    id: string
    name: string
    email: string
  }
  lineItems: Array<{
    id: string
    quantity: number
    price: number
    total: number
    product: {
      id: string
      name: string
      price: number
    }
  }>
  paymentInvoices: Array<{
    id: string
    payment: {
      id: string
      amount: number
      date: string
    }
  }>
}

export function InvoicesList({ isDashboard = false }: { isDashboard?: boolean }) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("unpaid")
  const [selectedCustomer, setSelectedCustomer] = useState("all")
  const router = useRouter()

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/invoices")
      if (response.ok) {
        const data = await response.json()
        setInvoices(data)
      }
    } catch (error) {
      console.error("Error fetching invoices:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get unique customers for filter
  const customers = Array.from(new Set(invoices.map(inv => inv.customer.name))).sort()

  // Calculate amounts
  const getInvoiceAmounts = (invoice: Invoice) => {
    const amountPaid = invoice.paymentInvoices.reduce((sum, pi) => sum + pi.payment.amount, 0)
    const balance = invoice.grandTotal - amountPaid
    return { amountPaid, balance }
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTab = activeTab === "paid" 
      ? invoice.status === "PAID" 
      : invoice.status !== "PAID"
    
    const matchesCustomer = selectedCustomer === "all" || invoice.customer.name === selectedCustomer
    
    return matchesSearch && matchesTab && matchesCustomer
  })

  // Limit to 5 invoices for dashboard
  const displayInvoices = isDashboard ? filteredInvoices.slice(0, 5) : filteredInvoices

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 h-10 bg-muted rounded-lg animate-pulse" />
            <div className="w-full sm:w-auto h-10 bg-muted rounded-lg animate-pulse" />
          </div>
          <SkeletonLoader />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className={isDashboard ? "pt-0" : "pt-4 md:pt-6"}>
          {isDashboard && (
            <h3 className="text-xl font-semibold mb-4">Recent Invoices</h3>
          )}
          {!isDashboard && (
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Link href="/invoices/add" className="w-full sm:w-auto">
                <Button className="w-full hover:bg-secondary hover:text-secondary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  New Invoice
                </Button>
              </Link>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex items-center gap-4">
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger className="w-[200px] h-9">
                  <SelectValue placeholder="All Customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {customers.map((customer) => (
                    <SelectItem key={customer} value={customer}>
                      {customer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <TabsList className="h-9">
                <TabsTrigger value="unpaid" className="text-sm">Unpaid</TabsTrigger>
                <TabsTrigger value="paid" className="text-sm">Paid</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="unpaid" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayInvoices.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-muted-foreground">No invoices found</div>
                ) : (
                  displayInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="border rounded-lg p-4 space-y-3 bg-white h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => router.push(`/invoices/preview/${invoice.id}`)}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1 flex-1">
                          
                          <div className="font-semibold">{invoice.invoiceNumber}</div>
                        </div>
                        <StatusChip status={invoice.status} />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">{new Date(invoice.createdAt).toLocaleDateString("en-IN")}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">{invoice.customer.name}</div>
                      </div>
                      <div className="space-y-2 pt-4 border-t mt-auto">
                        <div className="flex justify-between items-center">
                          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</div>
                          <div className="text-sm font-semibold">LKR {invoice.grandTotal.toLocaleString()}</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Balance</div>
                          <div className="text-lg font-bold text-primary">LKR {getInvoiceAmounts(invoice).balance.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="paid" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayInvoices.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-muted-foreground">No invoices found</div>
                ) : (
                  displayInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="border rounded-lg p-4 space-y-3 bg-white h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => router.push(`/invoices/preview/${invoice.id}`)}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1 flex-1">
                          <div className="font-semibold">{invoice.invoiceNumber}</div>
                        </div>
                        <StatusChip status={invoice.status} />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">{new Date(invoice.createdAt).toLocaleDateString("en-IN")}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">{invoice.customer.name}</div>
                      </div>
                      <div className="space-y-1 pt-4 border-t mt-auto">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</div>
                        <div className="text-lg font-bold text-primary">LKR {invoice.grandTotal.toLocaleString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
