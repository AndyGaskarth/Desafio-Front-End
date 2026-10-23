import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { getNfts } from "../lib/api";
import { money } from "../lib/money";
import { responsiveImage } from "../lib/nftImage";

export function CataloguePage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as {
    q?: string;
    available?: string;
    sort?: string;
    page?: number;
  };
  const {
    data = [],
    isPending,
    isError,
  } = useQuery({ queryKey: ["nfts"], queryFn: getNfts });
  const query = search.q ?? "";
  const available = search.available ?? "all";
  const sort = search.sort ?? "featured";
  const page = search.page ?? 1;
  let filtered = data.filter(
    (item) =>
      `${item.name} ${item.creator}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (available === "all" || item.availableQuantity > 0),
  );
  filtered = [...filtered].sort((a, b) =>
    sort === "price-asc"
      ? Number(a.price) - Number(b.price)
      : sort === "name"
        ? a.name.localeCompare(b.name)
        : 0,
  );
  const perPage = 6;
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, pages);
  const items = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const update = (values: Record<string, string | number>) =>
    navigate({
      to: "/",
      search: { q: query, available, sort, page: 1, ...values },
    });
  const featured = data[0];

  return (
    <div className="catalogue-page">
      <section className="catalogue-hero" id="inicio">
        <div className="catalogue-hero-copy">
          <p className="eyebrow">Bem-vindo à Kurio</p>
          <h1>Encontre sua criatura cósmica</h1>
          <p className="catalogue-hero-description">
            Descubra NFTs selecionados de criadores independentes e encontre
            uma peça única para sua coleção.
          </p>
          <a className="warm-button catalogue-hero-button" href="#colecao">
            Explorar coleção
          </a>
        </div>
        {featured && !query && (
          <Link
            to="/nft/$id"
            params={{ id: featured.id }}
            className="catalogue-featured-image"
            aria-label={`Ver NFT em destaque: ${featured.name}`}
          >
            <img src={featured.image} alt={featured.name} fetchPriority="high" />
            <span className="featured-label">NFT em destaque</span>
            <span className="featured-title">{featured.name}</span>
          </Link>
        )}
      </section>

      <section className="catalogue-layout" id="colecao">
        <aside className="catalogue-sidebar" aria-label="Filtros do catálogo">
          <div>
            <h2>Explorar coleções</h2>
            <p className="sidebar-intro">Peças selecionadas para descobrir e colecionar.</p>
          </div>
          <label className="catalogue-search">
            <span className="sr-only">Buscar por nome ou criador</span>
            <Search size={16} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => update({ q: event.target.value })}
              placeholder="Nome ou criador"
            />
          </label>
          <label className="catalogue-filter">
            <span>Disponibilidade</span>
            <select
              aria-label="Disponibilidade"
              value={available}
              onChange={(event) => update({ available: event.target.value })}
            >
              <option value="all">Todos os NFTs</option>
              <option value="available">Disponíveis</option>
            </select>
          </label>
          <label className="catalogue-filter">
            <span>Ordenar por</span>
            <select
              aria-label="Ordenação"
              value={sort}
              onChange={(event) => update({ sort: event.target.value })}
            >
              <option value="featured">Em destaque</option>
              <option value="price-asc">Menor preço</option>
              <option value="name">Nome</option>
            </select>
          </label>
          <div className="sidebar-note">
            <span className="sidebar-note-dot" />
            <p>Novos itens e artistas são adicionados regularmente.</p>
          </div>
        </aside>

        <div className="catalogue-results">
          <div className="catalogue-heading">
            <div>
              <p className="eyebrow">Mercado / NFTs</p>
              <h2>Todos os NFTs</h2>
            </div>
            <span>{filtered.length} itens disponíveis</span>
          </div>
          {isPending && (
            <div className="catalogue-grid" aria-label="Carregando NFTs">
              {[1, 2, 3].map((key) => (
                <div key={key} className="catalogue-skeleton" />
              ))}
            </div>
          )}
          {isError && (
            <p className="catalogue-error" role="alert">
              Não foi possível carregar os NFTs.
            </p>
          )}
          {!isPending && !isError && items.length === 0 && (
            <p className="catalogue-empty">Nenhum NFT encontrado.</p>
          )}
          {!isPending && !isError && (
            <div className="catalogue-grid">
              {items.map((item) => {
                const image = responsiveImage(item.id, item.image);
                return (
                  <Link
                    to="/nft/$id"
                    params={{ id: item.id }}
                    key={item.id}
                    className="catalogue-card"
                  >
                    <div className="catalogue-card-image">
                      <img
                        src={image.image}
                        srcSet={image.srcSet}
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 260px"
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                      />
                      <span aria-hidden="true" className="card-heart">♡</span>
                    </div>
                    <div className="catalogue-card-details">
                      <div className="catalogue-card-title">
                        <h3>{item.name}</h3>
                        <span>{item.availableQuantity} un.</span>
                      </div>
                      <p>por {item.creator}</p>
                      <strong>{money(item.price)}</strong>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          {!isPending && pages > 1 && (
            <nav className="catalogue-pagination" aria-label="Paginação">
              {Array.from({ length: pages }, (_, index) => index + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => update({ page: number })}
                    aria-current={currentPage === number ? "page" : undefined}
                    className={currentPage === number ? "is-current" : ""}
                  >
                    {number}
                  </button>
                ),
              )}
            </nav>
          )}
        </div>
      </section>
    </div>
  );
}
