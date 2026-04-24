import Image from "next/image";

export default function Building() {
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a href="#" className="hover:text-[#232D4B] transition">
          Grounds
        </a>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
        <a href="#" className="font-semibold">
          Shannon Library
        </a>
      </nav>

      <div className="max-w-6xl mx-auto space-y-8">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-48 h-32 bg-gray-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="text-xs font-bold text-[#E57200] uppercase tracking-widest">
                Library
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs font-medium text-gray-500">
                Central Grounds
              </span>
            </div>
            <h2 className="text-3xl font-bold text-[#232D4B]">
              Shannon Library
            </h2>
            <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>4:00 PM - 6:00 PM</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>4+ People</span>
              </div>
            </div>
          </div>

          <button className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-[#232D4B] hover:bg-gray-50 transition shadow-sm">
            Edit Search
          </button>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Room Name
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                  Floor
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                  Capacity
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Features
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-blue-50/30 transition group">
                <td className="px-6 py-5 font-bold text-[#232D4B]">Room 302</td>
                <td className="px-6 py-5 text-center text-gray-600 font-medium text-sm">
                  3rd
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="text-sm font-semibold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md">
                    8
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">
                      Whiteboard
                    </span>
                    <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded uppercase">
                      TV
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">
                      Open
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="bg-[#232D4B] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#E57200] transition">
                    Book
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-blue-50/30 transition group">
                <td className="px-6 py-5 font-bold text-[#232D4B]">
                  Study Pod A
                </td>
                <td className="px-6 py-5 text-center text-gray-600 font-medium text-sm">
                  2nd
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="text-sm font-semibold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md">
                    4
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase">
                      Power
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded uppercase">
                      Quiet Zone
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 opacity-50">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-500">
                      Reserved
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="bg-gray-100 text-gray-400 px-4 py-1.5 rounded-lg text-xs font-bold cursor-not-allowed">
                    Waitlist
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
