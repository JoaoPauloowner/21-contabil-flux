# API Contract

## 1. Convenções

Base local: `/api`. Todas as respostas devem ser JSON, exceto download por URL assinada. Datas são ISO 8601 em UTC. Listas usam `data`, `page`, `pageSize`, `total` e `hasNextPage`. O servidor deriva `organizationId` da sessão.

Erro padrão:

```json
{
  "error": {
    "code": "REQUEST_NOT_FOUND",
    "message": "Solicitação não encontrada.",
    "requestId": "req_123"
  }
}
```

Códigos HTTP: `400` entrada inválida, `401` não autenticado, `403` sem permissão, `404` não encontrado, `409` conflito de estado, `413` arquivo grande, `422` regra de negócio, `429` limite excedido, `500` erro inesperado.

## 2. Sessão e organização

`GET /api/me` retorna usuário, organização atual, papel e permissões efetivas.

`GET /api/organizations` lista organizações disponíveis para o usuário.

`POST /api/organizations/switch` troca a organização ativa após validação de associação.

## 3. Clientes

`GET /api/clients?query=&status=&page=` lista clientes autorizados.

`POST /api/clients` cria cliente. Corpo mínimo: `legalName`, `displayName`, `taxId` opcionalmente mascarado, `status`.

`GET /api/clients/:id` retorna detalhes, solicitações, documentos e atividades resumidas.

`PATCH /api/clients/:id` atualiza campos permitidos.

`DELETE /api/clients/:id` realiza exclusão lógica conforme permissão e política de retenção.

## 4. Solicitações

`GET /api/requests?status=&department=&priority=&assigneeId=&clientId=&page=` lista solicitações.

`POST /api/requests` cria solicitação com `subject`, `description`, `clientId`, `department`, `priority`, `dueAt` e `assigneeId` opcional.

`GET /api/requests/:id` retorna detalhes, mensagens, anexos, tarefas, rascunhos e auditoria autorizada.

`PATCH /api/requests/:id` atualiza campos e valida transição de estado.

`POST /api/requests/:id/messages` adiciona mensagem interna ou recebida. Mensagem externa não deve ser publicada automaticamente.

`POST /api/requests/:id/tasks` cria tarefa vinculada.

`POST /api/requests/:id/drafts` gera rascunho de resposta assistido por IA. Deve aceitar `tone`, `purpose` e `knowledgeArticleIds` opcionais.

`GET /api/requests/:id/drafts` lista versões do rascunho.

`PATCH /api/drafts/:id` salva edição humana.

`POST /api/drafts/:id/approve` aprova o rascunho e registra ator, versão e timestamp. No MVP, aprovação apenas altera o estado; o envio externo deve ser uma etapa separada.

`POST /api/drafts/:id/reject` rejeita o rascunho com motivo opcional.

## 5. Tarefas

`GET /api/tasks?status=&assigneeId=&due=&page=` lista tarefas.

`POST /api/tasks` cria tarefa.

`GET /api/tasks/:id` retorna detalhe.

`PATCH /api/tasks/:id` altera status, responsável, prazo e checklist.

## 6. Documentos

`GET /api/document-requests?clientId=&status=&page=` lista pedidos de documentos.

`POST /api/document-requests` cria pedido com itens e prazo.

`POST /api/files/presign` recebe nome, MIME e tamanho após validação e retorna URL assinada de upload privado.

`POST /api/files/complete` confirma upload, valida checksum e vincula arquivo ao pedido ou solicitação.

`GET /api/files/:id/download-url` retorna URL assinada curta após autorização.

`PATCH /api/document-items/:id` altera estado de revisão.

## 7. Conhecimento

`GET /api/knowledge?query=&department=&page=` pesquisa artigos publicados ou permitidos.

`POST /api/knowledge` cria artigo em rascunho.

`GET /api/knowledge/:id` retorna artigo e versões.

`PATCH /api/knowledge/:id` edita artigo.

`POST /api/knowledge/:id/publish` publica artigo e registra aprovador.

## 8. Painel e auditoria

`GET /api/dashboard/summary?from=&to=` retorna métricas agregadas da organização.

`GET /api/audit-events?entityType=&actorId=&from=&to=&page=` retorna eventos permitidos a administradores e gestores.

## 9. Idempotência e concorrência

Operações de criação que possam ser repetidas devem aceitar `Idempotency-Key`. Aprovação de rascunho deve verificar a versão atual e retornar `409` se outro usuário alterou o conteúdo antes da aprovação.

## 10. API interna de IA

A camada de IA não deve ser exposta como endpoint genérico. O backend deve expor casos de uso específicos. Cada caso de uso possui schema de entrada e saída, limite, timeout, prompt versionado e fallback manual.
