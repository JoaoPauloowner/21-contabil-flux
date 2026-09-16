import { db, ensureDatabaseInitialized } from "@/server/infrastructure/db";
import { knowledgeArticles } from "@/server/infrastructure/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getSessionContext, assertCanWrite } from "@/server/application/context";
import { recordAudit } from "@/server/application/session";
import { z } from "zod";

const articleSchema = z.object({
  title: z.string().min(3).max(200),
  body: z.string().min(10).max(10000),
  department: z.enum(["contabil", "fiscal", "pessoal", "societario", "geral"]).default("geral"),
});

export async function listKnowledgeArticles(department?: string) {
  await ensureDatabaseInitialized();
  const context = await getSessionContext();
  const articles = await db
    .select()
    .from(knowledgeArticles)
    .where(eq(knowledgeArticles.organizationId, context.organizationId))
    .orderBy(desc(knowledgeArticles.createdAt));

  if (department && department !== "todas") {
    return articles.filter((a) => a.department === department);
  }
  return articles;
}

export async function createArticle(raw: unknown) {
  await ensureDatabaseInitialized();
  const context = await getSessionContext();
  assertCanWrite(context);
  const data = articleSchema.parse(raw);
  const id = `art_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const newArticle = {
    id,
    organizationId: context.organizationId,
    title: data.title,
    body: data.body,
    department: data.department,
    status: "published" as const,
    createdBy: context.userId,
    publishedBy: context.userName,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(knowledgeArticles).values(newArticle);
  await recordAudit(context, "knowledge.created", "knowledge_article", id, { title: data.title });
  return newArticle;
}
