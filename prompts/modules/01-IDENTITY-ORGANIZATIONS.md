# Módulo 01 — Identidade e organizações

## Prompt para Antigravity

Implemente o módulo de identidade e organizações do Contábil Flux. O objetivo é permitir autenticação, criação da organização, associação de membros, papéis e proteção de todas as rotas privadas.

### Escopo funcional

Implemente login, logout, sessão persistente, página de onboarding, criação da primeira organização, troca de organização quando o usuário participar de mais de uma e gerenciamento básico de membros. No MVP, o convite pode ser implementado com token de uso único ou fluxo simulado documentado, desde que não crie acesso sem validação.

Papéis: `owner`, `admin`, `manager`, `member` e `viewer`. Crie uma matriz central de permissões. O owner gerencia segurança e membros. O admin gerencia membros e configurações operacionais. O manager vê e organiza o trabalho, mas não altera segurança. O member opera solicitações, tarefas e documentos conforme seu departamento. O viewer possui acesso somente leitura limitado.

### Dados

Implemente `users`, `organizations` e `organization_members`. Inclua unicidade por organização e usuário, status do vínculo, timezone, configuração de IA e política de retenção. Use migrations e seed fictício com três papéis.

### Rotas

Implemente `GET /api/me`, `GET /api/organizations`, `POST /api/organizations/switch`, endpoints de membros e rotas de configuração. Proteja páginas privadas e redirecione usuários não autenticados.

### Segurança

Use cookies seguros, expiração de sessão, proteção contra enumeração de usuários, validação de e-mail e rate limit em login. Não aceite papel ou organização do cliente como autoridade. Registre login, falha de login, convite, entrada, saída e alteração de papel na auditoria.

### Interface

Crie login, onboarding, seletor de organização, lista de membros, formulário de convite e tela de permissões. Mostre claramente a organização ativa e o papel atual. Inclua estados vazios, erro, loading e sucesso.

### Testes de aceite

Teste login válido e inválido, sessão expirada, troca apenas para organização associada, bloqueio de rota privada, alteração de papel apenas por owner/admin autorizado, impossibilidade de um member convidar admin e isolamento completo entre organizações.
