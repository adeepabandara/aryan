"use client"

import { useState } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { MobileNavCards } from "@/components/mobile-nav-cards"
import { InvoicesList } from "@/components/invoices-list"
import { KPICards } from "@/components/kpi-cards"

export default function DashboardPage() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav navOpen={navOpen} onNavOpenChange={setNavOpen} />
      <main className="flex-1 w-full overflow-hidden">
        <div className="p-4 md:p-6 space-y-6">
          <div>
            <h2 className="font-semibold text-2xl">Dashboard</h2>
          </div>
          <KPICards />
          <MobileNavCards />
          <InvoicesList isDashboard={true} />
        </div>
      </main>
    </div>
  )
}
