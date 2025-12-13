import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kidscare.com' },
    update: {},
    create: {
      email: 'admin@kidscare.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+60123456789',
      address: 'KidsCare Center, Kuala Lumpur',
    },
  });

  console.log('✓ Created admin user:', admin.email);

  // Create parent users
  const parent1 = await prisma.user.upsert({
    where: { email: 'parent1@example.com' },
    update: {},
    create: {
      email: 'parent1@example.com',
      name: 'Sarah Ahmad',
      password: hashedPassword,
      role: 'PARENT',
      phone: '+60121234567',
      address: 'Petaling Jaya, Selangor',
    },
  });

  const parent2 = await prisma.user.upsert({
    where: { email: 'parent2@example.com' },
    update: {},
    create: {
      email: 'parent2@example.com',
      name: 'Muhammad Zaid',
      password: hashedPassword,
      role: 'PARENT',
      phone: '+60129876543',
      address: 'Shah Alam, Selangor',
    },
  });

  console.log('✓ Created parent users');

  // Create students
  const students = [
    {
      name: 'Eryna Binti Muhammad Zaid',
      class: 'Junior',
      dateOfBirth: new Date('2020-03-15'),
      parentId: parent2.id,
    },
    {
      name: 'Aiman Bin Ahmad',
      class: 'Junior',
      dateOfBirth: new Date('2020-05-20'),
      parentId: parent1.id,
    },
    {
      name: 'Sofia Binti Hassan',
      class: 'Senior',
      dateOfBirth: new Date('2019-08-10'),
      parentId: parent1.id,
    },
    {
      name: 'Arif Bin Rahman',
      class: 'Toddler',
      dateOfBirth: new Date('2021-11-25'),
      parentId: parent2.id,
    },
    {
      name: 'Aisyah Binti Ali',
      class: 'Senior',
      dateOfBirth: new Date('2019-02-14'),
      parentId: parent1.id,
    },
    {
      name: 'Haris Bin Ismail',
      class: 'Junior',
      dateOfBirth: new Date('2020-07-30'),
      parentId: parent2.id,
    },
  ];

  const createdStudents = [];
  for (const student of students) {
    const created = await prisma.student.upsert({
      where: { id: `student-${student.name}` },
      update: {},
      create: student,
    });
    createdStudents.push(created);
  }

  console.log(`✓ Created ${createdStudents.length} students`);

  // Create activities
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const activities = [
    {
      type: 'MEAL',
      description: 'Nasi ayam with vegetables',
      imageUrls: JSON.stringify(['https://example.com/meal1.jpg']),
      studentId: createdStudents[0].id,
      createdById: admin.id,
      createdAt: today,
    },
    {
      type: 'ACTIVITY',
      description: 'Arts and crafts session',
      imageUrls: JSON.stringify(['https://example.com/craft1.jpg', 'https://example.com/craft2.jpg']),
      studentId: createdStudents[1].id,
      createdById: admin.id,
      createdAt: today,
    },
    {
      type: 'CLOCK_IN',
      description: 'Arrived at 8:00 AM',
      imageUrls: JSON.stringify([]),
      studentId: createdStudents[0].id,
      createdById: admin.id,
      createdAt: new Date(today.setHours(8, 0, 0)),
    },
    {
      type: 'ACTIVITY',
      description: 'Outdoor playground time',
      imageUrls: JSON.stringify(['https://example.com/playground.jpg']),
      studentId: createdStudents[2].id,
      createdById: admin.id,
      createdAt: yesterday,
    },
    {
      type: 'MEAL',
      description: 'Breakfast - Cereal and milk',
      imageUrls: JSON.stringify([]),
      studentId: createdStudents[1].id,
      createdById: admin.id,
      createdAt: yesterday,
    },
  ];

  for (const activity of activities) {
    await prisma.activity.create({
      data: activity,
    });
  }

  console.log(`✓ Created ${activities.length} activities`);

  // Create attendance records
  const attendanceRecords = [
    {
      studentId: createdStudents[0].id,
      date: today,
      status: 'PRESENT',
      notes: 'On time',
      markedById: admin.id,
    },
    {
      studentId: createdStudents[1].id,
      date: today,
      status: 'PRESENT',
      notes: 'On time',
      markedById: admin.id,
    },
    {
      studentId: createdStudents[2].id,
      date: today,
      status: 'LATE',
      notes: 'Arrived 30 minutes late',
      markedById: admin.id,
    },
    {
      studentId: createdStudents[3].id,
      date: today,
      status: 'ABSENT',
      notes: 'Sick leave',
      markedById: admin.id,
    },
    {
      studentId: createdStudents[0].id,
      date: yesterday,
      status: 'PRESENT',
      notes: 'On time',
      markedById: admin.id,
    },
  ];

  for (const record of attendanceRecords) {
    await prisma.attendanceRecord.upsert({
      where: {
        studentId_date: {
          studentId: record.studentId,
          date: record.date,
        },
      },
      update: {},
      create: record,
    });
  }

  console.log(`✓ Created ${attendanceRecords.length} attendance records`);

  console.log('\n🎉 Seeding completed successfully!\n');
  console.log('📝 Login credentials:');
  console.log('   Admin: admin@kidscare.com / admin123');
  console.log('   Parent 1: parent1@example.com / admin123');
  console.log('   Parent 2: parent2@example.com / admin123');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
