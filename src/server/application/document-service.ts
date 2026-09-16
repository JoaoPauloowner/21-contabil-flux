import { db, ensureDatabaseInitialized } from "@/server/infrastructure/db";
import { documentRequests, documentItems } from "@/server/infrastructure/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getSessionContext, assertCanWrite } from "@/server/application/context";
import { recordAudit } from "@/server/application/session";
import { z } from "zod";

const createDocumentRequestSchema = z.object({
  clientId: z.string(),
  clientName: z.string(),
  title: z.string().min(3).max(200),
  periodStart: z.string().optional(),
  periodEnd: z.string().optional(),
  dueAt: z.string(),
  items: z.array(z.string().min(2)).min(1),
});

export async function listDocumentRequests(clientId?: string) {
  await ensureDatabaseInitialized();
  const context = await getSessionContext();
  const requests = await db
    .select()
    .from(documentRequests)
    .where(eq(documentRequests.organizationId, context.organizationId))
    .orderBy(desc(documentRequests.createdAt));

  const allItems = await db
    .select()
    .from(documentItems)
    .where(eq(documentItems.organizationId, context.organizationId));

  const result = requests
    .filter((r) => (!clientId ? true : r.clientId === clientId))
    .map((r) => {
      const items = allItems.filter((i) => i.documentRequestId === r.id);
      return {
        ...r,
        items,
      };
    });

  return result;
}

export async function createDocumentRequest(raw: unknown) {
  await ensureDatabaseInitialized();
  const context = await getSessionContext();
  assertCanWrite(context);
  const data = createDocumentRequestSchema.parse(raw);
  const reqId = `docreq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  await db.insert(documentRequests).values({
    id: reqId,
    organizationId: context.organizationId,
    clientId: data.clientId,
    clientName: data.clientName,
    title: data.title,
    periodStart: data.periodStart || null,
    periodEnd: data.periodEnd || null,
    dueAt: data.dueAt,
    status: "pending",
    createdBy: context.userId,
    createdAt: now,
    updatedAt: now,
  });

  for (const itemLabel of data.items) {
    const itemId = `docitem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await db.insert(documentItems).values({
      id: itemId,
      organizationId: context.organizationId,
      documentRequestId: reqId,
      label: itemLabel,
      description: null,
      status: "requested",
      required: true,
      fileId: null,
      fileName: null,
      fileSize: null,
      reviewNote: null,
      reviewedBy: null,
      reviewedAt: null,
      updatedAt: now,
    });
  }

  await recordAudit(context, "document_request.created", "document_request", reqId, { title: data.title });
  return { id: reqId };
}

export async function updateDocumentItemStatus(
  itemId: string,
  status: "requested" | "received" | "under_review" | "approved" | "rejected" | "expired",
  reviewNote?: string
) {
  await ensureDatabaseInitialized();
  const context = await getSessionContext();
  assertCanWrite(context);
  const now = new Date().toISOString();

  await db
    .update(documentItems)
    .set({
      status,
      reviewNote: reviewNote || null,
      reviewedBy: context.userName,
      reviewedAt: now,
      updatedAt: now,
    })
    .where(and(eq(documentItems.organizationId, context.organizationId), eq(documentItems.id, itemId)));

  await recordAudit(context, "document_item.reviewed", "document_item", itemId, { status, reviewNote });
}

export async function registerItemUpload(itemId: string, fileName: string, fileSize: number) {
  await ensureDatabaseInitialized();
  const context = await getSessionContext();
  assertCanWrite(context);
  const now = new Date().toISOString();

  await db
    .update(documentItems)
    .set({
      status: "received",
      fileName,
      fileSize,
      updatedAt: now,
    })
    .where(and(eq(documentItems.organizationId, context.organizationId), eq(documentItems.id, itemId)));

  await recordAudit(context, "document_item.uploaded", "document_item", itemId, { fileName, fileSize });
}
