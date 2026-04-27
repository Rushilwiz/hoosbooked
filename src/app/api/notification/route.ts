import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createNotification, getNotificationsByUserId } from "@/db/queries";
import { badRequest, parseInteger, readJson } from "../_utils";
import { auth } from "@/auth";

export const GET = auth(async (req) => {
  const id = Number(req.auth?.user?.id);
  if (!req.auth || !id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const notifications = await getNotificationsByUserId(id);

  return NextResponse.json(notifications);
});

export const POST = auth(async (req) => {
  const userId = Number(req.auth?.user?.id);
  if (!req.auth || !userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { reqUserId, message } = await readJson(req);

  const user = parseInteger(reqUserId ?? userId);
  if (user === null) return badRequest("userId is required");

  if (typeof message !== "string" || message.trim().length === 0) {
    return badRequest("message is required");
  }

  const notificationId = randomUUID();

  await createNotification(notificationId, user, message.trim());

  return NextResponse.json(
    {
      notification_id: notificationId,
      user_id: user,
      message: message.trim(),
      viewed: 0,
    },
    { status: 201 },
  );
});
