import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { auth } from "@/lib/auth";
import { createBooking } from "@/db/queries";



export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { roomId, buildingId, date, startTime, endTime, purpose } = body;

  if (
    typeof roomId !== "number" ||
    typeof buildingId !== "number" ||
    typeof date !== "string" ||
    typeof startTime !== "string" ||
    typeof endTime !== "string"
  ) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  try {
    const bookingId = await createBooking({
      bookingId: randomUUID(),
      userId: Number(session.user.id),
      roomId,
      buildingId,
      date,
      startTime,
      endTime,
      purpose: typeof purpose === "string" ? purpose : null,
    });
    return NextResponse.json({ bookingId }, { status: 201 });
  } catch (err) {
    if ((err as { code?: string }).code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "time slot already booked" }, { status: 409 });
    }
    throw err;
  }
}
