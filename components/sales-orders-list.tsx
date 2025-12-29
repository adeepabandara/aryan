"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react"
import { SalesOrderDialog } from "@/components/sales-order-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type SalesOrder = {
  id: string
  orderNumber: string
  date: string
  customerCode: string
  customerName: string
  items: Array<{
    productCode: string
    productName: string
    quantity: number
    price: number
    gst: number
    total: number
  }>
  subtotal: number
  taxAmount: number
  grandTotal: number
  status: "pending" | "confirmed" | "shipped" | "delivered"
}

const initialOrders: SalesOrder[] = [
  {
    id: "1",
    orderNumber: "SO-2024-001",
    date: "2024-12-28",
    customerCode: "C001",
    customerName: "Acme Corporation",
    items: [
      {
        productCode: "P001",
        productName: "Premium Widget A",
        quantity: 10,
        price: 1500,
        gst: 18,
        total: 17700,
      },
    ],
    subtotal: 15000,
    taxAmount: 2700,
    grandTotal: 17700,
    status: "confirmed",
  },
  {
    id: "2",
    orderNumber: "SO-2024-002",
    date: "2024-12-27",
    customerCode: "C002",
    customerName: "Tech Solutions Ltd",
    items: [
      {
        productCode: "P002",
        productName: "Standard Component B",
        quantity: 20,
        price: 850,
        gst: 18,
        total: 20060,
      },
    ],
    subtotal: 17000,
    taxAmount: 3060,
    grandTotal: 20060,
    status: "pending",
  },
]

export function SalesOrdersList() {
  const [orders, setOrders] = useState<SalesOrder[]>(initialOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null)

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerCode.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddOrder = (order: Omit<SalesOrder, "id">) => {
    const newOrder = {
      ...order,
      id: Date.now().toString(),
    }
    setOrders([...orders, newOrder])
    setIsDialogOpen(false)
  }

  const handleEditOrder = (order: SalesOrder) => {
    setOrders(orders.map((o) => (o.id === order.id ? order : o)))
    setEditingOrder(null)
    setIsDialogOpen(false)
  }

  const handleDeleteOrder = (id: string) => {
    setOrders(orders.filter((o) => o.id !== id))
  }

  const openEditDialog = (order: SalesOrder) => {
    setEditingOrder(order)
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingOrder(null)
    setIsDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      confirmed: "default",
      shipped: "default",
      delivered: "default",
    }
    return <Badge variant={variants[status as keyof typeof variants] as any}>{status}</Badge>
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={openAddDialog} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </div>

          <div className="hidden md:block rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="text-right">Tax</TableHead>
                  <TableHead className="text-right">Grand Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString("en-IN")}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-muted-foreground">{order.customerCode}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">₹{order.subtotal.toLocaleString()}</TableCell>
                      <TableCell className="text-right">₹{order.taxAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-semibold">₹{order.grandTotal.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(order)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteOrder(order.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No orders found</div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="font-medium text-sm">{order.orderNumber}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(order.date).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>
                  <div className="border-t pt-2">
                    <div className="text-xs font-medium text-muted-foreground">{order.customerName}</div>
                    <div className="text-xs text-muted-foreground">{order.customerCode}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs bg-muted/50 p-2 rounded">
                    <div>
                      <div className="text-muted-foreground">Subtotal</div>
                      <div className="font-semibold">₹{order.subtotal.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Tax</div>
                      <div className="font-semibold">₹{order.taxAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Total</div>
                      <div className="font-semibold">₹{order.grandTotal.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="ghost" size="sm" className="flex-1" onClick={() => openEditDialog(order)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleDeleteOrder(order.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <SalesOrderDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        order={editingOrder}
        onSave={editingOrder ? handleEditOrder : handleAddOrder}
      />
    </div>
  )
}
