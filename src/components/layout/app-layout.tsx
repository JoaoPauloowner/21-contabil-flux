"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  CheckSquare,
  FileText,
  Building2,
  BookOpen,
  Settings,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const navigation = [
  { name: "Visão Geral", href: "/dashboard", icon: LayoutDashboard },
  { name: "Solicitações", href: "/requests", icon: Inbox },
  { name: "Tarefas", href: "/tasks", icon: CheckSquare },
  { name: "Documentos", href: "/documents", icon: FileText },
  { name: "Clientes", href: "/clients", icon: Building2 },
  { name: "Conhecimento", href: "/knowledge", icon: BookOpen },
  { name: "Configurações & Auditoria", href: "/settings", icon: Settings },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ userName: string; role: string; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.session) {
          setCurrentUser(data.session);
        } else {
          setCurrentUser({
            userName: "João Paulo",
            role: "owner",
            email: "admin@21contabil.com.br",
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
      {/* Barra Lateral */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-lg">
              21
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">Contábil</span>
              <span className="text-lg font-bold text-blue-400">Flux</span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>21 Contábil & Associados</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Rodapé do Perfil */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-slate-300" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {currentUser?.userName || "Operador"}
                </p>
                <p className="text-[11px] text-blue-400 font-mono capitalize">
                  {currentUser?.role || "owner"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sair"
              className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
