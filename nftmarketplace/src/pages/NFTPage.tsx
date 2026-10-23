import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "@tanstack/react-router";
import { Heart, Minus, Plus, Star } from "lucide-react";
import { getNft, getNfts } from "../lib/api";
import { addToCart, storage } from "../lib/state";
import { money } from "../lib/money";
import { responsiveImage } from "../lib/nftImage";

export function NFTPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data, isPending, isError } = useQuery({
    queryKey: ["nft", id],
    queryFn: () => getNft(id),
  });
  const { data: collection = [] } = useQuery({
    queryKey: ["nfts"],
    queryFn: getNfts,
  });
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState("");
  const favorites = storage.read<string[]>("nexus-favorites", []);
  if (isPending)
    return <div className="mx-auto h-96 max-w-7xl animate-pulse bg-white/5" />;
  if (isError || !data)
    return (
      <section className="mx-auto max-w-7xl px-5 py-16">
        <h1 className="text-3xl font-bold">NFT não encontrado</h1>
        <Link
          to="/"
          search={{ q: "", available: "all", sort: "featured", page: 1 }}
          className="mt-4 inline-block text-violet-300"
        >
          Voltar ao catálogo
        </Link>
      </section>
    );
  const favorite = favorites.includes(data.id);
  const toggleFavorite = () =>
    storage.write(
      "nexus-favorites",
      favorite
        ? favorites.filter((value) => value !== data.id)
        : [...favorites, data.id],
    );
  const related = collection.filter((item) => item.id !== data.id);
  const image = responsiveImage(data.id, data.image);

  return (
    <div className="nft-detail-page">
      <p className="detail-breadcrumb">Início / Mercado / {data.name}</p>
      <section className="nft-detail-layout">
        <div className="nft-detail-image-wrap">
          <img
            src={image.image}
            srcSet={image.srcSet}
            sizes="(max-width: 760px) 100vw, 56vw"
            alt={data.name}
            fetchPriority="high"
            decoding="async"
            className="nft-detail-image"
          />
        </div>
        <div className="nft-detail-panel">
          <p className="eyebrow">Coleção Kurio Apes</p>
          <h1>{data.name}</h1>
          <div className="detail-rating">
            <strong>{money(data.price)}</strong>
            <span aria-label="Avaliação 4.8 de 5">
              <Star size={12} fill="currentColor" /> 4.8
            </span>
            <span>·</span>
            <span>{data.availableQuantity} disponíveis</span>
          </div>
          <p className="nft-detail-description">{data.description}</p>
          <dl className="nft-attributes">
            <div><dt>ID do token</dt><dd>#{data.id.padStart(4, "0")}</dd></div>
            <div><dt>Coleção</dt><dd>Kurio Apes</dd></div>
            <div><dt>Atributos</dt><dd>Único · Colecionável · Raro</dd></div>
            <div><dt>Criador</dt><dd>{data.creator}</dd></div>
          </dl>
          {data.availableQuantity === 0 ? (
            <p className="mt-5 rounded-md border border-red-400/30 p-4 text-red-200">
              Este NFT está esgotado.
            </p>
          ) : (
            <>
              <div className="nft-purchase-row">
                <div className="quantity-control">
                  <span>Quantidade</span>
                  <button
                    aria-label="Diminuir quantidade"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  >
                    <Minus size={14} />
                  </button>
                  <output>{quantity}</output>
                  <button
                    aria-label="Aumentar quantidade"
                    disabled={quantity >= data.availableQuantity}
                    onClick={() => setQuantity((value) => value + 1)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <strong className="purchase-total">{money(data.price)}</strong>
              </div>
              <div className="nft-purchase-actions">
                <button
                  onClick={() => {
                    addToCart(data.id, quantity);
                    setNotice("Adicionado ao carrinho.");
                  }}
                  className="warm-button purchase-button"
                >
                  Adicionar ao carrinho
                </button>
                <button
                  aria-label={
                    favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
                  }
                  aria-pressed={favorite}
                  onClick={toggleFavorite}
                  className="favorite-button"
                >
                  <Heart size={17} fill={favorite ? "currentColor" : "none"} />
                </button>
              </div>
            </>
          )}
          <p role="status" className="detail-notice">{notice}</p>
        </div>
      </section>
      <section className="nft-about">
        <h2>Detalhes do NFT</h2>
        <p>
          {data.name} é uma obra digital da coleção Kurio Apes, criada por
          {` ${data.creator}`}. Cada peça possui identidade própria e pode ser
          adicionada à sua carteira após a compra.
        </p>
        <p>
          A propriedade e os detalhes do item ficam associados ao seu token
          digital. Consulte a disponibilidade antes de concluir a compra.
        </p>
      </section>
      {related.length > 0 && (
        <section className="related-collection">
          <div className="related-heading">
            <h2>Mais desta coleção</h2>
            <Link to="/" search={{ q: "", available: "all", sort: "featured", page: 1 }}>
              Ver coleção
            </Link>
          </div>
          <div className="related-grid">
            {related.map((item) => {
              const relatedImage = responsiveImage(item.id, item.image);
              return (
                <Link
                  to="/nft/$id"
                  params={{ id: item.id }}
                  key={item.id}
                  className="related-card"
                >
                  <img
                    src={relatedImage.image}
                    srcSet={relatedImage.srcSet}
                    sizes="(max-width: 760px) 44vw, 190px"
                    alt={item.name}
                    loading="lazy"
                  />
                  <strong>{item.name}</strong>
                  <span>{money(item.price)}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
