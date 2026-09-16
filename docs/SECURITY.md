# Security and Privacy

## 1. Objetivo

O produto processará informações operacionais e potencialmente pessoais de escritórios contábeis. A segurança deve ser construída como requisito de produto, não como etapa posterior. O sistema deve seguir princípios de minimização, finalidade, controle de acesso, rastreabilidade e retenção limitada.

Este documento é uma especificação técnica e não substitui avaliação jurídica, contrato, DPA ou orientação de profissional de privacidade.

## 2. Modelo de ameaças

### Isolamento entre organizações

A ameaça mais grave é um usuário consultar dados de outra organização. Toda tabela de negócio deve possuir `organization_id`. O servidor deve derivar esse valor da sessão e aplicar filtros em todas as consultas. Criar testes negativos que tentem acessar IDs de outra organização.

### Vazamento por IA

Prompts podem carregar dados de clientes. O sistema deve minimizar o contexto, remover campos desnecessários, impedir chamadas do cliente ao provedor, não registrar prompt completo em logs e permitir desativar IA por organização.

### Upload malicioso

Arquivos podem conter malware, extensões falsas ou conteúdo excessivo. Validar tamanho, MIME real, extensão permitida, nome, checksum e organização. Armazenar de forma privada e usar URL assinada com expiração curta. Planejar antivírus antes de liberar download para terceiros.

### Escalada de privilégio

Papéis devem ser verificados no backend. Esconder botão no frontend não é autorização. Ações de administração, exportação, exclusão e aprovação precisam de política explícita.

### Prompt injection

Conteúdo de mensagens e documentos é dado não confiável. O sistema não deve tratar instruções presentes no conteúdo como instruções de sistema. Delimitar contexto, usar prompts fixos versionados e instruir o modelo a ignorar comandos encontrados em documentos.

### Abuso e disponibilidade

Aplicar rate limit por usuário e organização, limite de tamanho de payload, timeout de IA, retry limitado e circuit breaker. A falha do provedor não deve bloquear o modo manual.

## 3. Controles obrigatórios

- HTTPS em todos os ambientes não locais.
- Cookies `HttpOnly`, `Secure` e `SameSite` adequado.
- Proteção CSRF quando a estratégia de sessão exigir.
- Senhas nunca armazenadas em texto puro.
- MFA opcional no MVP e obrigatório para administradores quando o provedor suportar.
- Segredos apenas em variáveis de ambiente ou secret manager.
- Validação Zod em toda entrada externa.
- Queries parametrizadas pelo ORM.
- Logs estruturados com remoção de tokens, senhas, documentos e conteúdo sensível.
- Headers de segurança, CSP revisada e proteção contra clickjacking.
- Dependências atualizadas e verificadas no CI.
- Backups criptografados e teste de restauração definido.
- Auditoria para login, falha de login, mudança de papel, download, aprovação, exportação e exclusão.

## 4. Papéis iniciais

- `owner`: controle total da organização.
- `admin`: gestão de membros, configurações e dados operacionais.
- `manager`: visão e gestão operacional, sem alterar segurança da organização.
- `member`: uso cotidiano conforme departamentos.
- `viewer`: leitura limitada.

Permissões devem ser verificadas por ação, recurso e organização. Não usar apenas comparação de strings no frontend.

## 5. IA segura

A camada de IA deve registrar o modelo, versão do prompt, timestamp, usuário solicitante, resultado de validação e fontes internas usadas. Não deve registrar chaves, conteúdo completo de arquivos ou dados desnecessários.

A resposta do modelo deve ser tratada como não confiável. Validar JSON com schema, limitar tamanho, bloquear instruções de execução e exibir aviso de revisão. Nunca permitir que o modelo execute SQL, envie e-mail, altere registros ou publique uma resposta sem uma ação explícita do backend e autorização do usuário.

## 6. Privacidade operacional

Implementar mecanismos para exportar dados da organização, remover ou anonimizar registros conforme política aplicável e configurar retenção. O sistema deve distinguir exclusão lógica, retenção legal e remoção física. A política final deve ser validada pelo responsável jurídico do negócio.

## 7. Checklist antes do deploy

- Teste de isolamento multi-tenant aprovado.
- Teste de autorização por papel aprovado.
- Upload inválido rejeitado.
- URLs de arquivos expiram.
- Logs não contêm segredos.
- IA está desligável por configuração.
- Aprovação humana está bloqueando envio externo.
- Rate limits estão ativos.
- Backups e restauração foram testados.
- Documentação de incidentes e contato responsável existe.
