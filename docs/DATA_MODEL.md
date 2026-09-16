# Data Model

## 1. Regras gerais

Todas as tabelas de negócio devem conter `id`, `organization_id`, `created_at`, `updated_at` e, quando aplicável, `deleted_at`. IDs públicos devem usar UUID ou ULID. Timestamps devem ser armazenados em UTC. Criar índices compostos iniciados por `organization_id`.

## 2. Entidades

### organizations

Representa o escritório contábil. Campos: `id`, `name`, `slug`, `timezone`, `ai_enabled`, `retention_days`, `created_at`, `updated_at`.

### users

Identidade global. Campos: `id`, `name`, `email`, `image_url`, `created_at`, `updated_at`.

### organization_members

Vínculo de usuário e organização. Campos: `id`, `organization_id`, `user_id`, `role`, `status`, `joined_at`.

### clients

Empresa atendida pelo escritório. Campos: `id`, `organization_id`, `legal_name`, `display_name`, `tax_id_encrypted` opcional, `status`, `metadata_json`, `created_at`, `updated_at`, `deleted_at`.

### requests

Solicitação operacional. Campos: `id`, `organization_id`, `client_id`, `subject`, `description`, `department`, `priority`, `status`, `assignee_id`, `due_at`, `resolved_at`, `created_by`, `created_at`, `updated_at`, `deleted_at`.

### request_messages

Mensagens vinculadas. Campos: `id`, `organization_id`, `request_id`, `author_user_id`, `source`, `body`, `is_internal`, `created_at`, `deleted_at`.

### tasks

Tarefas. Campos: `id`, `organization_id`, `request_id`, `client_id`, `title`, `description`, `status`, `priority`, `assignee_id`, `due_at`, `completed_at`, `created_by`, `created_at`, `updated_at`.

### document_requests

Pedido de documentos. Campos: `id`, `organization_id`, `client_id`, `title`, `period_start`, `period_end`, `due_at`, `status`, `created_by`, `created_at`, `updated_at`.

### document_items

Item esperado dentro do pedido. Campos: `id`, `organization_id`, `document_request_id`, `label`, `description`, `status`, `required`, `review_note`, `reviewed_by`, `reviewed_at`.

### files

Metadados de arquivo. Campos: `id`, `organization_id`, `document_item_id` opcional, `request_id` opcional, `storage_key`, `original_name`, `mime_type`, `size_bytes`, `checksum`, `uploaded_by`, `created_at`, `deleted_at`.

### knowledge_articles

Artigo interno. Campos: `id`, `organization_id`, `title`, `body`, `department`, `status`, `created_by`, `published_by`, `published_at`, `created_at`, `updated_at`, `deleted_at`.

### knowledge_versions

Versionamento. Campos: `id`, `organization_id`, `article_id`, `version`, `body`, `created_by`, `created_at`.

### ai_drafts

Rascunho de IA ou edição humana. Campos: `id`, `organization_id`, `request_id`, `created_by`, `status`, `content`, `edited_content`, `model`, `prompt_version`, `sources_json`, `failure_code`, `approved_by`, `approved_at`, `created_at`, `updated_at`.

### audit_events

Trilha de auditoria. Campos: `id`, `organization_id`, `actor_user_id`, `action`, `entity_type`, `entity_id`, `result`, `metadata_json`, `ip_hash` opcional, `created_at`.

## 3. Relacionamentos

Uma organização possui muitos membros, clientes, solicitações, tarefas, arquivos, artigos, rascunhos e eventos. Um cliente possui muitas solicitações e pedidos de documento. Uma solicitação possui mensagens, tarefas, arquivos e rascunhos. Um artigo possui versões.

## 4. Restrições

- `organization_members` deve ter unicidade por `organization_id` e `user_id`.
- `slug` de organização deve ser único.
- Arquivo deve pertencer a exatamente uma organização.
- Rascunho aprovado deve possuir `approved_by` e `approved_at`.
- Item de documento não pode ser aprovado sem arquivo válido, salvo quando o tipo não exigir upload.
- Exclusão física de auditoria é proibida pela aplicação.
- Campos fiscais ou pessoais devem possuir justificativa de necessidade e proteção adequada.

## 5. Migrações

Toda alteração deve usar migration versionada. Nunca alterar produção manualmente. Seeds devem usar dados fictícios, ser repetíveis e nunca conter informação de clientes reais.
