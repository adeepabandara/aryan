"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EditBillPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [navOpen, setNavOpen] = useState(false)
  const [formData, setFormData] = useState({
    number: "PB-2024-001",
    supplier: "Raw Materials Ltd",
    date: "2024-12-28",
    amount: "150000",
    description: "Materials for Q1 production",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/supplier-bills")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav navOpen={navOpen} onNavOpenChange={setNavOpen} />
      <main className="flex-1 w-full overflow-hidden">
        <div className="p-4 md:p-6 space-y-6">
          <h2 className="font-semibold text-2xl">Edit Supplier Bill</h2>
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Bill Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Bill Number</label>
                    <Input type="text" value={formData.number} disabled className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Supplier *</label>
                    <Input
                      type="text"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Amount *</label>
                    <Input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg mt-1 text-sm"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="bg-primary">
                    Save
                  </Button>
                  <Link href="/supplier-bills">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
