"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type PaymentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (payment: any) => void
}

const mockInvoices = [
  { number: "INV-2024-001", customer: "Acme Corporation", balance: 0 },
  { number: "INV-2024-002", customer: "Tech Solutions Ltd", balance: 10060 },
]

export function PaymentDialog({ open, onOpenChange, onSave }: PaymentDialogProps) {
  const [formData, setFormData] = useState({
    paymentNumber: `PAY-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
    date: new Date().toISOString().split("T")[0],
    invoiceNumber: "",
    customerName: "",
    amount: 0,
    paymentMode: "bank_transfer" as const,
    reference: "",
    status: "completed" as const,
  })

  const handleInvoiceChange = (invoiceNumber: string) => {
    const invoice = mockInvoices.find((inv) => inv.number === invoiceNumber)
    if (invoice) {
      setFormData({
        ...formData,
        invoiceNumber,
        customerName: invoice.customer,
        amount: invoice.balance,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)

    // Reset form
    setFormData({
      paymentNumber: `PAY-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      invoiceNumber: "",
      customerName: "",
      amount: 0,
      paymentMode: "bank_transfer",
      reference: "",
      status: "completed",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>Enter payment details to record a customer payment</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="invoice">Invoice*</Label>
              <Select value={formData.invoiceNumber} onValueChange={handleInvoiceChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select invoice" />
                </SelectTrigger>
                <SelectContent>
                  {mockInvoices
                    .filter((inv) => inv.balance > 0)
                    .map((invoice) => (
                      <SelectItem key={invoice.number} value={invoice.number}>
                        {invoice.number} - {invoice.customer} (Balance: ₹{invoice.balance.toLocaleString()})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Input id="customer" value={formData.customerName} disabled className="bg-muted" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)*</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  required
                  min="0"
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.invoiceNumber || formData.amount <= 0}>
              Record Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
