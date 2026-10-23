import { useState } from "react";
import { nftsData } from "./data/nfts";
import { NFTGrid } from "./components/NFTGrid";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredNFTs = nftsData.filter((nft) =>
    `${nft.name} ${nft.creator}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#080914] text-white">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-10">
        <a
          className="text-xl font-bold tracking-[0.2em] text-white"
          href="#inicio"
        >
          NEXUS
        </a>
        <nav
          aria-label="Navegação principal"
          className="flex items-center gap-6"
        >
          <a
            className="hidden text-sm text-slate-300 transition hover:text-white sm:inline"
            href="#colecao"
          >
            Coleção
          </a>
          <a
            className="rounded-full border border-violet-400/50 px-5 py-2.5 text-sm font-semibold text-violet-200 transition hover:border-violet-300 hover:bg-violet-400/10"
            href="#colecao"
          >
            Explorar NFTs
          </a>
        </nav>
      </header>

      <section
        className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pb-20 pt-10 sm:px-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16 lg:py-20"
        id="inicio"
      >
        <div className="relative z-10">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
            Uma coleção fora deste mundo
          </p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Criaturas cósmicas,
            <span className="block bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
              únicas como você.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Descubra seres extraordinários que atravessaram galáxias para
            encontrar um novo lar. Cada criatura é uma peça única da coleção
            Nexus.
          </p>
          <a
            className="mt-8 inline-flex rounded-full bg-violet-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-violet-950/40 transition hover:bg-violet-400"
            href="#colecao"
          >
            Ver coleção
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-5 rounded-full bg-violet-600/20 blur-3xl" />
          <img
            alt="Criatura cósmica nadando em uma galáxia azul e violeta"
            className="relative aspect-square w-full rounded-3xl border border-white/10 object-cover shadow-2xl shadow-violet-950/40"
            src={nftsData[0].image}
          />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/10 bg-[#10111f]/85 p-4 backdrop-blur sm:bottom-6 sm:left-6 sm:right-6">
            <div>
              <p className="text-xs text-slate-400">Destaque da coleção</p>
              <p className="mt-1 font-semibold">{nftsData[0].name}</p>
            </div>
            <span className="rounded-full bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-200">
              NFT
            </span>
          </div>
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-7xl px-6 pb-24 sm:px-10"
        id="colecao"
      >
        <div className="mb-8 flex flex-col justify-between gap-3 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300">
              A coleção
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Encontre sua criatura
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            {nftsData.length} itens únicos disponíveis
          </p>
        </div>

        <div className="mb-10 flex justify-center">
          <input
            type="text"
            placeholder="Buscar por criatura ou criador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='className="w-full max-w-md rounded-xl border border-white/10 bg-[#111220] px-4 py-3 text-sm text-white placeholder-slate-500 transition outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"'
          ></input>
        </div>

        <NFTGrid nfts={filteredNFTs} />
      </section>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-sm text-slate-500">
        Nexus — Criaturas Cósmicas
      </footer>
    </main>
  );
}

export default App;
