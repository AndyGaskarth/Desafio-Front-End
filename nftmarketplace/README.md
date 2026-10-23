# Kurio — Marketplace de NFTs

Marketplace demonstrativo feito com React, TypeScript, Vite, Tailwind CSS,
TanStack Router/Query, Axios, MSW, Socket.IO e Playwright. A aplicação usa
respostas simuladas no navegador; não requer backend ou credenciais de serviços
privados para desenvolvimento e avaliação.

## Requisitos

- Node.js 20.19+ ou 22.12+.
- npm incluído com o Node.js.

## Setup

```sh
npm ci
npm run dev
```

Abra `http://localhost:5173`. O MSW é iniciado pela aplicação e simula o
catálogo, a autenticação, cupons, perfil e pedidos. Não é necessário criar um
arquivo `.env` para executar a versão com mocks.

### Variáveis de ambiente

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `VITE_SOCKET_URL` | Não | URL de um servidor Socket.IO compatível. Sem ela, o cliente Socket.IO não conecta e a aplicação funciona com REST/MSW. |

Para habilitar o cliente de tempo real, defina `VITE_SOCKET_URL` no ambiente
local antes de iniciar o Vite, por exemplo:

```text
VITE_SOCKET_URL=http://localhost:3001
```

Use somente valores de desenvolvimento. Não coloque senhas, tokens ou chaves
privadas em variáveis `VITE_*`: o Vite inclui esses valores no bundle público.
O projeto não exige credenciais reais; as contas abaixo são fictícias.

## Credenciais fictícias

- E-mail de demonstração: `demo@nexus.com`
- Senha de demonstração: `demo123`

O mock de login verifica se o e-mail existe e se a senha tem pelo menos seis
caracteres; não compara a senha com uma credencial armazenada e não há
provedor real de autenticação. Os valores acima são os dados fictícios
recomendados para a demonstração. Também é possível cadastrar uma conta local
pelo formulário.

## Cenários dos mocks

Os cenários são selecionados preenchendo os formulários da aplicação:

| Cenário | Como selecionar | Resultado esperado |
| --- | --- | --- |
| Login válido | Use `demo@nexus.com` e `demo123` em **Conta**. | Abre o perfil de demonstração, com carteira de teste. |
| Login inválido | Use um e-mail não cadastrado e uma senha com pelo menos seis caracteres. | O mock responde `401` e a página exibe o erro de autenticação. |
| Cadastro duplicado | Em **Conta**, escolha cadastro e informe `demo@nexus.com`. | O mock responde `400` indicando dados inválidos ou e-mail já cadastrado. |
| Cupom válido | No carrinho, aplique `NEXUS10`. | Aplica desconto de 10%. |
| Cupom expirado | No carrinho, aplique `EXPIRED`. | Exibe “Cupom expirado”, sem desconto. |
| Cupom inválido | Aplique qualquer outro código, por exemplo `INVALIDO`. | Exibe “Cupom inválido”, sem desconto. |
| NFT inexistente | Abra `/nft/id-inexistente`. | O mock responde `404` e a página oferece retorno ao catálogo. |
| Checkout sem carteira | Entre, remova a carteira em **Conta** e abra o checkout. | O checkout informa que é necessário cadastrar uma carteira e desabilita a confirmação. |
| Pedido confirmado | Mantenha a carteira de demonstração, adicione um NFT, entre e confirme o checkout. | O mock cria o pedido como pendente e o confirma após breve processamento. |

Os cenários de login, cadastro e cupom podem ser repetidos sem preparação
adicional. Para o checkout, a carteira de demonstração está disponível na
conta inicial.

### Reset dos dados simulados

No console do navegador, execute para restaurar usuários e pedidos no MSW:

```js
await fetch("/api/reset", { method: "POST" });
```

Para limpar também os dados locais do navegador (conta, carrinho, pedido ativo
e cupom) e voltar ao estado inicial, execute:

```js
await fetch("/api/reset", { method: "POST" });
localStorage.removeItem("nexus-user");
localStorage.removeItem("nexus-cart");
localStorage.removeItem("nexus-active-order");
sessionStorage.removeItem("nexus-coupon");
location.reload();
```

O endpoint de reset restaura os usuários fictícios iniciais e limpa os pedidos
em memória. Recarregar a página inicia novamente o worker MSW.

## Comandos

```sh
npm run dev                 # desenvolvimento com MSW
npm run typecheck           # verificação TypeScript
npm run lint                # ESLint
npm run build               # TypeScript + bundle de produção
npm run preview             # preview local do build
npm run test:e2e            # fluxos Playwright desktop e mobile
npm run lighthouse          # auditoria LHCI padrão
npm run lighthouse:desktop # auditoria desktop
npm run lighthouse:mobile  # auditoria mobile
```

Na primeira execução do Playwright, instale o Chromium se necessário:

```sh
npx playwright install chromium
```

Os testes E2E cobrem catálogo e detalhes, gerenciamento de carteiras, carrinho
e checkout em viewports desktop e mobile.

## Limitações da demonstração

Os usuários e pedidos dos mocks são mantidos em memória no worker; o carrinho
e a conta do navegador usam armazenamento local. Atualizar ou reiniciar a
aplicação reinicia o estado em memória do mock. O servidor Socket.IO é
opcional; sem `VITE_SOCKET_URL`, as telas funcionam sem atualizações por
Socket.IO. Veja [ARCHITECTURE.md](./ARCHITECTURE.md) para contratos, cache,
persistência, sincronização e limitações conhecidas.
