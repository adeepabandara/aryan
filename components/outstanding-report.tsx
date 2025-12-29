"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"

const outstandingData = [
  {
    invoice: "INV-2024-002",
    date: "2024-12-27",
    dueDate: "2025-01-26",
    customer: "Tech Solutions Ltd",
    total: 20060,
    paid: 10000,
    balance: 10060,
    daysOverdue: 0,
    status: "current",
  },
  {
    invoice: "INV-2024-005",
    date: "2024-11-15",
    dueDate: "2024-12-15",
    customer: "Sample Corp",
    total: 35000,
    paid: 0,
    balance: 35000,
    daysOverdue: 14,
    status: "overdue",
  },
  {
    invoice: "INV-2024-006",
    date: "2024-12-20",
    dueDate: "2025-01-19",
    customer: "Modern Solutions",
    total: 15500,
    paid: 0,
    balance: 15500,
    daysOverdue: 0,
    status: "current",
  },
]

export function OutstandingReport() {
  const totalOutstanding = outstandingData.reduce((sum, item) => sum + item.balance, 0)
  const overdueAmount = outstandingData
    .filter((item) => item.status === "overdue")
    .reduce((sum, item) => sum + item.balance, 0)

  const getStatusBadge = (status: string) => {
    return status === "overdue" ? (
      <Badge variant="destructive">Overdue</Badge>
    ) : (
      <Badge variant="secondary">Current</Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalOutstanding.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending receivables</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{overdueAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Past due date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outstandingData.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Unpaid invoices</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Outstanding Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Days Overdue</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outstandingData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.invoice}</TableCell>
                    <TableCell>{new Date(item.date).toLocaleDateString("en-IN")}</TableCell>
                    <TableCell>{new Date(item.dueDate).toLocaleDateString("en-IN")}</TableCell>
                    <TableCell>{item.customer}</TableCell>
                    <TableCell className="text-right">₹{item.total.toLocaleString()}</TableCell>
                    <TableCell className="text-right">₹{item.paid.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-semibold">₹{item.balance.toLocaleString()}</TableCell>
                    <TableCell className={item.daysOverdue > 0 ? "text-red-600" : ""}>
                      {item.daysOverdue > 0 ? item.daysOverdue : "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-muted">
                  <TableCell colSpan={6}>TOTAL OUTSTANDING</TableCell>
                  <TableCell className="text-right">₹{totalOutstanding.toLocaleString()}</TableCell>
                  <TableCell colSpan={2}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
