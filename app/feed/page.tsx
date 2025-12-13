import { ArrowLeftRight, Utensils, LogIn, LogOut, Image as ImageIcon } from "lucide-react";

export default function Feed() {
  return (
    <div className="bg-gray-50 min-h-full pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-indigo-500 text-white p-4 lg:p-6 pt-8 sticky top-0 z-10 shadow-md">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-center w-full">
             <h2 className="text-sm lg:text-lg font-medium opacity-90">ERYNA BINTI MUHAMMAD ZAID</h2>
          </div>
          <ArrowLeftRight size={20} className="absolute right-4 lg:right-8" />
        </div>
      </div>

      <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">

        {/* Card: Lunch */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4 mb-3">
            <div className="bg-green-500 p-2 lg:p-3 rounded-xl text-white">
              <Utensils size={24} className="lg:w-7 lg:h-7" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 lg:text-lg">Lunch - All</h3>
              <p className="text-xs lg:text-sm text-gray-400">26 Sep 2025 11:00 AM</p>
              <p className="text-sm lg:text-base text-gray-600 mt-1">Nasi ayam</p>
            </div>
          </div>
          {/* Mock Image for Lunch */}
          <div className="w-full h-48 lg:h-64 bg-gray-200 rounded-xl overflow-hidden mt-2 relative">
             <div className="absolute inset-0 flex items-center justify-center text-gray-400 lg:text-lg">
               [Food Image Placeholder]
             </div>
          </div>
        </div>

        {/* Card: Photo Gallery */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
           <div className="flex items-start gap-4 mb-3">
            <div className="bg-purple-500 p-2 lg:p-3 rounded-xl text-white">
              <ImageIcon size={24} className="lg:w-7 lg:h-7" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 lg:text-lg">Photo</h3>
              <p className="text-xs lg:text-sm text-gray-400">26 Sep 2025 10:00 AM</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 lg:gap-4 mt-2">
            <div className="h-32 lg:h-48 bg-gray-200 rounded-lg"></div>
            <div className="h-32 lg:h-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

         {/* Card: Clock In */}
         <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500 p-2 lg:p-3 rounded-xl text-white">
              <LogIn size={24} className="lg:w-7 lg:h-7" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 lg:text-lg">Clock In - JUNIOR</h3>
              <p className="text-xs lg:text-sm text-gray-400">26 Sep 2025 07:37 AM</p>
              <p className="text-xs lg:text-sm text-gray-400 mt-1">By MUHAMMAD ZAID</p>
            </div>
          </div>
        </div>

        {/* Card: Clock Out */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500 p-2 lg:p-3 rounded-xl text-white">
              <LogOut size={24} className="lg:w-7 lg:h-7" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 lg:text-lg">Clock Out - JUNIOR</h3>
              <p className="text-xs lg:text-sm text-gray-400">25 Sep 2025 05:47 PM</p>
              <p className="text-xs lg:text-sm text-gray-400 mt-1">By MUHAMMAD ZAID</p>
            </div>
          </div>
        </div>

      </div>
       <div className="text-center text-xs lg:text-sm text-gray-400 py-4 lg:py-6">Click to load more</div>
    </div>
  );
}
