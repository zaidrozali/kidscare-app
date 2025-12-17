import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const demoTenant = await prisma.tenant.upsert({
    where: { subdomain: 'demo' },
    update: {},
    create: {
      name: 'Demo KidsCare Center',
      subdomain: 'demo',
      plan: 'FREE',
      maxStudents: 20,
      isActive: true,
      settings: JSON.stringify({
        timezone: 'Asia/Kuala_Lumpur',
        currency: 'MYR',
      }),
    },
  });

  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: demoTenant.id,
        email: 'admin@kidscare.com'
      }
    },
    update: {},
    create: {
      email: 'admin@kidscare.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'TENANT_ADMIN',
      tenantId: demoTenant.id,
    },
  });

  const parentPassword = await hashPassword('parent123');
  const parent = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: demoTenant.id,
        email: 'parent1@example.com'
      }
    },
    update: {},
    create: {
      email: 'parent1@example.com',
      name: 'Muhammad Zaid',
      password: parentPassword,
      role: 'PARENT',
      tenantId: demoTenant.id,
    },
  });

  console.log('✅ Seeding completed!');
  console.log('   Admin: admin@kidscare.com / admin123');
  console.log('   Parent: parent1@example.com / parent123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
