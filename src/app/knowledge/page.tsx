"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { BookOpen, Plus, Search, Tag, X, User, CheckCircle } from "lucide-react";

type Article = {
  id: string;
  title: string;
  body: string;
  department: string;
  status: string;
  publishedBy: string | null;
  createdAt: string;
};

export default function KnowledgePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    department: "geral",
    body: "",
  });

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/knowledge");
      const json = await res.json();
      if (json.data) setArticles(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        alert("Erro ao criar artigo");
        return;
      }

      setModalOpen(false);
      setForm({ title: "", department: "geral", body: "" });
      fetchArticles();
    } catch (e) {
      alert("Erro ao conectar");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.body.toLowerCase().includes(search.toLowerCase());
    const matchesDept = department === "all" || a.department === department;
    return matchesSearch && matchesDept;
  });

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Base de Conhecimento Interna
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manuais, orientações tributárias, prazos e checklists que alimentam a assistência de IA.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Procedimento</span>
          </button>
        </div>

        {/* Filtros e Busca */}
        <div className="card p-4 bg-white flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Pesquisar orientações, leis ou manuais..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 w-full md:w-auto"
            >
              <option value="all">Todos os Departamentos</option>
              <option value="fiscal">Fiscal</option>
              <option value="contabil">Contábil</option>
              <option value="pessoal">Pessoal (RH)</option>
              <option value="societario">Societário</option>
              <option value="geral">Geral</option>
            </select>
          </div>
        </div>

        {/* Lista de Artigos */}
        {loading ? (
          <div className="card p-12 text-center text-sm text-slate-400 bg-white">
            Carregando base de conhecimento...
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center text-sm text-slate-500 bg-white">
            Nenhum procedimento encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((art) => (
              <div
                key={art.id}
                className="card p-6 bg-white space-y-3 hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="capitalize text-xs font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100">
                      {art.department}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Aprovado para IA
                    </span>
                  </div>

                  <h2 className="font-bold text-slate-900 text-base leading-snug">{art.title}</h2>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap line-clamp-4">
                    {art.body}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {art.publishedBy || "Equipe"}
                  </span>
                  <span>{art.createdAt.slice(0, 10)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Novo Procedimento */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Novo Procedimento Interno</h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateArticle} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Título do Procedimento ou Regra *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Ex: Documentos Obrigatórios para Rescisão Trabalhista"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Departamento Responsável *
                  </label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="geral">Geral / Administrativo</option>
                    <option value="fiscal">Fiscal</option>
                    <option value="contabil">Contábil</option>
                    <option value="pessoal">Pessoal (RH)</option>
                    <option value="societario">Societário</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Conteúdo / Instruções / Prazos (Usado pela IA para responder clientes) *
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                    placeholder="Descreva o passo a passo, prazos legais, documentação requerida..."
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500 text-xs leading-relaxed"
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
                    {submitting ? "Publicando..." : "Publicar Procedimento"}
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
