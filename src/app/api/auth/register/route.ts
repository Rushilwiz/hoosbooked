import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createUser } from "@/db/queries";

export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => ({}));

  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  if (username.length < 3) {
    return NextResponse.json(
      { error: "Username must be at least 3 characters long." },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters long." },
      { status: 400 },
    );
  }

  const hash = await bcrypt.hash(password, 10);

  try {
    const id = await createUser(username, hash);
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    if ((err as { code?: string }).code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Username already taken." },
        { status: 409 },
      );
    }
    throw err;
  }
}
