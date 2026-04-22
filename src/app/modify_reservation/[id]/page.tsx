import Image from "next/image";

export default function Room() {
    return (
<main className="flex-1 overflow-y-auto bg-gray-50 p-8">
  <div className="max-w-3xl mx-auto">
    
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <button className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition shadow-sm text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-[#232D4B]">Edit Reservation</h2>
          <p className="text-sm text-gray-500">ID: <span className="font-mono text-gray-700">88294</span></p>
        </div>
      </div>
      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">Upcoming</span>
    </div>

    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      
      <div className="bg-[#232D4B] p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"/></svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">Shannon Library, Room 302</h3>
            <p className="text-white/70 text-sm">3rd Floor • Standard Study Room</p>
          </div>
        </div>
        <button className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition">Change Building</button>
      </div>

      <form className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Reservation Date</label>
            <input type="date" defaultValue="2026-02-15" className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#E57200] focus:bg-white outline-none transition-all" />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Start Time</label>
            <select className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#E57200] focus:bg-white outline-none transition-all" defaultValue={"16:00"}>
              <option value={"16:00"}>4:00 PM</option>
              <option value={"16:30"}>4:30 PM</option>
              <option value={"17:00"}>5:00 PM</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">End Time</label>
            <select className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#E57200] focus:bg-white outline-none transition-all" defaultValue={"18:00"}>
              <option value={"17:30"}>5:30 PM</option>
              <option value={"18:00"}>6:00 PM</option>
              <option value={"18:30"}>6:30 PM</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Booking Name/Purpose</label>
            <input type="text" defaultValue="CS 3240 Capstone Work" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#E57200] focus:bg-white outline-none transition-all" />
          </div>
          
          <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <div className="shrink-0 text-gray-400">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#232D4B]">Group Size</p>
              <p className="text-xs text-gray-500">You previously noted 4 attendees.</p>
            </div>
            <input type="number" defaultValue="4" className="w-20 bg-white border border-gray-200 rounded-lg p-2 text-center text-sm font-bold focus:ring-2 focus:ring-[#E57200] outline-none" />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <button type="button" className="text-red-500 text-sm font-bold hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition">
            Cancel Reservation
          </button>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button type="button" className="flex-1 md:flex-none px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition">
              Discard
            </button>
            <button type="submit" className="flex-1 md:flex-none px-8 py-3 bg-[#E57200] text-white font-bold rounded-xl shadow-lg hover:bg-[#c66200] hover:shadow-xl transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>

  </div>
</main>
    );
}