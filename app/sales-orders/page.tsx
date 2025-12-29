import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { SalesOrdersList } from "@/components/sales-orders-list"

export default function SalesOrdersPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav />
      <div className="flex-1">
        <DashboardHeader />
        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Sales Orders</h2>
              <p className="text-muted-foreground mt-1">Create and manage customer orders</p>
            </div>
          </div>
          <SalesOrdersList />
        </main>
      </div>
    </div>
  )
}
