import { NextResponse } from "next/server";

export type RouteContext<T extends Record<string, string> = { id: string }> = {
  params: Promise<T>;
};

export const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status });

export const badRequest = (message = "Invalid request.") =>
  json({ error: message }, 400);

export const notFound = (message = "Resource not found.") =>
  json({ error: message }, 404);

export const parseInteger = (value: unknown) => {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string" && /^\d+$/.test(value)) return Number(value);
  return null;
};

export const readJson = async (req: Request) => req.json().catch(() => ({}));
