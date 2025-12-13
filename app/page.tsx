import {
  Clock, CheckSquare,
  Stethoscope, NotebookPen, FileText, CalendarCheck,
  CalendarDays, FileStack, Bell, Image as ImageIcon
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 text-white p-6 pb-16 lg:pb-20 rounded-b-[2.5rem] lg:rounded-b-[3rem] relative shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-14 h-14 lg:w-20 lg:h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden">
                {/* Logo - Stylized Kids Icon */}
                <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                  {/* Head */}
                  <div className="absolute top-3 lg:top-4">
                    <div className="w-4 h-4 lg:w-6 lg:h-6 bg-yellow-300 rounded-full border-2 border-white"></div>
                  </div>
                  {/* Body/Heart shape */}
                  <div className="absolute bottom-2 lg:bottom-3">
                    <svg className="w-6 h-6 lg:w-9 lg:h-9 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  {/* Arms */}
                  <div className="absolute left-1 lg:left-2 top-1/2 w-2 h-1 lg:w-3 lg:h-1.5 bg-yellow-300 rounded-full transform -rotate-45"></div>
                  <div className="absolute right-1 lg:right-2 top-1/2 w-2 h-1 lg:w-3 lg:h-1.5 bg-yellow-300 rounded-full transform rotate-45"></div>
                </div>
              </div>
              <div>
                <p className="text-xs lg:text-sm opacity-90 font-medium mb-1">Welcome to</p>
                <h1 className="font-bold text-2xl lg:text-4xl leading-tight tracking-tight">KidsCare</h1>
                <p className="text-xs lg:text-sm opacity-80 mt-0.5">Nurturing Tomorrow's Leaders</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs lg:text-sm font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:px-8 space-y-6 max-w-7xl mx-auto pt-6">
        {/* Warning Banner */}
        <div className="bg-gray-100 rounded-xl p-4 lg:p-6 flex justify-between items-center gap-4">
          <p className="text-xs lg:text-sm text-gray-600 flex-1">
            Your profile is incomplete. Please update it now to receive e-Invoices.
          </p>
          <button className="bg-yellow-400 text-xs lg:text-sm font-bold px-4 py-2 rounded-full whitespace-nowrap">
            Update
          </button>
        </div>

        {/* My Actions Grid */}
        <div>
          <h3 className="font-bold text-gray-800 mb-4 lg:text-xl">My Actions</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 text-center">
            <ActionButton icon={<Clock />} color="bg-red-100 text-red-500" label="Absence Request" />
            <ActionButton icon={<CheckSquare />} color="bg-purple-100 text-purple-500" label="Task" />
            <ActionButton icon={<Stethoscope />} color="bg-yellow-100 text-yellow-500" label="Care" />
            <ActionButton icon={<NotebookPen />} color="bg-orange-100 text-orange-500" label="Daily Notes" />
            <ActionButton icon={<FileText />} color="bg-green-100 text-green-500" label="Forms" />
            <ActionButton icon={<CalendarCheck />} color="bg-blue-100 text-blue-500" label="Booking" />
          </div>
        </div>

        {/* Others Grid */}
        <div>
          <h3 className="font-bold text-gray-800 mb-4 lg:text-xl">Others</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 text-center">
            <ActionButton icon={<Clock />} color="bg-red-100 text-red-500" label="Attendance" />
            <ActionButton icon={<CalendarDays />} color="bg-purple-100 text-purple-500" label="Calendar" />
            <ActionButton icon={<FileStack />} color="bg-cyan-100 text-cyan-500" label="Documents" />
            <ActionButton icon={<FileText />} color="bg-teal-100 text-teal-500" label="Report" />
            <ActionButton icon={<Bell />} color="bg-indigo-100 text-indigo-500" label="Notifications" />
            <ActionButton icon={<ImageIcon />} color="bg-yellow-100 text-yellow-500" label="Portfolio" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Component for Grid Items
function ActionButton({ icon, color, label }: { icon: any, color: string, label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-sm`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium leading-tight text-gray-600">{label}</span>
    </div>
  );
}
