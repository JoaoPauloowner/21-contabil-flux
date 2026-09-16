# Implementation Plan

## Fase 0 — Fundação

Criar o projeto, TypeScript estrito, lint, formatter, variáveis de ambiente tipadas, banco local, migrations, autenticação e layout protegido. Definir tokens visuais e componentes base.

**Saída:** usuário autenticado consegue acessar uma organização e navegar no shell.

## Fase 1 — Organizações, membros e clientes

Implementar papéis, autorização no servidor, cadastro de clientes, filtros e exclusão lógica. Criar testes de isolamento entre organizações.

**Saída:** dados de uma organização nunca aparecem em outra.

## Fase 2 — Solicitações e tarefas

Implementar criação, listagem, detalhe, filtros, transições de status, tarefas e linha do tempo. Adicionar auditoria para mutações.

**Saída:** equipe consegue operar o trabalho manualmente sem IA.

## Fase 3 — Documentos

Implementar pedidos, itens, upload privado, URLs assinadas, limites e revisão. Começar com tipos permitidos configuráveis.

**Saída:** equipe consegue controlar documentos pendentes com segurança.

## Fase 4 — Conhecimento e IA assistida

Implementar artigos, versões, busca textual, adapter de IA, prompt versionado, schema de saída, rate limit, timeout, rascunhos e aprovação humana.

**Saída:** equipe gera rascunhos úteis, edita, aprova e audita.

## Fase 5 — Dashboard e qualidade

Adicionar métricas agregadas, filtros, estados de interface, acessibilidade, testes E2E, observabilidade e documentação de deploy.

**Saída:** MVP demonstrável e operável.

## Estratégia de testes

Testes unitários cobrem regras de transição, permissões e validação. Testes de integração cobrem repositórios, upload e casos de uso. Testes E2E cobrem onboarding, criação de solicitação, upload, geração de rascunho, aprovação e isolamento.

Criar testes de falha para provedor de IA indisponível, arquivo acima do limite, tentativa de acesso cross-tenant e aprovação de versão desatualizada.

## Definition of Done

Uma funcionalidade só está pronta quando possui schema validado, autorização no backend, estado de loading/empty/error/success, auditoria quando aplicável, teste automatizado, tratamento de erro, texto em português brasileiro e documentação mínima.

## Ordem de prioridade

Primeiro garantir operação manual e isolamento de dados. Depois adicionar IA. Por fim otimizar aparência, métricas e integrações. Não aceitar uma tela bonita que não tenha regras de autorização e estados de falha.

## Deploy inicial

Usar ambiente de staging com banco separado. Executar migrations, seed fictício, testes e verificação de variáveis antes de produção. Configurar domínio, HTTPS, logs, backup, monitoramento e procedimento de rollback.
