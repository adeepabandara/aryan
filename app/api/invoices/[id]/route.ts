import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/invoices/[id] - Get a single invoice
export async function GET(request: Request, context: RouteContext) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        },
        payments: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("Error fetching invoice:", error)
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    )
  }
}

// PUT /api/invoices/[id] - Update an invoice
export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()

    const { status, dueDate, notes } = body

    // Check if invoice exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id }
    })

    if (!existingInvoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      )
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: status || existingInvoice.status,
        dueDate: dueDate ? new Date(dueDate) : existingInvoice.dueDate,
        notes: notes !== undefined ? notes : existingInvoice.notes
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        },
        payments: true
      }
    })

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("Error updating invoice:", error)
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    )
  }
}

// DELETE /api/invoices/[id] - Delete an invoice
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params

    // Check if invoice exists
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            payments: true
          }
        }
      }
    })

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      )
    }

    // Check if invoice has payments
    if (invoice._count.payments > 0) {
      return NextResponse.json(
        { error: "Cannot delete invoice with existing payments" },
        { status: 400 }
      )
    }

    // Delete invoice items first, then invoice
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: id }
    })

    await prisma.invoice.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Invoice deleted successfully" })
  } catch (error) {
    console.error("Error deleting invoice:", error)
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 }
    )
  }
}
