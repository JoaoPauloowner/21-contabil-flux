import { db, ensureDatabaseInitialized } from "@/server/infrastructure/db";
import { aiDrafts, requests } from "@/server/infrastructure/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getSessionContext, assertCanWrite } from "@/server/application/context";
import { recordAudit } from "@/server/application/session";
import { AccountingAiProvider } from "@/server/infrastructure/ai-provider";

export async function getLatestDraftForRequest(requestId: string) {
  await ensureDatabaseInitialized();
  const context = await getSessionContext();
  const [draft] = await db
    .select()
    .from(aiDrafts)
    .where(and(eq(aiDrafts.organizationId, context.organizationId), eq(aiDrafts.requestId, requestId)))
    .orderBy(desc(aiDrafts.createdAt));

  return draft ?? null;
}

export async function generateOrGetDraft(requestId: string) {
  await ensureDatabaseInitialized();
  const context = await getSessionContext();
  const existing = await getLatestDraftForRequest(requestId);
  if (existing) return existing;

  const [req] = await db
    .select()
    .from(requests)
    .where(and(eq(requests.organizationId, context.organizationId), eq(requests.id, requestId)));

  if (!req) throw new Error("Solicitação não encontrada");

  const provider = new AccountingAiProvider();
  const generated = await provider.generateReplyDraft({
    requestId: req.id,
    organizationId: context.organizationId,
    subject: req.subject,
    description: req.description,
    clientName: req.clientName,
    department: req.department,
  });

  const draftId = `draft_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const newDraft = {
    id: draftId,
    organizationId: context.organizationId,
    requestId: req.id,
    createdBy: context.userId,
    status: "draft" as const,
    content: generated.content,
    editedContent: null,
    confidence: generated.confidence,
    model: generated.model,
    sourcesJson: JSON.stringify(generated.sources),
    approvedBy: null,
    approvedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(aiDrafts).values(newDraft);
  await recordAudit(context, "ai_draft.generated", "ai_draft", draftId, { requestId });
  return newDraft;
}

export async function updateDraftContent(draftId: string, editedContent: string) {
  await ensureDatabaseInitialized();
  const context = await getSessionContext();
  assertCanWrite(context);
  const now = new Date().toISOString();

  await db
    .update(aiDrafts)
    .set({
      editedContent,
      status: "edited",
      updatedAt: now,
    })
    .where(and(eq(aiDrafts.organizationId, context.organizationId), eq(aiDrafts.id, draftId)));

  await recordAudit(context, "ai_draft.edited", "ai_draft", draftId);
}

export async function approveDraft(draftId: string) {
  await ensureDatabaseInitialized();
  const context = await getSessionContext();
  assertCanWrite(context);
  const now = new Date().toISOString();

  await db
    .update(aiDrafts)
    .set({
      status: "approved",
      approvedBy: context.userName,
      approvedAt: now,
      updatedAt: now,
    })
    .where(and(eq(aiDrafts.organizationId, context.organizationId), eq(aiDrafts.id, draftId)));

  await recordAudit(context, "ai_draft.approved", "ai_draft", draftId, { approvedBy: context.userName });
}
