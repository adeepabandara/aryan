import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { PaymentReport } from "@/components/payment-report"

export default function PaymentReportPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav />
      <div className="flex-1">
        <DashboardHeader />
        <main className="p-6 space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Payment Report</h2>
            <p className="text-muted-foreground mt-1">Track payments received and collection efficiency</p>
          </div>
          <PaymentReport />
        </main>
      </div>
    </div>
  )
}
