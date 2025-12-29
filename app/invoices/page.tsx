"use client"

import { useState } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { InvoicesList } from "@/components/invoices-list"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function InvoicesPage() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav navOpen={navOpen} onNavOpenChange={setNavOpen} />
      <main className="flex-1 w-full overflow-hidden">
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h2 className="text-2xl font-semibold tracking-tight">Invoices</h2>
          </div>
          <InvoicesList />
        </div>
      </main>
    </div>
  )
}
