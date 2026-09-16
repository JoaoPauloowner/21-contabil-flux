import { NextResponse } from "next/server";
import { listKnowledgeArticles, createArticle } from "@/server/application/knowledge-service";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const department = url.searchParams.get("department") || undefined;
    const articles = await listKnowledgeArticles(department);
    return NextResponse.json({ data: articles });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ERROR";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const article = await createArticle(body);
    return NextResponse.json({ data: article }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ERROR";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
