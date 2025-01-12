"use client";

import { useState } from 'react'
import { type Movie } from '@/utils/tmdb'
import { getWatchProviders } from '@/utils/tmdb'
//import { MovieCard } from './movie-card'
import Image from 'next/image'

interface RaffleButtonProps {
  movies: Movie[]
}

export function RaffleButton({ movies }: RaffleButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [watchProviders, setWatchProviders] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleRaffle = async () => {
    const randomIndex = Math.floor(Math.random() * movies.length)
    const movie = movies[randomIndex]
    setSelectedMovie(movie)
    setIsLoading(true)
    setIsOpen(true)

    const providers = await getWatchProviders(movie.id)
    setWatchProviders(providers)
    setIsLoading(false)
  }

  const getImagePath = (path: string | null) => {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : '/no-poster.jpg';
  }

  if (!isOpen) {
    return (
      <button onClick={handleRaffle} className="nes-btn is-primary">
        Raffle Movie
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
      <div className="nes-container is-dark with-title w-full max-w-[min(calc(100vw-1rem),20rem)]">
        <p className="title">Your Random Movie</p>
        {selectedMovie && (
          <div className="flex flex-col gap-2">
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

            <div className="nes-container is-dark">
              <p className="nes-text is-primary mb-2 text-xs">Where to Watch</p>
              {isLoading ? (
                <p className="nes-text is-disabled">Loading providers...</p>
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
                <p className="nes-text is-error">No streaming information available</p>
              )}
            </div>

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
  )
}

