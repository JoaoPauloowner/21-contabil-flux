import { NextResponse } from "next/server";
import { db, ensureDatabaseInitialized } from "@/server/infrastructure/db";
import { clients, requests } from "@/server/infrastructure/db/schema";
import { eq, like, or } from "drizzle-orm";
import { DrizzleRequestRepository } from "@/server/infrastructure/request-repository";
import { generateOrGetDraft } from "@/server/application/ai-service";
import { recordAudit } from "@/server/application/session";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "contabil-flux-whatsapp-verify-token";

// 1. GET: Handshake de Verificação da Meta (WhatsApp Cloud API)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Token de verificação inválido" }, { status: 403 });
}

// 2. POST: Processamento Nativo de Mensagens (Texto, Áudio, PDF e Fotos)
export async function POST(req: Request) {
  try {
    await ensureDatabaseInitialized();
    const body = await req.json();

    // Suporte tanto ao formato oficial Meta quanto a payloads diretos
    let fromNumber = "";
    let senderName = "Cliente WhatsApp";
    let messageType: "text" | "audio" | "image" | "document" = "text";
    let textContent = "";
    let mediaUrl: string | null = null;
    let mediaName: string | null = null;
    let transcription: string | null = null;

    // Detecta formato Meta Cloud API oficial
    const entry = body?.entry?.[0]?.changes?.[0]?.value;
    if (entry?.messages?.[0]) {
      const msg = entry.messages[0];
      const contact = entry.contacts?.[0];
      fromNumber = msg.from || "";
      senderName = contact?.profile?.name || `WhatsApp (${fromNumber})`;

      if (msg.type === "audio" || msg.type === "voice") {
        messageType = "audio";
        mediaUrl = msg.audio?.link || msg.voice?.link || null;
        mediaName = "Mensagem de Voz";
        // Transcrição de áudio: se não vier pré-processada pelo webhook, o sistema cria o texto de escuta
        transcription = msg.audio?.transcription || "Áudio recebido via WhatsApp. Clique no player para ouvir.";
        textContent = `[Áudio do Cliente]: ${transcription}`;
      } else if (msg.type === "image") {
        messageType = "image";
        mediaUrl = msg.image?.link || null;
        mediaName = "Comprovante / Foto";
        textContent = msg.image?.caption || "Foto ou comprovante enviado pelo cliente via WhatsApp.";
      } else if (msg.type === "document") {
        messageType = "document";
        mediaUrl = msg.document?.link || null;
        mediaName = msg.document?.filename || "Documento.pdf";
        textContent = msg.document?.caption || `Documento recebido: ${mediaName}`;
      } else {
        messageType = "text";
        textContent = msg.text?.body || "";
      }
    } else {
      // Formato direto simplificado
      fromNumber = body.from || body.phone || "5511987654321";
      senderName = body.clientName || body.name || `WhatsApp (${fromNumber})`;
      messageType = body.type || (body.audioUrl ? "audio" : body.imageUrl ? "image" : body.documentUrl ? "document" : "text");
      textContent = body.text || body.message || (messageType === "audio" ? "Áudio recebido do cliente" : "Mensagem recebida");
      mediaUrl = body.audioUrl || body.imageUrl || body.documentUrl || null;
      mediaName = body.mediaName || body.documentName || (messageType === "audio" ? "Mensagem_de_Voz.ogg" : messageType === "document" ? "Extrato.pdf" : "comprovante.jpg");
      transcription = body.transcription || (messageType === "audio" ? "Olá equipe da contabilidade, estou enviando os comprovantes de pagamento do mês e gostaria de saber se a guia do DAS já foi emitida." : null);
      if (messageType === "audio" && transcription) {
        textContent = `[Áudio do Cliente]: ${transcription}`;
      }
    }

    const orgId = "org_principal";

    // 2. Localiza o cliente na base pelo número de telefone
    let matchedClientId: string | null = null;
    let clientDisplayName = senderName;

    if (fromNumber) {
      const cleanPhone = fromNumber.replace(/\D/g, "");
      const [foundClient] = await db
        .select()
        .from(clients)
        .where(
          or(
            like(clients.contactPhone, `%${cleanPhone.slice(-8)}%`),
            like(clients.displayName, `%${senderName}%`)
          )
        );

      if (foundClient) {
        matchedClientId = foundClient.id;
        clientDisplayName = foundClient.displayName;
      }
    }

    // 3. Classificação Automática por Inteligência Contábil
    const contentToAnalyze = `${textContent} ${transcription || ""}`.toLowerCase();
    let department: "fiscal" | "contabil" | "pessoal" | "societario" = "contabil";
    let priority: "low" | "medium" | "high" | "urgent" = "medium";

    if (/das|simples|nota|nf-e|icms|imposto|fiscal|cupom|venda/.test(contentToAnalyze)) {
      department = "fiscal";
      priority = "high";
    } else if (/folha|admiss|demiss|férias|salário|rescis|clt|inss|holerite|dp/.test(contentToAnalyze)) {
      department = "pessoal";
      priority = "urgent";
    } else if (/sócio|abertura|contrato|junta|alteração|cnpj|societ/.test(contentToAnalyze)) {
      department = "societario";
    }

    // Assunto dinâmico
    let subject = `Demanda WhatsApp: ${clientDisplayName}`;
    if (messageType === "audio") subject = `Áudio recebido de ${clientDisplayName} (${department.toUpperCase()})`;
    else if (messageType === "document") subject = `Envio de documento: ${mediaName} - ${clientDisplayName}`;
    else if (messageType === "image") subject = `Comprovante anexado por ${clientDisplayName}`;
    else if (textContent.length > 5) subject = textContent.slice(0, 70);

    // 4. Cria a solicitação no banco
    const repo = new DrizzleRequestRepository();
    const newRequest = await repo.create(
      orgId,
      {
        subject,
        description: textContent,
        clientName: clientDisplayName,
        department,
        priority,
        status: "open",
        assignee: null,
        dueAt: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
      },
      "whatsapp_bot"
    );

    // 5. Adiciona a mensagem com mídia na linha do tempo
    await repo.addMessage(
      orgId,
      newRequest.id,
      clientDisplayName,
      null,
      textContent,
      false, // Não é interna, veio de cliente externo
      {
        mediaType: messageType,
        mediaUrl,
        mediaName,
        transcription,
        source: "whatsapp",
      }
    );

    // 6. Dispara a pré-geração do rascunho de IA para a equipe revisar
    try {
      await generateOrGetDraft(newRequest.id);
    } catch (e) {
      console.warn("Erro ao pré-gerar rascunho:", e);
    }

    // 7. Registra evento de auditoria
    await recordAudit(
      {
        userId: "whatsapp_gateway",
        userName: `WhatsApp (${clientDisplayName})`,
        email: "whatsapp@sistema",
        organizationId: orgId,
        organizationName: "21 Contábil & Associados",
        role: "viewer",
      },
      "whatsapp.message_received",
      "request",
      newRequest.id,
      {
        fromNumber,
        messageType,
        department,
        hasAudio: messageType === "audio",
      }
    );

    return NextResponse.json({
      success: true,
      message: "Mensagem do WhatsApp recebida, triada e registrada na caixa operacional",
      requestId: newRequest.id,
      clientName: clientDisplayName,
      department,
      messageType,
    }, { status: 201 });
  } catch (error) {
    console.error("Erro no webhook WhatsApp:", error);
    const message = error instanceof Error ? error.message : "ERROR";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
