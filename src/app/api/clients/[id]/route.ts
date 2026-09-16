import { NextResponse } from "next/server";
import { getClientById, deleteClient } from "@/server/application/client-service";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const client = await getClientById(id);
    if (!client) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ data: client });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "ERROR";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteClient(id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "ERROR";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
