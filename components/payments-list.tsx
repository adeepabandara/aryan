"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"
import { SkeletonLoader } from "@/components/skeleton-loader"

type Payment = {
  id: string
  paymentNumber: string
  amount: number
  paymentMode: string
  date: string
  reference: string | null
  status: string
  createdAt: string
  customer: {
    id: string
    name: string
    email: string
  }
  paymentInvoices: Array<{
    invoice: {
      id: string
      invoiceNumber: string
    }
  }>
}

export function PaymentsList() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/payments")
      if (response.ok) {
        const data = await response.json()
        setPayments(data)
      }
    } catch (error) {
      console.error("Error fetching payments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPayments = payments.filter(
    (payment) =>
      payment.paymentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.paymentMode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (payment.paymentInvoices.length > 0 && 
       payment.paymentInvoices[0].invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash: "Cash",
      cheque: "Cheque",
      bank_transfer: "Bank Transfer",
      upi: "UPI",
      card: "Card",
      online: "Online"
    }
    return labels[method.toLowerCase()] || method
  }

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
        <CardContent className="pt-4 md:pt-0">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Link href="/payments/add" className="w-full sm:w-auto">
              <Button className="w-full hover:bg-secondary hover:text-secondary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPayments.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                {payments.length === 0 ? "No payments yet. Record your first payment!" : "No payments found"}
              </div>
            ) : (
              filteredPayments.map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4 space-y-3 bg-white h-full flex flex-col">
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Payment #</div>
                    <div className="font-semibold">{payment.paymentNumber}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</div>
                    <div className="font-medium">{payment.customer.name}</div>
                  </div>
                  {payment.paymentInvoices.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Invoice</div>
                      <div className="font-medium">{payment.paymentInvoices[0].invoice.invoiceNumber}</div>
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</div>
                    <div className="font-medium">{new Date(payment.date).toLocaleDateString("en-IN")}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Method</div>
                    <div className="font-medium">{getPaymentMethodLabel(payment.paymentMode)}</div>
                  </div>
                  {payment.reference && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Reference</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{payment.reference}</div>
                    </div>
                  )}
                  <div className="space-y-1 pt-4 border-t mt-auto">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</div>
                    <div className="text-lg font-bold text-primary">LKR {payment.amount.toLocaleString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
