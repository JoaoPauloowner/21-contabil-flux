# Módulo 08 — Auditoria, observabilidade e hardening

## Prompt para Antigravity

Implemente a camada final de confiabilidade, auditoria e operação do Contábil Flux. Este módulo deve revisar os módulos anteriores e corrigir falhas de segurança, não apenas adicionar uma tela de logs.

### Auditoria

Implemente serviço central `AuditService` e tabela append-only `audit_events`. Eventos devem possuir organização, ator, ação, entidade, identificador, resultado, timestamp e metadados mínimos. Registre autenticação, mudanças de papel, alterações de configuração, criação/edição/arquivamento, upload/download, aprovação/rejeição de IA, exportação e falhas relevantes.

Crie `GET /api/audit-events` com filtros por ator, ação, entidade e período. Apenas owner, admin e papéis explicitamente autorizados podem consultar. Não exibir tokens, prompts completos, documentos ou segredos.

### Observabilidade

Use logger estruturado com `requestId`, latência, método, rota, status e organização anonimizada ou identificador interno. Remova authorization headers, cookies, senhas, conteúdo de arquivos e dados pessoais desnecessários. Adicione error boundary no frontend e captura de exceção no backend.

### Hardening

Revisar headers de segurança, CSP, CORS, cookies, CSRF, rate limiting, limite de body, timeout, idempotência, validação Zod, SQL parametrizado e políticas de upload. Criar endpoint de health check que não revele configuração. Adicionar dependabot ou verificação de dependências no CI.

### Backup e continuidade

Documentar backup do PostgreSQL, retenção, restauração em staging e rollback de migration. Não declarar backup confiável sem teste de restauração.

### Testes de aceite

Criar testes de ausência de segredo nos logs, auditoria para ações importantes, autorização de consulta, rate limit, headers, CORS, CSRF quando aplicável, health check, erro controlado e restauração documentada. Executar revisão de segurança sobre todos os endpoints existentes.
