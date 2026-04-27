import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {
  deleteUserEmail,
  getUserEmailByUserId,
  setUserEmail,
} from "@/db/queries";
import { badRequest, notFound, readJson } from "../../_utils";

export const GET = auth(async function GET(req) {
  const id = Number(req.auth?.user?.id);
  if (!req.auth || !id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const email = await getUserEmailByUserId(id);
  if (!email) return notFound("email not found");

  return NextResponse.json(email);
});

export const PUT = auth(async function PUT(req) {
  const id = Number(req.auth?.user?.id);
  if (!req.auth || !id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { email } = await readJson(req);

  if (typeof email !== "string" || email.trim().length === 0) {
    return badRequest("email is required");
  }

  const resId = await setUserEmail(id, email.trim());

  return NextResponse.json({
    id: resId,
    user_id: id,
    email: email.trim(),
  });
});

export const POST = PUT;
export const PATCH = PUT;

export const DELETE = auth(async function DELETE(req) {
  const id = Number(req.auth?.user?.id);
  if (!req.auth || !id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  await deleteUserEmail(id);

  return new NextResponse(null, { status: 204 });
});
