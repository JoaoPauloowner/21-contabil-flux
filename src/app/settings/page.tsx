"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import {
  ShieldCheck,
  Building2,
  Users,
  History,
  Lock,
  CheckCircle,
  Clock,
  UserCheck,
} from "lucide-react";

type AuditEvent = {
  id: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId: string;
  result: string;
  metadataJson: string | null;
  createdAt: string;
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"org" | "audit">("org");
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  useEffect(() => {
    if (activeTab === "audit") {
      setLoadingAudit(true);
      fetch("/api/audit")
        .then((r) => r.json())
        .then((data) => {
          if (data?.data) setAuditEvents(data.data);
        })
        .catch(console.error)
        .finally(() => setLoadingAudit(false));
    }
  }, [activeTab]);

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Configurações & Conformidade
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gerenciamento do escritório contábil, controle de acessos e trilha de auditoria imutável.
          </p>
        </div>

        {/* Abas */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("org")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition ${
              activeTab === "org"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Organização & Permissões</span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition ${
              activeTab === "audit"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Trilha de Auditoria (LGPD & Compliance)</span>
          </button>
        </div>

        {activeTab === "org" ? (
          <div className="space-y-6">
            {/* Dados do Escritório */}
            <div className="card p-6 bg-white space-y-4">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Identificação do Escritório Parceiro</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="text-xs text-slate-400 font-semibold uppercase">Razão Social</p>
                  <p className="text-sm font-bold text-slate-800">21 Contábil & Associados</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="text-xs text-slate-400 font-semibold uppercase">Identificador Multi-Inquilino</p>
                  <p className="text-sm font-mono font-bold text-blue-600">org_principal</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="text-xs text-slate-400 font-semibold uppercase">Fuso Horário Padrão</p>
                  <p className="text-sm font-bold text-slate-800">America/Sao_Paulo (UTC-3)</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong className="block font-semibold">Isolamento Multi-tenant Ativo:</strong>
                  Todas as consultas e mutações desta sessão são estritamente filtradas pelo ID da sua organização.
                </div>
              </div>
            </div>

            {/* Membros e Papéis */}
            <div className="card p-6 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Membros da Equipe & Papéis</span>
                </h2>
              </div>

              <div className="divide-y divide-slate-100">
                {[
                  {
                    name: "João Paulo",
                    email: "admin@21contabil.com.br",
                    role: "owner",
                    dept: "Geral",
                    status: "Ativo",
                  },
                  {
                    name: "Ana Souza",
                    email: "ana.souza@21contabil.com.br",
                    role: "admin",
                    dept: "Fiscal",
                    status: "Ativo",
                  },
                  {
                    name: "Carlos Lima",
                    email: "carlos.lima@21contabil.com.br",
                    role: "member",
                    dept: "Pessoal (RH)",
                    status: "Ativo",
                  },
                ].map((m) => (
                  <div key={m.email} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                      <p className="text-xs text-slate-400">{m.email} · Depto: {m.dept}</p>
                    </div>
                    <span className="badge uppercase text-xs font-bold bg-blue-100 text-blue-800">
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Trilha de Auditoria */
          <div className="card overflow-hidden shadow-sm bg-white">
            <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">Registro Imutável de Eventos de Segurança</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Conforme exigido pelo item 3 de `docs/SECURITY.md`, todas as criações, aprovações de IA e exclusões são gravadas em banco.
                </p>
              </div>
            </div>

            {loadingAudit ? (
              <div className="p-12 text-center text-sm text-slate-400">Carregando eventos de auditoria...</div>
            ) : auditEvents.length === 0 ? (
              <div className="p-12 text-center text-sm text-slate-500">Nenhum evento registrado ainda.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {auditEvents.map((ev) => (
                  <div key={ev.id} className="p-4 sm:px-6 hover:bg-slate-50/50 transition flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {ev.action}
                        </span>
                        <span className="text-slate-700 font-semibold">{ev.entityType}:</span>
                        <span className="font-mono text-slate-500">{ev.entityId}</span>
                      </div>
                      <p className="text-slate-500">
                        Ator: <strong className="text-slate-700">{ev.actorName}</strong>
                        {ev.metadataJson && <span className="ml-2 font-mono text-slate-400">· {ev.metadataJson}</span>}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 block text-[11px] font-mono">
                        {ev.createdAt.slice(0, 19).replace("T", " ")}
                      </span>
                      <span className="badge bg-emerald-50 text-emerald-700 font-medium text-[10px]">
                        {ev.result}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
