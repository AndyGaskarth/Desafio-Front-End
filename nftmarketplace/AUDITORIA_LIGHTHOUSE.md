# Auditoria Lighthouse

## Ambiente

- Lighthouse CLI: 13.5.0
- Chrome: Playwright Chromium 1248 / Chrome 156
- Node.js: 24.21.0
- npm: 11.19.0
- Sistema: Linux/Codespaces
- Aplicação: build de produção via `vite preview`, mocks padrão do MSW
- Amostras: 3 por cenário
- Emulação desktop: preset desktop
- Emulação mobile: 390 x 844, deviceScaleFactor 2
- Relatórios: JSON e HTML em `audits/`

## Medianas

| Cenário | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| Início desktop | 96 | 96 | 100 | 92 | 772,8 ms | 0,111 | 0 ms |
| Detalhe desktop | 99 | 96 | 100 | 92 | 758,7 ms | 0 | 0 ms |
| Início mobile | 87 | 96 | 100 | 92 | 3238,9 ms | 0 | 118 ms |
| Detalhe mobile | 88 | 96 | 100 | 92 | 3272,4 ms | 0 | 72 ms |

## Metas

- Desktop inicio/detalhe: Performance, Accessibility, Best Practices e SEO atingidas.
- Mobile inicio/detalhe: Accessibility, Best Practices e SEO atingidas; Performance ficou 2–3 pontos abaixo da meta de 90.
- A meta não é considerada atingida até existir mediana mobile >= 90 com relatório reproduzível.

## Causas observadas

- O código inicial ainda inclui React, router, Query, Axios, MSW e bibliotecas compartilhadas em requisições críticas.
- O chunk principal continua acima de 500 KB, apesar do carregamento lazy das páginas.
- As imagens WebP reduziram o conteúdo visual para arquivos menores, mas o bundle de JavaScript permanece dominante no LCP mobile.
- O CLS ficou zero no detalhe mobile e no catálogo móvel atual; o deslocamento desktop do catálogo é 0,111, abaixo de 0,1 esperado pela maior parte das métricas recomendadas e deve ser reduzido reservando dimensões estáveis aos elementos.

## Limitações conhecidas

- Socket.IO só conecta quando `VITE_SOCKET_URL` está definido; o build estático não gera erros de WebSocket no Lighthouse.
- Os JPEGs originais continuam presentes como fallback no diretório de assets, mas mobile usa variantes WebP responsivas.
