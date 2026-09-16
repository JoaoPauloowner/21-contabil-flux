# Módulo 07 — Dashboard e relatórios

## Prompt para Antigravity

Implemente a visão operacional do Contábil Flux. O painel deve priorizar trabalho acionável, não gráficos decorativos.

### Indicadores

Implemente solicitações abertas, vencidas, sem responsável, aguardando cliente, tarefas atrasadas, documentos pendentes e tempo médio de primeira resposta. O backend deve calcular os indicadores com filtros de período, departamento e responsável. Exiba a data de atualização e uma definição curta de cada indicador.

### API

Implemente `GET /api/dashboard/summary?from=&to=` com agregações limitadas à organização. Evite consultas N+1. Use índices e, se necessário, consultas agregadas específicas. Não introduza cache complexo sem medir necessidade.

### Interface

Crie `/dashboard` com resumo no topo, lista de atenção imediata, atividade recente e links para listas filtradas. Crie `/reports` com filtros e tabela exportável apenas para papéis autorizados. No MVP, exportação pode ser CSV gerado no servidor, com auditoria.

### UX

Cada número deve permitir ação. Ao clicar em “12 solicitações vencidas”, navegar para `/requests?status=...&overdue=true`. Mostrar empty state útil quando não houver pendências. Em mobile, transformar cards e tabelas em blocos legíveis.

### Segurança

Verificar autorização para métricas, exportação e auditoria. Nunca incluir dados de uma organização em agregações. Limitar exportações por período e registrar ator, filtro e timestamp.

### Testes de aceite

Testar cálculos com dados fixos, timezone, período vazio, filtros, autorização de exportação, isolamento cross-tenant, paginação e navegação para listas filtradas.
