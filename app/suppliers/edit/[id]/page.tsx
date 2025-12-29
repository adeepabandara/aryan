"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function EditSupplierPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [navOpen, setNavOpen] = useState(false)
  const [formData, setFormData] = useState({
    code: "SUP-001",
    name: "Raw Materials Ltd",
    contact: "9876543210",
    email: "contact@rawmaterials.com",
    address: "123 Business St",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/suppliers")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav navOpen={navOpen} onNavOpenChange={setNavOpen} />
      <main className="flex-1 w-full overflow-hidden">
        <div className="p-4 md:p-6 space-y-6 max-w-3xl">
          <div className="flex items-center gap-2">
            <Link href="/suppliers">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h2 className="text-2xl font-semibold tracking-tight">Edit Supplier</h2>
          </div>
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Supplier Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Supplier Code</label>
                    <Input type="text" value={formData.code} disabled className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Name *</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Contact Number</label>
                    <Input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Address</label>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="bg-primary">
                    Save
                  </Button>
                  <Link href="/suppliers">
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
