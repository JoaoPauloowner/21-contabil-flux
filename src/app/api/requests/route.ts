import { NextResponse } from "next/server";
import { createRequest, listRequests } from "@/server/application/request-service";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || undefined;
    const department = url.searchParams.get("department") || undefined;
    const priority = url.searchParams.get("priority") || undefined;

    const data = await listRequests({ status, department, priority });
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ERROR";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await createRequest(body);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "INVALID_REQUEST";
    return NextResponse.json(
      { error: { code: message.startsWith("FORBIDDEN") ? "FORBIDDEN" : "VALIDATION_ERROR", message } },
      { status: message.startsWith("FORBIDDEN") ? 403 : 400 }
    );
  }
}
