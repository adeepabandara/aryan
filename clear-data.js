const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log('🗑️  Clearing database data...');
  
  // Delete in correct order (due to foreign key constraints)
  await prisma.paymentInvoice.deleteMany();
  console.log('✅ Deleted all payment invoices');
  
  await prisma.payment.deleteMany();
  console.log('✅ Deleted all payments');
  
  await prisma.invoiceLineItem.deleteMany();
  console.log('✅ Deleted all invoice line items');
  
  await prisma.invoice.deleteMany();
  console.log('✅ Deleted all invoices');
  
  await prisma.product.deleteMany();
  console.log('✅ Deleted all products');
  
  await prisma.customer.deleteMany();
  console.log('✅ Deleted all customers');
  
  console.log('✨ Database cleared successfully!');
  console.log('Note: Admin user and company settings were preserved.');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
