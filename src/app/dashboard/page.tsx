import Link from "next/link";
import { listRequests } from "@/server/application/request-service";

const nav = [["Visão geral","/dashboard"],["Solicitações","/requests"],["Tarefas","/tasks"],["Documentos","/documents"],["Clientes","/clients"],["Conhecimento","/knowledge"],["Configurações","/settings"]] as const;

export default function DashboardPage() {
  const requests = listRequests();
  const cards = [
    ["Abertas", requests.filter((r) => r.status !== "resolved").length, "text-blue-700"],
    ["Sem responsável", requests.filter((r) => !r.assignee).length, "text-amber-700"],
    ["Aguardando cliente", requests.filter((r) => r.status === "waiting_client").length, "text-emerald-700"]
  ];
  return <div className="min-h-screen md:flex">
    <aside className="w-full border-b bg-white p-5 md:min-h-screen md:w-60 md:border-b-0 md:border-r"><div className="mb-8 text-xl font-black">Contábil <span className="text-blue-600">Flux</span></div><nav className="space-y-1">{nav.map(([label, href]) => <Link key={href} href={href as never} className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-950">{label}</Link>)}</nav></aside>
    <main className="flex-1 p-6 md:p-10"><div className="mb-8 flex items-start justify-between"><div><p className="text-sm font-semibold text-blue-600">Visão geral</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Bom dia, equipe</h1><p className="mt-2 text-slate-500">Aqui está o que precisa da sua atenção hoje.</p></div><Link href="/requests" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">Ver solicitações</Link></div>
      <div className="grid gap-4 md:grid-cols-3">{cards.map(([label, value, color]) => <div className="card p-5" key={label}><p className="text-sm text-slate-500">{label}</p><p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p></div>)}</div>
      <section className="card mt-8 overflow-hidden"><div className="border-b p-5"><h2 className="font-bold">Atenção imediata</h2><p className="mt-1 text-sm text-slate-500">Solicitações que precisam de uma próxima ação.</p></div><div>{requests.map((item) => <Link href={`/requests/${item.id}`} key={item.id} className="flex items-center justify-between border-b p-5 last:border-0 hover:bg-slate-50"><div><p className="font-semibold">{item.subject}</p><p className="mt-1 text-sm text-slate-500">{item.clientName} · {item.department}</p></div><span className="badge bg-slate-100 text-slate-700">{item.status}</span></Link>)}</div></section>
    </main></div>;
}
