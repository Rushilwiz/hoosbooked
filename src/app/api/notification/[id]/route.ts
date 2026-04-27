import { NextResponse } from "next/server";
import { deleteNotification, markNotificationAsViewed } from "@/db/queries";
import type { RouteContext } from "../../_utils";
import { auth } from "@/auth";

export const PATCH = auth(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const userId = Number(req.auth?.user?.id);
    if (!req.auth || !userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;

    await markNotificationAsViewed(id, userId);

    return NextResponse.json({
      notification_id: id,
      viewed: 1,
    });
  },
);

export const PUT = PATCH;

export const DELETE = auth(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const userId = Number(req.auth?.user?.id);
    if (!req.auth || !userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const { id } = await params;

    await deleteNotification(id, userId);

    return new NextResponse(id, { status: 204 });
  },
);
