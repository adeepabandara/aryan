"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Download } from "lucide-react"

const paymentData = [
  {
    date: "2024-12-28",
    paymentNumber: "PAY-2024-001",
    invoice: "INV-2024-001",
    customer: "Acme Corporation",
    amount: 17700,
    mode: "Bank Transfer",
  },
  {
    date: "2024-12-27",
    paymentNumber: "PAY-2024-002",
    invoice: "INV-2024-002",
    customer: "Tech Solutions Ltd",
    amount: 10000,
    mode: "UPI",
  },
  {
    date: "2024-12-26",
    paymentNumber: "PAY-2024-003",
    invoice: "INV-2024-003",
    customer: "Global Industries",
    amount: 25960,
    mode: "Cheque",
  },
]

const paymentModeData = [
  { name: "Bank Transfer", value: 17700, color: "hsl(var(--chart-1))" },
  { name: "UPI", value: 10000, color: "hsl(var(--chart-2))" },
  { name: "Cheque", value: 25960, color: "hsl(var(--chart-3))" },
]

export function PaymentReport() {
  const [dateFrom, setDateFrom] = useState("2024-12-01")
  const [dateTo, setDateTo] = useState("2024-12-31")

  const totalPayments = paymentData.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input id="dateFrom" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input id="dateTo" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <Button>Generate Report</Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Payments Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">For selected period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Number of Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentData.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Payment transactions</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Mode Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentModeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {paymentModeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Payment Number</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentData.map((payment, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(payment.date).toLocaleDateString("en-IN")}</TableCell>
                    <TableCell className="font-medium">{payment.paymentNumber}</TableCell>
                    <TableCell>{payment.invoice}</TableCell>
                    <TableCell>{payment.customer}</TableCell>
                    <TableCell>{payment.mode}</TableCell>
                    <TableCell className="text-right font-semibold">₹{payment.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-muted">
                  <TableCell colSpan={5}>TOTAL</TableCell>
                  <TableCell className="text-right">₹{totalPayments.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
