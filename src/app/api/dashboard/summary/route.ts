import { NextResponse } from "next/server";
import { listRequests } from "@/server/application/request-service";

export async function GET() {
  const requests = listRequests();
  return NextResponse.json({ data: {
    overdue: requests.filter((item) => item.status !== "resolved" && item.dueAt < "2026-09-16").length,
    unassigned: requests.filter((item) => !item.assignee).length,
    waitingClient: requests.filter((item) => item.status === "waiting_client").length,
    open: requests.filter((item) => item.status !== "resolved").length
  } });
}
