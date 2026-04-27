import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  getBuildingById,
  getAllAmenities,
  getRoomsFiltered,
  getAmenitiesForRooms,
  getBookedRoomIds,
  getOpenHoursByBuildingId,
} from "@/db/queries";
import SearchPanel from "@/components/SearchPanel";
import BuildingImage from "@/components/BuildingImage";
import OpenHoursDisplay from "@/components/OpenHoursDisplay";

interface PageProps {
  params: Promise<{ building_id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function parseMinCapacity(
  val: string | string[] | undefined,
): number | undefined {
  if (typeof val !== "string") return undefined;
  const n = parseInt(val, 10);
  return isNaN(n) || n < 1 ? undefined : n;
}

function parseAmenityIds(val: string | string[] | undefined): number[] {
  if (typeof val !== "string" || !val) return [];
  return val
    .split(",")
    .map(Number)
    .filter((n) => !isNaN(n) && n > 0);
}

function parseString(val: string | string[] | undefined): string | undefined {
  return typeof val === "string" && val ? val : undefined;
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${period}`;
}

function getOrdinal(n: number): string {
  switch (n % 10) {
    case 0:
      return `Gnd`;
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

const BADGE_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
  "bg-orange-100 text-orange-700",
];

export default async function BuildingPage({
  params,
  searchParams,
}: PageProps) {
  const { building_id } = await params;
  const sp = await searchParams;

  const buildingId = parseInt(building_id, 10);
  if (isNaN(buildingId)) notFound();

  const minCapacity = parseMinCapacity(sp.capacity);
  const amenityIds = parseAmenityIds(sp.amenities as string | undefined);
  const date = parseString(sp.date);
  const start = parseString(sp.start);
  const end = parseString(sp.end);
  const availableOnly = sp.available === "true";

  const [building, allAmenities, rooms, openHoursRows] = await Promise.all([
    getBuildingById(buildingId),
    getAllAmenities(),
    getRoomsFiltered(buildingId, {
      minCapacity,
      amenityIds: amenityIds.length > 0 ? amenityIds : undefined,
    }),
    getOpenHoursByBuildingId(buildingId),
  ]);

  const openHoursMap: Record<string, { open_time: string; closing_time: string }> = {};
  for (const row of openHoursRows) {
    openHoursMap[row.day] = {
      open_time: String(row.open_time),
      closing_time: String(row.closing_time),
    };
  }

  if (!building) notFound();

  const roomIds = rooms.map((r) => r.id);

  const [roomAmenityRows, bookedSet] = await Promise.all([
    getAmenitiesForRooms(buildingId, roomIds),
    date && start && end
      ? getBookedRoomIds(buildingId, roomIds, date, start, end)
      : Promise.resolve(new Set<number>()),
  ]);

  const amenitiesMap = new Map<number, { id: number; name: string }[]>();
  for (const row of roomAmenityRows) {
    if (!amenitiesMap.has(row.room_id)) amenitiesMap.set(row.room_id, []);
    amenitiesMap.get(row.room_id)!.push({ id: row.id, name: row.name });
  }

  const displayRooms =
    availableOnly && date && start && end
      ? rooms.filter((r) => !bookedSet.has(r.id))
      : rooms;

  const hasTimeFilter = !!(date && start && end);
  const bookQueryString = hasTimeFilter
    ? `?date=${date}&start=${start}&end=${end}`
    : "";
  const currentFilters = {
    minCapacity,
    amenityIds,
    date,
    start,
    end,
    availableOnly,
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
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
        <span className="font-semibold text-[#232D4B]">{building.name}</span>
      </nav>

      <div className="max-w-6xl mx-auto space-y-8">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-full md:w-48 h-32 bg-gray-200 rounded-xl overflow-hidden shrink-0">
            <BuildingImage buildingId={buildingId} name={building.name} />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="text-xs font-bold text-[#E57200] uppercase tracking-widest">
                Building
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs font-medium text-gray-500">
                {building.address}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-[#232D4B]">
              {building.name}
            </h2>
            <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2 text-sm text-gray-600">
              <Suspense>
                <OpenHoursDisplay openHours={openHoursMap} />
              </Suspense>
              {hasTimeFilter ? (
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
                  <span>
                    {date}&nbsp; {formatTime(start!)} – {formatTime(end!)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full text-gray-400 text-xs">
                  No time filter — click Edit Search
                </div>
              )}
              {minCapacity != null && (
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
                  <span>{minCapacity}+ People</span>
                </div>
              )}
              {amenityIds.length > 0 && (
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    {amenityIds.length} amenity filter
                    {amenityIds.length > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          <SearchPanel
            allAmenities={allAmenities}
            currentFilters={currentFilters}
          />
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
                {hasTimeFilter && (
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                )}
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayRooms.length === 0 ? (
                <tr>
                  <td
                    colSpan={hasTimeFilter ? 6 : 5}
                    className="px-6 py-12 text-center text-sm text-gray-400"
                  >
                    No rooms match your current filters.
                  </td>
                </tr>
              ) : (
                displayRooms.map((room) => {
                  const isBooked = hasTimeFilter && bookedSet.has(room.id);
                  const roomAmenities = amenitiesMap.get(room.id) ?? [];
                  const floorMatch = room.number.toString().match(/\d{3}/);
                  const floor = floorMatch
                    ? Math.floor(parseInt(floorMatch[0], 10) / 100)
                    : null;

                  return (
                    <tr
                      key={room.id}
                      className={`hover:bg-blue-50/30 transition group ${isBooked ? "opacity-60" : ""}`}
                    >
                      <td className="px-6 py-5 font-bold text-[#232D4B]">
                        Room {room.number}
                      </td>
                      <td className="px-6 py-5 text-center text-gray-600 font-medium text-sm">
                        {floor ? getOrdinal(floor) : "—"}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-sm font-semibold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md">
                          {room.capacity}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-1.5">
                          {roomAmenities.length > 0 ? (
                            roomAmenities.map((a) => (
                              <span
                                key={a.id}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${BADGE_COLORS[a.id % BADGE_COLORS.length]}`}
                              >
                                {a.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                      {hasTimeFilter && (
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${isBooked ? "bg-red-400" : "bg-green-500"}`}
                            />
                            <span
                              className={`text-sm font-medium ${isBooked ? "text-gray-500" : "text-green-700"}`}
                            >
                              {isBooked ? "Reserved" : "Open"}
                            </span>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-5 text-right">
                        {isBooked ? (
                          <button className="bg-gray-100 text-gray-400 px-4 py-1.5 rounded-lg text-xs font-bold cursor-not-allowed">
                            Unavailable
                          </button>
                        ) : (
                          <a
                            href={`/buildings/${buildingId}/rooms/${room.id}${bookQueryString}`}
                            className="inline-block bg-[#232D4B] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#E57200] transition"
                          >
                            Book
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
