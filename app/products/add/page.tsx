"use client"

import type React from "react"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AddProductPage() {
  const [navOpen, setNavOpen] = useState(false)
  const [formData, setFormData] = useState({
    code: `P${Date.now()}`,
    name: "",
    cost: "",
    salesMargin: "",
    price: "",
  })

  const calculatePrice = (cost: string, margin: string) => {
    if (cost && margin) {
      const costNum = Number.parseFloat(cost)
      const marginNum = Number.parseFloat(margin)
      const calculatedPrice = costNum + (costNum * marginNum) / 100
      return calculatedPrice.toFixed(2)
    }
    return ""
  }

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCost = e.target.value
    setFormData((prev) => ({
      ...prev,
      cost: newCost,
      price: calculatePrice(newCost, prev.salesMargin),
    }))
  }

  const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMargin = e.target.value
    setFormData((prev) => ({
      ...prev,
      salesMargin: newMargin,
      price: calculatePrice(prev.cost, newMargin),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Product saved:", formData)
    window.location.href = "/products"
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav navOpen={navOpen} onNavOpenChange={setNavOpen} />
      <main className="flex-1 w-full overflow-hidden">
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Link href="/products">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h2 className="text-2xl font-semibold tracking-tight">Add New Product</h2>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Product Code</Label>
                <Input id="code" value={formData.code} disabled className="bg-muted" />
                
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Product Name*</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter product name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Cost (LKR)*</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={handleCostChange}
                  required
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salesMargin">Sales Margin (%)*</Label>
                <Input
                  id="salesMargin"
                  type="number"
                  step="0.01"
                  value={formData.salesMargin}
                  onChange={handleMarginChange}
                  required
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (LKR)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  disabled
                  className="bg-muted"
                  placeholder="Auto-calculated"
                />
                
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Link href="/products">
                <Button type="button" variant="outline" className="bg-transparent h-12 px-8">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="h-12 px-8">
                Add Product
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
