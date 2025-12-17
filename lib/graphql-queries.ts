import { gql } from '@apollo/client';

// Authentication
export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        name
        role
      }
    }
  }
`;

// Get all students
export const GET_STUDENTS = gql`
  query GetStudents {
    students {
      id
      name
      class
      dateOfBirth
      parent {
        id
        name
        email
      }
    }
  }
`;

// Get attendance records for a specific date
export const GET_ATTENDANCE_BY_DATE = gql`
  query GetAttendanceByDate($date: String!) {
    attendanceByDate(date: $date) {
      id
      status
      notes
      date
      student {
        id
        name
        class
      }
    }
  }
`;

// Get activities (optionally filtered by date)
export const GET_ACTIVITIES = gql`
  query GetActivities($date: String) {
    activities(date: $date) {
      id
      type
      description
      imageUrls
      createdAt
      student {
        id
        name
        class
      }
      createdBy {
        id
        name
      }
    }
  }
`;

// Mark or update attendance
export const MARK_ATTENDANCE = gql`
  mutation MarkAttendance($input: MarkAttendanceInput!) {
    markAttendance(input: $input) {
      id
      status
      notes
      date
      student {
        id
        name
      }
    }
  }
`;

// Create activity
export const CREATE_ACTIVITY = gql`
  mutation CreateActivity($input: CreateActivityInput!) {
    createActivity(input: $input) {
      id
      type
      description
      imageUrls
      createdAt
      student {
        id
        name
      }
    }
  }
`;

// Create student
export const CREATE_STUDENT = gql`
  mutation CreateStudent($input: CreateStudentInput!) {
    createStudent(input: $input) {
      id
      name
      class
      dateOfBirth
      parent {
        id
        name
        email
      }
    }
  }
`;

// Get all users (for parent selection)
export const GET_USERS = gql`
  query GetUsers($role: UserRole) {
    users(role: $role) {
      id
      name
      email
      role
    }
  }
`;
