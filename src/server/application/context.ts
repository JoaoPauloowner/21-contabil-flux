import { requireSession, assertCanWrite as assertWrite, recordAudit, type SessionData } from "./session";

export type SessionContext = {
  userId: string;
  organizationId: string;
  role: "owner" | "admin" | "manager" | "member" | "viewer";
};

export async function getSessionContext(): Promise<SessionData> {
  return requireSession();
}

export function assertCanWrite(context: { role: string }) {
  if (context.role === "viewer") throw new Error("FORBIDDEN");
}

export async function audit(action: string, entityId: string, entityType = "request") {
  const session = await requireSession();
  await recordAudit(session, action, entityType, entityId);
}
