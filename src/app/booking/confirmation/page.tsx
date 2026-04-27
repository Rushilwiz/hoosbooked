import { notFound } from "next/navigation";
import { getBookingById, getRoomById, getBuildingById } from "@/db/queries";
import CancelReservation from "@/components/CancelReservation";

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

export default async function ConfirmationPage({ searchParams }: PageProps) {
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
            <a
              href="/"
              className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition shadow-sm text-gray-500"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <div>
              <h2 className="text-2xl font-bold text-[#232D4B]">
                Reservation Confirmed
              </h2>
              <p className="text-sm text-gray-500">
                ID:{" "}
                <span className="font-mono text-gray-700">
                  {booking.booking_id}
                </span>
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
            Confirmed
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-[#232D4B] p-6 text-white flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
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
              <p className="text-white/70 text-sm">
                {floor
                  ? `${floor}${["th", "st", "nd", "rd"][floor % 10 > 3 ? 0 : floor % 10]} Floor · `
                  : ""}
                {building.address}
              </p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-100 rounded-xl">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-green-800">
                  You&apos;re all set!
                </p>
                <p className="text-xs text-green-700">
                  Your reservation has been recorded. Check your notifications
                  for reminders.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Detail label="Date" value={formatDate(booking.date)} />
              <Detail
                label="Time"
                value={`${formatTime(booking.start_time)} – ${formatTime(booking.end_time)}`}
              />
              <Detail label="Purpose" value={booking.purpose ?? "—"} />
              <Detail
                label="Participants"
                value={booking.participants?.toString() ?? "—"}
              />
            </div>

            <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-end gap-3">
              <CancelReservation bookingId={booking.booking_id} />
              <a
                href={`/buildings/${building.id}`}
                className="w-full md:w-auto text-center px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
              >
                Back to{" "}
                {building.name.slice(
                  0,
                  building.name.indexOf(" ") > -1
                    ? building.name.indexOf(" ")
                    : undefined,
                )}
              </a>
              <a
                href={`/booking/modify?booking_id=${booking.booking_id}`}
                className="w-full md:w-auto text-center px-6 py-3 bg-[#E57200] text-white font-bold rounded-xl shadow-lg hover:bg-[#c66200] hover:shadow-xl transition-all"
              >
                Modify Booking
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}
