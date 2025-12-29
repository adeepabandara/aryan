"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const mockCustomers = [
  { id: "1", code: "C001", name: "Acme Corporation" },
  { id: "2", code: "C002", name: "Tech Solutions Ltd" },
]

const mockInvoices = [
  { id: "1", number: "INV-2024-001", customer: "Acme Corporation", customerId: "1", balance: 5000, dueDate: "2025-01-15" },
  { id: "2", number: "INV-2024-002", customer: "Tech Solutions Ltd", customerId: "2", balance: 10060, dueDate: "2025-01-26" },
  { id: "3", number: "INV-2024-003", customer: "Tech Solutions Ltd", customerId: "2", balance: 7500, dueDate: "2025-01-20" },
  { id: "4", number: "INV-2024-004", customer: "Acme Corporation", customerId: "1", balance: 3200, dueDate: "2025-01-18" },
]

export default function AddPaymentPage() {
  const [navOpen, setNavOpen] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState("")
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
  const [invoiceDropdownOpen, setInvoiceDropdownOpen] = useState(false)
  const [formData, setFormData] = useState({
    paymentNumber: `PAY-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
    date: new Date().toISOString().split("T")[0],
    paymentMode: "bank_transfer" as const,
    reference: "",
    status: "completed" as const,
  })

  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomerId(customerId)
    setSelectedInvoices([])
  }

  const handleInvoiceToggle = (invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    )
  }

  const customerInvoices = mockInvoices.filter(inv => inv.customerId === selectedCustomerId && inv.balance > 0)
  const selectedCustomer = mockCustomers.find(c => c.id === selectedCustomerId)
  const totalAmount = mockInvoices
    .filter(inv => selectedInvoices.includes(inv.id))
    .reduce((sum, inv) => sum + inv.balance, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Payment recorded:", {
      ...formData,
      customerId: selectedCustomerId,
      invoices: selectedInvoices,
      totalAmount
    })
    window.location.href = "/payments"
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav navOpen={navOpen} onNavOpenChange={setNavOpen} />
      <main className="flex-1 w-full overflow-hidden">
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/payments">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Record Payment</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-lg border p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentNumber">Payment Number*</Label>
                <Input id="paymentNumber" value={formData.paymentNumber} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Payment Date*</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer">Customer*</Label>
              <Select value={selectedCustomerId} onValueChange={handleCustomerChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {mockCustomers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.code} - {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoices">Unpaid Invoices*</Label>
              <Popover open={invoiceDropdownOpen} onOpenChange={setInvoiceDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start h-auto min-h-[2.5rem] py-2 px-3"
                    disabled={!selectedCustomerId}
                  >
                    <div className="flex flex-wrap gap-1 w-full">
                      {selectedInvoices.length === 0 ? (
                        <span className="text-muted-foreground">Select invoices</span>
                      ) : (
                        selectedInvoices.map(invId => {
                          const invoice = mockInvoices.find(inv => inv.id === invId)
                          return invoice ? (
                            <span key={invId} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-sm">
                              {invoice.number}
                            </span>
                          ) : null
                        })
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50 ml-2 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[500px] p-0" align="start">
                  <div className="max-h-80 overflow-y-auto">
                    {customerInvoices.length === 0 ? (
                      <div className="p-4 text-sm text-muted-foreground text-center">
                        No unpaid invoices for this customer
                      </div>
                    ) : (
                      <div className="p-2 space-y-1">
                        {customerInvoices.map((invoice) => (
                          <div
                            key={invoice.id}
                            className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted cursor-pointer"
                            onClick={() => handleInvoiceToggle(invoice.id)}
                          >
                            <Checkbox
                              checked={selectedInvoices.includes(invoice.id)}
                              onCheckedChange={() => handleInvoiceToggle(invoice.id)}
                            />
                            <div className="flex-1 space-y-1">
                              <div className="font-medium text-sm">{invoice.number}</div>
                              <div className="text-sm font-medium text-muted-foreground">
                                Due: {new Date(invoice.dueDate).toLocaleDateString("en-IN")} • Balance: LKR {invoice.balance.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Total Amount (LKR)*</Label>
                <Input
                  id="amount"
                  type="number"
                  value={totalAmount}
                  disabled
                  className="bg-muted font-semibold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMode">Payment Mode*</Label>
                <Select
                  value={formData.paymentMode}
                  onValueChange={(value: any) => setFormData({ ...formData, paymentMode: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Reference Number*</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                required
                placeholder="Transaction ID / Cheque Number / Reference"
              />
            </div>

            <div className="flex gap-4 pt-6 border-t justify-end">
              <Link href="/payments">
                <Button type="button" variant="outline" className="h-12 px-8 bg-transparent">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!selectedCustomerId || selectedInvoices.length === 0} className="h-12 px-8">
                Record Payment
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
