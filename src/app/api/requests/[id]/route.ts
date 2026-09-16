import { NextResponse } from "next/server";
import { getRequest, updateRequestStatus, addRequestMessage } from "@/server/application/request-service";
import type { RequestStatus } from "@/server/domain/request";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const request = await getRequest(id);
    if (!request) {
      return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 });
    }
    return NextResponse.json({ data: request });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ERROR";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    if (body.status) {
      await updateRequestStatus(id, body.status as RequestStatus);
    }
    if (body.message) {
      await addRequestMessage(id, body.message, body.isInternal ?? true);
    }
    const updated = await getRequest(id);
    return NextResponse.json({ data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ERROR";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
