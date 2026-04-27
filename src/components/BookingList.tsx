import { getBuildingById, getRoomById } from "@/db/queries";
import { Booking } from "@/types/db";
import CancelReservation from "./CancelReservation";

interface Props {
  bookings: Booking[];
}

export default async function BookingList({ bookings }: Props) {
  console.log("User bookings:", bookings);

  // omit all bookings before present date
  const now = new Date();

  const upcomingBookings = bookings
    .filter((b) => new Date(b.start_time) >= now)
    .sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    );

  const uniqueRoomIds = Array.from(
    new Set(upcomingBookings.map((b) => b.room_id)),
  );
  const uniqueBuildingIds = Array.from(
    new Set(upcomingBookings.map((b) => b.building_id)),
  );

  const roomData = await Promise.all(
    uniqueRoomIds.map((id) =>
      getRoomById(id).catch(() => ({ id, number: `Room ${id}` })),
    ),
  );

  const buildingData = await Promise.all(
    uniqueBuildingIds.map((id) =>
      getBuildingById(id).catch(() => ({ id, name: `Building ${id}` })),
    ),
  );
  return (
    <aside className="w-96 bg-white border-r border-gray-200 flex flex-col shadow-xl z-20">
      <div className="px-6 pt-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-[#232D4B]">Your Bookings</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {upcomingBookings.map((booking: Booking) => {
          const bookingDate = new Date(booking.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          bookingDate.setHours(0, 0, 0, 0);

          const isToday = bookingDate.getTime() === today.getTime();
          const barColor = isToday ? "bg-green-500" : "bg-[#E57200]";
          const opacity = isToday ? "" : "opacity-80";

          return (
            <div
              key={booking.booking_id}
              className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group ${opacity}`}
            >
              <div className="flex">
                <div className={`w-1.5 ${barColor}`}></div>
                <div className="p-4 flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {buildingData.find((b) => b.id === booking.building_id)
                      ?.name
                      ? `${buildingData.find((b) => b.id === booking.building_id)?.name}, ${
                          roomData.find((r) => r.id === booking.room_id)?.number
                        }`
                      : `Building ${booking.building_id}, Room ${booking.room_id}`}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {isToday
                      ? "Today"
                      : new Date(booking.start_time).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" },
                        )}
                    ,{" "}
                    {new Date(booking.start_time).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}{" "}
                    {!isToday
                      ? ""
                      : " - " +
                        new Date(booking.end_time).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                  </p>
                  <div className="mt-4 flex gap-4 text-sm font-medium">
                    {isToday ? (
                      <a
                        href={`/booking/confirmation?booking_id=${booking.booking_id}`}
                        className="mt-4 w-full py-2 bg-[#232D4B] text-white text-sm font-medium rounded hover:bg-[#1a2138] transition flex items-center justify-center gap-2"
                      >
                        <span>Check In</span>
                      </a>
                    ) : (
                      <>
                        <a
                          href={`/booking/modify?booking_id=${booking.booking_id}`}
                          className="text-[#232D4B] hover:underline"
                        >
                          Modify
                        </a>
                        <CancelReservation
                          small={true}
                          bookingId={booking.booking_id}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {upcomingBookings.length != 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <a
            href={`/booking/confirmation?booking_id=${upcomingBookings[0].booking_id}`}
            className="w-full py-3 px-4 bg-white border border-gray-200 text-[#232D4B] font-medium rounded shadow-sm hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
              />
            </svg>
            View Last Booking
          </a>
        </div>
      )}
    </aside>
  );
}
