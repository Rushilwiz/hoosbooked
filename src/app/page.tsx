import { auth } from "@/auth";
import BookingList from "@/components/BookingList";
import HomeSearchBar from "@/components/HomeSearchBar";
import MapExplorer from "@/components/MapExplorer";
import {
  getAllBuildings,
  getAllAmenities,
  getRoomsFiltered,
  getBookedRoomIds,
  getBookingsByUserId,
  getAllBuildingCoordinates,
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

  const [buildings, allAmenities, bookings, buildingCoordinates] =
    await Promise.all([
      getAllBuildings(),
      getAllAmenities(),
      getBookingsByUserId(userId),
      getAllBuildingCoordinates(),
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
    <main className="flex flex-1 overflow-hidden h-screen">
      <BookingList bookings={bookings} />

      <section className="flex-1 relative bg-[#F1F1EF] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <MapExplorer
            buildings={buildings}
            buildingCounts={buildingRoomCounts}
            buildingCoordinates={buildingCoordinates}
          />
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
        </div>
      </section>
    </main>
  );
}
