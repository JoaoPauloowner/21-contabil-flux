import type { AccountingRequest } from "@/server/domain/request";

export type ReplyDraft = { content: string; confidence: "low" | "medium" | "high"; sourceIds: string[]; requiresHumanReview: true };

export interface AiProvider { generateReplyDraft(request: AccountingRequest): Promise<ReplyDraft> }

export class MockAiProvider implements AiProvider {
  async generateReplyDraft(request: AccountingRequest): Promise<ReplyDraft> {
    return {
      content: `Olá! Recebemos sua solicitação sobre “${request.subject}”. Nossa equipe está analisando o caso e retornará com os próximos passos. Antes do envio, confirme os documentos e o prazo aplicável ao cliente ${request.clientName}.`,
      confidence: "medium",
      sourceIds: [],
      requiresHumanReview: true
    };
  }
}
