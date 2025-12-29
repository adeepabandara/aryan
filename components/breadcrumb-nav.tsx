"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const breadcrumbMap: Record<string, { name: string; parent?: { name: string; href: string } }> = {
  "/dashboard": { name: "Dashboard" },
  "/products": { name: "Products" },
  "/products/add": { name: "Add Product", parent: { name: "Products", href: "/products" } },
  "/products/edit": { name: "Edit Product", parent: { name: "Products", href: "/products" } },
  "/customers": { name: "Customers" },
  "/customers/add": { name: "Add Customer", parent: { name: "Customers", href: "/customers" } },
  "/customers/edit": { name: "Edit Customer", parent: { name: "Customers", href: "/customers" } },
  "/invoices": { name: "Invoices" },
  "/invoices/add": { name: "Create Invoice", parent: { name: "Invoices", href: "/invoices" } },
  "/invoices/preview": { name: "Invoice Preview", parent: { name: "Invoices", href: "/invoices" } },
  "/payments": { name: "Payments" },
  "/payments/add": { name: "Record Payment", parent: { name: "Payments", href: "/payments" } },
  "/suppliers": { name: "Suppliers" },
  "/suppliers/add": { name: "Add Supplier", parent: { name: "Suppliers", href: "/suppliers" } },
  "/suppliers/edit": { name: "Edit Supplier", parent: { name: "Suppliers", href: "/suppliers" } },
  "/supplier-bills": { name: "Supplier Bills" },
  "/supplier-bills/add": { name: "Create Bill", parent: { name: "Supplier Bills", href: "/supplier-bills" } },
  "/supplier-bills/edit": { name: "Edit Bill", parent: { name: "Supplier Bills", href: "/supplier-bills" } },
  "/settings": { name: "Settings" },
}

export function BreadcrumbNav() {
  const pathname = usePathname()
  const router = useRouter()

  const getBreadcrumbInfo = () => {
    for (const [path, info] of Object.entries(breadcrumbMap)) {
      if (pathname.startsWith(path) && pathname !== "/dashboard") {
        return info
      }
    }
    return null
  }

  const breadcrumbInfo = getBreadcrumbInfo()

  if (!breadcrumbInfo) {
    return null
  }

  return (
    <div className="flex items-center gap-2 mb-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="gap-1 text-muted-foreground hover:text-foreground hover:bg-gray-200"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Back</span>
      </Button>

      {breadcrumbInfo.parent && (
        <>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link href={breadcrumbInfo.parent.href} className="text-sm text-muted-foreground hover:text-foreground">
            {breadcrumbInfo.parent.name}
          </Link>
        </>
      )}

      <ChevronRight className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium text-foreground">{breadcrumbInfo.name}</span>
    </div>
  )
}
