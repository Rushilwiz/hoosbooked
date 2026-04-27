import { auth } from "@/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { deleteUser, updateUserPassword, getUserById } from "@/db/queries";
import { badRequest, readJson } from "../_utils";

export const GET = auth(async function GET(req) {
  const id = Number(req.auth?.user?.id);
  if (!req.auth || !id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await getUserById(id);
  if (!user) return badRequest("user not found");
  return NextResponse.json(user);
});

export const PATCH = auth(async function PATCH(req) {
  const id = Number(req.auth?.user?.id);
  if (!req.auth || !id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { password } = await readJson(req);

  if (typeof password !== "string" || password.length < 8) {
    return badRequest("password must be at least 8 characters long");
  }

  const hash = await bcrypt.hash(password, 10);

  await updateUserPassword(id, hash);

  return NextResponse.json({ id });
});

export const PUT = PATCH;

export const DELETE = auth(async function DELETE(req) {
  const id = Number(req.auth?.user?.id);
  if (!req.auth || !id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  console.log("deleting user with id", id);

  await deleteUser(id);

  return NextResponse.json({ id }, { status: 204 });
});
