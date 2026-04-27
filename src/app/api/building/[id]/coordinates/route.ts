import { NextResponse } from "next/server";
import { getBuildingById, getCoordinatesByBuildingId } from "@/db/queries";
import { badRequest, notFound, parseInteger } from "../../../_utils";
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

    const coordinates = await getCoordinatesByBuildingId(buildingId);

    return NextResponse.json(coordinates);
  },
);
