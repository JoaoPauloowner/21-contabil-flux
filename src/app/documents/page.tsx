"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import {
  FileText,
  Plus,
  Upload,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  X,
  AlertCircle,
} from "lucide-react";

type DocItem = {
  id: string;
  label: string;
  status: "requested" | "received" | "under_review" | "approved" | "rejected";
  fileName: string | null;
  fileSize: number | null;
  reviewNote: string | null;
  reviewedBy: string | null;
};

type DocRequest = {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  dueAt: string;
  status: string;
  items: DocItem[];
};

type ClientOption = {
  id: string;
  displayName: string;
};

export default function DocumentsPage() {
  const [docRequests, setDocRequests] = useState<DocRequest[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal de Novo Pedido
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    clientId: "",
    clientName: "",
    title: "",
    dueAt: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0],
    itemLabels: "Extrato Bancário Mensal (OFX/PDF)\nRelatório de Vendas e Notas Emitidas\nComprovantes de Pagamentos e Despesas",
  });

  const fetchData = async () => {
    try {
      const [docsRes, clientsRes] = await Promise.all([
        fetch("/api/documents"),
        fetch("/api/clients"),
      ]);
      const docsJson = await docsRes.json();
      const clientsJson = await clientsRes.json();

      if (docsJson.data) setDocRequests(docsJson.data);
      if (clientsJson.data) {
        setClients(clientsJson.data);
        if (clientsJson.data[0] && !form.clientId) {
          setForm((prev) => ({
            ...prev,
            clientId: clientsJson.data[0].id,
            clientName: clientsJson.data[0].displayName,
          }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSimulateUpload = async (itemId: string, label: string) => {
    try {
      await fetch(`/api/documents/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upload",
          fileName: `${label.toLowerCase().replace(/[^a-z0-9]/g, "_")}_anexado.pdf`,
          fileSize: 1024 * 540,
        }),
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReviewItem = async (itemId: string, status: "approved" | "rejected") => {
    const note = status === "rejected" ? prompt("Informe o motivo da recusa para o cliente:") : undefined;
    if (status === "rejected" && !note) return;

    try {
      await fetch(`/api/documents/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewNote: note }),
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const items = form.itemLabels
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: form.clientId,
          clientName: form.clientName,
          title: form.title,
          dueAt: form.dueAt,
          items,
        }),
      });

      if (!res.ok) {
        alert("Erro ao criar pedido de documentos");
        return;
      }

      setModalOpen(false);
      setForm((prev) => ({
        ...prev,
        title: "",
      }));
      fetchData();
    } catch (e) {
      alert("Erro ao conectar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Cobrança & Controle de Documentos
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Acompanhe o recebimento de extratos, notas e comprovantes para os fechamentos contábeis.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Pedido de Documentos</span>
          </button>
        </div>

        {/* Lista de Pedidos de Documentos */}
        <div className="space-y-6">
          {loading ? (
            <div className="card p-12 text-center text-sm text-slate-400 bg-white">
              Carregando pedidos de documentos...
            </div>
          ) : docRequests.length === 0 ? (
            <div className="card p-12 text-center text-sm text-slate-500 bg-white">
              Nenhum pedido de documentos cadastrado.
            </div>
          ) : (
            docRequests.map((batch) => (
              <div key={batch.id} className="card overflow-hidden shadow-sm bg-white">
                {/* Cabeçalho do Lote */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-slate-900 text-base">{batch.title}</h2>
                      <span className="badge bg-blue-100 text-blue-700 font-medium">
                        {batch.items.filter((i) => i.status === "approved").length} de {batch.items.length} aprovados
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{batch.clientName}</span>
                      <span>·</span>
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Prazo de Entrega: <strong>{batch.dueAt}</strong></span>
                    </p>
                  </div>
                </div>

                {/* Itens do Pedido */}
                <div className="divide-y divide-slate-100">
                  {batch.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-sm text-slate-800">{item.label}</span>
                          <span
                            className={`badge text-[11px] font-bold capitalize ${
                              item.status === "approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : item.status === "received"
                                ? "bg-blue-100 text-blue-800"
                                : item.status === "rejected"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-50 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {item.status === "requested"
                              ? "Aguardando Envio"
                              : item.status === "received"
                              ? "Recebido / Aguardando Revisão"
                              : item.status === "approved"
                              ? "Aprovado"
                              : "Rejeitado"}
                          </span>
                        </div>

                        {item.fileName && (
                          <p className="text-xs text-slate-500 pl-6">
                            Arquivo: <strong className="text-slate-700">{item.fileName}</strong> (
                            {Math.round((item.fileSize || 0) / 1024)} KB)
                          </p>
                        )}
                        {item.reviewNote && (
                          <p className="text-xs text-rose-600 pl-6 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Motivo da recusa: {item.reviewNote}
                          </p>
                        )}
                      </div>

                      {/* Botões de Ação do Item */}
                      <div className="flex items-center gap-2 pl-6 sm:pl-0">
                        {item.status === "requested" && (
                          <button
                            onClick={() => handleSimulateUpload(item.id, item.label)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Anexar Arquivo</span>
                          </button>
                        )}

                        {item.status === "received" && (
                          <>
                            <button
                              onClick={() => handleReviewItem(item.id, "approved")}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Aprovar</span>
                            </button>
                            <button
                              onClick={() => handleReviewItem(item.id, "rejected")}
                              className="inline-flex items-center gap-1 px-3 py-1.5 border border-rose-300 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Rejeitar</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Novo Pedido */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Novo Pedido de Documentos</h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateBatch} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Título do Pedido *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Ex: Documentação Fiscal - Setembro/2026"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Cliente *</label>
                    <select
                      value={form.clientId}
                      onChange={(e) => {
                        const sel = clients.find((c) => c.id === e.target.value);
                        setForm({
                          ...form,
                          clientId: e.target.value,
                          clientName: sel?.displayName || "",
                        });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.displayName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Data Limite *</label>
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
                    Itens Solicitados (1 por linha) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.itemLabels}
                    onChange={(e) => setForm({ ...form, itemLabels: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 font-mono text-xs"
                  />
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
                    {submitting ? "Criando..." : "Disparar Pedido"}
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
