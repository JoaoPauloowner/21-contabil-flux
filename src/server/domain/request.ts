export type RequestStatus = "open" | "in_progress" | "waiting_client" | "resolved";
export type Priority = "low" | "medium" | "high" | "urgent";
export type Department = "contabil" | "fiscal" | "pessoal" | "societario";

export type Task = {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  assignee: string;
  dueAt: string;
};

export type AccountingRequest = {
  id: string;
  organizationId: string;
  subject: string;
  description: string;
  clientName: string;
  department: Department;
  priority: Priority;
  status: RequestStatus;
  assignee: string | null;
  dueAt: string;
  createdAt: string;
  tasks: Task[];
};

export type CreateRequestInput = Omit<AccountingRequest, "id" | "organizationId" | "createdAt" | "tasks" | "status"> & { status?: RequestStatus };
