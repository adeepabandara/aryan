import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
})

async function main() {
  console.log('🌱 Starting database seed...')

  // Seed Company Settings
  const companySettings = await prisma.companySettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Aryan Products',
      address: '123 Business Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      phone: '+91 98765 43210',
      email: 'info@aryanproducts.com',
      gstin: '27AABCU9603R1ZX',
      pan: 'AABCU9603R',
      website: 'www.aryanproducts.com',
    },
  })
  console.log('✅ Company settings created')

  // Seed Bank Details
  const bankDetails = await prisma.bankDetails.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      accountName: 'Aryan Products Pvt Ltd',
      accountNumber: '1234567890',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      branch: 'Mumbai Main Branch',
    },
  })
  console.log('✅ Bank details created')

  // Seed Invoice Settings
  const invoiceSettings = await prisma.invoiceSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      prefix: 'INV',
      startingNumber: 1,
      terms: 'Payment due within 30 days',
      notes: 'Thank you for your business!',
    },
  })
  console.log('✅ Invoice settings created')

  // Seed Users
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@aryanproducts.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@aryanproducts.com',
      password: hashedPassword,
    },
  })
  console.log('✅ Admin user created')

  // Seed Customers
  const customer1 = await prisma.customer.upsert({
    where: { code: 'C001' },
    update: {},
    create: {
      code: 'C001',
      name: 'Acme Corporation',
      email: 'contact@acmecorp.com',
      contactNumber: '+91 98765 43210',
      address: '123 Business Park, Mumbai, Maharashtra, 400001',
      type: 'CORPORATE',
    },
  })

  const customer2 = await prisma.customer.upsert({
    where: { code: 'C002' },
    update: {},
    create: {
      code: 'C002',
      name: 'Tech Solutions Ltd',
      email: 'info@techsol.com',
      contactNumber: '+91 87654 32109',
      address: '456 Tech Tower, Bangalore, Karnataka, 560001',
      type: 'CORPORATE',
    },
  })
  console.log('✅ Customers created')

  // Seed Products
  const product1 = await prisma.product.upsert({
    where: { code: 'P001' },
    update: {},
    create: {
      code: 'P001',
      name: 'Premium Widget A',
      category: 'Electronics',
      hsnCode: '8471',
      unit: 'PCS',
      cost: 1000,
      salesMargin: 50,
      price: 1500,
      gst: 18,
      stock: 150,
    },
  })

  const product2 = await prisma.product.upsert({
    where: { code: 'P002' },
    update: {},
    create: {
      code: 'P002',
      name: 'Standard Component B',
      category: 'Components',
      hsnCode: '8473',
      unit: 'PCS',
      cost: 600,
      salesMargin: 41.67,
      price: 850,
      gst: 18,
      stock: 200,
    },
  })

  const product3 = await prisma.product.upsert({
    where: { code: 'P003' },
    update: {},
    create: {
      code: 'P003',
      name: 'Industrial Part C',
      category: 'Industrial',
      hsnCode: '8481',
      unit: 'KG',
      cost: 1500,
      salesMargin: 46.67,
      price: 2200,
      gst: 18,
      stock: 75,
    },
  })
  console.log('✅ Products created')

  // Seed Invoice 1 (Paid)
  const invoice1 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-001',
      invoiceDate: new Date('2024-12-15'),
      dueDate: new Date('2025-01-15'),
      customerId: customer1.id,
      subtotal: 22500,
      lineDiscounts: 0,
      invoiceDiscount: 0,
      subtotalAfterDiscounts: 22500,
      taxPercentage: 18,
      taxAmount: 4050,
      grandTotal: 26550,
      amountPaid: 26550,
      balance: 0,
      status: 'PAID',
      lineItems: {
        create: [
          {
            productId: product1.id,
            quantity: 15,
            price: 1500,
            lineDiscount: 0,
            gst: 18,
            total: 26550,
          },
        ],
      },
    },
  })

  // Seed Invoice 2 (Partial)
  const invoice2 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-002',
      invoiceDate: new Date('2024-12-20'),
      dueDate: new Date('2025-01-26'),
      customerId: customer2.id,
      subtotal: 17000,
      lineDiscounts: 0,
      invoiceDiscount: 0,
      subtotalAfterDiscounts: 17000,
      taxPercentage: 18,
      taxAmount: 3060,
      grandTotal: 20060,
      amountPaid: 10000,
      balance: 10060,
      status: 'PARTIAL',
      lineItems: {
        create: [
          {
            productId: product2.id,
            quantity: 20,
            price: 850,
            lineDiscount: 0,
            gst: 18,
            total: 20060,
          },
        ],
      },
    },
  })
  console.log('✅ Invoices created')

  // Seed Payment for Invoice 1
  const payment1 = await prisma.payment.create({
    data: {
      paymentNumber: 'PAY-2024-001',
      date: new Date('2024-12-26'),
      customerId: customer1.id,
      amount: 26550,
      paymentMode: 'BANK_TRANSFER',
      reference: 'TXN123456789',
      status: 'COMPLETED',
      paymentInvoices: {
        create: [
          {
            invoiceId: invoice1.id,
            amount: 26550,
          },
        ],
      },
    },
  })

  // Seed Payment for Invoice 2 (Partial)
  const payment2 = await prisma.payment.create({
    data: {
      paymentNumber: 'PAY-2024-002',
      date: new Date('2024-12-27'),
      customerId: customer2.id,
      amount: 10000,
      paymentMode: 'UPI',
      reference: 'UPI987654321',
      status: 'COMPLETED',
      paymentInvoices: {
        create: [
          {
            invoiceId: invoice2.id,
            amount: 10000,
          },
        ],
      },
    },
  })
  console.log('✅ Payments created')

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
