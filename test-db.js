const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
})

async function main() {
  const users = await prisma.user.findMany()
  console.log('All users:', JSON.stringify(users, null, 2))
  
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@aryanproducts.com' }
  })
  console.log('\nAdmin user:', JSON.stringify(admin, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
