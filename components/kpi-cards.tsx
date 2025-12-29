"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, AlertCircle } from "lucide-react"

type Invoice = {
  id: string
  grandTotal: number
  status: string
  paymentInvoices: Array<{
    payment: {
      amount: number
    }
  }>
}

export function KPICards() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  // Calculate Total Sales from all invoices
  const totalSales = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0)

  // Calculate Outstanding Payments (unpaid balances)
  const outstandingPayments = invoices.reduce((sum, inv) => {
    const paid = inv.paymentInvoices.reduce((paidSum, pi) => paidSum + pi.payment.amount, 0)
    const balance = inv.grandTotal - paid
    return sum + (balance > 0 ? balance : 0)
  }, 0)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-green-600">
          <CardContent className="pt-0">
            <div className="h-24 animate-pulse bg-muted rounded"></div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-600">
          <CardContent className="pt-0">
            <div className="h-24 animate-pulse bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="border-l-4 border-l-green-600">
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
              <p className="text-3xl font-bold text-green-600">LKR {totalSales.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total revenue from all invoices</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-600">
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Outstanding Payments</p>
              <p className="text-3xl font-bold text-red-600">LKR {outstandingPayments.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Amount due from customers</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
