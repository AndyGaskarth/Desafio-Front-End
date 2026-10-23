/* eslint-disable react-refresh/only-export-components */
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { lazy } from "react";
import { AppShell } from "./pages/AppShell";

const CataloguePage = lazy(() =>
  import("./pages/CataloguePage").then((module) => ({
    default: module.CataloguePage,
  })),
);
const NFTPage = lazy(() =>
  import("./pages/NFTPage").then((module) => ({ default: module.NFTPage })),
);
const CartPage = lazy(() =>
  import("./pages/CartPage").then((module) => ({ default: module.CartPage })),
);
const CheckoutPage = lazy(() =>
  import("./pages/CheckoutPage").then((module) => ({
    default: module.CheckoutPage,
  })),
);
const AccountPage = lazy(() =>
  import("./pages/AccountPage").then((module) => ({
    default: module.AccountPage,
  })),
);

export const rootRoute = createRootRoute({ component: AppShell });
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: CataloguePage,
  validateSearch: (search: Record<string, unknown>) => ({
    q: String(search.q ?? ""),
    available: String(search.available ?? "all"),
    sort: String(search.sort ?? "featured"),
    page: Number(search.page ?? 1),
  }),
});
const nftRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nft/$id",
  component: NFTPage,
});
const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});
const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});
const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: AccountPage,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  nftRoute,
  cartRoute,
  checkoutRoute,
  accountRoute,
]);
export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
export { Outlet, Link, useNavigate };
