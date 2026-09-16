# Contributing

## Fluxo de trabalho

Crie uma branch curta a partir da branch principal. Cada alteração deve representar uma decisão ou uma unidade funcional compreensível. Antes de abrir um pull request, execute lint, typecheck e os testes relacionados.

## Convenções

Use TypeScript estrito, nomes em inglês no código e textos de interface em português brasileiro. Prefira funções pequenas e casos de uso explícitos. Não coloque regras de autorização apenas em componentes de frontend.

Toda nova rota deve documentar autenticação, permissão, entrada, saída, erros e auditoria. Toda nova entidade deve explicar organização, timestamps, exclusão lógica e índices.

## Pull requests

A descrição deve informar o problema, a solução, riscos, migrações, variáveis de ambiente novas e como validar. Mudanças que envolvam IA devem informar o modelo, versão do prompt, dados enviados e comportamento de fallback.

## Segurança

Nunca envie segredos, dados reais de clientes ou documentos reais para o repositório. Se encontrar uma falha de segurança, não a publique em issue aberta; comunique aos responsáveis do projeto por canal privado.

## Commits

Use mensagens curtas e descritivas, como `feat: add request triage`, `fix: enforce organization scope` e `test: cover draft approval conflict`.
