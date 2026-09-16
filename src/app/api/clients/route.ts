import { NextResponse } from "next/server";
import { listClients, createClient } from "@/server/application/client-service";

export async function GET() {
  try {
    const clients = await listClients();
    return NextResponse.json({ data: clients });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "ERROR";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await createClient(body);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "INVALID_INPUT";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
