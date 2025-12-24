import {
  Clock, CheckSquare,
  Stethoscope, NotebookPen, FileText, CalendarCheck,
  CalendarDays, FileStack, Bell, Image as ImageIcon
} from "lucide-react";
import { ActionButton } from "@/components/ActionButton";

export default function Dashboard() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20 lg:pb-12">
      {/* V2 Header - Clean & Minimal */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-8 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Welcome back to KidsCare
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Session
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-10">
        {/* Alerts Section */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-amber-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-amber-900 font-semibold text-sm">Profile Incomplete</h3>
              <p className="text-amber-800/80 text-sm mt-0.5">Please update your profile information to unlock all features.</p>
            </div>
          </div>
          <button className="text-sm font-medium bg-amber-100 text-amber-900 px-4 py-2 rounded-md hover:bg-amber-200 transition-colors whitespace-nowrap">
            Update Profile
          </button>
        </div>

        {/* My Actions Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg text-slate-900">
              My Actions
            </h3>
          </div>

          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            <ActionButton
              icon={Clock}
              label="Absence Request"
            />
            <ActionButton
              icon={CheckSquare}
              label="Tasks"
            />
            <ActionButton
              icon={Stethoscope}
              label="Care"
            />
            <ActionButton
              icon={NotebookPen}
              label="Daily Notes"
            />
            <ActionButton
              icon={FileText}
              label="Forms"
            />
            <ActionButton
              icon={CalendarCheck}
              label="Booking"
            />
          </div>
        </section>

        {/* Explore Grid */}
        <section>
          <h3 className="font-semibold text-lg text-slate-900 mb-6">
            Explore
          </h3>
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            <ActionButton
              icon={Clock}
              label="Attendance"
            />
            <ActionButton
              icon={CalendarDays}
              label="Calendar"
            />
            <ActionButton
              icon={FileStack}
              label="Documents"
            />
            <ActionButton
              icon={FileText}
              label="Reports"
            />
            <ActionButton
              icon={Bell}
              label="Notifications"
            />
            <ActionButton
              icon={ImageIcon}
              label="Portfolio"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
