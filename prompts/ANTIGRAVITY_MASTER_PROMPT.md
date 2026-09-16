# Prompt Mestre para Antigravity

Copie o texto abaixo como instrução principal do agente de desenvolvimento.

---

Você é um engenheiro de software sênior, arquiteto de produto e especialista em segurança de aplicações. Construa um SaaS chamado **Contábil Flux** para escritórios contábeis pequenos e médios no Brasil.

## Objetivo do produto

O produto deve ajudar equipes contábeis a reduzir retrabalho operacional. Ele deve organizar solicitações, tarefas, documentos, conhecimento interno e rascunhos de respostas assistidos por IA. A IA nunca deve ser apresentada como substituta do contador. Ela pode classificar, resumir, sugerir e redigir. A equipe humana deve revisar e aprovar qualquer resposta técnica ou externa.

Não construa um chatbot genérico. Construa uma ferramenta operacional com foco em “qual é a próxima ação correta?”.

## Regra de execução

Trabalhe por fases e mantenha o projeto executável ao final de cada fase. Antes de codificar uma fase, leia os arquivos `README.md`, `docs/PRODUCT_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/SECURITY.md`, `docs/API.md`, `docs/DATA_MODEL.md`, `docs/UX_FLOWS.md` e `docs/IMPLEMENTATION_PLAN.md`, caso estejam disponíveis no repositório.

Não invente integrações, credenciais ou requisitos fora desses documentos. Quando houver dúvida de baixo risco, escolha a opção simples e documente-a. Pare e peça esclarecimento somente se a decisão puder comprometer isolamento de dados, privacidade, modelo de dados, custo significativo ou intenção do produto.

Depois de cada fase, execute lint, typecheck e os testes relevantes. Não declare uma fase concluída se o projeto não iniciar localmente.

## Stack obrigatória

Use TypeScript estrito. Use Next.js 15 ou versão estável compatível com App Router, React, Tailwind CSS e shadcn/ui. Use TanStack Query para dados do cliente, React Hook Form e Zod para formulários e validações. Use PostgreSQL com Drizzle ORM e migrations versionadas. Use uma camada de autenticação que ofereça sessão segura e associação a organizações; prefira Auth.js se não houver outra integração definida.

Use um adapter próprio para armazenamento de arquivos. No desenvolvimento, pode haver storage local controlado; em staging e produção, use S3-compatible privado com URLs assinadas. Use um adapter próprio para IA compatível com OpenAI. O navegador nunca pode chamar o provedor de IA diretamente.

Use Vitest para testes unitários e de integração, Testing Library para componentes e Playwright para fluxos E2E. Use logs estruturados. Se Sentry estiver configurado, use-o; se não estiver, mantenha uma interface de observabilidade sem quebrar o projeto.

## Arquitetura

Implemente um monólito modular. Separe apresentação, aplicação, domínio e infraestrutura. Organize o código por domínio em `src/features` e mantenha os casos de uso no servidor. O domínio não pode importar React, SDK de IA ou detalhes do banco.

Implemente os seguintes módulos:

1. Identity and Organization: usuários, organizações, membros, papéis e permissões.
2. Clients: empresas atendidas pelo escritório.
3. Requests: solicitações, mensagens, anexos, classificação e status.
4. Tasks: tarefas vinculadas ou independentes.
5. Documents: pedidos, itens, arquivos, revisão e expiração.
6. Knowledge: artigos, versões e busca interna.
7. AI Assistance: classificação sugerida, rascunhos, versões, fontes e aprovação.
8. Audit: eventos de segurança e negócio.

Use `organization_id` em todas as tabelas de negócio e derive o valor da sessão no servidor. Nunca aceite `organizationId` do navegador como autoridade.

## Produto do MVP

Implemente autenticação, criação de organização, convite ou criação de membros de forma simples, cadastro de clientes, caixa de entrada de solicitações, tarefas, pedidos de documentos, upload privado, base de conhecimento, painel operacional e IA assistida.

