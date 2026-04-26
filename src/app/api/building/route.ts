import { NextResponse } from "next/server";
import { createBuilding, getAllBuildings } from "@/db/queries";
import { badRequest, readJson } from "../_utils";

export async function GET() {
  const buildings = await getAllBuildings();
  return NextResponse.json(buildings);
}

export async function POST(req: Request) {
  const { name, address } = await readJson(req);

  if (typeof name !== "string" || name.trim().length === 0) {
    return badRequest("name is required");
  }

  if (typeof address !== "string" || address.trim().length === 0) {
    return badRequest("address is required");
  }

  const id = await createBuilding(name.trim(), address.trim());

  return NextResponse.json(
    {
      id,
      name: name.trim(),
      address: address.trim(),
    },
    { status: 201 }
  );
}
