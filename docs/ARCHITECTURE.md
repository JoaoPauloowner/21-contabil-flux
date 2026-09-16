# Architecture

## 1. Decisão geral

O MVP deve ser um monólito modular full-stack. Essa escolha reduz custo e tempo de entrega, mantém a transação entre domínio e banco simples e permite separar serviços apenas quando houver evidência de necessidade. O código deve ter fronteiras claras para que a futura extração de serviços seja possível.

## 2. Camadas

### Apresentação

Next.js App Router, páginas protegidas por organização, componentes de UI acessíveis, formulários tipados e TanStack Query para mutações e invalidação de cache.

### Aplicação

Casos de uso explícitos, como `CreateRequest`, `ClassifyRequest`, `GenerateReplyDraft` e `ApproveReplyDraft`. Cada caso de uso valida entrada, verifica autorização, executa a operação e registra auditoria.

### Domínio

Entidades, enums, regras de transição de estado e interfaces de repositório. O domínio não deve importar React, SDK de provedor de IA ou detalhes de banco.

### Infraestrutura

Drizzle/PostgreSQL, armazenamento de objetos, adaptador de IA, e-mail, logs, filas futuras e provedores de autenticação. Cada dependência externa deve possuir um adapter substituível.

## 3. Organização de diretórios recomendada

```text
src/
  app/
    (auth)/
    (app)/
      dashboard/
      requests/
      tasks/
      documents/
      knowledge/
      clients/
      settings/
    api/
  components/
    features/
      requests/
      tasks/
      documents/
      knowledge/
      ai/
    server/
      application/
      domain/
      infrastructure/
    lib/
  db/
    schema/
    migrations/
  styles/
  types/
```

## 4. Módulos de domínio

### Identity and Organization

Usuários, organizações, membros, papéis e sessões. Toda consulta de negócio deve receber `organizationId` de uma fonte confiável do servidor, nunca de um campo livre do cliente.

### Clients

Cadastro de empresas atendidas pelo escritório, contatos e status. O módulo não deve armazenar mais dados pessoais do que o necessário para o fluxo.

### Requests

Solicitações recebidas, classificação, mensagens, anexos e relacionamento com cliente. É o centro operacional do MVP.

### Tasks

Tarefas derivadas de solicitações ou criadas manualmente, com responsável, prazo e checklist.

### Documents

Solicitações de documentos, arquivos, versões, revisão e expiração. O conteúdo do arquivo deve permanecer em armazenamento privado.

### Knowledge

Artigos, procedimentos e respostas aprovadas. A busca inicial pode ser textual; busca semântica é uma evolução posterior, com controle de escopo e fontes.

### AI Assistance

Prompts versionados, geração de rascunho, classificação sugerida, citações internas, limites de tokens, logs mínimos e aprovação humana. O módulo deve continuar funcionando em modo degradado quando a IA falhar.

### Audit

Eventos imutáveis de segurança e negócio, com ator, ação, entidade, identificador, timestamp, resultado e metadados não sensíveis.

## 5. Fluxo de geração de rascunho

1. O usuário abre uma solicitação autorizada.
2. O frontend chama `POST /api/requests/:id/drafts`.
3. O backend valida o corpo e aplica rate limit.
4. O caso de uso carrega apenas dados pertencentes à organização.
5. O sistema seleciona contexto aprovado da base de conhecimento.
6. O adapter de IA recebe instrução estruturada e dados minimizados.
7. O resultado passa por validação de schema.
8. O sistema salva o rascunho, fontes utilizadas, versão do prompt e estado `draft`.
9. O frontend mostra o resultado como sugestão editável.
10. Apenas uma ação explícita de aprovação pode mudar o estado para `approved`.

## 6. Decisões que não podem ser quebradas

- O navegador nunca chama diretamente o provedor de IA.
- `organizationId` nunca vem do corpo da requisição como autoridade.
- Arquivos nunca são servidos por URL pública permanente.
- Dados de clientes não são enviados para IA sem minimização e configuração explícita.
- A aprovação humana é obrigatória antes de uma resposta externa.
- Prompts, modelos e regras importantes são versionados.

## 7. Escalabilidade futura

Se o volume aumentar, separar geração de IA em worker assíncrono, adicionar fila, busca vetorial para conhecimento, serviço de notificações e integrações. Essas mudanças não devem ser antecipadas no MVP sem métricas que justifiquem a complexidade.
