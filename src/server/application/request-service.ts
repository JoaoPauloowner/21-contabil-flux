import { z } from "zod";
import type { CreateRequestInput } from "@/server/domain/request";
import { audit, assertCanWrite, getSessionContext } from "@/server/application/context";
import { InMemoryRequestRepository } from "@/server/infrastructure/request-repository";

const inputSchema = z.object({ subject: z.string().min(3).max(160), description: z.string().min(3).max(5000), clientName: z.string().min(2).max(160), department: z.enum(["contabil", "fiscal", "pessoal", "societario"]), priority: z.enum(["low", "medium", "high", "urgent"]), assignee: z.string().max(120).nullable().optional(), dueAt: z.string().date(), status: z.enum(["open", "in_progress", "waiting_client", "resolved"]).optional() });
const repository = new InMemoryRequestRepository();
export function listRequests() { return repository.list(getSessionContext().organizationId); }
export function getRequest(id: string) { return repository.getById(getSessionContext().organizationId, id); }
export function createRequest(raw: unknown) { const context = getSessionContext(); assertCanWrite(context); const input = inputSchema.parse(raw) as CreateRequestInput; const request = repository.create(context.organizationId, input); audit("request.created", request.id); return request; }
