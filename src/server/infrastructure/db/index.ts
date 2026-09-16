import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import path from "node:path";
import fs from "node:fs";
import bcrypt from "bcryptjs";

const dbPath = process.env.DATABASE_FILE || path.join(process.cwd(), "contabil_flux.db");
const client = createClient({
  url: `file:${dbPath}`,
});

export const db = drizzle(client, { schema });

// Inicializador automático das tabelas e seed inicial
let initialized = false;
export async function ensureDatabaseInitialized() {
  if (initialized) return;

  // Criação automática de tabelas se não existirem
  await client.execute(`
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      timezone TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
      ai_enabled INTEGER NOT NULL DEFAULT 1,
      retention_days INTEGER NOT NULL DEFAULT 365,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      image_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS organization_members (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL REFERENCES organizations(id),
      user_id TEXT NOT NULL REFERENCES users(id),
      role TEXT NOT NULL DEFAULT 'member',
      department TEXT NOT NULL DEFAULT 'geral',
      status TEXT NOT NULL DEFAULT 'active',
      joined_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL REFERENCES organizations(id),
      legal_name TEXT NOT NULL,
      display_name TEXT NOT NULL,
      tax_id TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      contact_email TEXT,
      contact_phone TEXT,
      metadata_json TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      deleted_at TEXT
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS requests (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL REFERENCES organizations(id),
      client_id TEXT REFERENCES clients(id),
      client_name TEXT NOT NULL,
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      department TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'medium',
      status TEXT NOT NULL DEFAULT 'open',
      assignee_id TEXT,
      assignee_name TEXT,
      due_at TEXT NOT NULL,
      resolved_at TEXT,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      deleted_at TEXT
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS request_messages (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL REFERENCES organizations(id),
      request_id TEXT NOT NULL REFERENCES requests(id),
      author_name TEXT NOT NULL,
      author_user_id TEXT,
      source TEXT NOT NULL DEFAULT 'internal',
      body TEXT NOT NULL,
      media_type TEXT NOT NULL DEFAULT 'text',
      media_url TEXT,
      media_name TEXT,
      transcription TEXT,
      is_internal INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );
  `);

  // Migrações automáticas para colunas de mídia em bancos existentes
  try { await client.execute(`ALTER TABLE request_messages ADD COLUMN media_type TEXT NOT NULL DEFAULT 'text'`); } catch {}
  try { await client.execute(`ALTER TABLE request_messages ADD COLUMN media_url TEXT`); } catch {}
  try { await client.execute(`ALTER TABLE request_messages ADD COLUMN media_name TEXT`); } catch {}
  try { await client.execute(`ALTER TABLE request_messages ADD COLUMN transcription TEXT`); } catch {}

  await client.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL REFERENCES organizations(id),
      request_id TEXT REFERENCES requests(id),
      client_id TEXT REFERENCES clients(id),
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'todo',
      priority TEXT NOT NULL DEFAULT 'medium',
      assignee_name TEXT,
      assignee_id TEXT,
      due_at TEXT NOT NULL,
      completed_at TEXT,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS document_requests (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL REFERENCES organizations(id),
      client_id TEXT NOT NULL REFERENCES clients(id),
      client_name TEXT NOT NULL,
      title TEXT NOT NULL,
      period_start TEXT,
      period_end TEXT,
      due_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS document_items (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL REFERENCES organizations(id),
      document_request_id TEXT NOT NULL REFERENCES document_requests(id),
      label TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'requested',
      required INTEGER NOT NULL DEFAULT 1,
      file_id TEXT,
      file_name TEXT,
      file_size INTEGER,
      review_note TEXT,
      reviewed_by TEXT,
      reviewed_at TEXT,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL REFERENCES organizations(id),
      document_item_id TEXT,
      request_id TEXT,
      storage_key TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      checksum TEXT,
      uploaded_by TEXT NOT NULL,
      created_at TEXT NOT NULL,
      deleted_at TEXT
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS knowledge_articles (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL REFERENCES organizations(id),
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      department TEXT NOT NULL DEFAULT 'geral',
      status TEXT NOT NULL DEFAULT 'published',
      created_by TEXT NOT NULL,
      published_by TEXT,
      published_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS ai_drafts (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL REFERENCES organizations(id),
      request_id TEXT NOT NULL REFERENCES requests(id),
      created_by TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      content TEXT NOT NULL,
      edited_content TEXT,
      confidence TEXT NOT NULL DEFAULT 'medium',
      model TEXT NOT NULL DEFAULT 'assistant-v1',
      sources_json TEXT,
      approved_by TEXT,
      approved_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS audit_events (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL REFERENCES organizations(id),
      actor_user_id TEXT NOT NULL,
      actor_name TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      result TEXT NOT NULL DEFAULT 'success',
      metadata_json TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Verifica se o seed inicial precisa ser inserido
  const orgCheck = await client.execute(`SELECT count(*) as count FROM organizations`);
  const orgCount = Number(orgCheck.rows[0]?.count ?? 0);

  if (orgCount === 0) {
    const now = new Date().toISOString();
    const passwordHash = await bcrypt.hash("admin123", 10);

    // 1. Organização Contábil
    await client.execute({
      sql: `INSERT INTO organizations (id, name, slug, timezone, ai_enabled, retention_days, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: ["org_principal", "21 Contábil & Associados", "21-contabil", "America/Sao_Paulo", 1, 365, now, now],
    });

    // 2. Usuário Administrador
    await client.execute({
      sql: `INSERT INTO users (id, name, email, password_hash, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: ["user_admin", "João Paulo (Contador Chefe)", "admin@21contabil.com.br", passwordHash, now, now],
    });

    // 3. Vínculo como Owner
    await client.execute({
      sql: `INSERT INTO organization_members (id, organization_id, user_id, role, department, status, joined_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: ["member_1", "org_principal", "user_admin", "owner", "geral", "active", now],
    });

    // 4. Clientes reais de exemplo
    await client.execute({
      sql: `INSERT INTO clients (id, organization_id, legal_name, display_name, tax_id, status, contact_email, contact_phone, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: ["cli_1", "org_principal", "Comércio de Alimentos ABC Ltda", "ABC Alimentos", "12.345.678/0001-90", "active", "fiscal@abcalimentos.com.br", "(11) 98765-4321", now, now],
    });
    await client.execute({
      sql: `INSERT INTO clients (id, organization_id, legal_name, display_name, tax_id, status, contact_email, contact_phone, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: ["cli_2", "org_principal", "Tecnologia & Softwares XYZ S/A", "XYZ Tech", "98.765.432/0001-10", "active", "financeiro@xyztech.com.br", "(11) 91234-5678", now, now],
    });
    await client.execute({
      sql: `INSERT INTO clients (id, organization_id, legal_name, display_name, tax_id, status, contact_email, contact_phone, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: ["cli_3", "org_principal", "Varejo Moda Central Eireli", "Moda Central", "45.678.910/0001-22", "active", "contato@modacentral.com", "(21) 97654-3210", now, now],
    });

    // 5. Solicitações reais
    await client.execute({
      sql: `INSERT INTO requests (id, organization_id, client_id, client_name, subject, description, department, priority, status, assignee_id, assignee_name, due_at, created_by, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        "req_1",
        "org_principal",
        "cli_1",
        "ABC Alimentos",
        "Documentos do fechamento fiscal de Agosto",
        "Precisamos do relatório de saídas e extrato da conta PJ para apuração do Simples Nacional.",
        "fiscal",
        "urgent",
        "waiting_client",
        "user_admin",
        "João Paulo",
        "2026-09-20",
        "user_admin",
        now,
        now,
      ],
    });
    await client.execute({
      sql: `INSERT INTO requests (id, organization_id, client_id, client_name, subject, description, department, priority, status, assignee_id, assignee_name, due_at, created_by, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        "req_2",
        "org_principal",
        "cli_2",
        "XYZ Tech",
        "Admissão de novo desenvolvedor CLT",
        "Cliente enviou documentos para registro de novo colaborador que inicia na segunda-feira.",
        "pessoal",
        "high",
        "in_progress",
        "user_admin",
        "João Paulo",
        "2026-09-18",
        "user_admin",
        now,
        now,
      ],
    });
    await client.execute({
      sql: `INSERT INTO requests (id, organization_id, client_id, client_name, subject, description, department, priority, status, assignee_id, assignee_name, due_at, created_by, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        "req_3",
        "org_principal",
        "cli_3",
        "Moda Central",
        "Alteração contratual de sócio",
        "Entrada de novo sócio investidor e atualização da cota societária na Junta Comercial.",
        "societario",
        "medium",
        "open",
        null,
        null,
        "2026-09-25",
        "user_admin",
        now,
        now,
      ],
    });

    // 6. Tarefas
    await client.execute({
      sql: `INSERT INTO tasks (id, organization_id, request_id, client_id, title, description, status, priority, assignee_name, due_at, created_by, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: ["task_1", "org_principal", "req_1", "cli_1", "Cobrar envio do extrato bancário em OFX", "Solicitado via WhatsApp e e-mail", "in_progress", "urgent", "João Paulo", "2026-09-18", "user_admin", now, now],
    });
    await client.execute({
      sql: `INSERT INTO tasks (id, organization_id, request_id, client_id, title, description, status, priority, assignee_name, due_at, created_by, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: ["task_2", "org_principal", "req_2", "cli_2", "Qualificação cadastral e envio do eSocial S-2200", "Aguardando exame admissional ASO", "todo", "high", "João Paulo", "2026-09-19", "user_admin", now, now],
    });

    // 7. Base de Conhecimento Inicial
    await client.execute({
      sql: `INSERT INTO knowledge_articles (id, organization_id, title, body, department, status, created_by, published_by, published_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        "art_1",
        "org_principal",
        "Procedimento de Admissão CLT (Documentos Obrigatórios)",
        "Para admissão CLT são necessários: RG, CPF, Título, Carteira de Trabalho Digital, Comprovante de Residência, ASO Admissional e Certidão de Dependentes. O evento S-2200 do eSocial deve ser enviado até o dia útil anterior ao início das atividades.",
        "pessoal",
        "published",
        "user_admin",
        "user_admin",
        now,
        now,
        now,
      ],
    });
    await client.execute({
      sql: `INSERT INTO knowledge_articles (id, organization_id, title, body, department, status, created_by, published_by, published_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        "art_2",
        "org_principal",
        "Fechamento Fiscal Simples Nacional (Prazo DAS)",
        "A apuração do Simples Nacional ocorre mensalmente até o dia 20 do mês subsequente ao faturamento. Os relatórios de notas fiscais emitidas (NF-e, NFS-e) e cupons fiscais (NFC-e/SAT) devem ser importados até o dia 05 para conciliação.",
        "fiscal",
        "published",
        "user_admin",
        "user_admin",
        now,
        now,
        now,
      ],
    });

    // 8. Pedidos de Documentos
    await client.execute({
      sql: `INSERT INTO document_requests (id, organization_id, client_id, client_name, title, period_start, period_end, due_at, status, created_by, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: ["docreq_1", "org_principal", "cli_1", "ABC Alimentos", "Fechamento Mensal - Competência 08/2026", "2026-08-01", "2026-08-31", "2026-09-15", "pending", "user_admin", now, now],
    });
    await client.execute({
      sql: `INSERT INTO document_items (id, organization_id, document_request_id, label, description, status, required, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: ["docitem_1", "org_principal", "docreq_1", "Extrato Bancário (OFX/PDF)", "Contas corrente de todos os bancos com movimentação no mês", "requested", 1, now],
    });
    await client.execute({
      sql: `INSERT INTO document_items (id, organization_id, document_request_id, label, description, status, required, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: ["docitem_2", "org_principal", "docreq_1", "Relatório de Vendas e Comprovantes de Pagamento", "Relatório de receitas e comprovantes de despesas pagas", "requested", 1, now],
    });

    // 9. Evento de Auditoria Inicial
    await client.execute({
      sql: `INSERT INTO audit_events (id, organization_id, actor_user_id, actor_name, action, entity_type, entity_id, result, metadata_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: ["aud_init", "org_principal", "user_admin", "João Paulo", "system.initialized", "system", "org_principal", "success", JSON.stringify({ message: "Ambiente contábil inicializado com sucesso" }), now],
    });
  }

  initialized = true;
}
