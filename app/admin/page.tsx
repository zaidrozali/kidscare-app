"use client";

import {
  Upload, Image as ImageIcon, Utensils, Camera,
  Clock, Baby, LogIn, LogOut, ShieldAlert,
  LayoutDashboard, ClipboardCheck, Users, TrendingUp,
  CheckCircle, XCircle, AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

type TabType = "dashboard" | "attendance" | "upload";

export default function AdminPage() {
  const { isAdmin } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [activityType, setActivityType] = useState("meal");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [clockTime, setClockTime] = useState("");
  const [mealTime, setMealTime] = useState("breakfast");

  // Attendance states
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [students] = useState([
    { id: 1, name: "Eryna Binti Muhammad Zaid", class: "Junior", status: "present" },
    { id: 2, name: "Ahmad Bin Abdullah", class: "Junior", status: "present" },
    { id: 3, name: "Sarah Binti Ibrahim", class: "Senior", status: "absent" },
    { id: 4, name: "Ali Bin Hassan", class: "Junior", status: "present" },
    { id: 5, name: "Fatimah Binti Yusof", class: "Senior", status: "late" },
    { id: 6, name: "Hafiz Bin Kamal", class: "Junior", status: "present" },
  ]);

  const [attendanceRecords, setAttendanceRecords] = useState(
    students.reduce((acc, student) => ({
      ...acc,
      [student.id]: student.status
    }), {} as Record<number, string>)
  );

  // Protect admin page - redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
    }
  }, [isAdmin, router]);

  // Show access denied message while redirecting
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            This page is only accessible to administrators.
          </p>
          <p className="text-sm text-gray-500">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      activityType,
      selectedStudent,
      description,
      uploadedFiles
    });
    alert("Activity uploaded successfully!");
    setActivityType("photo");
    setSelectedStudent("");
    setDescription("");
    setUploadedFiles([]);
  };

  const handleAttendanceChange = (studentId: number, status: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = () => {
    console.log("Saving attendance:", attendanceRecords);
    alert("Attendance saved successfully!");
  };

  // Calculate stats
  const totalStudents = students.length;
  const presentCount = Object.values(attendanceRecords).filter(s => s === "present").length;
  const absentCount = Object.values(attendanceRecords).filter(s => s === "absent").length;
  const lateCount = Object.values(attendanceRecords).filter(s => s === "late").length;
  const attendanceRate = Math.round((presentCount / totalStudents) * 100);

  return (
    <div className="bg-gray-50 min-h-full pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-4 lg:p-6 pt-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl lg:text-3xl font-bold">Admin Dashboard</h1>
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

      <div className="p-4 lg:p-8 max-w-7xl mx-auto">

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">

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
                    <p className="text-xs lg:text-sm text-gray-500">Present Today</p>
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
                    <p className="text-xs lg:text-sm text-gray-500">Absent Today</p>
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

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
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

                <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                  <Baby className="w-8 h-8 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Manage Students</span>
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
                    {students.map((student) => (
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
                                attendanceRecords[student.id] === "present"
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(student.id, "absent")}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                attendanceRecords[student.id] === "absent"
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(student.id, "late")}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                attendanceRecords[student.id] === "late"
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
                  Save Attendance
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

              {/* Student Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Choose a student...</option>
                  {students.map(student => (
                    <option key={student.id} value={student.name}>{student.name}</option>
                  ))}
                </select>
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
    </div>
  );
}
