"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import {
  Building2,
  Plus,
  Search,
  Mail,
  Phone,
  FileText,
  Trash2,
  X,
  ShieldCheck,
} from "lucide-react";

type Client = {
  id: string;
  legalName: string;
  displayName: string;
  taxId: string | null;
  status: string;
  contactEmail: string | null;
  contactPhone: string | null;
  createdAt: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    legalName: "",
    displayName: "",
    taxId: "",
    contactEmail: "",
    contactPhone: "",
    status: "active" as const,
  });

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients");
      const json = await res.json();
      if (json.data) setClients(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Erro ao cadastrar cliente");
        return;
      }

      setModalOpen(false);
      setForm({
        legalName: "",
        displayName: "",
        taxId: "",
        contactEmail: "",
        contactPhone: "",
        status: "active",
      });
      fetchClients();
    } catch (e) {
      alert("Erro ao conectar");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClient = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente remover o cliente "${name}"?`)) return;
    try {
      await fetch(`/api/clients/${id}`, { method: "DELETE" });
      fetchClients();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = clients.filter((c) => {
    return (
      c.displayName.toLowerCase().includes(search.toLowerCase()) ||
      c.legalName.toLowerCase().includes(search.toLowerCase()) ||
      (c.taxId && c.taxId.includes(search))
    );
  });

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Clientes Atendidos
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Carteira de empresas, pessoas jurídicas e contatos sob responsabilidade do escritório.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Cliente</span>
          </button>
        </div>

        {/* Busca */}
        <div className="card p-4 bg-white">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar cliente por razão social, nome fantasia ou CNPJ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Grid de Clientes */}
        {loading ? (
          <div className="card p-12 text-center text-sm text-slate-400 bg-white">
            Carregando empresas clientes...
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center text-sm text-slate-500 bg-white">
            Nenhum cliente cadastrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((client) => (
              <div
                key={client.id}
                className="card p-5 bg-white flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-900 text-sm">{client.displayName}</h2>
                        <p className="text-[11px] text-slate-400 font-mono">{client.taxId || "Sem CNPJ"}</p>
                      </div>
                    </div>
                    <span
                      className={`badge text-[11px] font-bold ${
                        client.status === "active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {client.status === "active" ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-1">{client.legalName}</p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  {client.contactEmail && (
                    <div className="flex items-center gap-2 text-slate-500">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate">{client.contactEmail}</span>
                    </div>
                  )}
                  {client.contactPhone && (
                    <div className="flex items-center gap-2 text-slate-500">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{client.contactPhone}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    Cadastrado em: {client.createdAt.slice(0, 10)}
                  </span>
                  <button
                    onClick={() => handleDeleteClient(client.id, client.displayName)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Remover cliente"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Novo Cliente */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Cadastrar Empresa Cliente</h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateClient} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome Fantasia / Apelido da Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.displayName}
                    onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                    placeholder="Ex: Padaria Central"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Razão Social Completa *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.legalName}
                    onChange={(e) => setForm({ ...form, legalName: e.target.value })}
                    placeholder="Ex: Panificadora Central de Alimentos Ltda"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      CNPJ / CPF *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.taxId}
                      onChange={(e) => setForm({ ...form, taxId: e.target.value })}
                      placeholder="00.000.000/0001-00"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Telefone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={form.contactPhone}
                      onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                      placeholder="(11) 98765-4321"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail do Responsável Financeiro / Fiscal
                  </label>
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                    placeholder="financeiro@empresa.com.br"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-500"
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
                    {submitting ? "Cadastrando..." : "Salvar Empresa"}
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
