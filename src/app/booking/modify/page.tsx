import CancelReservation from "@/components/CancelReservation";
import ModifyBookingForm from "@/components/ModifyBookingForm";
import { getBookingById, getBuildingById, getRoomById } from "@/db/queries";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatTime(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const period = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${period}`;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const mo = date.getMonth();
  const d = date.getDate();
  const dow = date.getDay();
  return `${DAYS[dow]}, ${MONTHS[mo]} ${d}, ${y}`;
}

export default async function ModifyBooking({ searchParams }: PageProps) {
  const sp = await searchParams;
  const bookingId = typeof sp.booking_id === "string" ? sp.booking_id : null;
  if (!bookingId) notFound();

  const booking = await getBookingById(bookingId);
  if (!booking) notFound();

  const [room, building] = await Promise.all([
    getRoomById(booking.room_id),
    getBuildingById(booking.building_id),
  ]);

  if (!room || !building) notFound();

  const floorMatch = room.number.toString().match(/\d{3}/);
  const floor = floorMatch
    ? Math.floor(parseInt(floorMatch[0], 10) / 100)
    : null;

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition shadow-sm text-gray-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-[#232D4B]">
                Edit Reservation
              </h2>
              <p className="text-sm text-gray-500">
                ID: <span className="font-mono text-gray-700">{bookingId}</span>
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
            Upcoming
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-[#232D4B] p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {building.name}, Room {room.number}
                </h3>
                <p className="text-white/70 text-sm">{floor} Floor</p>
              </div>
            </div>
          </div>
          <ModifyBookingForm
            bookingId={bookingId}
            roomId={room.id}
            buildingId={building.id}
            date={booking.date}
            start={booking.start_time}
            end={booking.end_time}
            capacity={room.capacity}
            participants={booking.participants}
            purpose={booking.purpose}
          />
        </div>
      </div>
    </main>
  );
}
