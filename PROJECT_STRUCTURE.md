# Estrutura do projeto

Este repositório reúne a documentação de produto e o scaffold executável do Contábil Flux.

- `src/app`: páginas Next.js e Route Handlers.
- `src/server/domain`: entidades e tipos de domínio.
- `src/server/application`: casos de uso, sessão e autorização.
- `src/server/infrastructure`: repositórios, adapters e providers externos.
- `docs/`: especificações de produto, arquitetura, segurança, API, dados e UX.
- `prompts/`: prompt-mestre, guia de execução e prompts por módulo para o Antigravity.

O scaffold usa armazenamento em memória apenas para demonstrar o fluxo. A evolução para PostgreSQL, autenticação real, storage privado e provider de IA real está documentada nos prompts e no README.
