import { NextResponse } from "next/server";
import { db, ensureDatabaseInitialized } from "@/server/infrastructure/db";
import { auditEvents } from "@/server/infrastructure/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSessionContext } from "@/server/application/context";

export async function GET() {
  try {
    await ensureDatabaseInitialized();
    const context = await getSessionContext();
    const events = await db
      .select()
      .from(auditEvents)
      .where(eq(auditEvents.organizationId, context.organizationId))
      .orderBy(desc(auditEvents.createdAt))
      .limit(50);

    return NextResponse.json({ data: events });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "ERROR";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
