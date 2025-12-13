import { prisma } from '@/lib/prisma';
import { generateToken, hashPassword, comparePassword, getUserFromContext } from '@/lib/auth';
import { GraphQLError } from 'graphql';

export const resolvers = {
  Activity: {
    imageUrls: (parent: any) => {
      if (!parent.imageUrls) return [];
      try {
        return JSON.parse(parent.imageUrls);
      } catch {
        return [];
      }
    },
  },

  Query: {
    // Auth
    me: async (_: any, __: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });

      return await prisma.user.findUnique({
        where: { id: user.userId },
        include: { children: true },
      });
    },

    // Users
    users: async (_: any, { role }: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user || user.role !== 'ADMIN') {
        throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      }

      return await prisma.user.findMany({
        where: role ? { role } : undefined,
        include: { children: true },
      });
    },

    user: async (_: any, { id }: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });

      return await prisma.user.findUnique({
        where: { id },
        include: { children: true },
      });
    },

    // Students
    students: async (_: any, __: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });

      if (user.role === 'ADMIN') {
        return await prisma.student.findMany({
          include: { parent: true, activities: true, attendanceRecords: true },
        });
      }

      // Parents can only see their own children
      return await prisma.student.findMany({
        where: { parentId: user.userId },
        include: { parent: true, activities: true, attendanceRecords: true },
      });
    },

    student: async (_: any, { id }: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });

      const student = await prisma.student.findUnique({
        where: { id },
        include: { parent: true, activities: true, attendanceRecords: true },
      });

      if (!student) throw new GraphQLError('Student not found');

      // Check authorization
      if (user.role !== 'ADMIN' && student.parentId !== user.userId) {
        throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      }

      return student;
    },

    myChildren: async (_: any, __: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });

      return await prisma.student.findMany({
        where: { parentId: user.userId },
        include: { parent: true, activities: true, attendanceRecords: true },
      });
    },

    // Activities
    activities: async (_: any, { studentId, limit = 50, offset = 0 }: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });

      const where: any = {};

      if (studentId) {
        // Check if user has access to this student
        const student = await prisma.student.findUnique({ where: { id: studentId } });
        if (user.role !== 'ADMIN' && student?.parentId !== user.userId) {
          throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
        }
        where.studentId = studentId;
      } else if (user.role === 'PARENT') {
        // Parents can only see activities for their children
        const children = await prisma.student.findMany({ where: { parentId: user.userId } });
        where.studentId = { in: children.map(c => c.id) };
      }

      return await prisma.activity.findMany({
        where,
        include: { student: true, createdBy: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });
    },

    activity: async (_: any, { id }: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });

      const activity = await prisma.activity.findUnique({
        where: { id },
        include: { student: true, createdBy: true },
      });

      if (!activity) throw new GraphQLError('Activity not found');

      // Check authorization
      if (user.role !== 'ADMIN' && activity.student.parentId !== user.userId) {
        throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      }

      return activity;
    },

    recentActivities: async (_: any, { limit = 10 }: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });

      const where: any = {};

      if (user.role === 'PARENT') {
        const children = await prisma.student.findMany({ where: { parentId: user.userId } });
        where.studentId = { in: children.map(c => c.id) };
      }

      return await prisma.activity.findMany({
        where,
        include: { student: true, createdBy: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    },

    // Attendance
    attendanceRecords: async (_: any, { studentId, date }: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });

      const where: any = {};

      if (studentId) {
        const student = await prisma.student.findUnique({ where: { id: studentId } });
        if (user.role !== 'ADMIN' && student?.parentId !== user.userId) {
          throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
        }
        where.studentId = studentId;
      } else if (user.role === 'PARENT') {
        const children = await prisma.student.findMany({ where: { parentId: user.userId } });
        where.studentId = { in: children.map(c => c.id) };
      }

      if (date) {
        const dateObj = new Date(date);
        where.date = {
          gte: new Date(dateObj.setHours(0, 0, 0, 0)),
          lt: new Date(dateObj.setHours(23, 59, 59, 999)),
        };
      }

      return await prisma.attendanceRecord.findMany({
        where,
        include: { student: true, markedBy: true },
        orderBy: { date: 'desc' },
      });
    },

    attendanceRecord: async (_: any, { id }: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });

      const record = await prisma.attendanceRecord.findUnique({
        where: { id },
        include: { student: true, markedBy: true },
      });

      if (!record) throw new GraphQLError('Attendance record not found');

      if (user.role !== 'ADMIN' && record.student.parentId !== user.userId) {
        throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      }

      return record;
    },

    attendanceStats: async (_: any, { date }: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user || user.role !== 'ADMIN') {
        throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      }

      const dateObj = new Date(date);
      const startOfDay = new Date(dateObj.setHours(0, 0, 0, 0));
      const endOfDay = new Date(dateObj.setHours(23, 59, 59, 999));

      const records = await prisma.attendanceRecord.findMany({
        where: {
          date: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      });

      const totalStudents = await prisma.student.count();
      const presentCount = records.filter(r => r.status === 'PRESENT').length;
      const absentCount = records.filter(r => r.status === 'ABSENT').length;
      const lateCount = records.filter(r => r.status === 'LATE').length;
      const attendanceRate = totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0;

      return {
        totalStudents,
        presentCount,
        absentCount,
        lateCount,
        attendanceRate,
      };
    },

    studentAttendance: async (_: any, { studentId, startDate, endDate }: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });

      const student = await prisma.student.findUnique({ where: { id: studentId } });
      if (user.role !== 'ADMIN' && student?.parentId !== user.userId) {
        throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      }

      const where: any = { studentId };

      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = new Date(startDate);
        if (endDate) where.date.lte = new Date(endDate);
      }

      return await prisma.attendanceRecord.findMany({
        where,
        include: { student: true, markedBy: true },
        orderBy: { date: 'desc' },
      });
    },
  },

  Mutation: {
    // Auth
    register: async (_: any, { input }: any) => {
      const { email, password, name, role, phone, address } = input;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new GraphQLError('Email already in use');
      }

      const hashedPassword = await hashPassword(password);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
          phone,
          address,
        },
        include: { children: true },
      });

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return { token, user };
    },

    login: async (_: any, { input }: any) => {
      const { email, password } = input;

      const user = await prisma.user.findUnique({
        where: { email },
        include: { children: true },
      });

      if (!user) {
        throw new GraphQLError('Invalid credentials');
      }

      const valid = await comparePassword(password, user.password);
      if (!valid) {
        throw new GraphQLError('Invalid credentials');
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return { token, user };
    },

    // Students
    createStudent: async (_: any, { input }: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user || user.role !== 'ADMIN') {
        throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      }

      return await prisma.student.create({
        data: input,
        include: { parent: true, activities: true, attendanceRecords: true },
      });
    },

    updateStudent: async (_: any, { id, ...data }: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user || user.role !== 'ADMIN') {
        throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      }

      return await prisma.student.update({
        where: { id },
        data,
        include: { parent: true, activities: true, attendanceRecords: true },
      });
    },

    deleteStudent: async (_: any, { id }: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user || user.role !== 'ADMIN') {
        throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      }

      await prisma.student.delete({ where: { id } });
      return true;
    },

    // Activities
    createActivity: async (_: any, { input }: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user || user.role !== 'ADMIN') {
        throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      }

      const { imageUrls, ...rest } = input;

      return await prisma.activity.create({
        data: {
          ...rest,
          imageUrls: imageUrls ? JSON.stringify(imageUrls) : '[]',
          createdById: user.userId,
        },
        include: { student: true, createdBy: true },
      });
    },

    updateActivity: async (_: any, { id, description, imageUrls }: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user || user.role !== 'ADMIN') {
        throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      }

      const updateData: any = {};
      if (description !== undefined) updateData.description = description;
      if (imageUrls !== undefined) updateData.imageUrls = JSON.stringify(imageUrls);

      return await prisma.activity.update({
        where: { id },
        data: updateData,
        include: { student: true, createdBy: true },
      });
    },

    deleteActivity: async (_: any, { id }: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user || user.role !== 'ADMIN') {
        throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      }

      await prisma.activity.delete({ where: { id } });
      return true;
    },

    // Attendance
    markAttendance: async (_: any, { input }: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user || user.role !== 'ADMIN') {
        throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      }

      const { studentId, date, status, notes } = input;

      return await prisma.attendanceRecord.upsert({
        where: {
          studentId_date: {
            studentId,
            date: new Date(date),
          },
        },
        update: {
          status,
          notes,
          markedById: user.userId,
        },
        create: {
          studentId,
          date: new Date(date),
          status,
          notes,
          markedById: user.userId,
        },
        include: { student: true, markedBy: true },
      });
    },

    updateAttendance: async (_: any, { input }: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user || user.role !== 'ADMIN') {
        throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      }

      const { id, status, notes } = input;

      return await prisma.attendanceRecord.update({
        where: { id },
        data: { status, notes },
        include: { student: true, markedBy: true },
      });
    },

    markBulkAttendance: async (_: any, { inputs }: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user || user.role !== 'ADMIN') {
        throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      }

      const records = await Promise.all(
        inputs.map((input: any) =>
          prisma.attendanceRecord.upsert({
            where: {
              studentId_date: {
                studentId: input.studentId,
                date: new Date(input.date),
              },
            },
            update: {
              status: input.status,
              notes: input.notes,
              markedById: user.userId,
            },
            create: {
              studentId: input.studentId,
              date: new Date(input.date),
              status: input.status,
              notes: input.notes,
              markedById: user.userId,
            },
            include: { student: true, markedBy: true },
          })
        )
      );

      return records;
    },

    deleteAttendanceRecord: async (_: any, { id }: any, context: any) => {
      const user = getUserFromContext(context);
      if (!user || user.role !== 'ADMIN') {
        throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      }

      await prisma.attendanceRecord.delete({ where: { id } });
      return true;
    },
  },
};
