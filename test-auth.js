const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function testAuth() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'admin@aryanproducts.com' }
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.email);
    console.log('🔐 Testing password: admin123');
    
    const isValid = await bcrypt.compare('admin123', user.password);
    console.log('✅ Password valid:', isValid);
    
    if (isValid) {
      console.log('✅ Authentication would succeed!');
    } else {
      console.log('❌ Password does not match');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();
