"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardNav } from "@/components/dashboard-nav"
import { SuppliersList } from "@/components/suppliers-list"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function SuppliersPage() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav navOpen={navOpen} onNavOpenChange={setNavOpen} />
      <main className="flex-1 w-full overflow-hidden">
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h2 className="text-2xl font-semibold tracking-tight">Suppliers</h2>
            </div>
            <Link href="/suppliers/add">
              <Button>Add Supplier</Button>
            </Link>
          </div>
          <SuppliersList />
        </div>
      </main>
    </div>
  )
}
