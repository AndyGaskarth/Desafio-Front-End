# Nexus — Marketplace de NFTs

Marketplace demonstrativo construído com React, TypeScript, Vite, Tailwind,
TanStack Router/Query, Axios, MSW, Socket.IO e Playwright.

## Instalação e execução

```sh
npm ci
npm run dev
```

Abra `http://localhost:5173`. O catálogo, a autenticação e os pedidos são
simulados pelo MSW no navegador.

## Conta fictícia

- E-mail: `demo@nexus.com`
- Senha: `demo123`

O formulário aceita o cadastro de novos usuários com senha de ao menos seis
caracteres. Sessões e carrinhos são persistidos localmente; o perfil da conta
demonstra cadastro e adição de carteiras.

## Mocks

- Cupom válido: `NEXUS10`, desconto de 10%.
- Cupom expirado: `EXPIRED`.
- Qualquer outro código resulta em cupom inválido.
- Pedidos ficam pendentes inicialmente e são confirmados pelo mock após breve processamento.
- O endpoint `POST /api/reset` restaura usuários e pedidos simulados.

## Validação

```sh
npm run typecheck
npm run lint
npm run build
npm run test:e2e
npm run lighthouse
```

O Playwright cobre desktop, mobile, catálogo, detalhes, carrinho, conta e
checkout. O LHCI audita desktop/mobile a partir da configuração local.

## Publicação na Vercel

O arquivo `vercel.json` usa o build do Vite e aplica fallback SPA para rotas do
TanStack Router. Os workers do MSW são carregados pelo bundle estático e não
definem dependência em backend externo.

Consulte `ARCHITECTURE.md` para contratos REST, eventos Socket.IO, tratamento de
versionamento e persistência.
