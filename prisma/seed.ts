import { PrismaClient, CustomerType, InvoiceStatus, PaymentMode, PaymentStatus } from '@prisma/client'
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

  // Clear existing data (in reverse order of dependencies)
  console.log('🗑️  Clearing existing data...')
  await prisma.paymentInvoice.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.invoiceLineItem.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()
  console.log('✅ Existing data cleared')

  // Seed Company Settings
  const companySettings = await prisma.companySettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Aryan Wooden Pallets Industries',
      address: '123 Industrial Zone, Sector 15',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      phone: '+91 98765 43210',
      email: 'info@aryanpallets.com',
      gstin: '27AABCU9603R1ZX',
      pan: 'AABCU9603R',
      website: 'www.aryanpallets.com',
    },
  })
  console.log('✅ Company settings created')

  // Seed Bank Details
  const bankDetails = await prisma.bankDetails.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      accountName: 'Aryan Wooden Pallets Industries',
      accountNumber: '1234567890123456',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      branch: 'Mumbai Industrial Estate Branch',
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
      startingNumber: 1001,
      terms: 'Payment due within 30 days. Late payments subject to 2% monthly interest.',
      notes: 'Thank you for your business! All wooden pallets are quality checked and certified.',
    },
  })
  console.log('✅ Invoice settings created')

  // Seed Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@aryanproducts.com',
      password: hashedPassword,
    },
  })
  console.log('✅ Admin user created')

  // Seed 10 Customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        code: 'CUST001',
        name: 'BuildRight Construction Ltd',
        email: 'contact@buildright.com',
        contactNumber: '+91 98765 43210',
        address: '123 Industrial Estate, Ambattur, Chennai, Tamil Nadu, 600058',
        type: CustomerType.CORPORATE,
        description: 'Large construction company - Regular buyer of heavy-duty pallets',
      },
    }),
    prisma.customer.create({
      data: {
        code: 'CUST002',
        name: 'Mega Logistics Solutions',
        email: 'orders@megalogistics.com',
        contactNumber: '+91 87654 32109',
        address: '456 Logistics Park, Bhiwandi, Maharashtra, 421302',
        type: CustomerType.CORPORATE,
        description: 'Leading logistics company - Bulk pallet orders for warehousing',
      },
    }),
    prisma.customer.create({
      data: {
        code: 'CUST003',
        name: 'GreenLeaf Exports Pvt Ltd',
        email: 'info@greenleafexports.in',
        contactNumber: '+91 99887 76655',
        address: '789 Export Zone, Cochin, Kerala, 682001',
        type: CustomerType.CORPORATE,
        description: 'Agricultural exports - Export grade wooden pallets',
      },
    }),
    prisma.customer.create({
      data: {
        code: 'CUST004',
        name: 'FastShip eCommerce',
        email: 'vendor@fastship.in',
        contactNumber: '+91 91234 56789',
        address: '321 Tech Park, Whitefield, Bangalore, Karnataka, 560066',
        type: CustomerType.ONLINE,
        description: 'Online marketplace - Light-duty pallets for warehouse',
      },
    }),
    prisma.customer.create({
      data: {
        code: 'CUST005',
        name: 'Industrial Packaging Co',
        email: 'sales@indpack.com',
        contactNumber: '+91 88776 65544',
        address: '654 GIDC Estate, Vapi, Gujarat, 396195',
        type: CustomerType.CORPORATE,
        description: 'Packaging solutions provider - Custom size pallets',
      },
    }),
    prisma.customer.create({
      data: {
        code: 'CUST006',
        name: 'QuickMart Retail Chain',
        email: 'procurement@quickmart.in',
        contactNumber: '+91 77665 54433',
        address: '987 Retail Hub, Gurgaon, Haryana, 122001',
        type: CustomerType.CORPORATE,
        description: 'Nationwide retail chain - Display pallets for stores',
      },
    }),
    prisma.customer.create({
      data: {
        code: 'CUST007',
        name: 'ShopNow Online',
        email: 'suppliers@shopnow.com',
        contactNumber: '+91 98887 77766',
        address: '147 Cyber City, Hyderabad, Telangana, 500081',
        type: CustomerType.ONLINE,
        description: 'E-commerce platform - Standardized warehouse pallets',
      },
    }),
    prisma.customer.create({
      data: {
        code: 'CUST008',
        name: 'Premium Warehousing Ltd',
        email: 'admin@premiumware.in',
        contactNumber: '+91 95554 44333',
        address: '258 Warehouse Complex, Pune, Maharashtra, 411001',
        type: CustomerType.CORPORATE,
        description: 'Cold storage warehousing - Heat-treated pallets',
      },
    }),
    prisma.customer.create({
      data: {
        code: 'CUST009',
        name: 'GlobalTrade Enterprises',
        email: 'export@globaltrade.co.in',
        contactNumber: '+91 94443 33222',
        address: '369 Trade Center, New Delhi, Delhi, 110001',
        type: CustomerType.CORPORATE,
        description: 'International trade - ISPM-15 certified export pallets',
      },
    }),
    prisma.customer.create({
      data: {
        code: 'CUST010',
        name: 'EasyBuy eStore',
        email: 'vendor@easybuy.in',
        contactNumber: '+91 93332 22111',
        address: '741 Digital Hub, Noida, Uttar Pradesh, 201301',
        type: CustomerType.ONLINE,
        description: 'Online shopping platform - Mixed size pallets for fulfillment',
      },
    }),
  ])
  console.log(`✅ Created ${customers.length} customers`)

  // Seed 10 Wooden Pallet Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        code: 'WP-STD-1200',
        name: 'Standard Wooden Pallet 1200x1000mm',
        category: 'Standard Pallets',
        hsnCode: '44151010',
        unit: 'PCS',
        cost: 450,
        salesMargin: 33.33,
        price: 600,
        gst: 18,
        stock: 500,
      },
    }),
    prisma.product.create({
      data: {
        code: 'WP-STD-1200-4W',
        name: 'Four-Way Entry Pallet 1200x1000mm',
        category: 'Standard Pallets',
        hsnCode: '44151010',
        unit: 'PCS',
        cost: 520,
        salesMargin: 34.62,
        price: 700,
        gst: 18,
        stock: 350,
      },
    }),
    prisma.product.create({
      data: {
        code: 'WP-HD-1200',
        name: 'Heavy Duty Pallet 1200x1200mm',
        category: 'Heavy Duty Pallets',
        hsnCode: '44151010',
        unit: 'PCS',
        cost: 650,
        salesMargin: 38.46,
        price: 900,
        gst: 18,
        stock: 200,
      },
    }),
    prisma.product.create({
      data: {
        code: 'WP-EURO-1200',
        name: 'Euro Pallet 1200x800mm',
        category: 'Export Grade Pallets',
        hsnCode: '44151010',
        unit: 'PCS',
        cost: 580,
        salesMargin: 37.93,
        price: 800,
        gst: 18,
        stock: 280,
      },
    }),
    prisma.product.create({
      data: {
        code: 'WP-ISPM-1200',
        name: 'ISPM-15 Certified Export Pallet 1200x1000mm',
        category: 'Export Grade Pallets',
        hsnCode: '44151010',
        unit: 'PCS',
        cost: 700,
        salesMargin: 42.86,
        price: 1000,
        gst: 18,
        stock: 150,
      },
    }),
    prisma.product.create({
      data: {
        code: 'WP-LIGHT-1000',
        name: 'Light Duty Pallet 1000x1000mm',
        category: 'Light Duty Pallets',
        hsnCode: '44151010',
        unit: 'PCS',
        cost: 350,
        salesMargin: 42.86,
        price: 500,
        gst: 18,
        stock: 600,
      },
    }),
    prisma.product.create({
      data: {
        code: 'WP-DISPLAY-800',
        name: 'Display Pallet 800x600mm',
        category: 'Display Pallets',
        hsnCode: '44151010',
        unit: 'PCS',
        cost: 280,
        salesMargin: 42.86,
        price: 400,
        gst: 18,
        stock: 400,
      },
    }),
    prisma.product.create({
      data: {
        code: 'WP-CUSTOM-1400',
        name: 'Custom Size Pallet 1400x1200mm',
        category: 'Custom Pallets',
        hsnCode: '44151010',
        unit: 'PCS',
        cost: 800,
        salesMargin: 50,
        price: 1200,
        gst: 18,
        stock: 100,
      },
    }),
    prisma.product.create({
      data: {
        code: 'WP-2WAY-1200',
        name: 'Two-Way Entry Pallet 1200x1000mm',
        category: 'Standard Pallets',
        hsnCode: '44151010',
        unit: 'PCS',
        cost: 400,
        salesMargin: 37.5,
        price: 550,
        gst: 18,
        stock: 450,
      },
    }),
    prisma.product.create({
      data: {
        code: 'WP-HEAT-1200',
        name: 'Heat Treated Pallet 1200x1000mm',
        category: 'Export Grade Pallets',
        hsnCode: '44151010',
        unit: 'PCS',
        cost: 620,
        salesMargin: 45.16,
        price: 900,
        gst: 18,
        stock: 250,
      },
    }),
  ])
  console.log(`✅ Created ${products.length} wooden pallet products`)

  // Seed 10 Invoices with varying statuses
  const invoices = []
  
  // Invoice 1 - PAID
  const invoice1 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-1001',
      invoiceDate: new Date('2024-11-15'),
      dueDate: new Date('2024-12-15'),
      customerId: customers[0].id,
      subtotal: 30000,
      lineDiscounts: 0,
      invoiceDiscount: 1500,
      subtotalAfterDiscounts: 28500,
      taxPercentage: 18,
      taxAmount: 5130,
      grandTotal: 33630,
      amountPaid: 33630,
      balance: 0,
      status: InvoiceStatus.PAID,
      lineItems: {
        create: [
          {
            productId: products[0].id,
            quantity: 50,
            price: 600,
            lineDiscount: 0,
            gst: 18,
            total: 30000,
          },
        ],
      },
    },
  })
  invoices.push(invoice1)

  // Invoice 2 - PARTIAL
  const invoice2 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-1002',
      invoiceDate: new Date('2024-11-20'),
      dueDate: new Date('2024-12-20'),
      customerId: customers[1].id,
      subtotal: 63000,
      lineDiscounts: 1260,
      invoiceDiscount: 0,
      subtotalAfterDiscounts: 61740,
      taxPercentage: 18,
      taxAmount: 11113.2,
      grandTotal: 72853.2,
      amountPaid: 40000,
      balance: 32853.2,
      status: InvoiceStatus.PARTIAL,
      lineItems: {
        create: [
          {
            productId: products[2].id,
            quantity: 70,
            price: 900,
            lineDiscount: 1260,
            gst: 18,
            total: 61740,
          },
        ],
      },
    },
  })
  invoices.push(invoice2)

  // Invoice 3 - PENDING
  const invoice3 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-1003',
      invoiceDate: new Date('2024-12-01'),
      dueDate: new Date('2024-12-31'),
      customerId: customers[2].id,
      subtotal: 80000,
      lineDiscounts: 0,
      invoiceDiscount: 4000,
      subtotalAfterDiscounts: 76000,
      taxPercentage: 18,
      taxAmount: 13680,
      grandTotal: 89680,
      amountPaid: 0,
      balance: 89680,
      status: InvoiceStatus.PENDING,
      lineItems: {
        create: [
          {
            productId: products[4].id,
            quantity: 80,
            price: 1000,
            lineDiscount: 0,
            gst: 18,
            total: 80000,
          },
        ],
      },
    },
  })
  invoices.push(invoice3)

  // Invoice 4 - PAID
  const invoice4 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-1004',
      invoiceDate: new Date('2024-11-10'),
      dueDate: new Date('2024-12-10'),
      customerId: customers[3].id,
      subtotal: 40000,
      lineDiscounts: 800,
      invoiceDiscount: 0,
      subtotalAfterDiscounts: 39200,
      taxPercentage: 18,
      taxAmount: 7056,
      grandTotal: 46256,
      amountPaid: 46256,
      balance: 0,
      status: InvoiceStatus.PAID,
      lineItems: {
        create: [
          {
            productId: products[5].id,
            quantity: 80,
            price: 500,
            lineDiscount: 800,
            gst: 18,
            total: 39200,
          },
        ],
      },
    },
  })
  invoices.push(invoice4)

  // Invoice 5 - OVERDUE
  const invoice5 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-1005',
      invoiceDate: new Date('2024-10-15'),
      dueDate: new Date('2024-11-15'),
      customerId: customers[4].id,
      subtotal: 96000,
      lineDiscounts: 0,
      invoiceDiscount: 0,
      subtotalAfterDiscounts: 96000,
      taxPercentage: 18,
      taxAmount: 17280,
      grandTotal: 113280,
      amountPaid: 0,
      balance: 113280,
      status: InvoiceStatus.OVERDUE,
      lineItems: {
        create: [
          {
            productId: products[7].id,
            quantity: 80,
            price: 1200,
            lineDiscount: 0,
            gst: 18,
            total: 96000,
          },
        ],
      },
    },
  })
  invoices.push(invoice5)

  // Invoice 6 - PARTIAL
  const invoice6 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-1006',
      invoiceDate: new Date('2024-11-25'),
      dueDate: new Date('2024-12-25'),
      customerId: customers[5].id,
      subtotal: 32000,
      lineDiscounts: 640,
      invoiceDiscount: 0,
      subtotalAfterDiscounts: 31360,
      taxPercentage: 18,
      taxAmount: 5644.8,
      grandTotal: 37004.8,
      amountPaid: 20000,
      balance: 17004.8,
      status: InvoiceStatus.PARTIAL,
      lineItems: {
        create: [
          {
            productId: products[6].id,
            quantity: 80,
            price: 400,
            lineDiscount: 640,
            gst: 18,
            total: 31360,
          },
        ],
      },
    },
  })
  invoices.push(invoice6)

  // Invoice 7 - PENDING
  const invoice7 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-1007',
      invoiceDate: new Date('2024-12-05'),
      dueDate: new Date('2025-01-05'),
      customerId: customers[6].id,
      subtotal: 56000,
      lineDiscounts: 0,
      invoiceDiscount: 2800,
      subtotalAfterDiscounts: 53200,
      taxPercentage: 18,
      taxAmount: 9576,
      grandTotal: 62776,
      amountPaid: 0,
      balance: 62776,
      status: InvoiceStatus.PENDING,
      lineItems: {
        create: [
          {
            productId: products[3].id,
            quantity: 70,
            price: 800,
            lineDiscount: 0,
            gst: 18,
            total: 56000,
          },
        ],
      },
    },
  })
  invoices.push(invoice7)

  // Invoice 8 - PAID
  const invoice8 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-1008',
      invoiceDate: new Date('2024-11-05'),
      dueDate: new Date('2024-12-05'),
      customerId: customers[7].id,
      subtotal: 72000,
      lineDiscounts: 0,
      invoiceDiscount: 0,
      subtotalAfterDiscounts: 72000,
      taxPercentage: 18,
      taxAmount: 12960,
      grandTotal: 84960,
      amountPaid: 84960,
      balance: 0,
      status: InvoiceStatus.PAID,
      lineItems: {
        create: [
          {
            productId: products[9].id,
            quantity: 80,
            price: 900,
            lineDiscount: 0,
            gst: 18,
            total: 72000,
          },
        ],
      },
    },
  })
  invoices.push(invoice8)

  // Invoice 9 - OVERDUE
  const invoice9 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-1009',
      invoiceDate: new Date('2024-10-20'),
      dueDate: new Date('2024-11-20'),
      customerId: customers[8].id,
      subtotal: 44000,
      lineDiscounts: 880,
      invoiceDiscount: 0,
      subtotalAfterDiscounts: 43120,
      taxPercentage: 18,
      taxAmount: 7761.6,
      grandTotal: 50881.6,
      amountPaid: 0,
      balance: 50881.6,
      status: InvoiceStatus.OVERDUE,
      lineItems: {
        create: [
          {
            productId: products[8].id,
            quantity: 80,
            price: 550,
            lineDiscount: 880,
            gst: 18,
            total: 43120,
          },
        ],
      },
    },
  })
  invoices.push(invoice9)

  // Invoice 10 - PENDING
  const invoice10 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-1010',
      invoiceDate: new Date('2024-12-10'),
      dueDate: new Date('2025-01-10'),
      customerId: customers[9].id,
      subtotal: 56000,
      lineDiscounts: 0,
      invoiceDiscount: 0,
      subtotalAfterDiscounts: 56000,
      taxPercentage: 18,
      taxAmount: 10080,
      grandTotal: 66080,
      amountPaid: 0,
      balance: 66080,
      status: InvoiceStatus.PENDING,
      lineItems: {
        create: [
          {
            productId: products[1].id,
            quantity: 80,
            price: 700,
            lineDiscount: 0,
            gst: 18,
            total: 56000,
          },
        ],
      },
    },
  })
  invoices.push(invoice10)

  console.log(`✅ Created ${invoices.length} invoices`)

  // Seed 10 Payments
  const payments = []

  // Payment 1 - Full payment for Invoice 1
  const payment1 = await prisma.payment.create({
    data: {
      paymentNumber: 'PAY-2024-001',
      date: new Date('2024-11-20'),
      customerId: customers[0].id,
      amount: 33630,
      paymentMode: PaymentMode.BANK_TRANSFER,
      reference: 'NEFT/123456789',
      status: PaymentStatus.COMPLETED,
      paymentInvoices: {
        create: [
          {
            invoiceId: invoices[0].id,
            amount: 33630,
          },
        ],
      },
    },
  })
  payments.push(payment1)

  // Payment 2 - Partial payment for Invoice 2
  const payment2 = await prisma.payment.create({
    data: {
      paymentNumber: 'PAY-2024-002',
      date: new Date('2024-11-25'),
      customerId: customers[1].id,
      amount: 40000,
      paymentMode: PaymentMode.CHEQUE,
      reference: 'CHQ-987654',
      status: PaymentStatus.COMPLETED,
      paymentInvoices: {
        create: [
          {
            invoiceId: invoices[1].id,
            amount: 40000,
          },
        ],
      },
    },
  })
  payments.push(payment2)

  // Payment 3 - Full payment for Invoice 4
  const payment3 = await prisma.payment.create({
    data: {
      paymentNumber: 'PAY-2024-003',
      date: new Date('2024-11-15'),
      customerId: customers[3].id,
      amount: 46256,
      paymentMode: PaymentMode.UPI,
      reference: 'UPI/456123789',
      status: PaymentStatus.COMPLETED,
      paymentInvoices: {
        create: [
          {
            invoiceId: invoices[3].id,
            amount: 46256,
          },
        ],
      },
    },
  })
  payments.push(payment3)

  // Payment 4 - Partial payment for Invoice 6
  const payment4 = await prisma.payment.create({
    data: {
      paymentNumber: 'PAY-2024-004',
      date: new Date('2024-12-01'),
      customerId: customers[5].id,
      amount: 20000,
      paymentMode: PaymentMode.CASH,
      reference: 'CASH-001',
      status: PaymentStatus.COMPLETED,
      paymentInvoices: {
        create: [
          {
            invoiceId: invoices[5].id,
            amount: 20000,
          },
        ],
      },
    },
  })
  payments.push(payment4)

  // Payment 5 - Full payment for Invoice 8
  const payment5 = await prisma.payment.create({
    data: {
      paymentNumber: 'PAY-2024-005',
      date: new Date('2024-11-10'),
      customerId: customers[7].id,
      amount: 84960,
      paymentMode: PaymentMode.BANK_TRANSFER,
      reference: 'RTGS/789456123',
      status: PaymentStatus.COMPLETED,
      paymentInvoices: {
        create: [
          {
            invoiceId: invoices[7].id,
            amount: 84960,
          },
        ],
      },
    },
  })
  payments.push(payment5)

  // Payment 6 - Advance payment
  const payment6 = await prisma.payment.create({
    data: {
      paymentNumber: 'PAY-2024-006',
      date: new Date('2024-12-12'),
      customerId: customers[2].id,
      amount: 50000,
      paymentMode: PaymentMode.BANK_TRANSFER,
      reference: 'NEFT/321654987',
      status: PaymentStatus.COMPLETED,
      paymentInvoices: {
        create: [],
      },
    },
  })
  payments.push(payment6)

  // Payment 7 - Pending payment
  const payment7 = await prisma.payment.create({
    data: {
      paymentNumber: 'PAY-2024-007',
      date: new Date('2024-12-15'),
      customerId: customers[4].id,
      amount: 50000,
      paymentMode: PaymentMode.CHEQUE,
      reference: 'CHQ-456789',
      status: PaymentStatus.PENDING,
      paymentInvoices: {
        create: [],
      },
    },
  })
  payments.push(payment7)

  // Payment 8
  const payment8 = await prisma.payment.create({
    data: {
      paymentNumber: 'PAY-2024-008',
      date: new Date('2024-12-18'),
      customerId: customers[6].id,
      amount: 30000,
      paymentMode: PaymentMode.UPI,
      reference: 'UPI/789123456',
      status: PaymentStatus.COMPLETED,
      paymentInvoices: {
        create: [],
      },
    },
  })
  payments.push(payment8)

  // Payment 9
  const payment9 = await prisma.payment.create({
    data: {
      paymentNumber: 'PAY-2024-009',
      date: new Date('2024-12-20'),
      customerId: customers[9].id,
      amount: 25000,
      paymentMode: PaymentMode.BANK_TRANSFER,
      reference: 'IMPS/147258369',
      status: PaymentStatus.COMPLETED,
      paymentInvoices: {
        create: [],
      },
    },
  })
  payments.push(payment9)

  // Payment 10
  const payment10 = await prisma.payment.create({
    data: {
      paymentNumber: 'PAY-2024-010',
      date: new Date('2024-12-22'),
      customerId: customers[1].id,
      amount: 35000,
      paymentMode: PaymentMode.CASH,
      reference: 'CASH-002',
      status: PaymentStatus.COMPLETED,
      paymentInvoices: {
        create: [],
      },
    },
  })
  payments.push(payment10)

  console.log(`✅ Created ${payments.length} payments`)

  console.log('\n🎉 Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`   - 1 Admin User`)
  console.log(`   - ${customers.length} Customers (${customers.filter(c => c.type === 'CORPORATE').length} Corporate, ${customers.filter(c => c.type === 'ONLINE').length} Online)`)
  console.log(`   - ${products.length} Wooden Pallet Products`)
  console.log(`   - ${invoices.length} Invoices (PAID: ${invoices.filter(i => i.status === 'PAID').length}, PARTIAL: ${invoices.filter(i => i.status === 'PARTIAL').length}, PENDING: ${invoices.filter(i => i.status === 'PENDING').length}, OVERDUE: ${invoices.filter(i => i.status === 'OVERDUE').length})`)
  console.log(`   - ${payments.length} Payments`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
