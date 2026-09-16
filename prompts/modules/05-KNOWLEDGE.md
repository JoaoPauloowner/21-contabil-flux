# Módulo 05 — Base de conhecimento

## Prompt para Antigravity

Implemente uma base de conhecimento interna para procedimentos, respostas aprovadas e orientações operacionais do escritório. O conteúdo deve ser versionado e não pode ser tratado automaticamente como parecer contábil ou tributário.

### Escopo funcional

Crie artigos com título, corpo, departamento, tags, status `draft`, `published` e `archived`, autor, aprovador e data de publicação. Crie histórico de versões. O editor deve permitir salvar rascunho e publicar apenas para papéis autorizados.

### API e busca

Implemente `GET/POST /api/knowledge`, `GET/PATCH /api/knowledge/:id` e `POST /api/knowledge/:id/publish`. A busca inicial deve ser textual, paginada e limitada à organização. Filtre artigos arquivados por padrão.

### Interface

Crie `/knowledge` e `/knowledge/[id]`. Mostre artigos recentes, filtros por departamento, status e autor. Na tela de detalhe, exiba versão publicada, editor, histórico e ação de criar nova versão. Use editor simples e seguro; não renderize HTML não sanitizado.

### Segurança e governança

Sanitize conteúdo rico, bloqueie scripts e registre criação, edição, publicação e arquivamento. Mostre no painel de IA quais artigos foram usados como fonte. Não permita que qualquer membro publique conteúdo para toda a organização sem a permissão definida.

### Testes de aceite

Testar criação de rascunho, edição de versão, publicação autorizada, busca, isolamento entre organizações, sanitização contra XSS e utilização apenas de artigos publicados como contexto padrão de IA.
