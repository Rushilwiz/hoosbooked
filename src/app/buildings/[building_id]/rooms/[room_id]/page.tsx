import { notFound } from "next/navigation";
import {
  getRoomById,
  getBuildingById,
  getAmenityByRoomId,
  getOpenHoursForDay,
  getBookingsByRoomAndDate,
} from "@/db/queries";
import type { ScheduleBooking } from "@/types/db";
import RoomSchedule from "@/components/RoomSchedule";
import BookingForm from "@/components/BookingForm";

interface PageProps {
  params: Promise<{ building_id: string; room_id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function parseString(val: string | string[] | undefined): string | undefined {
  return typeof val === "string" && val ? val : undefined;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function getDayName(dateStr: string): string {
  const [y, mo, d] = dateStr.split("-").map(Number);
  return DAY_NAMES[new Date(y, mo - 1, d).getDay()];
}

function getOrdinal(n: number): string {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

export default async function RoomPage({ params, searchParams }: PageProps) {
  const { building_id, room_id } = await params;
  const sp = await searchParams;

  const buildingId = parseInt(building_id, 10);
  const roomId = parseInt(room_id, 10);
  if (isNaN(buildingId) || isNaN(roomId)) notFound();

  const dateParam = parseString(sp.date);
  const startParam = parseString(sp.start);
  const endParam = parseString(sp.end);

  const today = new Date().toISOString().slice(0, 10);
  const scheduleDate = dateParam ?? today;
  const dayName = getDayName(scheduleDate);

  const [room, building, amenities, openHours, bookings] = await Promise.all([
    getRoomById(roomId),
    getBuildingById(buildingId),
    getAmenityByRoomId(roomId, buildingId),
    getOpenHoursForDay(buildingId, dayName),
    getBookingsByRoomAndDate(roomId, buildingId, scheduleDate),
  ]);

  if (!room || !building) notFound();

  const amenityList = amenities as {
    id: number;
    name: string;
    description: string | null;
  }[];

  let isAvailable: boolean | null = true;

  const floorMatch = room.number.toString().match(/\d{3}/);
  const floor = floorMatch
    ? Math.floor(parseInt(floorMatch[0], 10) / 100)
    : null;
  const floorLabel = floor ? `${getOrdinal(floor)} Floor` : null;

  console.log("Open hours for the day:", openHours);
  console.log("Bookings for the day:", bookings);

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-[#232D4B] transition">
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
          <a
            href={`/buildings/${buildingId}`}
            className="hover:text-[#232D4B] transition"
          >
            {building.name}
          </a>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[#232D4B] font-semibold">
            Room {room.number}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column — room info + schedule */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-4xl font-extrabold text-[#232D4B] tracking-tight">
                    Room {room.number}
                  </h2>
                  {floorLabel && (
                    <p className="text-lg text-gray-500 mt-1">{floorLabel}</p>
                  )}
                </div>
                {isAvailable !== null && (
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-bold shrink-0 ${
                      isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isAvailable ? "Available" : "Reserved"}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <InfoCard
                  color="blue"
                  label="Capacity"
                  value={`${room.capacity} People Max`}
                  icon={
                    <path
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  }
                />
                {amenityList.map((a) => (
                  <InfoCard
                    key={a.id}
                    color="orange"
                    label="Amenity"
                    value={a.name}
                    icon={<path strokeWidth="2" d="M5 13l4 4L19 7" />}
                  />
                ))}
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
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
                  Schedule — {scheduleDate}
                </h3>
                <RoomSchedule
                  bookings={bookings}
                  openHours={openHours}
                  date={scheduleDate}
                  highlightStart={startParam}
                  highlightEnd={endParam}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sticky top-8">
              <h3 className="text-xl font-bold text-[#232D4B] mb-6">
                Secure this Space
              </h3>
              <BookingForm
                roomId={roomId}
                buildingId={buildingId}
                defaultDate={dateParam}
                defaultStart={startParam}
                defaultEnd={endParam}
                capacity={room.capacity}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoCard({
  color,
  label,
  value,
  icon,
}: {
  color: "blue" | "orange";
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  const bg =
    color === "blue"
      ? "bg-blue-50 text-[#232D4B]"
      : "bg-orange-50 text-[#E57200]";
  return (
    <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${bg}`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {icon}
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-gray-400 uppercase">{label}</p>
        <p className="text-sm font-semibold text-gray-800 truncate">
          {" "}
          {value
            .toLowerCase()
            .split(" ")
            .reduce(
              (s, c) => s + "" + (c.charAt(0).toUpperCase() + c.slice(1) + " "),
              "",
            )}
        </p>
      </div>
    </div>
  );
}
