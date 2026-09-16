import { z } from "zod";
import type { CreateRequestInput, RequestStatus } from "@/server/domain/request";
import { assertCanWrite, getSessionContext } from "@/server/application/context";
import { recordAudit } from "@/server/application/session";
import { DrizzleRequestRepository } from "@/server/infrastructure/request-repository";

const inputSchema = z.object({
  subject: z.string().min(3).max(160),
  description: z.string().min(3).max(5000),
  clientName: z.string().min(2).max(160),
  department: z.enum(["contabil", "fiscal", "pessoal", "societario"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  assignee: z.string().max(120).nullable().optional(),
  dueAt: z.string(),
  status: z.enum(["open", "in_progress", "waiting_client", "resolved"]).optional(),
});

const repository = new DrizzleRequestRepository();

export async function listRequests(filters?: { status?: string; department?: string; priority?: string }) {
  const context = await getSessionContext();
  return repository.list(context.organizationId, filters);
}

export async function getRequest(id: string) {
  const context = await getSessionContext();
  return repository.getById(context.organizationId, id);
}

export async function createRequest(raw: unknown) {
  const context = await getSessionContext();
  assertCanWrite(context);
  const input = inputSchema.parse(raw) as CreateRequestInput;
  const request = await repository.create(context.organizationId, input, context.userId);
  await recordAudit(context, "request.created", "request", request.id, {
    subject: request.subject,
    department: request.department,
  });
  return request;
}

export async function updateRequestStatus(id: string, status: RequestStatus) {
  const context = await getSessionContext();
  assertCanWrite(context);
  await repository.updateStatus(context.organizationId, id, status);
  await recordAudit(context, "request.status_updated", "request", id, { status });
}

export async function addRequestMessage(id: string, body: string, isInternal = true) {
  const context = await getSessionContext();
  assertCanWrite(context);
  await repository.addMessage(
    context.organizationId,
    id,
    context.userName,
    context.userId,
    body,
    isInternal
  );
  await recordAudit(context, "request.message_added", "request", id, { isInternal });
}
