"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, ArrowLeft } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type OrderItem = {
  productCode: string
  productName: string
  quantity: number
  price: number
  discount: number
  subtotal: number
  total: number
}

const mockCustomers = [
  { code: "C001", name: "Acme Corporation", address: "123 Business Park, Mumbai", phone: "+91 98765 43210" },
  { code: "C002", name: "Tech Solutions Ltd", address: "456 Tech Tower, Bangalore", phone: "+91 87654 32109" },
]

const mockProducts = [
  { code: "P001", name: "Premium Widget A", price: 1500 },
  { code: "P002", name: "Standard Component B", price: 850 },
  { code: "P003", name: "Industrial Part C", price: 2200 },
]

export default function AddInvoicePage() {
  const [navOpen, setNavOpen] = useState(false)
  const [formData, setFormData] = useState({
    invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    customerCode: "",
    customerName: "",
    customerAddress: "",
    customerPhone: "",
    status: "pending" as const,
    invoiceDiscount: 0,
    taxPercentage: 18,
  })

  const [items, setItems] = useState<OrderItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(0)
  const [lineDiscount, setLineDiscount] = useState(0)

  const handleCustomerChange = (code: string) => {
    const customer = mockCustomers.find((c) => c.code === code)
    if (customer) {
      setFormData({ 
        ...formData, 
        customerCode: code, 
        customerName: customer.name,
        customerAddress: customer.address,
        customerPhone: customer.phone
      })
    }
  }

  const handleProductChange = (code: string) => {
    setSelectedProduct(code)
    const product = mockProducts.find((p) => p.code === code)
    if (product) {
      setPrice(product.price)
    }
  }

  const handleAddItem = () => {
    const product = mockProducts.find((p) => p.code === selectedProduct)
    if (product && quantity > 0 && price > 0) {
      const subtotal = price * quantity
      const discountAmount = (subtotal * lineDiscount) / 100
      const total = subtotal - discountAmount

      const newItem: OrderItem = {
        productCode: product.code,
        productName: product.name,
        quantity,
        price: price,
        discount: lineDiscount,
        subtotal,
        total,
      }

      setItems([...items, newItem])
      setSelectedProduct("")
      setQuantity(1)
      setPrice(0)
      setLineDiscount(0)
    }
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
    const lineItemDiscounts = items.reduce((sum, item) => sum + (item.subtotal * item.discount) / 100, 0)
    const subtotalAfterLineDiscounts = subtotal - lineItemDiscounts
    const invoiceDiscountAmount = (subtotalAfterLineDiscounts * formData.invoiceDiscount) / 100
    const subtotalAfterAllDiscounts = subtotalAfterLineDiscounts - invoiceDiscountAmount
    const taxAmount = (subtotalAfterAllDiscounts * formData.taxPercentage) / 100
    const grandTotal = subtotalAfterAllDiscounts + taxAmount
    return { subtotal, lineItemDiscounts, invoiceDiscountAmount, subtotalAfterAllDiscounts, taxAmount, grandTotal }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Invoice created:", formData, items)
    window.location.href = "/invoices"
  }

  const totals = calculateTotals()

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav navOpen={navOpen} onNavOpenChange={setNavOpen} />
      <main className="flex-1 w-full overflow-hidden">
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/invoices">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Create New Invoice</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-lg border p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number*</Label>
                  <Input id="invoiceNumber" value={formData.invoiceNumber} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceDate">Invoice Date*</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={formData.invoiceDate}
                    onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date*</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer*</Label>
                  <Select value={formData.customerCode} onValueChange={handleCustomerChange}>
                    <SelectTrigger className="w-full">
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
                
                {formData.customerCode && (
                  <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Address</p>
                      <p className="text-sm">{formData.customerAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contact Number</p>
                      <p className="text-sm">{formData.customerPhone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="font-semibold">Add Items</h3>
              <div className="grid grid-cols-2 md:grid-cols-12 gap-4 items-end">
                <div className="col-span-2 md:col-span-4">
                  <Label htmlFor="product" className="text-sm">
                    Product Name
                  </Label>
                  <Select value={selectedProduct} onValueChange={handleProductChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProducts.map((product) => (
                        <SelectItem key={product.code} value={product.code}>
                          {product.code} - {product.name} (LKR {product.price})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="quantity" className="text-sm">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="price" className="text-sm">
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="discount" className="text-sm">
                    Discount %
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    value={lineDiscount}
                    onChange={(e) => setLineDiscount(Number(e.target.value))}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="col-span-2 md:col-span-2">
                  <Button type="button" onClick={handleAddItem} disabled={!selectedProduct || price <= 0} className="w-full">
                    Add
                    <Plus className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            {items.length > 0 && (
              <div className="space-y-4">
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary hover:bg-primary">
                        <TableHead className="text-primary-foreground">Product</TableHead>
                        <TableHead className="text-right text-primary-foreground">Qty</TableHead>
                        <TableHead className="text-right text-primary-foreground">Price</TableHead>
                        <TableHead className="text-right text-primary-foreground">Discount %</TableHead>
                        <TableHead className="text-right text-primary-foreground">Total</TableHead>
                        <TableHead className="w-12 text-primary-foreground"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="font-medium">{item.productName}</div>
                          </TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{item.price.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{item.discount}%</TableCell>
                          <TableCell className="text-right">{item.total.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="text-destructive hover:text-destructive/80 inline-flex items-center justify-center"
                              aria-label={`Remove item ${index + 1}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {items.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="w-full md:w-96 space-y-3">
                    <div className="space-y-2">
                      {totals.lineItemDiscounts > 0 && (
                        <div className="flex justify-between text-sm text-orange-600">
                          <span>Line Discounts:</span>
                          <span>-LKR{totals.lineItemDiscounts.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm border-t pt-2">
                        <span>Subtotal:</span>
                        <span>LKR{totals.subtotal.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="invoiceDiscount" className="text-sm whitespace-nowrap">Invoice Discount (%):</Label>
                          <Input
                            id="invoiceDiscount"
                            type="number"
                            value={formData.invoiceDiscount}
                            onChange={(e) => setFormData({ ...formData, invoiceDiscount: Number(e.target.value) })}
                            min="0"
                            max="100"
                            className="w-20 text-right"
                          />
                        </div>
                        {totals.invoiceDiscountAmount > 0 && (
                          <span className="text-sm text-orange-600">-LKR{totals.invoiceDiscountAmount.toLocaleString()}</span>
                        )}
                      </div>
                      
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>LKR{totals.subtotalAfterAllDiscounts.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Link href="/invoices">
                <Button type="button" variant="outline" className="bg-transparent h-12 px-8">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!formData.customerCode || items.length === 0} className="h-12 px-8">
                Create Invoice
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
