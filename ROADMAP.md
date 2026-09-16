# Roadmap do Contábil Flux

## Objetivo deste documento

Este arquivo define o que faz parte do MVP, o que deve ser preparado arquiteturalmente e o que será construído em versões futuras. O Antigravity deve ler este documento antes de criar funcionalidades novas.

> **Regra principal:** uma funcionalidade futura pode ter contratos, interfaces, eventos e pontos de extensão preparados, mas não deve ser implementada no MVP sem uma instrução explícita ou sem mudança deste roadmap.

## MVP 1 — Operação interna confiável

O objetivo é validar o núcleo operacional com um escritório contábil real.

### Incluído

- autenticação real;
- organizações e isolamento multi-tenant;
- RBAC completo;
- cadastro de clientes;
- solicitações e mensagens internas;
- tarefas e responsáveis;
- pedidos de documentos e upload privado;
- base de conhecimento versionada;
- rascunhos de resposta assistidos por IA;
- aprovação humana obrigatória;
- dashboard operacional;
- auditoria persistente;
- segurança, testes e observabilidade básica.

### Critério de saída

Um escritório consegue organizar solicitações, atribuir trabalho, controlar documentos, consultar conhecimento, gerar rascunhos e acompanhar pendências sem depender de planilhas dispersas.

## MVP 2 — Colaboração com clientes

O objetivo é reduzir a dependência de e-mail e WhatsApp para coleta de documentos e acompanhamento de pendências.

### Funcionalidades futuras planejadas

- portal externo do cliente;
- convite de contatos do cliente;
- acompanhamento de status pelo cliente;
- upload externo de documentos;
- comentários em solicitações;
- notificações por e-mail;
- lembretes de documentos pendentes;
- histórico compartilhado com controle de visibilidade.

### Preparação necessária no MVP 1

As entidades de solicitação, documento e mensagem devem permitir uma origem externa, um ator não pertencente à equipe e regras de visibilidade. Isso não significa construir o portal agora.

## Versão 0.3 — Integrações operacionais

O objetivo é eliminar digitação duplicada e sincronizar o Contábil Flux com as ferramentas já usadas pelo escritório.

### Funcionalidades futuras planejadas

- integração com sistemas contábeis selecionados;
- importação de clientes;
- sincronização de status e tarefas;
- webhooks de entrada;
- sincronização de documentos quando permitido;
- conexão com e-mail;
- logs e painel de falhas de integração;
- reprocessamento idempotente.

### Regra de implementação

Não criar uma integração genérica prematura. Primeiro escolher o sistema usado por clientes-piloto. Toda integração futura deve usar adapters, secrets separados, escopos mínimos, logs sem dados sensíveis e fila ou retry controlado quando necessário.

## Versão 0.4 — Canais de atendimento

O objetivo é centralizar as mensagens que hoje ficam espalhadas.

### Funcionalidades futuras planejadas

- WhatsApp Business Platform oficial;
- caixa de entrada de e-mail;
- classificação de mensagens recebidas;
- associação automática de remetente ao cliente;
- templates aprovados;
- envio com aprovação humana;
- notificações internas;
- prevenção de mensagens duplicadas.

### Limite obrigatório

Não implementar robô de WhatsApp não oficial, scraping, automação de conta pessoal ou envio sem consentimento e sem aprovação. O produto deve usar canais oficiais e respeitar políticas do provedor.

## Versão 1.0 — Operação inteligente e valor gerencial

O objetivo é aumentar a percepção de valor do escritório perante os próprios clientes.

### Funcionalidades futuras planejadas

- relatórios gerenciais mensais;
- indicadores por cliente;
- acompanhamento de receita, despesas e pendências;
- sugestões de follow-up;
- análise de carteira;
- rentabilidade por cliente;
- classificação inteligente de solicitações;
- automações com aprovação;
- relatórios exportáveis e compartilháveis.

### Limite obrigatório

Relatórios devem informar origem e limitações dos dados. A IA pode ajudar a explicar variações, mas não deve inventar números, preencher lacunas silenciosamente ou emitir recomendação profissional sem revisão.

## Versão avançada — Domínios especializados

Estas funcionalidades são oportunidades de produto, mas não fazem parte do MVP nem devem bloquear o núcleo operacional:

- automações tributárias controladas;
- folha de pagamento;
- assinatura digital;
- cobrança financeira;
- contas a receber;
- conciliação;
- fluxos configuráveis por escritório;
- marketplace ou catálogo de integrações;
- automações de obrigações;
- portal completo com múltiplos contatos e permissões por cliente.

## O que não deve ser antecipado

Não construir SaaS separado, integração com todos os ERPs, chatbot que responde qualquer questão técnica, automação tributária autônoma, robô de WhatsApp não oficial, envio externo sem aprovação ou módulo financeiro completo antes de validar demanda e segurança.

## Como o Antigravity deve usar este roadmap

Antes de implementar uma solicitação nova, classifique-a como:

1. **MVP:** pode ser implementada se respeitar os documentos de arquitetura e segurança.
2. **Preparação arquitetural:** criar apenas interfaces, entidades mínimas, eventos, adapters ou pontos de extensão necessários.
3. **Futuro:** registrar a ideia e não implementar sem instrução explícita.
4. **Fora do produto:** rejeitar ou pedir esclarecimento.

Se uma funcionalidade futura exigir alteração estrutural do MVP, preparar uma abstração simples e documentar a decisão. Não criar telas incompletas, botões sem funcionamento ou integrações falsas apresentadas como prontas.

## Métricas para decidir avanço de fase

A evolução deve considerar uso real, não apenas opinião. Medir solicitações processadas, tempo de primeira resposta, documentos recebidos no prazo, tarefas atrasadas, adoção da IA, horas economizadas, retenção do escritório e pedidos recorrentes de integração.

Uma fase futura só deve ser priorizada quando houver demanda repetida de clientes, risco controlado, responsável técnico e critério de sucesso definido.
