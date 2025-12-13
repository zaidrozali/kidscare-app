export const typeDefs = `#graphql
  # Enums
  enum UserRole {
    PARENT
    ADMIN
  }

  enum AttendanceStatus {
    PRESENT
    ABSENT
    LATE
  }

  enum ActivityType {
    MEAL
    CLOCK_IN
    CLOCK_OUT
    ACTIVITY
  }

  # Types
  type User {
    id: ID!
    email: String!
    name: String!
    role: UserRole!
    phone: String
    address: String
    children: [Student!]!
    createdAt: String!
    updatedAt: String!
  }

  type Student {
    id: ID!
    name: String!
    class: String!
    dateOfBirth: String
    parent: User!
    activities: [Activity!]!
    attendanceRecords: [AttendanceRecord!]!
    createdAt: String!
    updatedAt: String!
  }

  type Activity {
    id: ID!
    type: ActivityType!
    description: String
    imageUrls: [String!]!
    student: Student!
    createdBy: User!
    createdAt: String!
    updatedAt: String!
  }

  type AttendanceRecord {
    id: ID!
    date: String!
    status: AttendanceStatus!
    notes: String
    student: Student!
    markedBy: User!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type AttendanceStats {
    totalStudents: Int!
    presentCount: Int!
    absentCount: Int!
    lateCount: Int!
    attendanceRate: Float!
  }

  # Input Types
  input RegisterInput {
    email: String!
    password: String!
    name: String!
    role: UserRole!
    phone: String
    address: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateStudentInput {
    name: String!
    class: String!
    dateOfBirth: String
    parentId: String!
  }

  input CreateActivityInput {
    type: ActivityType!
    description: String
    imageUrls: [String!]
    studentId: String!
  }

  input MarkAttendanceInput {
    studentId: String!
    date: String!
    status: AttendanceStatus!
    notes: String
  }

  input UpdateAttendanceInput {
    id: String!
    status: AttendanceStatus!
    notes: String
  }

  # Queries
  type Query {
    # Auth
    me: User

    # Users
    users(role: UserRole): [User!]!
    user(id: ID!): User

    # Students
    students: [Student!]!
    student(id: ID!): Student
    myChildren: [Student!]!

    # Activities
    activities(studentId: String, limit: Int, offset: Int): [Activity!]!
    activity(id: ID!): Activity
    recentActivities(limit: Int): [Activity!]!

    # Attendance
    attendanceRecords(studentId: String, date: String): [AttendanceRecord!]!
    attendanceRecord(id: ID!): AttendanceRecord
    attendanceStats(date: String!): AttendanceStats!
    studentAttendance(studentId: String!, startDate: String, endDate: String): [AttendanceRecord!]!
  }

  # Mutations
  type Mutation {
    # Auth
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!

    # Students
    createStudent(input: CreateStudentInput!): Student!
    updateStudent(id: ID!, name: String, class: String, dateOfBirth: String): Student!
    deleteStudent(id: ID!): Boolean!

    # Activities
    createActivity(input: CreateActivityInput!): Activity!
    updateActivity(id: ID!, description: String, imageUrls: [String!]): Activity!
    deleteActivity(id: ID!): Boolean!

    # Attendance
    markAttendance(input: MarkAttendanceInput!): AttendanceRecord!
    updateAttendance(input: UpdateAttendanceInput!): AttendanceRecord!
    markBulkAttendance(inputs: [MarkAttendanceInput!]!): [AttendanceRecord!]!
    deleteAttendanceRecord(id: ID!): Boolean!
  }
`;
