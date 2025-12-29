import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { SalesReport } from "@/components/sales-report"

export default function SalesReportPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav />
      <div className="flex-1">
        <DashboardHeader />
        <main className="p-6 space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Sales Report</h2>
            <p className="text-muted-foreground mt-1">Analyze sales performance and trends</p>
          </div>
          <SalesReport />
        </main>
      </div>
    </div>
  )
}
