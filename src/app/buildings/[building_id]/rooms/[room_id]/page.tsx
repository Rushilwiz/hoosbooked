import Image from "next/image";

export default function Room() {
    return (
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="#" className="hover:text-[#232D4B] transition">Grounds</a>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
            <a href="#" className="hover:text-[#232D4B] transition"
              >Shannon Library</a
            >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[#232D4B] font-semibold">Room 302</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2
                      className="text-4xl font-extrabold text-[#232D4B] tracking-tight"
                    >
                      Room 302
                    </h2>
                    <p className="text-lg text-gray-500">
                      3rd Floor • Corner Suite
                    </p>
                  </div>
                  <span
                    className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold"
                    >Available Now</span
                  >
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div
                    className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl"
                  >
                    <div
                      className="w-10 h-10 bg-blue-50 text-[#232D4B] rounded-lg flex items-center justify-center"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeWidth="2"
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">
                        Capacity
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        8 People Max
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl"
                  >
                    <div
                      className="w-10 h-10 bg-orange-50 text-[#E57200] rounded-lg flex items-center justify-center"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeWidth="2"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">
                        Includes
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        Projector
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3
                    className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Today's Schedule
                  </h3>
                  <div
                    className="relative h-12 bg-gray-100 rounded-full overflow-hidden flex"
                  >
                    <div className="h-full bg-gray-200 w-[30%]" title="Past"></div>
                    <div
                      className="h-full bg-red-200 border-x border-white w-[15%]"
                      title="Booked"
                    ></div>
                    <div
                      className="h-full bg-green-400 w-[40%]"
                      title="Available"
                    ></div>
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-[#232D4B] left-[30%] shadow-[0_0_10px_rgba(35,45,75,0.5)]"
                    ></div>
                  </div>
                  <div
                    className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 px-1"
                  >
                    <span>8 AM</span>
                    <span>12 PM</span>
                    <span>4 PM</span>
                    <span>8 PM</span>
                    <span>12 AM</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div
                className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sticky top-8"
              >
                <h3 className="text-xl font-bold text-[#232D4B] mb-6">
                  Secure this Space
                </h3>

                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-[10px] font-bold text-gray-400 uppercase mb-1"
                        >Date</label
                      >
                      <input
                        type="date"
                        className="w-full bg-gray-50 border-gray-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#E57200] outline-none"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-[10px] font-bold text-gray-400 uppercase mb-1"
                        >Attendees</label
                      >
                      <input
                        type="number"
                        defaultValue="4"
                        className="w-full bg-gray-50 border-gray-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#E57200] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-[10px] font-bold text-gray-400 uppercase mb-1"
                        >Start Time</label
                      >
                      <select
                        className="w-full bg-gray-50 border-gray-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#E57200] outline-none"
                      >
                        <option>4:00 PM</option>
                      </select>
                    </div>
                    <div>
                      <label
                        className="block text-[10px] font-bold text-gray-400 uppercase mb-1"
                        >End Time</label
                      >
                      <select
                        className="w-full bg-gray-50 border-gray-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#E57200] outline-none"
                      >
                        <option>6:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-[10px] font-bold text-gray-400 uppercase mb-1"
                      >Purpose of Booking</label
                    >
                    <input
                      type="text"
                      placeholder="e.g. CS 3240 Group Meeting"
                      className="w-full bg-gray-50 border-gray-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#E57200] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#E57200] text-white font-bold rounded-xl shadow-lg hover:bg-[#c66200] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Confirm Reservation
                  </button>
                </form>

                <p
                  className="text-center text-[10px] text-gray-400 mt-6 leading-relaxed px-4"
                >
                  By booking, you agree to the
                  <span className="underline">UVA Library Conduct Policy</span>.
                  Cancellations must be made 1 hour prior.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
}