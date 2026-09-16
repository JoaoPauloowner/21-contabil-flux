import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// 1. Organizações (Escritórios contábeis)
export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  timezone: text("timezone").notNull().default("America/Sao_Paulo"),
  aiEnabled: integer("ai_enabled", { mode: "boolean" }).notNull().default(true),
  retentionDays: integer("retention_days").notNull().default(365),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// 2. Usuários globais
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  imageUrl: text("image_url"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// 3. Vínculo Usuário-Organização com Papéis (RBAC)
export const organizationMembers = sqliteTable("organization_members", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  userId: text("user_id").notNull().references(() => users.id),
  role: text("role", { enum: ["owner", "admin", "manager", "member", "viewer"] }).notNull().default("member"),
  department: text("department").notNull().default("geral"),
  status: text("status").notNull().default("active"),
  joinedAt: text("joined_at").notNull(),
});

// 4. Clientes atendidos pelo escritório
export const clients = sqliteTable("clients", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  legalName: text("legal_name").notNull(),
  displayName: text("display_name").notNull(),
  taxId: text("tax_id"), // CNPJ ou CPF
  status: text("status").notNull().default("active"), // active | inactive | onboarding
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  metadataJson: text("metadata_json"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  deletedAt: text("deleted_at"),
});

// 5. Solicitações operacionais (Centro do fluxo)
export const requests = sqliteTable("requests", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  clientId: text("client_id").references(() => clients.id),
  clientName: text("client_name").notNull(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  department: text("department", { enum: ["contabil", "fiscal", "pessoal", "societario"] }).notNull(),
  priority: text("priority", { enum: ["low", "medium", "high", "urgent"] }).notNull().default("medium"),
  status: text("status", { enum: ["open", "in_progress", "waiting_client", "waiting_internal", "resolved", "archived"] }).notNull().default("open"),
  assigneeId: text("assignee_id"),
  assigneeName: text("assignee_name"),
  dueAt: text("due_at").notNull(),
  resolvedAt: text("resolved_at"),
  createdBy: text("created_by").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  deletedAt: text("deleted_at"),
});

// 6. Mensagens e histórico da solicitação
export const requestMessages = sqliteTable("request_messages", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  requestId: text("request_id").notNull().references(() => requests.id),
  authorName: text("author_name").notNull(),
  authorUserId: text("author_user_id"),
  source: text("source").notNull().default("internal"), // internal | client | ai | system
  body: text("body").notNull(),
  isInternal: integer("is_internal", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
});

// 7. Tarefas vinculadas
export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  requestId: text("request_id").references(() => requests.id),
  clientId: text("client_id").references(() => clients.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", { enum: ["todo", "in_progress", "blocked", "done", "cancelled"] }).notNull().default("todo"),
  priority: text("priority", { enum: ["low", "medium", "high", "urgent"] }).notNull().default("medium"),
  assigneeName: text("assignee_name"),
  assigneeId: text("assignee_id"),
  dueAt: text("due_at").notNull(),
  completedAt: text("completed_at"),
  createdBy: text("created_by").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// 8. Pedidos de documentos (fechamento mensal, rescisões, certidões)
export const documentRequests = sqliteTable("document_requests", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  clientId: text("client_id").notNull().references(() => clients.id),
  clientName: text("client_name").notNull(),
  title: text("title").notNull(),
  periodStart: text("period_start"),
  periodEnd: text("period_end"),
  dueAt: text("due_at").notNull(),
  status: text("status", { enum: ["pending", "partially_received", "completed", "overdue"] }).notNull().default("pending"),
  createdBy: text("created_by").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// 9. Itens esperados dentro do pedido de documentos
export const documentItems = sqliteTable("document_items", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  documentRequestId: text("document_request_id").notNull().references(() => documentRequests.id),
  label: text("label").notNull(),
  description: text("description"),
  status: text("status", { enum: ["requested", "received", "under_review", "approved", "rejected", "expired"] }).notNull().default("requested"),
  required: integer("required", { mode: "boolean" }).notNull().default(true),
  fileId: text("file_id"),
  fileName: text("file_name"),
  fileSize: integer("file_size"),
  reviewNote: text("review_note"),
  reviewedBy: text("reviewed_by"),
  reviewedAt: text("reviewed_at"),
  updatedAt: text("updated_at").notNull(),
});

// 10. Arquivos e metadados de upload
export const files = sqliteTable("files", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  documentItemId: text("document_item_id"),
  requestId: text("request_id"),
  storageKey: text("storage_key").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  checksum: text("checksum"),
  uploadedBy: text("uploaded_by").notNull(),
  createdAt: text("created_at").notNull(),
  deletedAt: text("deleted_at"),
});

// 11. Base de conhecimento interna (manuais, procedimentos, orientações)
export const knowledgeArticles = sqliteTable("knowledge_articles", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  title: text("title").notNull(),
  body: text("body").notNull(),
  department: text("department", { enum: ["contabil", "fiscal", "pessoal", "societario", "geral"] }).notNull().default("geral"),
  status: text("status", { enum: ["draft", "published", "archived"] }).notNull().default("published"),
  createdBy: text("created_by").notNull(),
  publishedBy: text("published_by"),
  publishedAt: text("published_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// 12. Rascunhos de resposta com IA (Human-in-the-loop)
export const aiDrafts = sqliteTable("ai_drafts", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  requestId: text("request_id").notNull().references(() => requests.id),
  createdBy: text("created_by").notNull(),
  status: text("status", { enum: ["draft", "edited", "approved", "rejected"] }).notNull().default("draft"),
  content: text("content").notNull(),
  editedContent: text("edited_content"),
  confidence: text("confidence", { enum: ["low", "medium", "high"] }).notNull().default("medium"),
  model: text("model").notNull().default("assistant-v1"),
  sourcesJson: text("sources_json"),
  approvedBy: text("approved_by"),
  approvedAt: text("approved_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// 13. Eventos de Auditoria Imutáveis
export const auditEvents = sqliteTable("audit_events", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  actorUserId: text("actor_user_id").notNull(),
  actorName: text("actor_name").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  result: text("result").notNull().default("success"),
  metadataJson: text("metadata_json"),
  createdAt: text("created_at").notNull(),
});
