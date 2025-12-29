const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

// Use DATABASE_URL by default (pooled connection for Vercel)
const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Adding admin user...')

  // Hash the password
  const hashedPassword = await bcrypt.hash('admin123', 10)

  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aryanproducts.com' },
    update: {
      password: hashedPassword,
      name: 'Admin User',
    },
    create: {
      email: 'admin@aryanproducts.com',
      password: hashedPassword,
      name: 'Admin User',
    },
  })

  console.log('✅ Admin user created successfully!')
  console.log('📧 Email:', admin.email)
  console.log('🔑 Password: admin123')
  console.log('\nYou can now login at http://localhost:3000/login')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message)
    console.log('\n💡 Tip: Make sure your .env file has the correct database credentials')
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
