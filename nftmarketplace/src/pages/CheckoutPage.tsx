import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { createOrder, getNfts } from "../lib/api";
import { getCart, getUser, setCart } from "../lib/state";
import { money, multiply, sum } from "../lib/money";
import { useQuery } from "@tanstack/react-query";

export function CheckoutPage() {
  const user = getUser();
  const cart = getCart();
  const [collector, setCollector] = useState(user?.name ?? "");
  const [status, setStatus] = useState<
    "idle" | "pending" | "confirmed" | "error"
  >("idle");
  const [orderId, setOrderId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { data = [] } = useQuery({ queryKey: ["nfts"], queryFn: getNfts });
  const lines = cart
    .map((item) => ({
      ...item,
      nft: data.find((nft) => nft.id === item.nftId)!,
    }))
    .filter((item) => item.nft);
  const subtotal = sum(
    lines.map((line) => multiply(line.nft.price, line.quantity)),
  );
  if (!user)
    return (
      <section className="mx-auto max-w-xl px-5 py-16">
        <h1 className="text-3xl font-bold">Autenticação necessária</h1>
        <p className="mt-3 text-slate-300">
          Entre na sua conta para finalizar a compra.
        </p>
        <Link
          to="/account"
          className="mt-5 inline-block rounded-md bg-violet-500 px-5 py-3 font-semibold"
        >
          Acessar conta
        </Link>
      </section>
    );
  const wallet = user.wallets[0];
  const pay = async () => {
    if (!wallet || !collector.trim() || submitted) return;
    setSubmitted(true);
    setStatus("pending");
    try {
      const saved = localStorage.getItem("nexus-active-order");
      const order = saved
        ? JSON.parse(saved)
        : await createOrder({
            items: cart,
            wallet,
            total: subtotal,
            collector,
          });
      localStorage.setItem("nexus-active-order", JSON.stringify(order));
      setOrderId(order.id);
      window.setTimeout(() => {
        setStatus("confirmed");
        setCart([]);
        localStorage.removeItem("nexus-active-order");
      }, 900);
    } catch {
      setStatus("error");
      setSubmitted(false);
    }
  };
  return (
    <section className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <h1 className="text-3xl font-bold">Checkout</h1>
      {status === "confirmed" ? (
        <div
          role="status"
          className="mt-8 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-8"
        >
          <h2 className="text-2xl font-bold text-emerald-300">
            Compra confirmada
          </h2>
          <p className="mt-2">Pedido {orderId}</p>
          <Link
            to="/"
            search={{ q: "", available: "all", sort: "featured", page: 1 }}
            className="mt-5 inline-block text-violet-300"
          >
            Voltar à coleção
          </Link>
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void pay();
          }}
          className="mt-8 space-y-6"
        >
          <fieldset className="rounded-lg border border-white/10 p-5">
            <legend className="px-2 font-semibold">
              Dados do colecionador
            </legend>
            <label className="block text-sm" htmlFor="collector">
              Nome completo
            </label>
            <input
              id="collector"
              required
              minLength={3}
              value={collector}
              onChange={(event) => setCollector(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#111220] px-3"
            />
          </fieldset>
          <fieldset className="rounded-lg border border-white/10 p-5">
            <legend className="px-2 font-semibold">Carteira e rede</legend>
            {wallet ? (
              <>
                <p>{wallet.label}</p>
                <p className="mt-1 break-all text-sm text-slate-400">
                  {wallet.address}
                </p>
                <p className="mt-2 text-sm text-cyan-200">{wallet.network}</p>
              </>
            ) : (
              <p className="text-amber-200">
                Cadastre uma carteira na sua conta.
              </p>
            )}
          </fieldset>
          <div className="rounded-lg border border-white/10 p-5">
            <h2 className="font-semibold">Revisão do pedido</h2>
            <p className="mt-2 text-slate-300">
              {cart.length} item(ns) · {money(subtotal)}
            </p>
          </div>
          {status === "error" && (
            <p role="alert" className="text-red-300">
              Pagamento recusado. Tente novamente.
            </p>
          )}
          <button
            disabled={!wallet || !collector.trim() || status === "pending"}
            className="w-full rounded-md bg-violet-500 py-3 font-semibold disabled:opacity-40"
          >
            {status === "pending"
              ? "Processando pagamento..."
              : "Confirmar pagamento"}
          </button>
        </form>
      )}
    </section>
  );
}
