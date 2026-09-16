# Módulo 02 — Clientes

## Prompt para Antigravity

Implemente o cadastro operacional de clientes empresariais do Contábil Flux. O módulo deve servir de contexto para solicitações, documentos, tarefas e relatórios sem armazenar dados desnecessários.

### Escopo funcional

Crie listagem paginada, busca, filtros por status, cadastro, edição, visualização de detalhe e exclusão lógica. O cliente deve possuir razão social, nome de exibição, identificador fiscal protegido quando necessário, contatos mínimos, status e observações internas. Não crie ainda contabilidade, folha ou apuração tributária.

### Dados e domínio

Use a entidade `clients` conforme `docs/DATA_MODEL.md`. O identificador fiscal não deve aparecer completo em listas. Defina estados `active`, `inactive` e `archived`. Não permita apagar fisicamente um cliente que possua solicitações, documentos ou tarefas; use arquivamento.

### API

Implemente `GET/POST /api/clients`, `GET/PATCH/DELETE /api/clients/:id`. Valide entradas com Zod, aplique paginação no servidor e filtre sempre por organização. O endpoint de detalhe deve retornar apenas relações autorizadas e paginadas.

### Interface

Crie `/clients` e `/clients/[id]`. A lista deve exibir nome, status, quantidade de pendências e data da última atividade. O detalhe deve conter resumo, solicitações abertas, documentos pendentes, tarefas e atividade recente. Ofereça ação “Nova solicitação”.

### Segurança

Mascarar identificador fiscal em tabelas e logs. Verificar permissão de leitura e alteração no backend. Registrar criação, alteração, arquivamento e restauração.

### Testes de aceite

Testar CRUD autorizado, validação de campos, paginação, cliente arquivado, bloqueio de acesso cross-tenant, ocultação do identificador fiscal e preservação das relações ao arquivar.
