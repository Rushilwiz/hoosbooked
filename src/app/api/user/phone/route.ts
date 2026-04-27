import { NextResponse } from "next/server";
import {
  deleteUserPhoneNumber,
  getUserPhoneNumberByUserId,
  setUserPhoneNumber,
} from "@/db/queries";
import {
  badRequest,
  notFound,
  readJson,
} from "../../_utils";
import { auth } from "@/auth";

export const GET = auth(async function GET(req) {
  const id = Number(req.auth?.user?.id);
  if (!req.auth || !id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const phone = await getUserPhoneNumberByUserId(id);
  if (!phone) return notFound("phone not found");

  return NextResponse.json(phone);
});

export const PUT = auth(async function PUT(req) {
  const id = Number(req.auth?.user?.id);
  if (!req.auth || !id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { phone } = await readJson(req);

  if (typeof phone !== "string" || phone.trim().length === 0) {
    return badRequest("phone is required");
  }

  const resId = await setUserPhoneNumber(id, phone.trim());

  return NextResponse.json({
    id: resId,
    user_id: id,
    phone: phone.trim(),
  });
});

export const POST = PUT;
export const PATCH = PUT;

export const DELETE = auth(async function DELETE(req) {
  const id = Number(req.auth?.user?.id);
  if (!req.auth || !id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  await deleteUserPhoneNumber(id);

  return new NextResponse(null, { status: 204 });
});
