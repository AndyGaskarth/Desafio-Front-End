import { Suspense, useState } from "react";
import { Link, Outlet } from "@tanstack/react-router";
import { Search, ShoppingBag, UserRound } from "lucide-react";
import { useCart, useUser } from "../lib/state";
import { useRealtime } from "../lib/realtime";

export function AppShell() {
  useRealtime();
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const cart = useCart();
  const user = useUser();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  return (
    <div className="marketplace-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link
            to="/"
            search={{ q: "", available: "all", sort: "featured", page: 1 }}
            className="site-brand"
          >
            KURIO
          </Link>
          <nav aria-label="Principal" className="site-nav">
            <Link
              to="/"
              search={{ q: "", available: "all", sort: "featured", page: 1 }}
              activeProps={{ "aria-current": "page" }}
            >
              Início
            </Link>
            <a href="/#colecao">Mercado</a>
            <a href="/#colecao">Criadores</a>
            <a href="/#rodape">Aprenda</a>
            <Link
              to="/"
              search={{ q: "", available: "all", sort: "featured", page: 1 }}
              aria-label="Buscar NFTs"
              className="site-icon-link"
            >
              <Search size={15} />
            </Link>
            <Link
              to="/cart"
              aria-label={`Carrinho, ${count} itens`}
              className="site-icon-link"
            >
              <ShoppingBag size={15} />
              {count > 0 && (
                <span className="site-count">
                  {count}
                </span>
              )}
            </Link>
            <Link
              to="/account"
              aria-label="Conta"
              className="site-icon-link"
            >
              <UserRound size={15} />
              {user && <span className="sr-only">{user.name}</span>}
            </Link>
            <Link to="/account" className="warm-button site-login">
              Entrar
            </Link>
          </nav>
        </div>
      </header>
      <main>
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl animate-pulse px-5 py-12">
              <div className="h-10 w-64 rounded-md bg-white/5" />
              <div className="mt-8 h-96 rounded-lg bg-white/5" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <footer className="site-footer" id="rodape">
        <section className="footer-features" aria-label="Benefícios Kurio">
          <article className="footer-feature">
            <span className="footer-feature-icon" aria-hidden="true">W</span>
            <h2>Segurança da carteira</h2>
            <p>Proteja sua carteira e colecione arte digital verificada com confiança.</p>
          </article>
          <article className="footer-feature">
            <span className="footer-feature-icon" aria-hidden="true">C</span>
            <h2>Criadores em destaque</h2>
            <p>Conheça artistas, estúdios e comunidades que moldam a cultura digital.</p>
          </article>
          <article className="footer-feature">
            <span className="footer-feature-icon" aria-hidden="true">D</span>
            <h2>Alertas de lançamentos</h2>
            <p>Receba novidades de coleções e lançamentos selecionados.</p>
          </article>
          <div className="footer-newsletter">
            <h2>Antecipe-se ao próximo lançamento</h2>
            <p>Receba lançamentos selecionados e histórias de criadores.</p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setNewsletterMessage("Inscrição registrada para esta demonstração.");
              }}
            >
              <label className="sr-only" htmlFor="newsletter-email">Seu e-mail</label>
              <input id="newsletter-email" type="email" required placeholder="Digite seu e-mail" />
              <button type="submit">Enviar</button>
            </form>
            {newsletterMessage && <p role="status">{newsletterMessage}</p>}
          </div>
        </section>
        <div className="footer-contact">
          <strong>KURIO</strong>
          <span>Feito para colecionadores, criadores e cultura</span>
          <a href="mailto:contato@kurio.art">contato@kurio.art</a>
          <a href="tel:+551140029922">+55 11 4002 9922</a>
        </div>
        <section className="footer-links" aria-label="Links do rodapé">
          <div>
            <h2>Meu perfil</h2>
            <Link to="/account">Meu perfil</Link>
            <Link to="/account">Minha coleção</Link>
            <Link to="/account">Atividade</Link>
          </div>
          <div>
            <h2>Central de ajuda</h2>
            <a href="#rodape">Central de ajuda</a>
            <a href="#rodape">Como comprar NFTs</a>
            <a href="#rodape">Carteira e segurança</a>
          </div>
          <div>
            <h2>Coleções</h2>
            <a href="#colecao">Arte digital</a>
            <a href="#colecao">Fotografia</a>
            <a href="#colecao">Música</a>
          </div>
          <div>
            <h2>Redes sociais</h2>
            <a href="#rodape">Instagram · X · Discord</a>
            <a href="#rodape">Carteiras compatíveis</a>
          </div>
        </section>
        <p className="footer-copyright">© 2026 Kurio. Propriedade digital para todos.</p>
      </footer>
    </div>
  );
}
