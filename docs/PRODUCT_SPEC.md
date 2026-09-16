# Product Specification

## 1. Visão do produto

O Contábil Flux é uma plataforma operacional para escritórios contábeis. Seu foco é reduzir o trabalho administrativo que ocorre entre a chegada de uma solicitação e a sua resolução. O sistema combina caixa de entrada, tarefas, documentos, conhecimento interno e IA assistida.

O produto deve parecer uma ferramenta de operação confiável, não um chatbot experimental. A interface precisa mostrar contexto, responsável, prazo, histórico e próxima ação.

## 2. Personas

### Sócio ou gestor do escritório

Precisa saber onde a operação está travando, quais clientes estão com pendências e quanto trabalho está concentrado em cada departamento. Tem pouco tempo e não quer configurar uma plataforma complexa.

### Analista contábil, fiscal ou de pessoal

Precisa processar solicitações rapidamente, encontrar respostas aprovadas e evitar procurar informações em múltiplos canais. Deve poder editar sugestões da IA antes de utilizá-las.

### Cliente empresarial

No MVP, pode existir apenas como registro e remetente de solicitações. A experiência externa completa de portal do cliente deve ser preparada na arquitetura, mas não precisa ser construída antes da validação do fluxo interno.

### Administrador da organização

Configura membros, permissões, departamentos, políticas de retenção e integrações futuras.

## 3. Casos de uso prioritários

### UC-01 — Registrar e classificar solicitação

Um membro cria ou recebe uma solicitação. O sistema registra título, descrição, cliente, departamento, prioridade, prazo e responsável. A IA pode sugerir categoria e prioridade, mas o membro confirma a classificação.

### UC-02 — Transformar solicitação em tarefa

O usuário cria uma tarefa vinculada à solicitação. A tarefa possui responsável, prazo, status, checklist e histórico. Uma solicitação pode gerar várias tarefas.

### UC-03 — Controlar documentos pendentes

O usuário cria uma lista de documentos esperados para um cliente e período. Cada item possui status, prazo, arquivo, observação e histórico de cobrança.

### UC-04 — Gerar rascunho de resposta

O usuário solicita um rascunho. O backend envia apenas o contexto autorizado à camada de IA. A resposta deve indicar as fontes internas utilizadas, marcar incertezas e permanecer em estado `draft` até aprovação humana.

### UC-05 — Pesquisar conhecimento interno

O membro pesquisa procedimentos, respostas aprovadas e políticas. A busca deve respeitar a organização e as permissões do usuário.

### UC-06 — Acompanhar operação

O gestor consulta solicitações abertas, atrasadas, sem responsável, por departamento e por cliente. Os indicadores devem ser derivados do banco e mostrar a data de atualização.

## 4. Requisitos não funcionais

O sistema deve ser responsivo, acessível em nível WCAG 2.2 AA sempre que aplicável, funcionar em português do Brasil, registrar datas em UTC e exibir datas no fuso configurado da organização. Deve usar paginação, filtros no servidor e estados de carregamento, vazio, erro e sucesso.

As operações críticas precisam ser idempotentes. Falhas da IA não podem impedir o uso manual do sistema. Nenhum componente visual deve depender de uma resposta de IA para renderizar a estrutura básica da tela.

## 5. Estados essenciais

Solicitações: `open`, `in_progress`, `waiting_client`, `waiting_internal`, `resolved`, `archived`.

Tarefas: `todo`, `in_progress`, `blocked`, `done`, `cancelled`.

Documentos: `requested`, `received`, `under_review`, `approved`, `rejected`, `expired`.

Rascunhos de IA: `queued`, `generating`, `draft`, `edited`, `approved`, `rejected`, `failed`.

## 6. Critérios de aceite do MVP

- Um usuário de uma organização não consegue consultar ou alterar dados de outra organização.
- Um membro sem permissão de administrador não consegue alterar configurações globais.
- Um arquivo não permitido é recusado antes do armazenamento definitivo.
- Um rascunho de IA sempre mostra que é uma sugestão e exige revisão.
- Uma resposta aprovada registra quem aprovou, quando aprovou e qual era o conteúdo final.
- A exclusão lógica preserva a trilha de auditoria.
- O painel funciona mesmo quando o provedor de IA está indisponível.
- A interface informa claramente quando um resultado foi gerado por IA.
