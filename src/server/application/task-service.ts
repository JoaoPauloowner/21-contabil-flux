import { db, ensureDatabaseInitialized } from "@/server/infrastructure/db";
import { tasks } from "@/server/infrastructure/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getSessionContext, assertCanWrite } from "@/server/application/context";
import { recordAudit } from "@/server/application/session";
import { z } from "zod";

const taskSchema = z.object({
  requestId: z.string().optional().nullable(),
  clientId: z.string().optional().nullable(),
  title: z.string().min(3).max(200),
  description: z.string().optional().nullable(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  assigneeName: z.string().optional().nullable(),
  dueAt: z.string(),
});

export async function listTasks(requestId?: string) {
  await ensureDatabaseInitialized();
  const context = await getSessionContext();
  const query = db
    .select()
    .from(tasks)
    .where(eq(tasks.organizationId, context.organizationId))
    .orderBy(desc(tasks.createdAt));

  const allTasks = await query;
  if (requestId) {
    return allTasks.filter((t) => t.requestId === requestId);
  }
  return allTasks;
}

export async function createTask(raw: unknown) {
  await ensureDatabaseInitialized();
  const context = await getSessionContext();
  assertCanWrite(context);
  const data = taskSchema.parse(raw);
  const id = `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const newTask = {
    id,
    organizationId: context.organizationId,
    requestId: data.requestId || null,
    clientId: data.clientId || null,
    title: data.title,
    description: data.description || null,
    status: "todo" as const,
    priority: data.priority,
    assigneeName: data.assigneeName || context.userName,
    assigneeId: context.userId,
    dueAt: data.dueAt,
    completedAt: null,
    createdBy: context.userId,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(tasks).values(newTask);
  await recordAudit(context, "task.created", "task", id, { title: data.title });
  return newTask;
}

export async function updateTaskStatus(id: string, status: "todo" | "in_progress" | "blocked" | "done" | "cancelled") {
  await ensureDatabaseInitialized();
  const context = await getSessionContext();
  assertCanWrite(context);
  const now = new Date().toISOString();
  await db
    .update(tasks)
    .set({
      status,
      completedAt: status === "done" ? now : null,
      updatedAt: now,
    })
    .where(and(eq(tasks.organizationId, context.organizationId), eq(tasks.id, id)));
  await recordAudit(context, "task.status_updated", "task", id, { status });
}
