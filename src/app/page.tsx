import { auth } from "@/auth";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <main className="flex flex-1 overflow-hidden">
      <aside className="w-96 bg-white border-r border-gray-200 flex flex-col shadow-xl z-20">
        <div className="px-6 pt-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#232D4B]">Your Bookings</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
            <div className="flex">
              <div className="w-1.5 bg-green-500"></div>
              <div className="p-4 flex-1">
                <h3 className="font-semibold text-gray-900">Shannon Library, 302</h3>
                <p className="text-sm text-gray-500 mt-1">Today, 4:00 PM – 6:00 PM</p>
                
                <button className="mt-4 w-full py-2 bg-[#232D4B] text-white text-sm font-medium rounded hover:bg-[#1a2138] transition flex items-center justify-center gap-2">
                  <span>Check In</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition opacity-80 group">
            <div className="flex">
              <div className="w-1.5 bg-[#E57200]"></div>
              <div className="p-4 flex-1">
                <h3 className="font-semibold text-gray-900">Newcomb Hall, 160</h3>
                <p className="text-sm text-gray-500 mt-1">Tomorrow, 10:00 AM</p>
                
                <div className="mt-4 flex gap-4 text-sm font-medium">
                  <button className="text-[#232D4B] hover:underline">Modify</button>
                  <button className="text-red-600 hover:underline">Cancel</button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button className="w-full py-3 px-4 bg-white border border-gray-200 text-[#232D4B] font-medium rounded shadow-sm hover:bg-gray-50 transition flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            Duplicate Last Booking
          </button>
        </div>
      </aside>


      
      <main className="flex-1 relative bg-[#F1F1EF] overflow-hidden">
        
        {/* <!-- FAKE MAP BACKGROUND --> */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: `radial-gradient(#cbd5e1 1.5px, transparent 1.5px)`, backgroundSize: `30px 30px` }}></div>
          {/* <!-- Fake Buildings --> */}
          <div className="absolute top-1/3 left-1/4 w-32 h-24 bg-gray-300 border-b-4 border-r-4 border-gray-400 rotate-12 rounded"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-32 bg-gray-300 border-b-4 border-r-4 border-gray-400 -rotate-6 rounded"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gray-300 border-b-4 border-r-4 border-gray-400 rotate-3 rounded"></div>
        </div>
        
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-30">
            <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 py-2 pl-2 pr-2">
                  
            <button className="flex-1 text-left px-6 py-2 rounded-full hover:bg-gray-100 transition group relative">
              <div className="text-xs font-bold text-gray-800 tracking-wide">When</div>
              <input type="text" placeholder="Add dates" className="w-full bg-transparent p-0 text-sm text-gray-600 placeholder-gray-400 border-none focus:ring-0 cursor-pointer truncate focus=(this.type='date')" />
              
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-[1px] bg-gray-300 group-hover:opacity-0 transition"></div>
            </button>

            <div className="flex-1 relative group">
              <button className="w-full text-left px-6 py-2 rounded-full hover:bg-gray-100 transition">
                <div className="text-xs font-bold text-gray-800 tracking-wide">How Many</div>
                <select className="w-full bg-transparent p-0 text-sm text-gray-600 border-none focus:ring-0 cursor-pointer appearance-none -ml-1" defaultValue={""}>
                  <option value="" disabled>Add guests</option>
                  <option value="1">Just me</option>
                  <option value="2">2 People</option>
                  <option value="4">Small Group (3-5)</option>
                  <option value="8">Large Group (6+)</option>
                </select>
              </button>

              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-[1px] bg-gray-300 group-hover:opacity-0 transition"></div>
            </div>

            <div className="flex-[1.5] relative group">
              <button id="features-btn" className="w-full text-left px-6 py-2 rounded-full hover:bg-gray-100 transition peer">
                <div className="text-xs font-bold text-gray-800 tracking-wide">Features</div>
                <div className="text-sm text-gray-400 truncate">Whiteboard, TV...</div>
              </button>

              <div className="hidden group-hover:block absolute top-16 right-0 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Amenities</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-[#E57200] border-gray-300 rounded focus:ring-[#E57200]" />
                    <span className="text-sm text-gray-700">Whiteboard</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-[#E57200] border-gray-300 rounded focus:ring-[#E57200]" />
                    <span className="text-sm text-gray-700">TV / Monitor</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-[#E57200] border-gray-300 rounded focus:ring-[#E57200]" />
                    <span className="text-sm text-gray-700">Near Coffee</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-[#E57200] border-gray-300 rounded focus:ring-[#E57200]" />
                    <span className="text-sm text-gray-700">Silent Zone</span>
                  </label>
                </div>
              </div>
            </div>

        <div className="pl-2">
          <button className="w-12 h-12 bg-[#E57200] rounded-full flex items-center justify-center text-white hover:bg-[#c66200] transition shadow-md hover:scale-105 active:scale-95">
            <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

      </div>    
          
          <div className="flex gap-2 mt-4 justify-center flex-wrap">
            <button className="px-3 py-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm hover:border-[#E57200] hover:text-[#E57200] transition">
              Quiet Study
            </button>
            <button className="px-3 py-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm hover:border-[#E57200] hover:text-[#E57200] transition">
              Group Work
            </button>
            <button className="px-3 py-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm hover:border-[#E57200] hover:text-[#E57200] transition">
              Whiteboards
            </button>
            <button className="px-3 py-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm hover:border-[#E57200] hover:text-[#E57200] transition">
              Near Coffee
            </button>
            <button className="px-3 py-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm hover:border-[#E57200] hover:text-[#E57200] transition">
              Open Now
            </button>
          </div>
        </div>
        
        <div className="absolute top-[40%] left-[30%] group cursor-pointer z-10">
            <div className="w-8 h-8 -ml-4 -mt-8 bg-[#232D4B] rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-32 bg-gray-800 text-white text-xs rounded py-1 px-2 text-center">
              Shannon Library
            </div>
        </div>

        <div className="absolute top-[50%] left-[55%] z-20">
            <div className="w-10 h-10 -ml-5 -mt-10 bg-[#E57200] rounded-full flex items-center justify-center text-white shadow-xl ring-4 ring-white/50 animate-bounce-slight">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            <div className="absolute top-2 left-6 w-64 bg-white rounded-lg shadow-xl border border-gray-100 p-4 animate-in">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-[#232D4B]">Clark Hall</h4>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Open</span>
              </div>
              <ul className="text-xs text-gray-500 space-y-1 mb-4">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span> 3 rooms available
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span> Quiet Zone
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span> Coffee nearby
                </li>
              </ul>
              <button className="w-full py-1.5 border border-[#232D4B] text-[#232D4B] text-sm font-medium rounded hover:bg-[#232D4B] hover:text-white transition">
                Book Now
              </button>
            </div>
        </div>

        <div className="absolute top-[60%] left-[75%] opacity-50 z-10">
            <div className="w-6 h-6 bg-gray-400 rounded-full shadow-sm"></div>
        </div>

      </main>
    </main>
  );
}
