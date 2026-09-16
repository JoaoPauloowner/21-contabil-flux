"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Plus, CheckCircle2, Clock, Filter, AlertTriangle, X } from "lucide-react";

type Task = {
  id: string;
  requestId: string | null;
  clientId: string | null;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "blocked" | "done" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  assigneeName: string | null;
  dueAt: string;
  createdAt: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueAt: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
  });

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const json = await res.json();
      if (json.data) setTasks(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (id: string, status: "todo" | "in_progress" | "done") => {
    try {
      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        alert("Erro ao criar tarefa");
        return;
      }

      setModalOpen(false);
      setForm({
        title: "",
        description: "",
        priority: "medium",
        dueAt: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
      });
      fetchTasks();
    } catch (e) {
      alert("Erro ao conectar");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = tasks.filter((t) => {
    if (filter === "all") return true;
    return t.status === filter;
  });

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Gestão de Tarefas
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Acompanhe as rotinas, obrigações acessórias e pendências da equipe contábil.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Tarefa</span>
          </button>
        </div>

        {/* Filtros Rápidos */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { key: "all", label: "Todas" },
            { key: "todo", label: "A Fazer" },
            { key: "in_progress", label: "Em Andamento" },
            { key: "done", label: "Concluídas" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                filter === tab.key
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lista de Tarefas */}
        <div className="card overflow-hidden shadow-sm bg-white">
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-400">Carregando tarefas...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500">Nenhuma tarefa encontrada.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((task) => (
                <div
                  key={task.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          task.status === "done" ? "line-through text-slate-400" : "text-slate-900"
                        }`}
                      >
                        {task.title}
                      </span>
                      <span
                        className={`badge ${
                          task.priority === "urgent"
                            ? "bg-rose-100 text-rose-700"
                            : task.priority === "high"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-3">
                      <span>Responsável: <strong>{task.assigneeName || "Equipe"}</strong></span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Prazo: {task.dueAt}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {task.status !== "todo" && (
                      <button
                        onClick={() => handleUpdateStatus(task.id, "todo")}
                        className="px-2.5 py-1.5 border border-slate-200 text-[11px] font-semibold text-slate-600 rounded-lg hover:bg-slate-100"
                      >
                        A Fazer
                      </button>
                    )}
                    {task.status !== "in_progress" && (
                      <button
                        onClick={() => handleUpdateStatus(task.id, "in_progress")}
                        className="px-2.5 py-1.5 bg-blue-50 border border-blue-200 text-[11px] font-semibold text-blue-700 rounded-lg hover:bg-blue-100"
                      >
                        Em Andamento
                      </button>
                    )}
                    {task.status !== "done" && (
                      <button
                        onClick={() => handleUpdateStatus(task.id, "done")}
                        className="px-3 py-1.5 bg-emerald-600 text-[11px] font-semibold text-white rounded-lg hover:bg-emerald-500 shadow-sm"
                      >
                        ✓ Concluir
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Criação de Tarefa */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Nova Tarefa da Equipe</h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Título da Tarefa *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Ex: Emitir guia do DAS Simples Nacional"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Prioridade</label>
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Prazo de Entrega *</label>
                    <input
                      type="date"
                      required
                      value={form.dueAt}
                      onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg text-sm hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm shadow-sm transition"
                  >
                    {submitting ? "Salvando..." : "Salvar Tarefa"}
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
