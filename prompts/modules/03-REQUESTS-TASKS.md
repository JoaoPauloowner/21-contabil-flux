# Módulo 03 — Solicitações e tarefas

## Prompt para Antigravity

Implemente o centro operacional do Contábil Flux. Uma solicitação representa uma demanda recebida pelo escritório; uma tarefa representa uma ação executável por um membro da equipe.

### Solicitações

Implemente criação, edição, listagem paginada, busca, filtros por status, departamento, prioridade, cliente e responsável. Campos: assunto, descrição, cliente, departamento, prioridade, status, prazo, responsável e origem. Estados: `open`, `in_progress`, `waiting_client`, `waiting_internal`, `resolved` e `archived`.

Crie regras de transição explícitas. Uma solicitação resolvida deve registrar `resolved_at`. Uma arquivada não pode ser alterada sem restauração autorizada. Permita mensagens internas e recebidas, mas não envio externo no MVP.

### Tarefas

Permita criar tarefas vinculadas a uma solicitação ou cliente. Campos: título, descrição, status, prioridade, responsável, prazo, checklist e conclusão. Estados: `todo`, `in_progress`, `blocked`, `done` e `cancelled`. Uma tarefa concluída exige `completed_at`.

### API

Implemente os endpoints de `docs/API.md`: solicitações, mensagens, tarefas e criação de tarefa vinculada. Adicione filtros, ordenação segura, paginação, `Idempotency-Key` em criações e erro `409` em conflitos.

### Interface

Crie `/requests`, `/requests/new` e `/requests/[id]`. A listagem deve ser o espaço de trabalho principal. O detalhe deve ter cabeçalho de status, informações do cliente, linha do tempo, mensagens, anexos preparados, tarefas e painel de ações. A criação de tarefa deve ocorrer sem perder o contexto.

### Auditoria

Registre criação, mudança de status, troca de responsável, alteração de prazo, mensagem, criação/conclusão de tarefa e arquivamento.

### Testes de aceite

Cobrir transições válidas e inválidas, filtros, paginação, tarefa vinculada, conflito de atualização, permissão por papel, isolamento entre organizações e operação completa sem usar IA.
