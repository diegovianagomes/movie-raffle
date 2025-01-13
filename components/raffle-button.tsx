"use client";

import { useState } from 'react';
import { type Movie } from '@/utils/tmdb';
import { getWatchProviders } from '@/utils/tmdb';
import Image from 'next/image';

interface RaffleButtonProps {
  movies: Movie[];
}

export function RaffleButton({ movies }: RaffleButtonProps) {
  const [isOpen, setIsOpen] = useState(false); // Controla se o popup está aberto
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null); // Filme selecionado
  const [watchProviders, setWatchProviders] = useState<any>(null); // Provedores de streaming
  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento
  const [remainingMovies, setRemainingMovies] = useState<Movie[]>(movies); // Filmes restantes para sorteio

  const handleRaffle = async () => {
    console.log('Button clicked'); // Verifica se o botão foi clicado

    // Se todos os filmes foram sorteados, reinicia a lista
    if (remainingMovies.length === 0) {
      setRemainingMovies(movies);
      alert('All movies have been raffled! Restarting the list.');
      return;
    }

    // Sorteia um filme da lista de filmes restantes
    const randomIndex = Math.floor(Math.random() * remainingMovies.length);
    const movie = remainingMovies[randomIndex];

    // Verifica se o filme sorteado é válido
    if (!movie || !movie.id) {
      console.error('Invalid movie selected:', movie);
      return;
    }

    // Remove o filme sorteado da lista de filmes restantes
    const updatedRemainingMovies = remainingMovies.filter((_, index) => index !== randomIndex);
    setRemainingMovies(updatedRemainingMovies);

    console.log('Selected movie:', movie); // Log do filme selecionado

    // Atualiza o estado para exibir o popup
    setSelectedMovie(movie);
    setIsLoading(true);
    setIsOpen(true);
    console.log('isOpen set to true'); // Verifica se o popup foi aberto

    try {
      // Busca os provedores de streaming para o filme selecionado
      const providers = await getWatchProviders(movie.id);
      console.log('Watch Providers:', providers); // Log dos provedores
      setWatchProviders(providers);
    } catch (error) {
      console.error('Error fetching watch providers:', error); // Log de erro
      setWatchProviders(null);
    } finally {
      setIsLoading(false); // Finaliza o estado de carregamento
    }
  };

  // Função para construir o caminho da imagem do filme
  const getImagePath = (path: string | null) => {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : '/no-poster.jpg';
  };

  // Se o popup não estiver aberto, exibe apenas o botão
  if (!isOpen) {
    return (
      <button onClick={handleRaffle} className="nes-btn is-primary">
        Raffle Movie
      </button>
    );
  }

  // Se o popup estiver aberto, exibe o conteúdo do popup
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
      <div className="nes-container is-dark with-title w-full max-w-[min(calc(100vw-1rem),20rem)]">
        <p className="title">Your Random Movie</p>
        {selectedMovie && (
          <div className="flex flex-col gap-2">
            {/* Detalhes do filme */}
            <div className="nes-container is-dark with-title">
              <p className="title text-xs line-clamp-1">{selectedMovie.title}</p>
              <div className="relative aspect-[2/3] h-[200px] overflow-hidden mb-2 flex items-center justify-center">
                <Image
                  src={getImagePath(selectedMovie.poster_path)}
                  alt={selectedMovie.title}
                  fill
                  className="object-cover pixelated"
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="nes-text is-primary">
                  {new Date(selectedMovie.release_date).getFullYear()}
                </span>
                <div className="flex items-center gap-1">
                  <i className="nes-icon is-small star"></i>
                  <span className="nes-text is-success">
                    {selectedMovie.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Onde assistir */}
            <div className="nes-container is-dark">
              <p className="nes-text is-primary mb-2 text-xs">Where to Watch</p>
              {isLoading ? (
                <p className="nes-text is-disabled">Loading</p>
              ) : watchProviders ? (
                <div className="space-y-4">
                  {watchProviders.flatrate && (
                    <div>
                      <p className="nes-text is-success mb-1 text-xs">Streaming on:</p>
                      <div className="flex flex-wrap gap-2">
                        {watchProviders.flatrate.map((provider: any) => (
                          <div
                            key={provider.provider_id}
                            className="relative h-6 w-6 overflow-hidden rounded"
                            title={provider.provider_name}
                          >
                            <Image
                              src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                              alt={provider.provider_name}
                              fill
                              className="object-cover pixelated"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {watchProviders.rent && (
                    <div>
                      <p className="nes-text is-warning mb-1 text-xs">Available for rent on:</p>
                      <div className="flex flex-wrap gap-2">
                        {watchProviders.rent.map((provider: any) => (
                          <div
                            key={provider.provider_id}
                            className="relative h-6 w-6 overflow-hidden rounded"
                            title={provider.provider_name}
                          >
                            <Image
                              src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                              alt={provider.provider_name}
                              fill
                              className="object-cover pixelated"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="nes-text is-error">
                  Error
                </p>
              )}
            </div>

            {/* Botões de ação */}
            <div className="flex gap-2 justify-center">
              <button onClick={handleRaffle} className="nes-btn is-warning text-xs px-2 py-1">
                Try Another
              </button>
              <button onClick={() => setIsOpen(false)} className="nes-btn is-error text-xs px-2 py-1">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}