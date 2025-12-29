"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Download, ArrowLeft, MoreVertical, Trash2 } from "lucide-react"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Invoice = {
  id: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  customerName: string
  items: Array<{
    productName: string
    quantity: number
    price: number
    discount: number // added line item discount
    total: number
  }>
  subtotal: number
  lineDiscounts: number // added line discounts
  invoiceDiscount: number // added invoice discount
  subtotalAfterDiscounts: number // added subtotal after discounts
  taxPercentage: number // added tax percentage
  taxAmount: number
  grandTotal: number
  amountPaid: number
  balance: number
}

const invoicesData: Record<string, Invoice> = {
  "1": {
    id: "1",
    invoiceNumber: "INV-2024-001",
    invoiceDate: "2024-12-28",
    dueDate: "2025-01-27",
    customerName: "Acme Corporation",
    items: [
      {
        productName: "Premium Widget A",
        quantity: 10,
        price: 1500,
        discount: 5,
        total: 14250,
      },
    ],
    subtotal: 15000,
    lineDiscounts: 750,
    invoiceDiscount: 714,
    subtotalAfterDiscounts: 13536,
    taxPercentage: 18,
    taxAmount: 2436,
    grandTotal: 15972,
    amountPaid: 15972,
    balance: 0,
  },
  "2": {
    id: "2",
    invoiceNumber: "INV-2024-002",
    invoiceDate: "2024-12-27",
    dueDate: "2025-01-26",
    customerName: "Tech Solutions Ltd",
    items: [
      {
        productName: "Standard Component B",
        quantity: 20,
        price: 850,
        discount: 0,
        total: 17000,
      },
    ],
    subtotal: 17000,
    lineDiscounts: 0,
    invoiceDiscount: 0,
    subtotalAfterDiscounts: 17000,
    taxPercentage: 18,
    taxAmount: 3060,
    grandTotal: 20060,
    amountPaid: 10000,
    balance: 10060,
  },
}

function PreviewKebabMenu({ onDelete, invoiceNumber }: { onDelete: () => void; invoiceNumber: string }) {
  const handleDownload = () => {
    const printContent = document.getElementById('invoice-print-area')
    if (!printContent) return

    // Get all stylesheets from the current document
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n')
        } catch (e) {
          return ''
        }
      })
      .join('\n')

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoiceNumber}</title>
          <style>
            ${styles}
            body { 
              margin: 0;
              padding: 20px;
            }
            @media print {
              body { margin: 0; padding: 20px; }
              @page { margin: 0.5cm; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          <Trash2 className="h-4 w-4 mr-2 text-red-600" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function InvoicePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const [navOpen, setNavOpen] = useState(false)
  const router = useRouter()
  const { id } = use(params)
  const invoice = invoicesData[id]

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      console.log("Deleting invoice:", id)
      router.push("/invoices")
    }
  }

  if (!invoice) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardNav navOpen={navOpen} onNavOpenChange={setNavOpen} />
        <main className="flex-1 w-full overflow-hidden">
          <div className="p-4 md:p-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Invoice not found</p>
              <Button onClick={() => router.back()} className="mt-4">
                Go Back
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNav navOpen={navOpen} onNavOpenChange={setNavOpen} />
      <main className="flex-1 w-full overflow-hidden">
        <div className="p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Button variant="ghost" onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <PreviewKebabMenu onDelete={handleDelete} invoiceNumber={invoice.invoiceNumber} />
          </div>

          {/* Invoice Document */}
          <div id="invoice-print-area" className="border rounded-lg p-8 bg-card max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <Image src="/images/logo.jpg" alt="Aryan Products" width={200} height={70} className="h-16 w-auto" />
                <div className="mt-4 text-sm">
                  <p className="font-semibold">Aryan Products</p>
                  <p>123 Business Street</p>
                  <p>Mumbai, Maharashtra 400001</p>
                  <p>GSTIN: 27AABCU9603R1ZX</p>
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-3xl font-bold text-primary">INVOICE</h1>
                <div className="mt-4 text-sm">
                  <p>
                    <span className="font-semibold">Invoice No:</span> {invoice.invoiceNumber}
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(invoice.invoiceDate).toLocaleDateString("en-IN")}
                  </p>
                  <p>
                    <span className="font-semibold">Due Date:</span>{" "}
                    {new Date(invoice.dueDate).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-8">
              <h3 className="font-semibold text-sm mb-2">BILL TO:</h3>
              <div className="text-sm">
                <p className="font-semibold">{invoice.customerName}</p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-8">
              <thead className="border-b-2 border-foreground">
                <tr className="text-left text-sm">
                  <th className="pb-2">Item Description</th>
                  <th className="pb-2 text-right">Qty</th>
                  <th className="pb-2 text-right">Price</th>
                  <th className="pb-2 text-right">Discount %</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b text-sm">
                    <td className="py-3">{item.productName}</td>
                    <td className="py-3 text-right">{item.quantity}</td>
                    <td className="py-3 text-right">LKR{item.price.toLocaleString()}</td>
                    <td className="py-3 text-right">{item.discount}%</td>
                    <td className="py-3 text-right">LKR{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal:</span>
                  <span>LKR{invoice.subtotal.toLocaleString()}</span>
                </div>
                {invoice.lineDiscounts > 0 && (
                  <div className="flex justify-between text-sm mb-2 text-orange-600">
                    <span>Line Discounts:</span>
                    <span>-LKR{invoice.lineDiscounts.toLocaleString()}</span>
                  </div>
                )}
                {invoice.invoiceDiscount > 0 && (
                  <div className="flex justify-between text-sm mb-2 text-orange-600">
                    <span>Invoice Discount:</span>
                    <span>-LKR{invoice.invoiceDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t-2 border-foreground pt-2 mb-2">
                  <span>Grand Total:</span>
                  <span>LKR{invoice.grandTotal.toLocaleString()}</span>
                </div>
                {invoice.amountPaid > 0 && (
                  <>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Amount Paid:</span>
                      <span className="text-green-600">LKR{invoice.amountPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base border-t pt-2">
                      <span>Balance Due:</span>
                      <span className="text-red-600">LKR{invoice.balance.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-6 text-xs text-muted-foreground">
              <p className="mb-2">
                <span className="font-semibold">Payment Terms:</span> Payment due within 30 days
              </p>
              <p className="mb-2">
                <span className="font-semibold">Bank Details:</span> HDFC Bank, Account No: 1234567890, IFSC:
                HDFC0001234
              </p>
              <p className="mt-4">Thank you for your business!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
