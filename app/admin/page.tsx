"use client";

import {
  Upload, Image as ImageIcon, Utensils, Camera,
  Baby, LogIn, LogOut, ShieldAlert,
  LayoutDashboard, ClipboardCheck, Users, TrendingUp,
  CheckCircle, XCircle, AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_STUDENTS, GET_ATTENDANCE_BY_DATE, MARK_ATTENDANCE, CREATE_ACTIVITY } from "@/lib/graphql-queries";
import AddStudentModal from "@/components/AddStudentModal";
import { useAuth } from "@/hooks/useAuth";

type TabType = "dashboard" | "attendance" | "upload";

export default function AdminPage() {
  const { isAdmin } = useUser();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [activityType, setActivityType] = useState("meal");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [clockTime, setClockTime] = useState("");
  const [mealTime, setMealTime] = useState("breakfast");
  const [mealType, setMealType] = useState("rice");

  // Dashboard states
  const [dashboardDate, setDashboardDate] = useState(new Date().toISOString().split('T')[0]);

  // Attendance states
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, string>>({});

  // GraphQL Queries
  const { data: studentsData, loading: studentsLoading, refetch: refetchStudents } = useQuery(GET_STUDENTS, {
    fetchPolicy: "network-only", // Always fetch fresh data from server
  });
  const { data: attendanceData, loading: attendanceLoading, refetch: refetchAttendance } = useQuery(
    GET_ATTENDANCE_BY_DATE,
    {
      variables: { date: attendanceDate },
      skip: !attendanceDate,
      fetchPolicy: "network-only", // Always fetch fresh data from server
    }
  );

  // Debug logging for students data
  useEffect(() => {
    if (studentsData) {
      const students = (studentsData as any)?.students || [];
      console.log('Students data received:', {
        count: students.length,
        students: students,
        uniqueIds: new Set(students.map((s: any) => s.id)).size,
      });
    }
  }, [studentsData]);

  // GraphQL Mutations
  const [markAttendanceMutation] = useMutation(MARK_ATTENDANCE);
  const [createActivityMutation] = useMutation(CREATE_ACTIVITY);

  const students = studentsData?.students || [];

  // Update attendance records when data loads
  useEffect(() => {
    if (attendanceData?.attendanceByDate && students.length > 0) {
      const records: Record<string, string> = {};
      attendanceData.attendanceByDate.forEach((record: any) => {
        records[record.student.id] = record.status;
      });
      // Set default status for students without records
      students.forEach((student: any) => {
        if (!records[student.id]) {
          records[student.id] = "absent"; // Default to absent
        }
      });
      setAttendanceRecords(records);
    } else if (students.length > 0) {
      // Initialize all students as absent if no records exist
      const records: Record<string, string> = {};
      students.forEach((student: any) => {
        records[student.id] = "absent";
      });
      setAttendanceRecords(records);
    }
  }, [attendanceData, students]);

  // Refetch attendance when date changes
  useEffect(() => {
    refetchAttendance();
  }, [attendanceDate, refetchAttendance]);

  // Protect admin page - redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (!isAdmin) {
        router.push("/");
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show access denied message while redirecting
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            {!isAuthenticated
              ? "Please sign in to access this page."
              : "This page is only accessible to administrators."
            }
          </p>
          <p className="text-sm text-gray-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedStudents.length === 0) {
      alert("Please select at least one student");
      return;
    }

    try {
      // Map activity type to GraphQL enum
      const typeMap: Record<string, string> = {
        "meal": "MEAL",
        "clock-in": "CLOCK_IN",
        "clock-out": "CLOCK_OUT",
        "activity": "ACTIVITY"
      };

      // Create activity for each selected student
      for (const studentId of selectedStudents) {
        const activityInput: any = {
          type: typeMap[activityType],
          studentId: studentId,
        };

        // Add description for meal and activity types
        if (activityType === "meal" || activityType === "activity") {
          let desc = description;
          if (activityType === "meal") {
            desc = `${mealTime.charAt(0).toUpperCase() + mealTime.slice(1)}: ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}${description ? ' - ' + description : ''}`;
          }
          activityInput.description = desc;
        }

        // Add time for clock in/out
        if (activityType === "clock-in" || activityType === "clock-out") {
          activityInput.description = `${activityType === "clock-in" ? "Clocked in" : "Clocked out"} at ${clockTime}`;
        }

        // For now, we'll skip file upload (would need to implement file upload to server)
        activityInput.imageUrls = [];

        await createActivityMutation({
          variables: { input: activityInput }
        });
      }

      alert(`Activity created successfully for ${selectedStudents.length} student(s)!`);
      setSelectedStudents([]);
      setDescription("");
      setUploadedFiles([]);
      setClockTime("");
    } catch (error) {
      console.error("Error creating activity:", error);
      alert("Error creating activity. Please try again.");
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAttendanceChange = async (studentId: string, status: string) => {
    // Update local state immediately for better UX
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));

    // Save to database
    try {
      await markAttendanceMutation({
        variables: {
          input: {
            studentId,
            date: attendanceDate,
            status: status.toUpperCase(),
            notes: ""
          }
        }
      });
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Error saving attendance. Please try again.");
    }
  };

  const handleSaveAttendance = async () => {
    alert("All attendance changes have been saved!");
    refetchAttendance();
  };

  // Calculate stats
  const totalStudents = students.length;
  const presentCount = Object.values(attendanceRecords).filter(s => s === "PRESENT" || s === "present").length;
  const absentCount = Object.values(attendanceRecords).filter(s => s === "ABSENT" || s === "absent").length;
  const lateCount = Object.values(attendanceRecords).filter(s => s === "LATE" || s === "late").length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  if (studentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 text-white p-6 pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm lg:text-base opacity-90 mt-1">Manage activities, attendance, and content</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-4 lg:px-6 py-3 lg:py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === "dashboard"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("attendance")}
              className={`flex items-center gap-2 px-4 lg:px-6 py-3 lg:py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === "attendance"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <ClipboardCheck size={20} />
              <span>Attendance</span>
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex items-center gap-2 px-4 lg:px-6 py-3 lg:py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === "upload"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Upload size={20} />
              <span>Update Activity</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8 max-w-7xl mx-auto -mt-8">

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">

            {/* Date Selector */}
            <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Dashboard Overview</h2>
                  <p className="text-sm text-gray-500">View activities and statistics for selected date</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Date:</label>
                  <input
                    type="date"
                    value={dashboardDate}
                    onChange={(e) => setDashboardDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 lg:p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-800">{totalStudents}</p>
                    <p className="text-xs lg:text-sm text-gray-500">Total Students</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 lg:p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-800">{presentCount}</p>
                    <p className="text-xs lg:text-sm text-gray-500">Present</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 lg:p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <XCircle className="w-6 h-6 lg:w-8 lg:h-8 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-800">{absentCount}</p>
                    <p className="text-xs lg:text-sm text-gray-500">Absent</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 lg:p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-800">{attendanceRate}%</p>
                    <p className="text-xs lg:text-sm text-gray-500">Attendance Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Attendance Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Present Students */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-gray-800">Present ({presentCount})</h3>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {students.filter((s: any) => {
                    const status = attendanceRecords[s.id];
                    return status === "PRESENT" || status === "present";
                  }).length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No students marked present</p>
                  ) : (
                    students.filter((s: any) => {
                      const status = attendanceRecords[s.id];
                      return status === "PRESENT" || status === "present";
                    }).map((student: any) => (
                      <div key={student.id} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-green-700">{student.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-gray-700 block truncate">{student.name}</span>
                          <span className="text-xs text-gray-500">{student.class}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Absent Students */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <h3 className="font-bold text-gray-800">Absent ({absentCount})</h3>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {students.filter((s: any) => {
                    const status = attendanceRecords[s.id];
                    return status === "ABSENT" || status === "absent";
                  }).length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No students marked absent</p>
                  ) : (
                    students.filter((s: any) => {
                      const status = attendanceRecords[s.id];
                      return status === "ABSENT" || status === "absent";
                    }).map((student: any) => (
                      <div key={student.id} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-red-700">{student.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-gray-700 block truncate">{student.name}</span>
                          <span className="text-xs text-gray-500">{student.class}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Late Students */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-bold text-gray-800">Late ({lateCount})</h3>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {students.filter((s: any) => {
                    const status = attendanceRecords[s.id];
                    return status === "LATE" || status === "late";
                  }).length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No students marked late</p>
                  ) : (
                    students.filter((s: any) => {
                      const status = attendanceRecords[s.id];
                      return status === "LATE" || status === "late";
                    }).map((student: any) => (
                      <div key={student.id} className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-yellow-700">{student.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-gray-700 block truncate">{student.name}</span>
                          <span className="text-xs text-gray-500">{student.class}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg lg:text-xl font-bold text-gray-800">Activities</h2>
                <span className="text-sm text-gray-500">
                  {new Date(dashboardDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-purple-500 p-2 rounded-lg">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">Photo Gallery Updated</h3>
                    <p className="text-sm text-gray-500">12 new photos uploaded - 2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <Utensils className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">Lunch Menu Posted</h3>
                    <p className="text-sm text-gray-500">Today's lunch - Nasi Ayam - 3 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <ClipboardCheck className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">Attendance Marked</h3>
                    <p className="text-sm text-gray-500">{presentCount}/{totalStudents} students present - Today 8:00 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab("attendance")}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <ClipboardCheck className="w-8 h-8 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Mark Attendance</span>
                </button>

                <button
                  onClick={() => setActiveTab("upload")}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  <Upload className="w-8 h-8 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Upload Activity</span>
                </button>

                <button
                  onClick={() => setIsAddStudentModalOpen(true)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <Baby className="w-8 h-8 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Add Student</span>
                </button>

                <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
                  <Camera className="w-8 h-8 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">View Gallery</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === "attendance" && (
          <div className="space-y-6">

            {/* Date Selector */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg lg:text-xl font-bold text-gray-800">Attendance Tracker</h2>
                  <p className="text-sm text-gray-500 mt-1">Mark student attendance for today</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Date:</label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Attendance Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Present</span>
                </div>
                <p className="text-2xl font-bold text-green-700">{presentCount}</p>
              </div>

              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-900">Absent</span>
                </div>
                <p className="text-2xl font-bold text-red-700">{absentCount}</p>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900">Late</span>
                </div>
                <p className="text-2xl font-bold text-yellow-700">{lateCount}</p>
              </div>
            </div>

            {/* Student List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Student Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Class</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students.map((student: any) => (
                      <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="font-bold text-indigo-700">{student.name.charAt(0)}</span>
                            </div>
                            <span className="font-medium text-gray-800">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-600">{student.class}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleAttendanceChange(student.id, "present")}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                (attendanceRecords[student.id] === "PRESENT" || attendanceRecords[student.id] === "present")
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(student.id, "absent")}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                (attendanceRecords[student.id] === "ABSENT" || attendanceRecords[student.id] === "absent")
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(student.id, "late")}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                (attendanceRecords[student.id] === "LATE" || attendanceRecords[student.id] === "late")
                                  ? "bg-yellow-500 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              Late
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={handleSaveAttendance}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  Attendance Saved
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Activity Tab */}
        {activeTab === "upload" && (
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Upload className="w-6 h-6" />
              Update Activity
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Activity Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Activity Type
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setActivityType("meal")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      activityType === "meal"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Utensils className="w-6 h-6" />
                    <span className="text-xs font-medium">Meal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivityType("clock-in")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      activityType === "clock-in"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <LogIn className="w-6 h-6" />
                    <span className="text-xs font-medium">Clock In</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivityType("clock-out")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      activityType === "clock-out"
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <LogOut className="w-6 h-6" />
                    <span className="text-xs font-medium">Clock Out</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivityType("activity")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      activityType === "activity"
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Camera className="w-6 h-6" />
                    <span className="text-xs font-medium">Activity</span>
                  </button>
                </div>
              </div>

              {/* Student Selection - Multi-select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Students ({selectedStudents.length} selected)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-3">
                  {students.map((student: any) => (
                    <label
                      key={student.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedStudents.includes(student.id)
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudentSelection(student.id)}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.class}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clock In/Out Time Field */}
              {(activityType === "clock-in" || activityType === "clock-out") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activityType === "clock-in" ? "Clock In Time" : "Clock Out Time"}
                  </label>
                  <input
                    type="time"
                    value={clockTime}
                    onChange={(e) => setClockTime(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Meal Time Selection - Only for Meal */}
              {activityType === "meal" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Meal Time
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setMealTime("breakfast")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          mealTime === "breakfast"
                            ? "border-orange-500 bg-orange-50 text-orange-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Utensils className="w-5 h-5" />
                        <span className="text-sm font-medium">Breakfast</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMealTime("lunch")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          mealTime === "lunch"
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Utensils className="w-5 h-5" />
                        <span className="text-sm font-medium">Lunch</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMealTime("high-tea")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          mealTime === "high-tea"
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Utensils className="w-5 h-5" />
                        <span className="text-sm font-medium">High Tea</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Meal Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setMealType("rice")}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          mealType === "rice"
                            ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        🍚 Rice
                      </button>

                      <button
                        type="button"
                        onClick={() => setMealType("pasta")}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          mealType === "pasta"
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        🍝 Pasta
                      </button>

                      <button
                        type="button"
                        onClick={() => setMealType("bread")}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          mealType === "bread"
                            ? "border-amber-500 bg-amber-50 text-amber-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        🍞 Bread
                      </button>

                      <button
                        type="button"
                        onClick={() => setMealType("noodles")}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          mealType === "noodles"
                            ? "border-orange-500 bg-orange-50 text-orange-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        🍜 Noodles
                      </button>

                      <button
                        type="button"
                        onClick={() => setMealType("snacks")}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          mealType === "snacks"
                            ? "border-pink-500 bg-pink-50 text-pink-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        🍪 Snacks
                      </button>

                      <button
                        type="button"
                        onClick={() => setMealType("fruits")}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          mealType === "fruits"
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        🍎 Fruits
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Description - Only for Meal and Activity */}
              {(activityType === "meal" || activityType === "activity") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description / Notes
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add details about this activity..."
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>
              )}

              {/* File Upload - Only for Meal and Activity */}
              {(activityType === "meal" || activityType === "activity") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Photos (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="w-12 h-12 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Click to upload or drag and drop
                      </span>
                      <span className="text-xs text-gray-400">
                        PNG, JPG up to 10MB
                      </span>
                    </label>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        {uploadedFiles.length} file(s) selected:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="bg-gray-100 p-2 rounded-lg text-xs text-gray-600 truncate">
                            {file.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                {activityType === "clock-in" ? "Save Clock In" : activityType === "clock-out" ? "Save Clock Out" : "Update Activity"}
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
      />
    </div>
  );
}
