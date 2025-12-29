import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { OutstandingReport } from "@/components/outstanding-report"

export default function OutstandingReportPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav />
      <div className="flex-1">
        <DashboardHeader />
        <main className="p-6 space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Outstanding Report</h2>
            <p className="text-muted-foreground mt-1">Monitor pending payments and receivables</p>
          </div>
          <OutstandingReport />
        </main>
      </div>
    </div>
  )
}
