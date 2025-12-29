"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Send, X } from "lucide-react"
import Image from "next/image"

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
    gst: number
    total: number
  }>
  subtotal: number
  taxAmount: number
  grandTotal: number
  amountPaid: number
  balance: number
}

type InvoicePreviewDialogProps = {
  invoice: Invoice | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvoicePreviewDialog({ invoice, open, onOpenChange }: InvoicePreviewDialogProps) {
  if (!invoice) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Invoice Preview</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button size="sm">
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Invoice Document */}
          <div className="border rounded-lg p-8 bg-card">
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
                  <th className="pb-2 text-right">GST %</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b text-sm">
                    <td className="py-3">{item.productName}</td>
                    <td className="py-3 text-right">{item.quantity}</td>
                    <td className="py-3 text-right">₹{item.price.toLocaleString()}</td>
                    <td className="py-3 text-right">{item.gst}%</td>
                    <td className="py-3 text-right">₹{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal:</span>
                  <span>₹{invoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Tax Amount:</span>
                  <span>₹{invoice.taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t-2 border-foreground pt-2 mb-2">
                  <span>Grand Total:</span>
                  <span>₹{invoice.grandTotal.toLocaleString()}</span>
                </div>
                {invoice.amountPaid > 0 && (
                  <>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Amount Paid:</span>
                      <span className="text-green-600">₹{invoice.amountPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base border-t pt-2">
                      <span>Balance Due:</span>
                      <span className="text-red-600">₹{invoice.balance.toLocaleString()}</span>
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
              <p className="text-center mt-4">Thank you for your business!</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
