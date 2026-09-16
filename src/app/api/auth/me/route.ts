import { NextResponse } from "next/server";
import { deleteSessionCookie, getSession } from "@/server/application/session";

export async function POST() {
  await deleteSessionCookie();
  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, session });
}
