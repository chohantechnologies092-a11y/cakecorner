const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@cakeshop.com';
  const password = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Super Admin',
      password,
      role: 'SUPER_ADMIN',
    },
  });

  console.log('Super Admin user created: ', admin.email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
