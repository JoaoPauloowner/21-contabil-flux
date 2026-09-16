"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  Edit3,
  Copy,
  Check,
  Building2,
  FileText,
  User,
  Volume2,
  Image as ImageIcon,
  MessageSquare,
} from "lucide-react";

type RequestDetail = {
  id: string;
  subject: string;
  description: string;
  clientName: string;
  department: string;
  priority: string;
  status: string;
  assigneeName: string | null;
  dueAt: string;
  createdAt: string;
  tasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    assigneeName: string | null;
    dueAt: string;
  }>;
  messages: Array<{
    id: string;
    authorName: string;
    source: string;
    body: string;
    mediaType?: "text" | "audio" | "image" | "document";
    mediaUrl?: string | null;
    mediaName?: string | null;
    transcription?: string | null;
    isInternal: boolean;
    createdAt: string;
  }>;
};

type DraftData = {
  id: string;
  content: string;
  editedContent: string | null;
  confidence: string;
  model: string;
  status: string;
  approvedBy: string | null;
  sourcesJson: string | null;
};

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [draft, setDraft] = useState<DraftData | null>(null);
  const [loading, setLoading] = useState(true);

  // Mensagem nova
  const [newMessage, setNewMessage] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  // Nova Tarefa
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDue, setTaskDue] = useState(new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0]);
  const [addingTask, setAddingTask] = useState(false);

  // IA Rascunho
  const [editingDraft, setEditingDraft] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [savingDraft, setSavingDraft] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchRequestData = async () => {
    try {
      const res = await fetch(`/api/requests/${id}`);
      if (res.ok) {
        const json = await res.json();
        setRequest(json.data);
      }
      const draftRes = await fetch(`/api/requests/${id}/drafts`);
      if (draftRes.ok) {
        const draftJson = await draftRes.json();
        setDraft(draftJson.data);
        setDraftText(draftJson.data.editedContent || draftJson.data.content);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestData();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchRequestData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSendingMsg(true);
    try {
      await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage, isInternal: true }),
      });
      setNewMessage("");
      fetchRequestData();
    } catch (e) {
      console.error(e);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    setAddingTask(true);
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: id,
          title: taskTitle,
          dueAt: taskDue,
        }),
      });
      setTaskTitle("");
      fetchRequestData();
    } catch (e) {
      console.error(e);
    } finally {
      setAddingTask(false);
    }
  };

  const handleSaveDraftEdit = async () => {
    setSavingDraft(true);
    try {
      await fetch(`/api/requests/${id}/drafts`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: draftText }),
      });
      setEditingDraft(false);
      fetchRequestData();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingDraft(false);
    }
  };

  const handleApproveDraft = async () => {
    setSavingDraft(true);
    try {
      await fetch(`/api/requests/${id}/drafts`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
      fetchRequestData();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingDraft(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-12 text-center text-sm text-slate-500">Carregando detalhes da solicitação...</div>
      </AppLayout>
    );
  }

  if (!request) {
    return (
      <AppLayout>
        <div className="p-12 text-center">
          <p className="text-slate-600 mb-4">Solicitação não encontrada.</p>
          <Link href="/requests" className="text-sm font-semibold text-blue-600 hover:underline">
            ← Voltar para a lista
          </Link>
        </div>
      </AppLayout>
    );
  }

  const sources = draft?.sourcesJson ? JSON.parse(draft.sourcesJson) : [];

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
        {/* Navegação de Retorno */}
        <Link
          href="/requests"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para Solicitações</span>
        </Link>

        {/* Barra de Título e Ações de Status */}
        <div className="card p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {request.department}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">{request.clientName}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">{request.subject}</h1>
            <p className="text-xs text-slate-400 flex items-center gap-3">
              <span>Prazo: <strong className="text-slate-700">{request.dueAt}</strong></span>
              <span>Responsável: <strong className="text-slate-700">{request.assigneeName || "Não atribuído"}</strong></span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-500">Status:</label>
            <select
              value={request.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wide border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="open">Aberta</option>
              <option value="in_progress">Em Andamento</option>
              <option value="waiting_client">Aguardando Cliente</option>
              <option value="resolved">Resolvida</option>
            </select>
          </div>
        </div>

        {/* Conteúdo em Duas Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
          {/* Coluna Esquerda: Contexto, Tarefas e Timeline de Mensagens */}
          <div className="space-y-6">
            {/* Detalhes da Solicitação */}
            <div className="card p-6 bg-white">
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Contexto Operacional da Demanda</span>
              </h2>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {request.description}
              </div>
            </div>

            {/* Tarefas Vinculadas */}
            <div className="card p-6 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tarefas Operacionais Relacionadas</span>
                </h2>
                <span className="text-xs text-slate-400 font-semibold">{request.tasks.length} tarefas</span>
              </div>

              {request.tasks.length === 0 ? (
                <p className="text-xs text-slate-400">Nenhuma tarefa interna criada para esta solicitação.</p>
              ) : (
                <div className="space-y-2">
                  {request.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-800">{task.title}</span>
                        <p className="text-slate-400">Prazo: {task.dueAt}</p>
                      </div>
                      <span className="badge capitalize bg-slate-200/70 text-slate-700">{task.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulário Rápido de Nova Tarefa */}
              <form onSubmit={handleAddTask} className="pt-3 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  placeholder="Nova tarefa interna..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
                <input
                  type="date"
                  value={taskDue}
                  onChange={(e) => setTaskDue(e.target.value)}
                  className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={addingTask}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                >
                  Adicionar
                </button>
              </form>
            </div>

            {/* Histórico e Mensagens Internas */}
            <div className="card p-6 bg-white space-y-4">
              <h2 className="font-bold text-slate-900 text-sm">Histórico e Observações da Equipe</h2>

              <div className="space-y-3">
                {request.messages.map((msg) => (
                  <div key={msg.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          {msg.authorName}
                        </span>
                        {msg.source === "whatsapp" && (
                          <span className="badge bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            WhatsApp
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 text-[11px]">
                        {msg.createdAt.slice(0, 16).replace("T", " ")}
                      </span>
                    </div>

                    {/* Mídia: Áudio de Voz com Player e Transcrição */}
                    {msg.mediaType === "audio" ? (
                      <div className="space-y-2 p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
                        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
                          <Volume2 className="w-4 h-4" />
                          <span>Mensagem de Voz Recebida</span>
                        </div>
                        {msg.mediaUrl ? (
                          <audio controls src={msg.mediaUrl} className="w-full h-8" />
                        ) : (
                          <div className="text-xs text-slate-500 italic">Áudio processado pela central</div>
                        )}
                        {msg.transcription && (
                          <div className="p-2.5 rounded-lg bg-white border border-blue-100 text-xs text-slate-700 space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Transcrição Automática por IA:
                            </p>
                            <p className="leading-relaxed italic text-slate-800">"{msg.transcription}"</p>
                          </div>
                        )}
                      </div>
                    ) : msg.mediaType === "image" ? (
                      /* Mídia: Imagem / Comprovante */
                      <div className="space-y-2 p-3 bg-white border border-slate-200 rounded-xl">
                        <div className="flex items-center gap-2 text-xs font-semibold text-purple-700">
                          <ImageIcon className="w-4 h-4" />
                          <span>Comprovante / Imagem Anexada</span>
                        </div>
                        {msg.mediaUrl && (
                          <a href={msg.mediaUrl} target="_blank" rel="noopener noreferrer">
                            <img
                              src={msg.mediaUrl}
                              alt={msg.mediaName || "Comprovante"}
                              className="max-h-60 rounded-lg border border-slate-200 object-contain hover:opacity-95 transition"
                            />
                          </a>
                        )}
                        <p className="text-xs text-slate-600">{msg.body}</p>
                      </div>
                    ) : msg.mediaType === "document" ? (
                      /* Mídia: Documento / PDF */
                      <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-5 h-5 text-rose-600 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-slate-800">{msg.mediaName || "Documento PDF"}</p>
                            <p className="text-[11px] text-slate-500">{msg.body}</p>
                          </div>
                        </div>
                        {msg.mediaUrl && (
                          <a
                            href={msg.mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
                          >
                            Baixar / Ver
                          </a>
                        )}
                      </div>
                    ) : (
                      /* Mensagem de Texto Padrão */
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  placeholder="Registrar anotação interna ou atualização..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={sendingMsg}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar</span>
                </button>
              </form>
            </div>
          </div>

          {/* Coluna Direita: Assistência de IA (Human-in-the-Loop) */}
          <aside className="card p-6 bg-white border-blue-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">Assistência de IA</h2>
                  <p className="text-[11px] text-slate-500">Rascunho Técnico para Revisão</p>
                </div>
              </div>
              <span
                className={`badge text-xs font-bold capitalize ${
                  draft?.status === "approved"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
              >
                {draft?.status === "approved" ? "Aprovado" : "Sugestão"}
              </span>
            </div>

            {/* Aviso de Responsabilidade */}
            <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-900 text-xs leading-relaxed">
              <strong>Humano no Circuito:</strong> Esta sugestão foi gerada com base nos procedimentos contábeis internos. Revise antes de encaminhar ao cliente.
            </div>

            {/* Caixa de Texto do Rascunho */}
            <div className="space-y-2">
              {editingDraft ? (
                <div className="space-y-2">
                  <textarea
                    rows={10}
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    className="w-full p-3.5 text-xs text-slate-800 border border-blue-400 rounded-xl focus:outline-none leading-relaxed bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingDraft(false)}
                      className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-xs font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveDraftEdit}
                      disabled={savingDraft}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-sm"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap relative group">
                  {draftText}
                </div>
              )}
            </div>

            {/* Metadados e Fontes Internas */}
            <div className="pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
              <p>Modelo: <span className="font-mono text-slate-700">{draft?.model}</span></p>
              <p>Confiança técnica: <strong className="text-slate-700 uppercase">{draft?.confidence}</strong></p>
              {draft?.approvedBy && (
                <p className="text-emerald-700 font-medium">
                  ✓ Aprovado por: <strong>{draft.approvedBy}</strong>
                </p>
              )}
              {sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <p className="font-semibold text-slate-700 mb-1">Fontes internas consultadas:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {sources.map((s: { id: string; title: string }) => (
                      <li key={s.id}>{s.title}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Botões de Ação */}
            {!editingDraft && (
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setEditingDraft(true)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar Texto</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                  title="Copiar texto"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                {draft?.status !== "approved" && (
                  <button
                    onClick={handleApproveDraft}
                    disabled={savingDraft}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Aprovar Rascunho</span>
                  </button>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}
