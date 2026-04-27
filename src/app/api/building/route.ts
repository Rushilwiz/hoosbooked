import { NextResponse } from "next/server";
import { createBuilding, getAllBuildings } from "@/db/queries";
import { badRequest, readJson } from "../_utils";
import { auth } from "@/auth";

export const GET = auth(async (req) => {
  const userId = Number(req.auth?.user?.id);
  if (!req.auth || !userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const buildings = await getAllBuildings();
  return NextResponse.json(buildings);
});

export const POST = auth(async (req) => {
  const userId = Number(req.auth?.user?.id);
  if (!req.auth || !userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
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
    { status: 201 },
  );
});
