import { db, ensureDatabaseInitialized } from "@/server/infrastructure/db";
import { clients } from "@/server/infrastructure/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { getSessionContext, assertCanWrite } from "@/server/application/context";
import { recordAudit } from "@/server/application/session";
import { z } from "zod";

const clientInputSchema = z.object({
  legalName: z.string().min(2).max(200),
  displayName: z.string().min(2).max(100),
  taxId: z.string().min(11).max(20), // CPF ou CNPJ
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional().or(z.literal("")),
  status: z.enum(["active", "inactive", "onboarding"]).default("active"),
});

export type CreateClientInput = z.infer<typeof clientInputSchema>;

export async function listClients() {
  await ensureDatabaseInitialized();
  const context = await getSessionContext();
  return db
    .select()
    .from(clients)
    .where(and(eq(clients.organizationId, context.organizationId), isNull(clients.deletedAt)))
    .orderBy(desc(clients.createdAt));
}

export async function getClientById(id: string) {
  await ensureDatabaseInitialized();
  const context = await getSessionContext();
  const [client] = await db
    .select()
    .from(clients)
    .where(and(eq(clients.organizationId, context.organizationId), eq(clients.id, id), isNull(clients.deletedAt)));
  return client ?? null;
}

export async function createClient(raw: unknown) {
  await ensureDatabaseInitialized();
  const context = await getSessionContext();
  assertCanWrite(context);
  const data = clientInputSchema.parse(raw);
  const id = `cli_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const newClient = {
    id,
    organizationId: context.organizationId,
    legalName: data.legalName,
    displayName: data.displayName,
    taxId: data.taxId,
    status: data.status,
    contactEmail: data.contactEmail || null,
    contactPhone: data.contactPhone || null,
    metadataJson: null,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };

  await db.insert(clients).values(newClient);
  await recordAudit(context, "client.created", "client", id, { displayName: data.displayName });
  return newClient;
}

export async function deleteClient(id: string) {
  await ensureDatabaseInitialized();
  const context = await getSessionContext();
  assertCanWrite(context);
  const now = new Date().toISOString();
  await db
    .update(clients)
    .set({ deletedAt: now, updatedAt: now })
    .where(and(eq(clients.organizationId, context.organizationId), eq(clients.id, id)));
  await recordAudit(context, "client.deleted", "client", id);
}
