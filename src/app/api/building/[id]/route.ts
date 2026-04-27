import { NextResponse } from "next/server";
import { deleteBuilding, getBuildingById, updateBuilding } from "@/db/queries";
import { badRequest, notFound, parseInteger, readJson } from "../../_utils";
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

    return NextResponse.json(building);
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

    const { name, address } = await readJson(req);

    if (typeof name !== "string" || name.trim().length === 0) {
      return badRequest("name is required");
    }

    if (typeof address !== "string" || address.trim().length === 0) {
      return badRequest("address is required");
    }

    const existing = await getBuildingById(buildingId);
    if (!existing) return notFound("building not found");

    await updateBuilding(buildingId, name.trim(), address.trim());

    return NextResponse.json({
      id,
      name: name.trim(),
      address: address.trim(),
    });
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
    const buildingId = parseInteger(id);
    if (buildingId === null) return badRequest("invalid building id");

    const existing = await getBuildingById(buildingId);
    if (!existing) return notFound("building not found");

    await deleteBuilding(buildingId);

    return new NextResponse(null, { status: 204 });
  },
);
