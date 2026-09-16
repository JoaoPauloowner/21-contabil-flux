import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { listRequests } from "@/server/application/request-service";
import { listTasks } from "@/server/application/task-service";
import { listClients } from "@/server/application/client-service";
import {
  Inbox,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Building2,
  ArrowUpRight,
  Plus,
} from "lucide-react";

export default async function DashboardPage() {
  const requests = await listRequests();
  const tasks = await listTasks();
  const clients = await listClients();

  const today = new Date().toISOString().split("T")[0];

  const openRequests = requests.filter((r) => r.status !== "resolved");
  const unassigned = requests.filter((r) => !r.assigneeName);
  const waitingClient = requests.filter((r) => r.status === "waiting_client");
  const overdue = requests.filter((r) => r.status !== "resolved" && r.dueAt < today);
  const pendingTasks = tasks.filter((t) => t.status !== "done" && t.status !== "cancelled");

  const cards = [
    {
      label: "Solicitações Abertas",
      value: openRequests.length,
      icon: Inbox,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      href: "/requests?status=open",
    },
    {
      label: "Sem Responsável",
      value: unassigned.length,
      icon: AlertTriangle,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      href: "/requests",
    },
    {
      label: "Aguardando Cliente",
      value: waitingClient.length,
      icon: Clock,
      color: "text-purple-600 bg-purple-50 border-purple-100",
      href: "/requests?status=waiting_client",
    },
    {
      label: "Vencidas / Alerta de Prazo",
      value: overdue.length,
      icon: AlertTriangle,
      color: "text-rose-600 bg-rose-50 border-rose-100",
      href: "/requests",
    },
    {
      label: "Tarefas Pendentes da Equipe",
      value: pendingTasks.length,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      href: "/tasks",
    },
    {
      label: "Clientes Ativos",
      value: clients.length,
      icon: Building2,
      color: "text-slate-600 bg-slate-50 border-slate-200",
      href: "/clients",
    },
  ];

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-2">
              <span>Ambiente de Operação Conectado</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Central Operacional
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Visão em tempo real das demandas, pendências fiscais e prazos do escritório.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/requests"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Solicitação</span>
            </Link>
          </div>
        </div>

        {/* Grade de Indicadores Operacionais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                href={card.href}
                className="group card p-5 hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {card.label}
                  </span>
                  <div className={`p-2 rounded-lg border ${card.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {card.value}
                  </span>
                  <span className="text-xs text-blue-600 font-medium inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                    Ver lista <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Atenção Imediata & Últimas Demandas */}
        <div className="card overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-200 bg-white flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Demandas Operacionais Recentes</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Solicitações que requerem triagem, resposta ou fechamento pela equipe.
              </p>
            </div>
            <Link href="/requests" className="text-xs font-semibold text-blue-600 hover:underline">
              Ver todas ({requests.length})
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {requests.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                Nenhuma solicitação cadastrada no momento.
              </div>
            ) : (
              requests.slice(0, 5).map((req) => (
                <Link
                  key={req.id}
                  href={`/requests/${req.id}`}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 hover:text-blue-600 transition">
                        {req.subject}
                      </span>
                      <span
                        className={`badge ${
                          req.priority === "urgent"
                            ? "bg-rose-100 text-rose-700"
                            : req.priority === "high"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {req.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      <span className="font-medium text-slate-700">{req.clientName}</span> ·{" "}
                      <span className="uppercase font-semibold text-blue-600">{req.department}</span> · Prazo:{" "}
                      {req.dueAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">
                      {req.assigneeName ? `Resp: ${req.assigneeName}` : "Sem responsável"}
                    </span>
                    <span
                      className={`badge capitalize ${
                        req.status === "resolved"
                          ? "bg-emerald-100 text-emerald-800"
                          : req.status === "waiting_client"
                          ? "bg-purple-100 text-purple-800"
                          : req.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {req.status.replace("_", " ")}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
