import { auth } from "@/auth";
import BookingList from "@/components/BookingList";
import HomeSearchBar from "@/components/HomeSearchBar";
import {
  getAllBuildings,
  getAllAmenities,
  getRoomsFiltered,
  getBookedRoomIds,
  getBookingsByUserId,
} from "@/db/queries";

interface PageProps {
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

export default async function Home({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) return null;

  const userId = Number(session.user.id);

  const sp = await searchParams;

  const minCapacity = parseMinCapacity(sp.capacity);
  const amenityIds = parseAmenityIds(sp.amenities as string | undefined);
  const date = parseString(sp.date);
  const start = parseString(sp.start);
  const end = parseString(sp.end);

  const hasTimeFilter = !!(date && start && end);

  const [buildings, allAmenities, bookings] = await Promise.all([
    getAllBuildings(),
    getAllAmenities(),
    getBookingsByUserId(userId),
  ]);

  const roomResults = await Promise.all(
    buildings.map((b) =>
      getRoomsFiltered(b.id, {
        minCapacity,
        amenityIds: amenityIds.length > 0 ? amenityIds : undefined,
      }),
    ),
  );

  const bookedResults = await Promise.all(
    buildings.map((b, i) => {
      const roomIds = roomResults[i].map((r) => r.id);
      return hasTimeFilter && roomIds.length > 0
        ? getBookedRoomIds(b.id, roomIds, date!, start!, end!)
        : Promise.resolve(new Set<number>());
    }),
  );

  const buildingRoomCounts: Record<number, number> = {};
  buildings.forEach((b, i) => {
    const rooms = roomResults[i];
    const booked = bookedResults[i];
    buildingRoomCounts[b.id] = hasTimeFilter
      ? rooms.filter((r) => !booked.has(r.id)).length
      : rooms.length;
  });

  return (
    <main className="flex flex-1 overflow-hidden">
      <BookingList bookings={bookings} />

      <main className="flex-1 relative bg-[#F1F1EF] overflow-hidden">
        {/* <!-- FAKE MAP BACKGROUND --> */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `radial-gradient(#cbd5e1 1.5px, transparent 1.5px)`,
              backgroundSize: `30px 30px`,
            }}
          ></div>
          {/* <!-- Fake Buildings --> */}
          <div className="absolute top-1/3 left-1/4 w-32 h-24 bg-gray-300 border-b-4 border-r-4 border-gray-400 rotate-12 rounded"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-32 bg-gray-300 border-b-4 border-r-4 border-gray-400 -rotate-6 rounded"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gray-300 border-b-4 border-r-4 border-gray-400 rotate-3 rounded"></div>
        </div>

        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-30">
          <HomeSearchBar
            allAmenities={allAmenities}
            initialFilters={{
              date,
              start,
              end,
              capacity: minCapacity,
              amenityIds,
            }}
          />

          <div className="flex gap-2 mt-4 justify-center flex-wrap">
            <button className="px-3 py-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm hover:border-[#E57200] hover:text-[#E57200] transition">
              Projector
            </button>
            <button className="px-3 py-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm hover:border-[#E57200] hover:text-[#E57200] transition">
              Group Work
            </button>
            <button className="px-3 py-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm hover:border-[#E57200] hover:text-[#E57200] transition">
              Whiteboards
            </button>
            <button className="px-3 py-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm hover:border-[#E57200] hover:text-[#E57200] transition">
              Solo Lock-in
            </button>
          </div>

          <div className="mt-4 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm px-4 py-3 text-xs text-gray-600 font-mono">
            <span className="font-bold text-gray-700 mr-2">Results:</span>
            {JSON.stringify(buildingRoomCounts)}
          </div>
        </div>

        <div className="absolute top-[40%] left-[30%] group cursor-pointer z-10">
          <div className="w-8 h-8 -ml-4 -mt-8 bg-[#232D4B] rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition">
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-32 bg-gray-800 text-white text-xs rounded py-1 px-2 text-center">
            Shannon Library
          </div>
        </div>

        <div className="absolute top-[50%] left-[55%] z-20">
          <div className="w-10 h-10 -ml-5 -mt-10 bg-[#E57200] rounded-full flex items-center justify-center text-white shadow-xl ring-4 ring-white/50 animate-bounce-slight">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>

          <div className="absolute top-2 left-6 w-64 bg-white rounded-lg shadow-xl border border-gray-100 p-4 animate-in">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-[#232D4B]">Clark Hall</h4>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Open
              </span>
            </div>
            <ul className="text-xs text-gray-500 space-y-1 mb-4">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span> 3
                rooms available
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>{" "}
                Quiet Zone
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>{" "}
                Coffee nearby
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
