# Guia de implementação modular no Antigravity

Use este documento junto com um prompt de módulo por vez. Não cole todos os módulos simultaneamente na primeira execução. O Antigravity deve construir, testar e estabilizar um módulo antes de avançar.

## Prompt-base comum

Você está implementando um módulo do Contábil Flux. Antes de modificar o código, leia `README.md` e todos os documentos em `docs/`, especialmente arquitetura, segurança, API, dados, UX e plano de implementação. Inspecione o estado atual do repositório e preserve as convenções existentes.

Implemente a funcionalidade ponta a ponta: schema ou migration, domínio, caso de uso, autorização, rota de API, componentes de interface, estados de carregamento/vazio/erro/sucesso, auditoria e testes. Não crie apenas telas estáticas nem endpoints sem consumo pela interface.

Use TypeScript estrito, Zod nas fronteiras, Drizzle para persistência e organização multi-tenant. O `organizationId` deve vir da sessão no servidor. Nunca confie em IDs de organização enviados pelo navegador. Toda mutação deve verificar papel e pertencimento do recurso.

Após implementar, execute migration, seed se necessário, lint, typecheck, testes unitários, testes de integração e o E2E relevante. Corrija os problemas. Atualize documentação e README quando comandos, variáveis ou rotas mudarem.

## Ordem recomendada

1. Fundação e identidade.
2. Clientes.
3. Solicitações e tarefas.
4. Documentos e arquivos.
5. Conhecimento.
6. Assistência de IA.
7. Dashboard e relatórios.
8. Auditoria, observabilidade e hardening.

## Regra de parada

Não avance se houver falha em isolamento entre organizações, autorização, migration, typecheck ou teste do fluxo principal. Se faltar uma credencial externa, implemente um adapter mockado e deixe a integração substituível.

## Formato de resposta esperado do agente

Ao terminar cada módulo, informe: arquivos criados ou alterados; migrations; rotas; permissões; testes executados; decisões tomadas; limitações; instruções para executar localmente; e o próximo módulo recomendado.
