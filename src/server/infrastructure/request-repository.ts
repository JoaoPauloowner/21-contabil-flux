import { db, ensureDatabaseInitialized } from "./db";
import { requests, requestMessages, tasks, type requests as RequestsTable } from "./db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import type { AccountingRequest, CreateRequestInput, RequestStatus } from "@/server/domain/request";

export class DrizzleRequestRepository {
  async list(organizationId: string, filters?: { status?: string; department?: string; priority?: string }) {
    await ensureDatabaseInitialized();
    const query = db
      .select()
      .from(requests)
      .where(and(eq(requests.organizationId, organizationId), isNull(requests.deletedAt)))
      .orderBy(desc(requests.createdAt));

    const rows = await query;
    return rows.filter((r) => {
      if (filters?.status && r.status !== filters.status) return false;
      if (filters?.department && r.department !== filters.department) return false;
      if (filters?.priority && r.priority !== filters.priority) return false;
      return true;
    });
  }

  async getById(organizationId: string, id: string) {
    await ensureDatabaseInitialized();
    const [request] = await db
      .select()
      .from(requests)
      .where(and(eq(requests.organizationId, organizationId), eq(requests.id, id), isNull(requests.deletedAt)));

    if (!request) return null;

    // Busca tarefas vinculadas
    const relatedTasks = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.organizationId, organizationId), eq(tasks.requestId, id)));

    // Busca mensagens
    const messages = await db
      .select()
      .from(requestMessages)
      .where(and(eq(requestMessages.organizationId, organizationId), eq(requestMessages.requestId, id)))
      .orderBy(requestMessages.createdAt);

    return {
      ...request,
      tasks: relatedTasks,
      messages,
    };
  }

  async create(
    organizationId: string,
    input: CreateRequestInput,
    createdBy: string
  ): Promise<typeof requests.$inferSelect> {
    await ensureDatabaseInitialized();
    const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const newRequest = {
      id,
      organizationId,
      clientId: null,
      clientName: input.clientName,
      subject: input.subject,
      description: input.description,
      department: input.department,
      priority: input.priority ?? "medium",
      status: input.status ?? "open",
      assigneeId: null,
      assigneeName: input.assignee ?? null,
      dueAt: input.dueAt,
      resolvedAt: null,
      createdBy,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    await db.insert(requests).values(newRequest);
    return newRequest;
  }

  async updateStatus(organizationId: string, id: string, status: RequestStatus) {
    await ensureDatabaseInitialized();
    const now = new Date().toISOString();
    await db
      .update(requests)
      .set({
        status,
        updatedAt: now,
        resolvedAt: status === "resolved" ? now : null,
      })
      .where(and(eq(requests.organizationId, organizationId), eq(requests.id, id)));
  }

  async addMessage(
    organizationId: string,
    requestId: string,
    authorName: string,
    authorUserId: string | null,
    body: string,
    isInternal = true
  ) {
    await ensureDatabaseInitialized();
    const id = `msg_${Date.now()}`;
    const now = new Date().toISOString();

    await db.insert(requestMessages).values({
      id,
      organizationId,
      requestId,
      authorName,
      authorUserId,
      source: isInternal ? "internal" : "client",
      body,
      isInternal,
      createdAt: now,
    });
  }
}
