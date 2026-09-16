# Design System

## 1. Direção visual

A interface deve transmitir **controle, clareza e confiança operacional**. Evitar a estética genérica de “dashboard de IA” com gradientes excessivos, brilho, robôs e elementos decorativos sem função. O produto deve parecer uma ferramenta profissional usada diariamente por uma equipe contábil.

A linguagem visual combina fundo claro, superfícies brancas, bordas discretas, azul profundo para ação primária e verde controlado para estados positivos. O contraste deve ser alto e os estados nunca podem depender apenas de cor.

## 2. Tokens

### Cores

```css
--background: #F7F8FA;
--surface: #FFFFFF;
--surface-subtle: #F1F4F7;
--text: #17202A;
--text-muted: #5B6875;
--border: #DCE2E8;
--primary: #155EEF;
--primary-hover: #0E4ECD;
--success: #168A5B;
--warning: #B7791F;
--danger: #C53030;
--info: #2563A6;
--focus: #7AA7FF;
```

Usar fundo `#F7F8FA` no shell principal. Usar branco para cartões. Reservar vermelho para erro, risco ou ação destrutiva. Evitar usar a cor primária em todos os elementos.

### Tipografia

Usar Inter ou uma fonte sans-serif equivalente, com fallback do sistema. O título da página deve ter 28–32px, títulos de seção 18–22px, texto padrão 14–16px e metadados 12–13px. A hierarquia deve depender de peso, espaço e contraste, não de muitos tamanhos.

### Espaçamento e forma

Usar escala de 4px, com 8px como unidade recorrente. Cards devem ter raio de 10–12px. Botões devem ter raio de 8px. Evitar excesso de arredondamento. Sombras devem ser suaves e raras; bordas devem organizar a informação.

## 3. Layout da aplicação

Desktop: shell com sidebar de 248px, área principal fluida e header de 64px. Tablet: sidebar recolhível. Mobile: navegação inferior ou drawer, com ações críticas acessíveis sem rolagem horizontal.

A página deve seguir esta ordem: título e ação principal, filtros ou contexto, conteúdo principal, estados e detalhes. O painel não deve criar uma grade cheia de números sem explicar sua utilidade.

## 4. Navegação

- Visão geral
- Solicitações
- Tarefas
- Documentos
- Clientes
- Conhecimento
- Relatórios
- Configurações

A navegação deve exibir o nome da organização, usuário atual e opção de sair. Itens sem funcionalidade no MVP não devem aparecer como se estivessem prontos.

## 5. Componentes essenciais

### RequestList

Tabela ou lista densa com assunto, cliente, departamento, prioridade, responsável, prazo e status. Deve suportar busca, filtros, ordenação e paginação.

### RequestDetail

Cabeçalho com status e prioridade, linha do tempo, mensagens, anexos, tarefas relacionadas e painel de IA. O painel de IA deve ter rótulo “Sugestão gerada por IA” e botão de copiar, editar e aprovar.

### StatusBadge

Exibe texto e ícone, além de cor. Nunca usar cor isoladamente.

### EmptyState

Explica o que aparecerá, por que está vazio e qual ação o usuário pode executar.

### ApprovalPanel

Mostra texto sugerido, fontes internas, aviso de revisão e histórico de versões. O botão de aprovação deve ser explícito.

### AuditTimeline

Mostra ator, ação e horário em ordem cronológica. Não expor segredos, tokens ou conteúdo desnecessário.

## 6. Estados obrigatórios de interface

Cada página precisa ter estados de carregamento com skeleton, vazio com orientação, erro com ação de tentar novamente, sucesso com confirmação breve e estado offline ou indisponibilidade quando aplicável.

## 7. Acessibilidade

Usar HTML semântico, foco visível, navegação por teclado, labels associados, mensagens de erro próximas dos campos e `aria-live` para confirmações importantes. Modais devem prender foco e fechar com Escape. Tabelas devem ter cabeçalhos identificáveis.

## 8. Microcopy

Usar português brasileiro, linguagem direta e operacional. Preferir “Aprovar rascunho” a “Executar IA”. Preferir “Aguardando cliente” a “Pending external”. Sempre explicar quando uma ação foi sugerida por IA e ainda precisa de revisão.

## 9. Página inicial do produto

A tela de visão geral deve conter:

- saudação contextual sem excesso de marketing;
- solicitações vencidas;
- solicitações sem responsável;
- documentos aguardando cliente;
- tarefas da equipe;
- indicador de tempo de primeira resposta;
- atividade recente;
- ação rápida para criar solicitação.

O foco visual deve ser a lista de trabalho que precisa de atenção, não gráficos decorativos.
