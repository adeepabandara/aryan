const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

// For production, use the pooled DATABASE_URL from Vercel environment
const databaseUrl = process.argv[2] || process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL is required')
  console.log('\nUsage:')
  console.log('  node add-admin-user-production.js "YOUR_DATABASE_URL"')
  console.log('\nOr set DATABASE_URL environment variable')
  process.exit(1)
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
})

async function main() {
  console.log('🔧 Adding admin user to production database...')

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

  console.log('✅ Admin user created successfully in production!')
  console.log('📧 Email:', admin.email)
  console.log('🔑 Password: admin123')
  console.log('\nYou can now login at your Vercel URL')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
