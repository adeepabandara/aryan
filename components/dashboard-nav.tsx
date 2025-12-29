"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Users, FileText, CreditCard, Settings, X, ChevronLeft, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { signOut } from "next-auth/react"
import { UserMenu } from "@/components/user-menu"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Customers", href: "/customers", icon: Users },
  // { name: "Suppliers", href: "/suppliers", icon: Users },
  // { name: "Supplier Bills", href: "/supplier-bills", icon: FileText },
  { name: "Products", href: "/products", icon: Package },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function DashboardNav({
  navOpen,
  onNavOpenChange,
}: { navOpen: boolean; onNavOpenChange: (open: boolean) => void }) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      {navOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => onNavOpenChange(false)} />}

      <nav
        className={cn(
          "fixed md:relative z-50 md:z-auto h-screen bg-card border-r flex flex-col transition-all duration-300 md:translate-x-0",
          navOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "w-20 md:w-20" : "w-64 md:w-64",
        )}
      >
        {/* Logo at top */}
        <div className={cn("p-4 flex items-center justify-between border-b", isCollapsed && "md:justify-center")}>
          {!isCollapsed && (
            <Image src="/images/logo.jpg" alt="Aryan Products" width={140} height={50} className="h-8 w-auto" />
          )}
          {isCollapsed && <Image src="/images/logo.jpg" alt="Aryan" width={40} height={40} className="h-8 w-8" />}
          <Button variant="ghost" size="icon" className="md:flex hidden" onClick={() => setIsCollapsed(!isCollapsed)}>
            <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => onNavOpenChange(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => onNavOpenChange(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : // Changed hover color to light grey
                      "text-foreground hover:bg-gray-200 hover:text-foreground",
                )}
                title={isCollapsed ? item.name : ""}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="text-sm truncate">{item.name}</span>}
              </Link>
            )
          })}
        </div>

        {/* User info */}
        <UserMenu isCollapsed={isCollapsed} />

        {/* Logout button at bottom */}
        <div className="border-t p-2">
          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={cn(
              "w-full justify-start gap-3 text-foreground hover:bg-gray-200 hover:text-foreground",
              isCollapsed && "justify-center",
            )}
            variant="ghost"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm">Logout</span>}
          </Button>
        </div>
      </nav>
    </>
  )
}
