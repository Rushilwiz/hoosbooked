import { NextResponse } from "next/server";
import { getRoomById, getBuildingById, getCurrentBookingForRoom } from "@/db/queries";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ room_id: string }> },
) {
  const { room_id } = await params;
  const roomId = Number(room_id);

  if (isNaN(roomId)) {
    return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
  }

  const [room, booking] = await Promise.all([
    getRoomById(roomId),
    getCurrentBookingForRoom(roomId),
  ]);

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const building = await getBuildingById(room.building_id);

  return NextResponse.json({
    room: { id: room.id, number: room.number, capacity: room.capacity },
    building: building ? { id: building.id, name: building.name } : null,
    booking,
  });
}
