import { NextResponse } from "next/server";
import { listTasks, createTask, updateTaskStatus } from "@/server/application/task-service";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const requestId = url.searchParams.get("requestId") || undefined;
    const tasks = await listTasks(requestId);
    return NextResponse.json({ data: tasks });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ERROR";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const task = await createTask(body);
    return NextResponse.json({ data: task }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ERROR";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: "id e status são obrigatórios" }, { status: 400 });
    }
    await updateTaskStatus(body.id, body.status);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ERROR";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
