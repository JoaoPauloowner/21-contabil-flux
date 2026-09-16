# Módulo 04 — Documentos e arquivos

## Prompt para Antigravity

Implemente o controle de documentos pendentes e armazenamento privado de arquivos. O objetivo é substituir cobrança dispersa por uma lista rastreável e revisável.

### Pedidos de documentos

Crie pedido por cliente e período, com título, prazo e itens. Cada item possui nome, descrição, obrigatoriedade e estado `requested`, `received`, `under_review`, `approved`, `rejected` ou `expired`. O usuário deve poder adicionar observação de revisão e histórico.

### Upload

Implemente `POST /api/files/presign`, `POST /api/files/complete` e `GET /api/files/:id/download-url`. Antes de gerar URL, validar tamanho máximo configurável, extensão, MIME declarado e, quando possível, MIME real e checksum. Armazenar em bucket privado. O nome original não deve virar caminho de storage. Use chave aleatória com organização e entidade.

No MVP, defina uma allowlist conservadora de PDF, PNG, JPG, XLSX e DOCX. Bloqueie executáveis, arquivos compactados e tipos desconhecidos. Não exponha URL pública permanente.

### Interface

Crie `/documents` com filtros por cliente, período, prazo e status. Crie componente de upload com progresso, erro recuperável e indicação de tipo/tamanho. Na revisão, mostre visualização ou metadados, quem enviou, quando recebeu e ações de aprovar/rejeitar.

### Segurança

Revalidar autorização no presign, complete e download. Registrar upload, rejeição, download, aprovação e exclusão lógica. Não registrar conteúdo em logs. Preparar integração de antivírus como adapter; se não houver serviço, deixar o estado “scan pending” para ambientes que exigirem isso.

### Testes de aceite

Testar tipo inválido, tamanho excedido, checksum divergente, URL expirada, acesso cross-tenant, arquivo órfão, revisão de item obrigatório, aprovação sem arquivo e falha de storage.