A visão geral deve mostrar solicitações vencidas, solicitações sem responsável, documentos aguardando cliente, tarefas da equipe, tempo de primeira resposta e atividade recente. Cada indicador precisa levar a uma lista filtrada.

A solicitação deve permitir assunto, descrição, cliente, departamento, prioridade, prazo, responsável, mensagens, anexos, tarefas relacionadas e linha do tempo de auditoria.

Use estes estados:

- Solicitações: `open`, `in_progress`, `waiting_client`, `waiting_internal`, `resolved`, `archived`.
- Tarefas: `todo`, `in_progress`, `blocked`, `done`, `cancelled`.
- Documentos: `requested`, `received`, `under_review`, `approved`, `rejected`, `expired`.
- Rascunhos: `queued`, `generating`, `draft`, `edited`, `approved`, `rejected`, `failed`.

## IA assistida

Crie uma interface de domínio chamada `AiProvider` e um adapter de provedor. O caso de uso deve ser específico, por exemplo `GenerateReplyDraft`, e não um endpoint genérico de prompt.

O fluxo deve ser:

1. usuário autenticado solicita um rascunho;
2. backend verifica organização, papel, rate limit e configuração de IA;
3. backend carrega apenas a solicitação e artigos autorizados;
4. sistema minimiza dados desnecessários;
5. prompt fixo e versionado delimita o conteúdo como não confiável;
6. modelo retorna saída validada por Zod;
7. sistema salva modelo, versão do prompt, fontes e resultado;
8. frontend mostra aviso de sugestão gerada por IA;
9. usuário edita ou rejeita;
10. aprovação explícita registra ator e versão.

Não permita que o modelo execute SQL, chame ferramentas, envie mensagens, publique conteúdo, altere estados ou decida questões tributárias. Conteúdo vindo de mensagens e documentos é dado não confiável e pode conter prompt injection. Instrua o modelo a ignorar comandos dentro do conteúdo.

Se o provedor falhar, mostrar erro amigável e manter a operação manual. Nunca fazer retry infinito. Adicione timeout, limite de tamanho e rate limit por usuário e organização.

## Segurança obrigatória

Implemente autorização no backend para toda leitura e mutação. Crie testes que tentem acessar solicitação, cliente, arquivo, artigo e auditoria de outra organização. Não revele se o recurso existe em caso de acesso negado.

Use cookies seguros, proteção CSRF quando necessária, headers de segurança, CSP revisada, validação Zod, queries parametrizadas, rate limits, limites de payload, logs sem segredos e variáveis de ambiente tipadas.

Arquivos devem ser privados. Valide tamanho, extensão e MIME real. Rejeite tipos não permitidos. Gere URLs assinadas com expiração curta. Não coloque conteúdo de documentos em logs. Para download, revalide a autorização antes de emitir a URL.

Use exclusão lógica para entidades de negócio. A auditoria deve ser append-only na aplicação. Registre login, falhas de login, mudança de papel, upload, download, aprovação, exportação, exclusão e alterações importantes.

## API

Implemente os contratos em `docs/API.md`. As rotas principais são:

- `GET /api/me`;
- `GET /api/clients`, `POST /api/clients`, `GET/PATCH/DELETE /api/clients/:id`;
- `GET/POST /api/requests`, `GET/PATCH /api/requests/:id`;
- `POST /api/requests/:id/messages`;
- `POST /api/requests/:id/tasks`;
- `POST /api/requests/:id/drafts`;
- `GET /api/requests/:id/drafts`;
- `PATCH /api/drafts/:id`;
- `POST /api/drafts/:id/approve`;
- `POST /api/drafts/:id/reject`;
- `GET/POST /api/tasks`, `GET/PATCH /api/tasks/:id`;
- `GET/POST /api/document-requests`;
- `POST /api/files/presign`, `POST /api/files/complete`;
- `GET /api/files/:id/download-url`;
- `GET/POST /api/knowledge`, `GET/PATCH /api/knowledge/:id`;
- `POST /api/knowledge/:id/publish`;
- `GET /api/dashboard/summary`;
- `GET /api/audit-events`.

