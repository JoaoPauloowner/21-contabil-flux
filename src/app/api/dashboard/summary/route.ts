import { NextResponse } from "next/server";
import { listRequests } from "@/server/application/request-service";
import { listTasks } from "@/server/application/task-service";
import { listClients } from "@/server/application/client-service";
import { listDocumentRequests } from "@/server/application/document-service";

export async function GET() {
  try {
    const requests = await listRequests();
    const tasks = await listTasks();
    const clients = await listClients();
    const docs = await listDocumentRequests();

    const today = new Date().toISOString().split("T")[0];

    return NextResponse.json({
      data: {
        openRequests: requests.filter((item) => item.status !== "resolved").length,
        unassigned: requests.filter((item) => !item.assigneeName).length,
        waitingClient: requests.filter((item) => item.status === "waiting_client").length,
        overdue: requests.filter((item) => item.status !== "resolved" && item.dueAt < today).length,
        pendingTasks: tasks.filter((t) => t.status !== "done" && t.status !== "cancelled").length,
        activeClients: clients.filter((c) => c.status === "active").length,
        pendingDocs: docs.filter((d) => d.status === "pending").length,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ERROR";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
