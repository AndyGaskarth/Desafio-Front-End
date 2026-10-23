# Arquitetura

## Visão geral

- React e TypeScript compõem as páginas e componentes.
- TanStack Router controla as rotas; os filtros e a paginação do catálogo são
  serializados na query string.
- TanStack Query mantém o cache dos dados remotos; Axios executa chamadas à API.
- MSW intercepta `/api/*` no navegador e fornece o backend de demonstração sem
  serviço privado ou servidor de produção.
- Decimal.js trata os valores monetários em ETH.
- Socket.IO é opcional e só conecta quando `VITE_SOCKET_URL` está definido.

## Sessão, persistência e carrinho

Não há sessão autenticada em servidor nem token de acesso. O login do MSW
valida a conta fictícia, e a aplicação guarda o usuário atual em
`localStorage` (`nexus-user`). Esse dado local representa a sessão de
demonstração e persiste entre recargas no mesmo navegador.

O carrinho é persistido em `localStorage` (`nexus-cart`) e contém IDs de NFT e
quantidades; os dados e preços atuais dos itens são obtidos do catálogo. A
conta e o carrinho são sincronizados entre componentes da mesma aba por um
evento local (`nexus-storage`). Favoritos usam `nexus-favorites`. O cupom do
carrinho e a deduplicação/versões de eventos em tempo real usam
`sessionStorage`; expiram ao encerrar a sessão da aba.

Usuários registrados e pedidos criados pelo MSW vivem apenas na memória do
worker. Assim, eles são reiniciados quando o worker é recriado ou a página é
recarregada; já o usuário e o carrinho guardados no `localStorage` permanecem
até serem removidos. `POST /api/reset` restaura usuários fictícios iniciais e
limpa pedidos em memória, mas não limpa o armazenamento local do navegador.
Os passos completos de reset estão no [README](./README.md).

## Cache e dados REST

O QueryClient usa `staleTime: 30_000` e `retry: 1` por padrão. As queries de
catálogo e detalhe são identificadas por `["nfts"]` e `["nft", id]`;
atualizações REST e eventos Socket.IO invalidam essas chaves para buscar dados
atuais.

Endpoints simulados pelo MSW:

| Método | Endpoint | Comportamento |
| --- | --- | --- |
| `GET` | `/api/nfts` | Lista NFTs. |
| `GET` | `/api/nfts/:id` | Retorna NFT ou `404`. |
| `POST` | `/api/auth/login` | Valida conta fictícia; credenciais inválidas retornam `401`. |
| `POST` | `/api/auth/register` | Registra conta em memória; dados inválidos ou e-mail duplicado retornam `400`. |
| `POST` | `/api/coupons` | Valida cupom e retorna tipo, desconto e mensagem. |
| `POST` | `/api/orders` | Cria pedido `pending` e retorna `201`; o mock muda o estado para `confirmed` após breve intervalo. |
| `GET` | `/api/orders/:id` | Busca pedido ou retorna `404`. |
| `PUT` | `/api/profile` | Atualiza o perfil fictício. |
| `POST` | `/api/reset` | Restaura usuários e limpa pedidos em memória. |

Os mocks e suas credenciais/cenários estão descritos no
[README](./README.md). Eles não representam autenticação, persistência ou
liquidação financeira reais.

## Eventos e reconciliação em tempo real

Quando `VITE_SOCKET_URL` está configurada, o cliente conecta em
`/socket.io` usando WebSocket e polling como transportes disponíveis. Sem a
variável, o cliente não se conecta; catálogo, conta, carrinho e checkout
continuam funcionando com REST/MSW.

Eventos aceitos pelo cliente:

- `nft.updated`: `{ id, price?, availableQuantity?, version, eventId }`.
- `order.updated`: `{ id, status, version, eventId }`, onde `status` é
  `pending`, `confirmed` ou `declined`.

O cliente mantém versões e IDs de evento no `sessionStorage` para ignorar
versões antigas e eventos duplicados. Um evento de NFT invalida o catálogo e o
detalhe correspondente; um evento de pedido invalida a query daquele pedido e
notifica a aplicação. Ao reconectar, todas as queries são invalidadas. A
reconsulta REST é a reconciliação com a fonte de dados; Socket.IO não substitui
as respostas REST.

O mock MSW não publica eventos Socket.IO nem inicia um servidor Socket.IO. A
atualização em tempo real exige um serviço compatível, externo à demonstração.

## Decisões de UX e relação com o Figma

O layout foi ajustado usando as capturas desktop e mobile fornecidas: paleta
escura com acentos âmbar, navegação e rodapé comuns, catálogo com filtros,
detalhe de NFT e checkout adaptável. O nome da coleção apresentado é Kurio
Cosmic. As imagens originais dos cards foram mantidas.

As capturas representam páginas e dados de um marketplace completo, enquanto
este repositório contém catálogo e três NFTs de demonstração, com fluxos
simulados de conta, carrinho e checkout. Portanto, o conteúdo, a quantidade de
itens e alguns controles não são idênticos ao protótipo. O layout é
responsivo, mas não há autenticação real, pagamento on-chain, envio efetivo de
newsletter nem backend persistente.
