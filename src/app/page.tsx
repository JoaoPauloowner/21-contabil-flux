"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  Bot,
  FileText,
  Sparkles,
  Play,
  Users,
  Check,
  ChevronRight,
  X,
  Building2,
  HelpCircle,
  BarChart3,
  Lock,
  Headphones,
  FileSpreadsheet,
  AlertTriangle,
  Zap,
} from "lucide-react";

// ============================================================================
// CONFIGURAÇÃO COMERCIAL
// Substitua pelo seu número comercial oficial (DDI + DDD + Número sem traços)
// Exemplo: "5511999998888" ou configure via variável de ambiente NEXT_PUBLIC_COMMERCIAL_WHATSAPP
// ============================================================================
const DEFAULT_COMMERCIAL_WHATSAPP =
  process.env.NEXT_PUBLIC_COMMERCIAL_WHATSAPP || "5511999999999";

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Estados do formulário de qualificação
  const [formData, setFormData] = useState({
    name: "",
    firmName: "",
    phone: "",
    clientCount: "50-150",
    mainPain: "whatsapp-caos",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const painLabels: Record<string, string> = {
      "whatsapp-caos": "Caos de mensagens e áudios no WhatsApp",
      "docs-atrasados": "Documentos e extratos que clientes atrasam",
      "tarefas-perdidas": "Tarefas fiscais/folha sem responsável ou prazo claro",
      "respostas-repetitivas": "Equipe gastando tempo respondendo as mesmas dúvidas",
      outro: "Quero organizar e modernizar a operação",
    };

    const textMessage = `*Olá, João Paulo! Gostaria de agendar uma demonstração do Contábil Flux.*

📌 *Dados do Escritório:*
• *Responsável:* ${formData.name}
• *Escritório:* ${formData.firmName}
• *WhatsApp:* ${formData.phone}
• *Carteira Estimada:* ${formData.clientCount} clientes
• *Principal Desafio Atual:* ${painLabels[formData.mainPain] || formData.mainPain}

_Vim através da Landing Page oficial do Contábil Flux e tenho interesse no Programa Piloto._`;

    const whatsappUrl = `https://wa.me/${DEFAULT_COMMERCIAL_WHATSAPP}?text=${encodeURIComponent(
      textMessage
    )}`;

    setFormSubmitted(true);
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* ====================================================================
          NAVBAR
         ==================================================================== */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/20">
              21
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Contábil <span className="text-blue-500">Flux</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Operação & IA
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#solucao" className="hover:text-white transition-colors">
              O Problema
            </a>
            <a href="#recursos" className="hover:text-white transition-colors">
              Módulos
            </a>
            <a href="#como-funciona" className="hover:text-white transition-colors">
              Como Funciona
            </a>
            <a href="#seguranca" className="hover:text-white transition-colors">
              Segurança & LGPD
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              Dúvidas
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
            >
              Acessar Painel
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Testar Piloto</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ====================================================================
          HERO SECTION
         ==================================================================== */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        {/* Glows de fundo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[250px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge de Destaque */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-medium text-slate-300 mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Central Operacional Inteligente para Contabilidades Brasileiras</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            O fim do caos de mensagens e documentos perdidos no{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent">
              WhatsApp do seu escritório.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
            Centralize solicitações, organize tarefas da equipe, receba áudios e anexos fiscais com triagem imediata por IA — mantendo 100% do controle e supervisão profissional do contador.
          </p>

          {/* Chamada para Ação (CTA) */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base px-8 py-4 rounded-xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-5 h-5 text-blue-200" />
              <span>Quero Participar do Piloto Gratuito</span>
            </button>
            <a
              href="#preview"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-base px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Ver Como Funciona na Prática</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Badges de Confiança */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Conformidade com a LGPD</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Isolamento Total de Dados Fiscais</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>IA Supervisionada pelo Contador</span>
            </div>
          </div>

          {/* ================================================================
              MOCKUP VISUAL DO DASHBOARD (DEMONSTRAÇÃO INTERATIVA)
             ================================================================ */}
          <div id="preview" className="mt-16 sm:mt-20 max-w-6xl mx-auto">
            <div className="relative rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-800 shadow-2xl">
              {/* Barra superior de janela */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 mb-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 font-mono text-[11px] text-slate-500">
                    contabilflux.com.br/dashboard
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    WhatsApp Integrado & Ativo
                  </span>
                </div>
              </div>

              {/* Conteúdo demonstrativo da tela */}
              <div className="bg-slate-950 rounded-xl p-4 sm:p-6 text-left grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Coluna Esquerda: Triagem WhatsApp com Áudio (Destaque Principal) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                      <h4 className="font-semibold text-sm text-white">
                        Última Solicitação Recebida via WhatsApp
                      </h4>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                      Triagem Automática por IA
                    </span>
                  </div>

                  {/* Card da mensagem com áudio */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-200">Padaria Central Ltda.</span>
                        <span className="text-slate-500 ml-2">Marcos Vinícius (Sócio)</span>
                      </div>
                      <span className="text-slate-500">Hoje às 10:42</span>
                    </div>

                    {/* Simulação do Player de Áudio do WhatsApp */}
                    <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 flex items-center gap-3">
                      <button className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white shrink-0">
                        <Play className="w-4 h-4 fill-white translate-x-0.5" />
                      </button>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Áudio de WhatsApp (0:48)</span>
                          <span>Ouvir e Conferir</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full w-2/5 rounded-full" />
                        </div>
                      </div>
                    </div>

                    {/* Resumo da IA */}
                    <div className="bg-blue-950/30 border border-blue-900/40 rounded-lg p-3 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-[11px]">
                        <Bot className="w-3.5 h-3.5" />
                        <span>Diagnóstico da IA (Departamento Fiscal):</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        &quot;O cliente relata que emitiu a NF-e nº 1482 com CFOP incorreto e precisa de orientação urgente sobre cancelamento ou carta de correção dentro do prazo regulamentar.&quot;
                      </p>
                    </div>

                    {/* Ações da Equipe */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Responsável:</span>
                        <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded font-medium">
                          Carlos (Analista Fiscal)
                        </span>
                      </div>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                      >
                        <span>Aprovar Rascunho</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Coluna Direita: Indicadores e Tarefas Operacionais */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-semibold text-sm text-white">
                      Visão Operacional do Gestor
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                      <span className="text-[11px] text-slate-400 block font-medium">
                        Solicitações Ativas
                      </span>
                      <span className="text-2xl font-black text-white mt-1 block">18</span>
                      <span className="text-[10px] text-emerald-400">100% com responsável</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                      <span className="text-[11px] text-slate-400 block font-medium">
                        Docs Pendentes
                      </span>
                      <span className="text-2xl font-black text-amber-400 mt-1 block">7</span>
                      <span className="text-[10px] text-slate-400">Cobrança programada</span>
                    </div>
                  </div>

                  {/* Lista rápida de tarefas */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2.5">
                    <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                      Fila de Prioridades Fiscais
                    </span>
                    <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-950/60 border border-slate-800/60">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-slate-300">Apuração DAS - Simples Nacional</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Hoje 17h</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-950/60 border border-slate-800/60">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-slate-300">Envio EFD-Reinf Competência 08</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Amanhã</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SEÇÃO O PROBLEMA: ANTES vs DEPOIS
         ==================================================================== */}
      <section id="solucao" className="py-20 bg-slate-900/50 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">
              Diagnóstico Operacional
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              A diferença entre um escritório no sufoco e um escritório organizado
            </h2>
            <p className="text-slate-400 mt-4 text-base">
              Você não precisa trabalhar mais horas. Precisa que o fluxo de mensagens e tarefas não escape do controle da sua equipe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* O Caos Sem o Contábil Flux */}
            <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-8 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">A Rotina Sem o Contábil Flux</h3>
                  <span className="text-xs text-red-400 font-medium">
                    WhatsApp disperso, planilhas e estresse
                  </span>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-1" />
                  <span>
                    <strong>Áudios longos perdidos no WhatsApp</strong> do celular dos analistas, sem protocolo e sem registro formal.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-1" />
                  <span>
                    <strong>Cobranças repetitivas de documentos:</strong> a equipe passa o dia pedindo extratos e notas fiscais que o cliente esquece de enviar.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-1" />
                  <span>
                    <strong>Demandas sem responsável:</strong> mensagens caem no limbo e o cliente reclama da demora para o sócio.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-1" />
                  <span>
                    <strong>Dependência de pessoas-chave:</strong> quando um funcionário falta ou sai de férias, ninguém sabe onde parou o atendimento.
                  </span>
                </li>
              </ul>
            </div>

            {/* A Operação Com o Contábil Flux */}
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 relative overflow-hidden shadow-xl shadow-emerald-950/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Com o Contábil Flux</h3>
                  <span className="text-xs text-emerald-400 font-medium">
                    Processo rastreável, organizado e assistido por IA
                  </span>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <span>
                    <strong>Triagem nativa de áudio e documentos:</strong> a IA resume o problema contábil e direciona para o departamento correto (Fiscal, DP ou Contábil).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <span>
                    <strong>Painel com prazos e responsáveis:</strong> todo chamado tem dono, prioridade e data limite para resposta.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <span>
                    <strong>Rascunhos de resposta com IA confiável:</strong> o sistema gera a resposta com base nos procedimentos aprovados pelo seu escritório.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <span>
                    <strong>Visão executiva para os sócios:</strong> saiba exatamente quais clientes estão com pendências e onde estão os gargalos da operação.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          MÓDULOS E FUNCIONALIDADES PRINCIPAIS
         ==================================================================== */}
      <section id="recursos" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">
            Arquitetura Operacional
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Tudo o que seu escritório precisa em um único fluxo
          </h2>
          <p className="text-slate-400 mt-4 text-base">
            Construído especificamente para as particularidades e obrigações da rotina contábil brasileira.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              WhatsApp com Player de Áudio
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Receba mensagens e áudios de clientes diretamente no sistema. Ouça sem precisar tocar no celular pessoal e visualize o resumo do pedido feito pela IA.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Triagem de PDFs e Anexos Fiscais
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              O cliente mandou comprovante ou nota fiscal por foto? A plataforma identifica o tipo do documento e já organiza na pasta da solicitação correspondente.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              IA com Base de Conhecimento Própria
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Cadastre as regras internas e modelos de resposta do seu escritório. A IA redige as orientações com embasamento técnico e submete à revisão humana.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Gestão de Tarefas e Checklists
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Converta solicitações em tarefas com responsável, prazo fatal e checklists de fechamento (folha, apuração tributária, certidões e declarações).
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Dashboard de Controle Executivo
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Acompanhe solicitações em atraso, clientes mais demandantes e tempo médio de resposta por departamento para garantir alto padrão de atendimento.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-5">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Segurança e Trilha de Auditoria
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Cada alteração de status, envio de documento ou aprovação de texto fica registrada com data, hora e usuário responsável. Total conformidade com a LGPD.
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SEÇÃO DO PROGRAMA PILOTO
         ==================================================================== */}
      <section
        id="como-funciona"
        className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 rounded-3xl p-8 sm:p-12 relative shadow-2xl">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Vagas Limitadas para Escritórios Parceiros
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Participe do Programa Piloto do Contábil Flux
              </h2>
              <p className="mt-4 text-slate-300 text-base leading-relaxed">
                Estamos selecionando <strong>3 escritórios contábeis</strong> para implementar a plataforma gratuitamente durante 30 dias com acompanhamento consultivo direto dos fundadores.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Diagnóstico operacional gratuito</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Configuração e treinamento da equipe</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Integração assistida com o WhatsApp</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Condição vitalícia exclusiva pós-piloto</span>
                </div>
              </div>

              <div className="mt-10">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base px-8 py-4 rounded-xl shadow-xl shadow-blue-600/40 transition-all flex items-center gap-3 hover:scale-[1.02]"
                >
                  <span>Candidatar Meu Escritório ao Piloto</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          FAQ (DÚVIDAS FREQUENTES)
         ==================================================================== */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">
            Esclarecimentos
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-2">
            Perguntas Frequentes de Escritórios Contábeis
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "O Contábil Flux substitui meu sistema contábil (Domínio, Questor, Alterdata)?",
              a: "Não! O Contábil Flux não é um ERP contábil e não substitui seu sistema de escrituração. Ele atua na camada operacional e de comunicação: organiza as mensagens de clientes, cobrança de documentos, controle de pendências e tarefas internas que hoje ficam soltas no WhatsApp e planilhas.",
            },
            {
              q: "A inteligência artificial responde ao cliente sem a minha autorização?",
              a: "Jamais. O Contábil Flux foi desenhado com o princípio estrito de supervisão humana. A IA apenas elabora rascunhos de resposta, resume áudios e organiza documentos. Nenhuma resposta técnica ou externa é enviada ao cliente sem a validação e o clique de aprovação de um membro do escritório.",
            },
            {
              q: "Como funciona a segurança e o sigilo das informações dos meus clientes?",
              a: "Levamos a segurança e a LGPD muito a sério. Cada escritório possui isolamento lógico completo de dados (multi-inquilino) e trilha de auditoria para cada ação. Dados sensíveis não são utilizados para treinamento público de modelos de IA.",
            },
            {
              q: "Preciso instalar algo nos computadores da equipe?",
              a: "Não. A plataforma é 100% web e roda no navegador com altíssima performance. Toda a equipe acessa via login seguro de qualquer computador.",
            },
            {
              q: "Quanto custa para participar do Programa Piloto?",
              a: "O piloto é gratuito para os escritórios selecionados durante os primeiros 30 dias. Nosso objetivo com os parceiros pioneiros é validar o valor na rotina real e ajustar fluxos antes do lançamento em larga escala.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-white hover:text-blue-400 transition-colors"
              >
                <span>{item.q}</span>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 text-slate-400 transition-transform ${
                    activeFaq === index ? "rotate-90 text-blue-400" : ""
                  }`}
                />
              </button>
              {activeFaq === index && (
                <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================================
          FOOTER
         ==================================================================== */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-sm text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
              21
            </div>
            <div>
              <span className="font-bold text-white">Contábil Flux</span>
              <p className="text-xs text-slate-400 mt-0.5">
                Central de Operação, WhatsApp & IA para Escritórios Contábeis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <Link href="/login" className="hover:text-white transition-colors">
              Área Restrita / Login
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="hover:text-white transition-colors"
            >
              Contato Comercial
            </button>
            <span className="text-slate-400">© 2026 Contábil Flux. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>

      {/* ====================================================================
          MODAL DE QUALIFICAÇÃO (FORMS -> WHATSAPP)
         ==================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setFormSubmitted(false);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {!formSubmitted ? (
              <>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-2">
                    <Zap className="w-3 h-3" />
                    Agendamento Rápido de Demonstração
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Solicitar Acesso ao Piloto do Contábil Flux
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Preencha os dados do seu escritório. Ao enviar, você será direcionado ao nosso WhatsApp com a mensagem estruturada pronta para atendimento.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Seu Nome / Sócio Responsável *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Dra. Ana Paula"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nome do Escritório Contábil *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Exata Contabilidade e Assessoria"
                      value={formData.firmName}
                      onChange={(e) =>
                        setFormData({ ...formData, firmName: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Seu WhatsApp com DDD *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ex: (11) 98765-4321"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Carteira de Clientes
                      </label>
                      <select
                        value={formData.clientCount}
                        onChange={(e) =>
                          setFormData({ ...formData, clientCount: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="ate-50">Até 50 clientes</option>
                        <option value="50-150">50 a 150 clientes</option>
                        <option value="150-300">150 a 300 clientes</option>
                        <option value="mais-300">Mais de 300 clientes</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Qual o maior gargalo hoje na sua operação?
                    </label>
                    <select
                      value={formData.mainPain}
                      onChange={(e) =>
                        setFormData({ ...formData, mainPain: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="whatsapp-caos">
                        Muitas mensagens e áudios perdidos no WhatsApp
                      </option>
                      <option value="docs-atrasados">
                        Clientes atrasam o envio de notas e extratos fiscais
                      </option>
                      <option value="tarefas-perdidas">
                        Tarefas e prazos fiscais sem responsável claro
                      </option>
                      <option value="respostas-repetitivas">
                        Equipe gasta muito tempo repetindo as mesmas dúvidas
                      </option>
                      <option value="outro">
                        Outro (quero organizar a operação como um todo)
                      </option>
                    </select>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-1">
                    Número de atendimento configurado:{" "}
                    <code className="text-blue-400 font-mono">
                      +{DEFAULT_COMMERCIAL_WHATSAPP}
                    </code>
                  </p>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                    >
                      <span>Conversar no WhatsApp Comercial</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Dados Preparados com Sucesso!
                </h3>
                <p className="text-sm text-slate-300 max-w-sm mx-auto">
                  Uma nova aba do WhatsApp foi aberta com sua solicitação. Se a janela não abriu automaticamente, clique no botão abaixo:
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={handleFormSubmit}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                  >
                    Abrir WhatsApp Novamente
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setFormSubmitted(false);
                    }}
                    className="text-xs text-slate-400 hover:text-white py-1"
                  >
                    Fechar janela
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
