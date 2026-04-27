import { NextResponse } from "next/server";
import { deleteBooking, getBookingById, updateBooking } from "@/db/queries";
import { badRequest, notFound, parseInteger, readJson } from "../../_utils";
import { auth } from "@/auth";

export const GET = auth(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const userId = Number(req.auth?.user?.id);
    if (!req.auth || !userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;

    const booking = await getBookingById(id);
    if (!booking) return notFound("booking not found");

    return NextResponse.json(booking);
  },
);

export const PUT = auth(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const userId = Number(req.auth?.user?.id);
    if (!req.auth || !userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;

    const body = await readJson(req);

    const roomId = parseInteger(body.roomId ?? body.room_id);
    const buildingId = parseInteger(body.buildingId ?? body.building_id);

    const {
      purpose,
      participants,
      date,
      startTime,
      start_time,
      endTime,
      end_time,
    } = body;

    if (roomId === null) return badRequest("roomId is required");
    if (buildingId === null) return badRequest("buildingId is required");
    if (typeof date !== "string") return badRequest("date is required");

    if (typeof (startTime ?? start_time) !== "string") {
      return badRequest("startTime is required");
    }

    if (typeof (endTime ?? end_time) !== "string") {
      return badRequest("endTime is required");
    }

    const existing = await getBookingById(id);
    if (!existing) return notFound("booking not found");

    await updateBooking(
      id,
      typeof purpose === "string" ? purpose : null,
      startTime ?? start_time,
      endTime ?? end_time,
      date,
      typeof participants === "number" ? participants : null,
      roomId,
      buildingId,
    );

    return NextResponse.json(await getBookingById(id));
  },
);

export const PATCH = PUT;

export const DELETE = auth(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const userId = Number(req.auth?.user?.id);
    if (!req.auth || !userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await getBookingById(id);
    if (!existing) return notFound("booking not found");

    await deleteBooking(id);

    return new NextResponse(null, { status: 204 });
  },
);
