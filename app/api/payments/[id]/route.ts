import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/payments/[id] - Get a single payment
export async function GET(request: Request, context: RouteContext) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        invoice: {
          include: {
            customer: true
          }
        }
      }
    })

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(payment)
  } catch (error) {
    console.error("Error fetching payment:", error)
    return NextResponse.json(
      { error: "Failed to fetch payment" },
      { status: 500 }
    )
  }
}

// DELETE /api/payments/[id] - Delete a payment
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params

    // Get payment with invoice details
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        invoice: {
          include: {
            payments: true
          }
        }
      }
    })

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      )
    }

    // Calculate remaining total after deleting this payment
    const remainingTotal = payment.invoice.payments
      .filter(p => p.id !== id)
      .reduce((sum, p) => sum + p.amount, 0)

    // Determine new invoice status
    let newStatus = "PENDING"
    if (remainingTotal >= payment.invoice.total) {
      newStatus = "PAID"
    } else if (remainingTotal > 0) {
      newStatus = "PARTIALLY_PAID"
    }

    // Delete payment and update invoice status in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.payment.delete({
        where: { id }
      })

      await tx.invoice.update({
        where: { id: payment.invoiceId },
        data: { status: newStatus }
      })
    })

    return NextResponse.json({ message: "Payment deleted successfully" })
  } catch (error) {
    console.error("Error deleting payment:", error)
    return NextResponse.json(
      { error: "Failed to delete payment" },
      { status: 500 }
    )
  }
}
