import { NextResponse } from "next/server";
import { updateDocumentItemStatus, registerItemUpload } from "@/server/application/document-service";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (body.action === "upload") {
      await registerItemUpload(id, body.fileName || "documento_anexado.pdf", body.fileSize || 1024 * 450);
    } else if (body.status) {
      await updateDocumentItemStatus(id, body.status, body.reviewNote);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ERROR";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
