import type { AccountingRequest, CreateRequestInput } from "@/server/domain/request";

const seed: AccountingRequest[] = [
  { id: "req_1", organizationId: "org_demo", subject: "Documentos do fechamento mensal", description: "Solicitar relatório de vendas e comprovantes.", clientName: "Empresa ABC Ltda.", department: "fiscal", priority: "urgent", status: "waiting_client", assignee: "Ana Souza", dueAt: "2026-09-20", createdAt: "2026-09-15T10:00:00Z", tasks: [{ id: "task_1", title: "Enviar cobrança de documentos", status: "in_progress", assignee: "Ana Souza", dueAt: "2026-09-18" }] },
  { id: "req_2", organizationId: "org_demo", subject: "Dúvida sobre folha de pagamento", description: "Cliente pediu esclarecimento sobre a folha de agosto.", clientName: "Empresa XYZ Serviços", department: "pessoal", priority: "high", status: "in_progress", assignee: "Carlos Lima", dueAt: "2026-09-18", createdAt: "2026-09-16T08:00:00Z", tasks: [] },
  { id: "req_3", organizationId: "org_demo", subject: "Alteração cadastral", description: "Atualizar endereço da empresa.", clientName: "Loja Central Ltda.", department: "societario", priority: "medium", status: "open", assignee: null, dueAt: "2026-09-22", createdAt: "2026-09-16T07:00:00Z", tasks: [] }
];

export class InMemoryRequestRepository {
  private static requests = [...seed];
  list(organizationId: string) { return InMemoryRequestRepository.requests.filter((item) => item.organizationId === organizationId); }
  getById(organizationId: string, id: string) { return InMemoryRequestRepository.requests.find((item) => item.organizationId === organizationId && item.id === id) ?? null; }
  create(organizationId: string, input: CreateRequestInput): AccountingRequest { const request: AccountingRequest = { ...input, id: `req_${Date.now()}`, organizationId, createdAt: new Date().toISOString(), status: input.status ?? "open", tasks: [] }; InMemoryRequestRepository.requests.unshift(request); return request; }
}
