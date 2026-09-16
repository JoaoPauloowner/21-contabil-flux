export type SessionContext = {
  userId: string;
  organizationId: string;
  role: "owner" | "admin" | "manager" | "member" | "viewer";
};

export function getSessionContext(): SessionContext {
  // TODO: trocar por Auth.js/Clerk antes de produção.
  return { userId: "user_demo", organizationId: "org_demo", role: "owner" };
}

export function assertCanWrite(context: SessionContext) {
  if (context.role === "viewer") throw new Error("FORBIDDEN");
}

export function audit(action: string, entityId: string) {
  console.info(JSON.stringify({ type: "audit", action, entityId, at: new Date().toISOString() }));
}
