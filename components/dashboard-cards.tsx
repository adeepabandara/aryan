import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react"

const cards = [
  {
    title: "Total Revenue",
    value: "₹12,45,680",
    change: "+12.5%",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "Sales Orders",
    value: "145",
    change: "+8.2%",
    icon: ShoppingCart,
    trend: "up",
  },
  {
    title: "Active Customers",
    value: "87",
    change: "+4.3%",
    icon: Users,
    trend: "up",
  },
  {
    title: "Outstanding",
    value: "₹2,45,890",
    change: "-3.1%",
    icon: TrendingUp,
    trend: "down",
  },
]

export function DashboardCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className={`text-xs ${card.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {card.change} from last month
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
