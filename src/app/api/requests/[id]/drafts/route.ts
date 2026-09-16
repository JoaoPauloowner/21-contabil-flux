import { NextResponse } from "next/server";
import { generateOrGetDraft, updateDraftContent, approveDraft, getLatestDraftForRequest } from "@/server/application/ai-service";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const draft = await generateOrGetDraft(id);
    return NextResponse.json({ data: draft });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ERROR";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const draft = await getLatestDraftForRequest(id);
    if (!draft) return NextResponse.json({ error: "Rascunho não encontrado" }, { status: 404 });

    if (body.action === "approve") {
      await approveDraft(draft.id);
    } else if (body.content) {
      await updateDraftContent(draft.id, body.content);
    }

    const updated = await getLatestDraftForRequest(id);
    return NextResponse.json({ data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ERROR";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
