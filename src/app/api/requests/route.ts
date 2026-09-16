import { NextResponse } from "next/server";
import { createRequest, listRequests } from "@/server/application/request-service";

export async function GET() {
  return NextResponse.json({ data: listRequests() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ data: createRequest(body) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "INVALID_REQUEST";
    return NextResponse.json({ error: { code: message === "FORBIDDEN" ? "FORBIDDEN" : "VALIDATION_ERROR", message } }, { status: message === "FORBIDDEN" ? 403 : 400 });
  }
}
