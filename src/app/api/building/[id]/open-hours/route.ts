import { NextResponse } from "next/server";
import {
  deleteOpenHours,
  getBuildingById,
  getOpenHoursByBuildingId,
  setOpenHours,
} from "@/db/queries";
import { badRequest, notFound, parseInteger, readJson } from "../../../_utils";
import { auth } from "@/auth";

export const GET = auth(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const userId = Number(req.auth?.user?.id);
    if (!req.auth || !userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const buildingId = parseInteger(id);
    if (buildingId === null) return badRequest("invalid building id");

    const building = await getBuildingById(buildingId);
    if (!building) return notFound("building not found");

    const hours = await getOpenHoursByBuildingId(buildingId);

    return NextResponse.json(hours);
  },
);

export const PUT = auth(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const userId = Number(req.auth?.user?.id);
    if (!req.auth || !userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const buildingId = parseInteger(id);
    if (buildingId === null) return badRequest("invalid building id");

    const { day, openTime, open_time, closingTime, closing_time } =
      await readJson(req);

    if (typeof day !== "string" || day.trim().length === 0) {
      return badRequest("day is required");
    }

    if (typeof (openTime ?? open_time) !== "string") {
      return badRequest("openTime is required");
    }

    if (typeof (closingTime ?? closing_time) !== "string") {
      return badRequest("closingTime is required");
    }

    const building = await getBuildingById(buildingId);
    if (!building) return notFound("building not found");

    await setOpenHours(
      buildingId,
      day.trim(),
      openTime ?? open_time,
      closingTime ?? closing_time,
    );

    return NextResponse.json({
      building_id: buildingId,
      day: day.trim(),
      open_time: openTime ?? open_time,
      closing_time: closingTime ?? closing_time,
    });
  },
);

export const POST = PUT;
export const PATCH = PUT;

export const DELETE = auth(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const userId = Number(req.auth?.user?.id);
    if (!req.auth || !userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const buildingId = parseInteger(id);
    if (buildingId === null) return badRequest("invalid building id");

    const url = new URL(req.url);
    const body = await readJson(req);
    const day = body.day ?? url.searchParams.get("day");

    if (typeof day !== "string" || day.trim().length === 0) {
      return badRequest("day is required");
    }

    await deleteOpenHours(buildingId, day.trim());

    return new NextResponse(null, { status: 204 });
  },
);
