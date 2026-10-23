# Arquitetura

## Fluxo de dados
- React 19 e TypeScript formam as páginas e componentes.
- TanStack Router controla rotas e mantém filtros do catálogo na URL.
- TanStack Query possui o cache remoto; Axios executa todas as chamadas REST.
- MSW fornece os endpoints `/api/*` no navegador e permite build estático.
- Local Storage persiste carrinho, usuário e pedidos ativos; Session Storage guarda deduplicação de eventos.
- Decimal.js calcula valores financeiros em ETH sem ponto flutuante binário.
- Socket.IO mantém sincronização em tempo real e invalidação de Query.

## Contratos
- `NFT`: catálogo, preço decimal, quantidade, edição e versão.
- `CartItem`, `Wallet` e `User`: carrinho, carteira e perfil isolados por sessão.
- `Order`: pedido com `pending`, `confirmed` ou `declined` e versão monotônica.

## REST
`GET /api/nfts`, `GET /api/nfts/:id`, `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/coupons`, `POST /api/orders`, `GET /api/orders/:id`, `PUT /api/profile`, `POST /api/reset`.

## Tempo real
- `nft.updated`: `{ id, price?, availableQuantity?, version, eventId }`
- `order.updated`: `{ id, status, version, eventId }`

Versões antigas são rejeitadas, reconexão invalida o cache e identificadores de evento evitam duplicação. A sincronização REST permanece a fonte de recuperação.

## Limitações
O Figma público respondeu HTTP 403 nesta execução, portanto o layout foi preservado conforme os assets e o CSS local, sem afirmar validação visual com o arquivo remoto. Socket.IO real depende do servidor configurado na infraestrutura de publicação; a demonstração atual valida o cliente e os contratos.
