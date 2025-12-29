import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusChip } from "@/components/status-chip"

const activities = [
  {
    id: "INV-2024-001",
    customer: "Acme Corporation",
    amount: "LKR 45,000",
    status: "paid",
    date: "2024-12-28",
  },
  {
    id: "INV-2024-002",
    customer: "Tech Solutions Ltd",
    amount: "LKR 32,500",
    status: "due",
    date: "2024-12-27",
  },
  {
    id: "INV-2024-003",
    customer: "Global Industries",
    amount: "LKR 67,800",
    status: "overdue",
    date: "2024-12-26",
  },
  {
    id: "INV-2024-004",
    customer: "Bright Enterprises",
    amount: "LKR 28,900",
    status: "paid",
    date: "2024-12-25",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{activity.id}</p>
                  <StatusChip status={activity.status} />
                </div>
                <p className="text-sm text-muted-foreground">{activity.customer}</p>
              </div>
              <p className="text-sm font-semibold">{activity.amount}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
