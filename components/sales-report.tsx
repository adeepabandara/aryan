"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Download } from "lucide-react"

const salesData = [
  {
    date: "2024-12-28",
    orderNumber: "SO-2024-001",
    customer: "Acme Corporation",
    subtotal: 15000,
    tax: 2700,
    total: 17700,
  },
  {
    date: "2024-12-27",
    orderNumber: "SO-2024-002",
    customer: "Tech Solutions Ltd",
    subtotal: 17000,
    tax: 3060,
    total: 20060,
  },
  {
    date: "2024-12-26",
    orderNumber: "SO-2024-003",
    customer: "Global Industries",
    subtotal: 22000,
    tax: 3960,
    total: 25960,
  },
  {
    date: "2024-12-25",
    orderNumber: "SO-2024-004",
    customer: "Bright Enterprises",
    subtotal: 12000,
    tax: 2160,
    total: 14160,
  },
]

const chartData = [
  { date: "Dec 25", sales: 14160 },
  { date: "Dec 26", sales: 25960 },
  { date: "Dec 27", sales: 20060 },
  { date: "Dec 28", sales: 17700 },
]

export function SalesReport() {
  const [dateFrom, setDateFrom] = useState("2024-12-01")
  const [dateTo, setDateTo] = useState("2024-12-31")

  const totalSales = salesData.reduce((sum, item) => sum + item.total, 0)
  const totalTax = salesData.reduce((sum, item) => sum + item.tax, 0)

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

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">For selected period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Tax Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalTax.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">GST collected</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Number of Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesData.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Orders processed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="hsl(var(--primary))" name="Sales Amount (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="text-right">Tax</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesData.map((sale, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(sale.date).toLocaleDateString("en-IN")}</TableCell>
                    <TableCell className="font-medium">{sale.orderNumber}</TableCell>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell className="text-right">₹{sale.subtotal.toLocaleString()}</TableCell>
                    <TableCell className="text-right">₹{sale.tax.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-semibold">₹{sale.total.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-muted">
                  <TableCell colSpan={3}>TOTAL</TableCell>
                  <TableCell className="text-right">
                    ₹{salesData.reduce((sum, item) => sum + item.subtotal, 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">₹{totalTax.toLocaleString()}</TableCell>
                  <TableCell className="text-right">₹{totalSales.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
