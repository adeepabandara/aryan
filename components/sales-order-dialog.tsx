"use client"

import type React from "react"

import { useEffect, useState } from "react"
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
import { Plus, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type OrderItem = {
  productCode: string
  productName: string
  quantity: number
  price: number
  gst: number
  total: number
}

type SalesOrder = {
  id: string
  orderNumber: string
  date: string
  customerCode: string
  customerName: string
  items: OrderItem[]
  subtotal: number
  taxAmount: number
  grandTotal: number
  status: "pending" | "confirmed" | "shipped" | "delivered"
}

type SalesOrderDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: SalesOrder | null
  onSave: (order: any) => void
}

// Mock data for dropdowns
const mockCustomers = [
  { code: "C001", name: "Acme Corporation" },
  { code: "C002", name: "Tech Solutions Ltd" },
]

const mockProducts = [
  { code: "P001", name: "Premium Widget A", price: 1500, gst: 18 },
  { code: "P002", name: "Standard Component B", price: 850, gst: 18 },
  { code: "P003", name: "Industrial Part C", price: 2200, gst: 18 },
]

export function SalesOrderDialog({ open, onOpenChange, order, onSave }: SalesOrderDialogProps) {
  const [formData, setFormData] = useState({
    orderNumber: "",
    date: new Date().toISOString().split("T")[0],
    customerCode: "",
    customerName: "",
    status: "pending" as const,
  })

  const [items, setItems] = useState<OrderItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (order) {
      setFormData({
        orderNumber: order.orderNumber,
        date: order.date,
        customerCode: order.customerCode,
        customerName: order.customerName,
        status: order.status,
      })
      setItems(order.items)
    } else {
      const orderNumber = `SO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`
      setFormData({
        orderNumber,
        date: new Date().toISOString().split("T")[0],
        customerCode: "",
        customerName: "",
        status: "pending",
      })
      setItems([])
    }
  }, [order, open])

  const handleCustomerChange = (code: string) => {
    const customer = mockCustomers.find((c) => c.code === code)
    if (customer) {
      setFormData({ ...formData, customerCode: code, customerName: customer.name })
    }
  }

  const handleAddItem = () => {
    const product = mockProducts.find((p) => p.code === selectedProduct)
    if (product && quantity > 0) {
      const subtotal = product.price * quantity
      const taxAmount = (subtotal * product.gst) / 100
      const total = subtotal + taxAmount

      const newItem: OrderItem = {
        productCode: product.code,
        productName: product.name,
        quantity,
        price: product.price,
        gst: product.gst,
        total,
      }

      setItems([...items, newItem])
      setSelectedProduct("")
      setQuantity(1)
    }
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const taxAmount = items.reduce((sum, item) => {
      const itemSubtotal = item.price * item.quantity
      return sum + (itemSubtotal * item.gst) / 100
    }, 0)
    const grandTotal = subtotal + taxAmount
    return { subtotal, taxAmount, grandTotal }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { subtotal, taxAmount, grandTotal } = calculateTotals()

    const orderData = {
      ...formData,
      items,
      subtotal,
      taxAmount,
      grandTotal,
    }

    if (order) {
      onSave({ ...order, ...orderData })
    } else {
      onSave(orderData)
    }
  }

  const totals = calculateTotals()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{order ? "Edit Sales Order" : "Create New Sales Order"}</DialogTitle>
          <DialogDescription>
            {order ? "Update order details below" : "Enter order details to create a new sales order"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Order Header */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderNumber">Order Number*</Label>
                <Input id="orderNumber" value={formData.orderNumber} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Order Date*</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status*</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer">Customer*</Label>
              <Select value={formData.customerCode} onValueChange={handleCustomerChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {mockCustomers.map((customer) => (
                    <SelectItem key={customer.code} value={customer.code}>
                      {customer.code} - {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Add Items Section */}
            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="font-semibold">Add Items</h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProducts.map((product) => (
                        <SelectItem key={product.code} value={product.code}>
                          {product.code} - {product.name} (₹{product.price})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                  />
                </div>
                <Button type="button" onClick={handleAddItem} disabled={!selectedProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            {/* Items Table */}
            {items.length > 0 && (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">GST %</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.productName}</div>
                            <div className="text-sm text-muted-foreground">{item.productCode}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">₹{item.price.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.gst}%</TableCell>
                        <TableCell className="text-right">₹{item.total.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Totals */}
            {items.length > 0 && (
              <div className="flex justify-end">
                <div className="w-80 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₹{totals.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax Amount:</span>
                    <span>₹{totals.taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Grand Total:</span>
                    <span>₹{totals.grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.customerCode || items.length === 0}>
              {order ? "Update" : "Create"} Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
