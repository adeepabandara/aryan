"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { Card } from "@/components/ui/card"
import { FormKebabMenu } from "@/components/form-kebab-menu"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EditCustomerPage() {
  const [navOpen, setNavOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [formData, setFormData] = useState({
    code: "C001",
    name: "Acme Corporation",
    email: "",
    contactNumber: "",
    address: "",
    description: "",
    type: "corporate" as "corporate" | "online",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Customer updated:", formData)
    window.location.href = "/customers"
  }

  const handleDelete = () => {
    console.log("Customer deleted:", formData.code)
    window.location.href = "/customers"
  }

  const handleDeleteClick = () => {
    // Check if customer has invoices (mock check)
    const hasInvoices = true // In real app, check from backend
    if (hasInvoices) {
      setShowDeleteModal(true)
    } else {
      handleDelete()
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav navOpen={navOpen} onNavOpenChange={setNavOpen} />
      <main className="flex-1 w-full overflow-hidden">
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/customers">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h2 className="text-2xl font-semibold tracking-tight">Edit Customer</h2>
            </div>
            <FormKebabMenu onDelete={handleDeleteClick} />
          </div>

          <Card className="border bg-white">
            <form onSubmit={handleSubmit} className="rounded-lg p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Customer Code</Label>
                  <Input id="code" value={formData.code} disabled className="bg-muted" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="type">Customer Type*</Label>
                  <Select value={formData.type} onValueChange={(value: "corporate" | "online") => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Customer Name*</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter customer name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    placeholder="Enter contact number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter address"
                  className="resize-none"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                  className="resize-none"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <Link href="/customers">
                  <Button type="button" variant="outline" className="bg-transparent h-12 px-8">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="h-12 px-8">
                  Update Customer
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title="Cannot Delete Customer"
        description={`Customer "${formData.code}" has associated invoices.`}
        warningMessage="Please delete or reassign all invoices before deleting this customer."
        onConfirm={() => setShowDeleteModal(false)}
        onCancel={() => setShowDeleteModal(false)}
        isDestructive={false}
      />
    </div>
  )
}