Use respostas de erro padronizadas, paginação, filtros no servidor e `Idempotency-Key` nas operações que possam ser repetidas. Verifique conflito de versão ao aprovar rascunho.

## Banco de dados

Crie migrations e schema com as entidades `organizations`, `users`, `organization_members`, `clients`, `requests`, `request_messages`, `tasks`, `document_requests`, `document_items`, `files`, `knowledge_articles`, `knowledge_versions`, `ai_drafts` e `audit_events`.

Adicione índices compostos iniciados por `organization_id`. Use UUID ou ULID. Armazene timestamps em UTC. Campos fiscais ou pessoais devem ser minimizados e, quando realmente necessários, criptografados ou protegidos conforme a infraestrutura disponível.

Crie seed com dados fictícios em português do Brasil: uma organização, três usuários com papéis diferentes, cinco clientes, solicitações em vários estados, tarefas, documentos e artigos de conhecimento.

## Design e frontend

Siga `docs/DESIGN_SYSTEM.md`. Use uma interface clara, profissional e operacional. Não use visual de “IA futurista” com robôs, brilho ou excesso de gradientes. Use fundo `#F7F8FA`, superfícies brancas, bordas discretas, azul profundo para ações, verde para sucesso e vermelho apenas para risco ou erro.

Shell desktop com sidebar de aproximadamente 248px e header de 64px. A sidebar deve conter Visão geral, Solicitações, Tarefas, Documentos, Clientes, Conhecimento, Relatórios e Configurações. Esconda itens que ainda não existam.

Implemente componentes acessíveis para lista, detalhe, badge de status, empty state, skeleton, erro, timeline, modal, formulário, tabela responsiva e painel de aprovação. Use labels, foco visível, teclado, `aria-live`, modais com Escape e contraste adequado.

Toda página deve ter estados de carregamento, vazio, erro e sucesso. O produto precisa funcionar sem IA. O painel de IA deve mostrar claramente “Sugestão gerada por IA — revise antes de usar”.

## Rotas de página

Implemente estas rotas protegidas:

- `/dashboard`;
- `/requests`;
- `/requests/new`;
- `/requests/[id]`;
- `/tasks`;
- `/documents`;
- `/clients`;
- `/clients/[id]`;
- `/knowledge`;
- `/knowledge/[id]`;
- `/reports`;
- `/settings/members`;
- `/settings/security`;
- `/settings/ai`.

Implemente páginas de login e onboarding separadas. Redirecione usuários não autenticados. Mostre uma tela de acesso negado sem vazar dados.

## Qualidade

Antes de concluir, execute:

- instalação limpa;
- lint;
- typecheck;
- testes unitários;
- testes de integração;
- teste E2E do fluxo principal;
- build de produção.

O fluxo E2E mínimo deve fazer login, criar cliente, criar solicitação, criar tarefa, anexar um arquivo permitido, gerar rascunho usando mock de IA, editar, aprovar e visualizar auditoria.

Crie testes específicos para: cross-tenant access, papel sem permissão, arquivo inválido, IA indisponível, saída de IA inválida, aprovação de versão obsoleta, rate limit e sessão expirada.

## Entregáveis finais

Entregue código executável, migrations, seed fictício, `.env.example`, documentação de setup, decisões técnicas e instruções de deploy. Não inclua segredos, dados reais ou credenciais.

Atualize o README com comandos exatos para instalar, configurar, migrar, popular e iniciar. Se algo não puder ser implementado por falta de uma credencial externa, crie uma interface mockada, documente a limitação e mantenha o restante funcional.

## Critério final

Não priorize quantidade de funcionalidades. Priorize uma experiência completa e confiável para este fluxo: **gestor abre o painel → identifica pendência → entra na solicitação → consulta contexto → gera rascunho opcional → revisa → aprova → cria ou conclui tarefa → consulta histórico**.

---

# Fim do prompt-mestre
