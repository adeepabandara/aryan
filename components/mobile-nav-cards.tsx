"use client"

import Link from "next/link"
import { LayoutDashboard, Package, Users, FileText, CreditCard, Settings, Building2, FileTextIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const navigationCards = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "bg-blue-50" },
  { name: "Invoices", href: "/invoices", icon: FileText, color: "bg-green-50" },
  { name: "Payments", href: "/payments", icon: CreditCard, color: "bg-purple-50" },
  { name: "Customers", href: "/customers", icon: Users, color: "bg-orange-50" },
  { name: "Suppliers", href: "/suppliers", icon: Building2, color: "bg-pink-50" },
  { name: "Supplier Bills", href: "/supplier-bills", icon: FileTextIcon, color: "bg-indigo-50" },
  { name: "Products", href: "/products", icon: Package, color: "bg-yellow-50" },
  { name: "Settings", href: "/settings", icon: Settings, color: "bg-gray-50" },
]

export function MobileNavCards() {
  return (
    <div className="grid grid-cols-2 gap-4 md:hidden">
      {navigationCards.map((item) => {
        const Icon = item.icon
        return (
          <Link key={item.name} href={item.href}>
            <Card className={`cursor-pointer h-full transition-all hover:shadow-lg hover:scale-105 ${item.color}`}>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Icon className="h-8 w-8 mb-3 text-primary" />
                <p className="text-sm font-semibold text-center text-foreground">{item.name}</p>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
