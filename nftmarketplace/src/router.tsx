/* eslint-disable react-refresh/only-export-components */
import { createRootRoute, createRoute, createRouter, Outlet, Link, useNavigate } from '@tanstack/react-router'
import { AppShell } from './pages/AppShell'
import { CataloguePage } from './pages/CataloguePage'
import { NFTPage } from './pages/NFTPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { AccountPage } from './pages/AccountPage'

export const rootRoute = createRootRoute({ component: AppShell })
const indexRoute = createRoute({
  getParentRoute: () => rootRoute, path: '/', component: CataloguePage,
  validateSearch: (search: Record<string, unknown>) => ({ q: String(search.q ?? ''), available: String(search.available ?? 'all'), sort: String(search.sort ?? 'featured'), page: Number(search.page ?? 1) }),
})
const nftRoute = createRoute({ getParentRoute: () => rootRoute, path: '/nft/$id', component: NFTPage })
const cartRoute = createRoute({ getParentRoute: () => rootRoute, path: '/cart', component: CartPage })
const checkoutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/checkout', component: CheckoutPage })
const accountRoute = createRoute({ getParentRoute: () => rootRoute, path: '/account', component: AccountPage })

export const routeTree = rootRoute.addChildren([indexRoute, nftRoute, cartRoute, checkoutRoute, accountRoute])
export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' { interface Register { router: typeof router } }
export { Outlet, Link, useNavigate }
