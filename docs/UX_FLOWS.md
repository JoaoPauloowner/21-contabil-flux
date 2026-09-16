# UX Flows

## 1. Onboarding do escritório

O usuário cria uma organização, informa nome e fuso horário, convida membros e escolhe os departamentos usados. A etapa de IA deve ser explícita: “Ativar assistência de IA para rascunhos e classificação?”. O padrão recomendado é ativada, mas com explicação de que toda sugestão exige revisão.

O onboarding termina com um checklist: criar primeiro cliente, criar solicitação e configurar primeira lista de documentos.

## 2. Criar solicitação

O usuário seleciona “Nova solicitação”, informa assunto e descrição, escolhe cliente, departamento, prioridade e prazo. O sistema oferece classificação sugerida apenas depois que houver conteúdo suficiente. A sugestão pode ser aceita ou editada.

Após salvar, a tela exibe a linha do tempo e uma ação clara: atribuir responsável, criar tarefa ou gerar rascunho.

## 3. Trabalhar uma solicitação

A tela de detalhe contém três áreas: contexto e status; conversa e anexos; ações e tarefas. A IA aparece como apoio contextual, não como protagonista. O usuário sempre consegue executar o fluxo sem IA.

## 4. Gerar e aprovar rascunho

O usuário clica em “Gerar rascunho”. O sistema explica que o resultado será uma sugestão. Durante o processamento, exibir estado de carregamento e permitir continuar em outra tela. Ao concluir, mostrar o texto, fontes internas, aviso de revisão e ações “Editar”, “Regenerar”, “Rejeitar” e “Aprovar”.

A aprovação deve exigir confirmação breve e registrar a versão. Se o conteúdo tiver incerteza detectada, o aviso deve ser mais forte e recomendar conferência.

## 5. Cobrar documentos

O usuário cria um pedido, escolhe período, adiciona itens e prazo. A interface mostra progresso. Cada item pode ser solicitado, recebido, em revisão, aprovado ou rejeitado. O histórico de cobrança deve ser visível e não depender de integração externa no MVP.

## 6. Dashboard

A tela inicial deve responder a quatro perguntas: o que está atrasado, o que não tem responsável, o que aguarda o cliente e onde a equipe está gastando tempo. Clicar em qualquer indicador leva à lista já filtrada.

## 7. Estados de erro

Erro de IA: informar que a assistência está indisponível e oferecer criação manual de resposta.

Erro de upload: informar tipo, tamanho ou motivo da rejeição e não perder os dados do formulário.

Erro de autorização: não revelar se o recurso existe em outra organização.

Erro de conflito: informar que o registro mudou e oferecer recarregar a versão atual.

## 8. Responsividade

Em telas pequenas, a lista de solicitações vira cartões compactos e os filtros ficam em drawer. O detalhe da solicitação usa uma coluna. A ação de aprovar rascunho permanece acessível no rodapé fixo, mas nunca cobre o conteúdo.
