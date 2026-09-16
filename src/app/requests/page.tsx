"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Plus, Search, Filter, Clock, ArrowRight, X } from "lucide-react";

type RequestItem = {
  id: string;
  subject: string;
  clientName: string;
  department: string;
  priority: string;
  status: string;
  assigneeName: string | null;
  dueAt: string;
  createdAt: string;
};

type ClientItem = {
  id: string;
  displayName: string;
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Estado do Modal de Nova Solicitação
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    clientName: "",
    department: "fiscal",
    priority: "medium",
    dueAt: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    description: "",
  });

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/requests");
      const json = await res.json();
      if (json.data) setRequests(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients");
      const json = await res.json();
      if (json.data) {
        setClients(json.data);
        if (json.data[0] && !form.clientName) {
          setForm((prev) => ({ ...prev, clientName: json.data[0].displayName }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchClients();
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error?.message || "Erro ao criar solicitação");
        return;
      }

      setModalOpen(false);
      setForm({
        subject: "",
        clientName: clients[0]?.displayName || "",
        department: "fiscal",
        priority: "medium",
        dueAt: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
        description: "",
      });
      fetchRequests();
    } catch (err) {
      alert("Erro ao conectar ao servidor");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.subject.toLowerCase().includes(search.toLowerCase()) ||
      r.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter === "all" || r.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
        {/* Topo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Caixa de Solicitações
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Centralize e acompanhe todas as demandas contábeis, fiscais e de folha dos seus clientes.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Solicitação</span>
          </button>
        </div>

        {/* Filtros e Busca */}
        <div className="card p-4 flex flex-col md:flex-row items-center gap-3 bg-white">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por assunto ou cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Todos os Departamentos</option>
              <option value="fiscal">Fiscal</option>
              <option value="contabil">Contábil</option>
              <option value="pessoal">Pessoal (RH)</option>
              <option value="societario">Societário</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Todos os Status</option>
              <option value="open">Abertas</option>
              <option value="in_progress">Em Andamento</option>
              <option value="waiting_client">Aguardando Cliente</option>
              <option value="resolved">Resolvidas</option>
            </select>
          </div>
        </div>

        {/* Tabela de Solicitações */}
        <div className="card overflow-hidden shadow-sm bg-white">
          <div className="grid grid-cols-[2.5fr_1.5fr_1fr_1fr_1fr_40px] gap-4 border-b border-slate-200 bg-slate-50/80 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Solicitação</span>
            <span>Cliente</span>
            <span>Departamento</span>
            <span>Prioridade</span>
            <span>Status</span>
            <span></span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-slate-400">Carregando solicitações...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500">
              Nenhuma solicitação encontrada para os filtros selecionados.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((req) => (
                <Link
                  key={req.id}
                  href={`/requests/${req.id}`}
                  className="grid grid-cols-[2.5fr_1.5fr_1fr_1fr_1fr_40px] gap-4 items-center px-6 py-4 text-sm hover:bg-slate-50/90 transition group"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition">
                      {req.subject}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Prazo: {req.dueAt}
                    </p>
                  </div>
                  <span className="font-medium text-slate-700 truncate">{req.clientName}</span>
                  <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 w-fit">
                    {req.department}
                  </span>
                  <div>
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
                  <div>
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
                  <div className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition flex justify-end">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Criação de Solicitação */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Nova Solicitação Operacional</h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRequest} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assunto da Demanda *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Ex: Envio do Relatório de Notas Fiscais de Agosto"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cliente Atendido *
                    </label>
                    <select
                      value={form.clientName}
                      onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.displayName}>
                          {c.displayName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Departamento *
                    </label>
                    <select
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="fiscal">Fiscal</option>
                      <option value="contabil">Contábil</option>
                      <option value="pessoal">Pessoal (RH)</option>
                      <option value="societario">Societário</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Prioridade
                    </label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Data Limite (Prazo) *
                    </label>
                    <input
                      type="date"
                      required
                      value={form.dueAt}
                      onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Descrição Detalhada da Demanda *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Descreva o que o cliente pediu ou o que precisa ser feito..."
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg text-sm hover:bg-slate-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm shadow-sm transition disabled:opacity-50"
                  >
                    {submitting ? "Cadastrando..." : "Cadastrar Solicitação"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
