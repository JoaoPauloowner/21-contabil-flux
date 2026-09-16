import { NextResponse } from "next/server";
import { deleteSessionCookie } from "@/server/application/session";

export async function POST() {
  await deleteSessionCookie();
  return NextResponse.json({ success: true });
}
