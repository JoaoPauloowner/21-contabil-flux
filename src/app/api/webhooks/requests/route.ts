import { NextResponse } from "next/server";
import { createRequest } from "@/server/application/request-service";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("x-webhook-secret");
    const configuredSecret = process.env.WEBHOOK_SECRET || "contabil-flux-n8n-webhook-secret";

    // Validação de token de segurança do webhook
    if (authHeader && authHeader !== configuredSecret) {
      return NextResponse.json({ error: "UNAUTHORIZED: Token de webhook inválido" }, { status: 401 });
    }

    const body = await req.json();
    const created = await createRequest({
      subject: body.subject || "Demanda recebida via Webhook",
      description: body.description || "Detalhes enviados via automação externa",
      clientName: body.clientName || "Cliente Webhook",
      department: body.department || "contabil",
      priority: body.priority || "medium",
      dueAt: body.dueAt || new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
      status: "open",
    });

    return NextResponse.json({
      success: true,
      message: "Demanda recebida e registrada na caixa de entrada do Contábil Flux com sucesso",
      data: created,
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ERROR";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
