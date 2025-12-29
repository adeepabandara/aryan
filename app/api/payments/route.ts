import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/payments - Get all payments
export async function GET(request: Request) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const invoiceId = searchParams.get("invoiceId")
    const customerId = searchParams.get("customerId")

    const where: any = {}
    
    if (invoiceId) {
      where.invoiceId = invoiceId
    }
    
    if (customerId) {
      where.invoice = {
        customerId
      }
    }

    const payments = await prisma.payment.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        paymentInvoices: {
          include: {
            invoice: {
              select: {
                id: true,
                invoiceNumber: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    )
  }
}

// POST /api/payments - Create a new payment
export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    const { invoiceId, amount, paymentMethod, paymentDate, notes } = body

    // Validate required fields
    if (!invoiceId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: "Invoice, amount, and payment method are required" },
        { status: 400 }
      )
    }

    // Check if invoice exists
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        payments: true
      }
    })

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      )
    }

    // Calculate total paid amount including this payment
    const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0) + parseFloat(amount)

    // Check if payment exceeds invoice total
    if (totalPaid > invoice.total) {
      return NextResponse.json(
        { error: "Payment amount exceeds invoice total" },
        { status: 400 }
      )
    }

    // Determine new invoice status
    let newStatus = invoice.status
    if (totalPaid >= invoice.total) {
      newStatus = "PAID"
    } else if (totalPaid > 0) {
      newStatus = "PARTIALLY_PAID"
    }

    // Create payment and update invoice status in a transaction
    const payment = await prisma.$transaction(async (tx) => {
      const newPayment = await tx.payment.create({
        data: {
          invoiceId,
          amount: parseFloat(amount),
          paymentMethod,
          paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
          notes: notes || null
        },
        include: {
          invoice: {
            include: {
              customer: true
            }
          }
        }
      })

      // Update invoice status
      await tx.invoice.update({
        where: { id: invoiceId },
        data: { status: newStatus }
      })

      return newPayment
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error("Error creating payment:", error)
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    )
  }
}
