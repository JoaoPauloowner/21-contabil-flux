# Contábil Flux

> Plataforma SaaS para escritórios contábeis reduzirem retrabalho, organizarem solicitações e atenderem clientes com IA assistida e revisão humana.

## Objetivo

O Contábil Flux transforma mensagens, documentos e pendências dispersos em fluxos operacionais rastreáveis. A primeira versão não substitui o contador, não emite parecer técnico automaticamente e não promete conformidade fiscal sem revisão profissional. Ela ajuda a equipe a **classificar, resumir, encaminhar, cobrar, responder e acompanhar**.

## Proposta de valor

O produto foi desenhado para escritórios contábeis pequenos e médios que enfrentam volume elevado de mensagens, cobrança manual de documentos, falta de padronização e baixa visibilidade sobre tarefas pendentes.

A promessa do MVP é simples: **reduzir o tempo entre uma solicitação e a próxima ação correta, sem remover o controle humano**.

## MVP

A versão inicial deve conter:

- autenticação e isolamento por organização;
- cadastro de clientes empresariais;
- caixa de entrada unificada para solicitações;
- classificação por departamento, prioridade e status;
- conversão de mensagens em tarefas;
- cobrança e acompanhamento de documentos;
- base de conhecimento interna;
- rascunhos de respostas gerados por IA;
- aprovação humana antes de qualquer resposta externa;
- trilha de auditoria;
- painel com indicadores operacionais;
- configuração de política de retenção e consentimento.

## Fora do escopo do MVP

Integrações profundas com ERPs contábeis, envio automático de obrigações, interpretação tributária autônoma, robô de WhatsApp não oficial, assinatura digital, cobrança financeira, folha de pagamento e qualquer ação irreversível sem aprovação explícita.

## Stack recomendada

- **Frontend:** Next.js 15 com App Router, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query e React Hook Form.
- **Backend:** Next.js Route Handlers ou NestJS separado quando o volume justificar; o MVP pode começar com Route Handlers organizados por domínio.
- **Banco:** PostgreSQL com Drizzle ORM e migrations versionadas.
- **Autenticação:** Auth.js ou Clerk, com sessões seguras, MFA opcional e controle de organização.
- **Armazenamento:** S3-compatible com URLs assinadas e verificação de tipo e tamanho.
- **IA:** provedor compatível com OpenAI através de uma camada de abstração própria; nenhum prompt deve chamar o provedor diretamente a partir do navegador.
- **Validação:** Zod em todas as fronteiras de entrada.
- **Observabilidade:** Sentry para erros, OpenTelemetry quando necessário e logs estruturados sem dados sensíveis.
- **Testes:** Vitest, Testing Library e Playwright.
- **Deploy:** plataforma com suporte a Node.js, PostgreSQL gerenciado, armazenamento privado e variáveis secretas.

## Princípios do produto

1. **Humano no circuito:** a IA pode sugerir, nunca publicar respostas técnicas sem aprovação.
2. **Privacidade por padrão:** coletar o mínimo de dados necessário e evitar inserir dados sensíveis em prompts quando não forem indispensáveis.
3. **Rastreabilidade:** toda sugestão, aprovação, edição e alteração importante deve gerar evento de auditoria.
4. **Clareza operacional:** cada tela deve responder o que aconteceu, quem é responsável e qual é a próxima ação.
5. **Escopo disciplinado:** resolver um fluxo repetitivo antes de tentar automatizar o escritório inteiro.

## Estrutura da documentação

- [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md): requisitos funcionais, personas e critérios de aceite.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): arquitetura lógica, módulos, decisões e fluxos.
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md): linguagem visual, componentes, layout e acessibilidade.
- [`docs/SECURITY.md`](docs/SECURITY.md): modelo de ameaças, controles e regras de privacidade.
- [`docs/API.md`](docs/API.md): endpoints, payloads, erros e autorização.
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md): entidades, relacionamentos e regras de integridade.
- [`docs/UX_FLOWS.md`](docs/UX_FLOWS.md): jornadas principais e estados de interface.
- [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md): fases de implementação e definição de pronto.
- [`prompts/ANTIGRAVITY_MASTER_PROMPT.md`](prompts/ANTIGRAVITY_MASTER_PROMPT.md): prompt completo para construir o projeto.
- [`prompts/MODULE_IMPLEMENTATION_GUIDE.md`](prompts/MODULE_IMPLEMENTATION_GUIDE.md): instruções comuns para implementar e validar cada módulo.

### Prompts por módulo

- [`prompts/modules/01-IDENTITY-ORGANIZATIONS.md`](prompts/modules/01-IDENTITY-ORGANIZATIONS.md): identidade, organizações, membros e permissões.
- [`prompts/modules/02-CLIENTS.md`](prompts/modules/02-CLIENTS.md): cadastro e operação de clientes.
- [`prompts/modules/03-REQUESTS-TASKS.md`](prompts/modules/03-REQUESTS-TASKS.md): solicitações, mensagens e tarefas.
- [`prompts/modules/04-DOCUMENTS-FILES.md`](prompts/modules/04-DOCUMENTS-FILES.md): pedidos de documentos, upload e revisão.
- [`prompts/modules/05-KNOWLEDGE.md`](prompts/modules/05-KNOWLEDGE.md): base de conhecimento e versionamento.
- [`prompts/modules/06-AI-ASSISTANCE.md`](prompts/modules/06-AI-ASSISTANCE.md): provider, rascunhos, aprovação e segurança da IA.
- [`prompts/modules/07-DASHBOARD-REPORTS.md`](prompts/modules/07-DASHBOARD-REPORTS.md): indicadores, dashboard e relatórios.
- [`prompts/modules/08-AUDIT-OBSERVABILITY.md`](prompts/modules/08-AUDIT-OBSERVABILITY.md): auditoria, logs, hardening e continuidade.

## Como usar este repositório

Leia primeiro o prompt-mestre e os documentos de arquitetura. Cole o prompt no Antigravity e instrua o agente a trabalhar por fases. O agente deve pedir esclarecimentos apenas quando uma decisão alterar segurança, modelo de dados, escopo ou custo operacional; em dúvidas menores, deve seguir as decisões documentadas.

## Variáveis de ambiente

Nunca comite segredos. Use um arquivo `.env.example` com nomes, não valores:

```env
DATABASE_URL=
AUTH_SECRET=
APP_URL=http://localhost:3000
STORAGE_ENDPOINT=
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
AI_API_KEY=
AI_BASE_URL=
AI_MODEL=
SENTRY_DSN=
```

## Definição de pronto do MVP

O MVP está pronto quando uma organização consegue criar clientes, registrar uma solicitação, anexar documento, classificar a solicitação, gerar um rascunho de resposta, revisar e aprovar o texto, converter a solicitação em tarefa, acompanhar o status e consultar o histórico de auditoria. Os testes automatizados devem cobrir autorização entre organizações, upload seguro, aprovação humana e falhas do provedor de IA.

## Licença

Definir antes do primeiro deploy público. Para um produto proprietário, usar aviso de direitos autorais e manter o repositório privado.
