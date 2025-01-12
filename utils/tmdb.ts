export interface Movie {
  id: number
  title: string
  poster_path: string
  release_date: string
  vote_average: number
}

interface WatchProvider {
  provider_name: string
  logo_path: string
}

interface WatchProviders {
  flatrate?: WatchProvider[]
  rent?: WatchProvider[]
  buy?: WatchProvider[]
}

const TMDB_API_BASE = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

export async function getPopularMovies(): Promise<Movie[]> {
  const response = await fetch(`${TMDB_API_BASE}/movie/popular`, {
    headers: {
      'Authorization': `Bearer ${process.env.TMDB_API_KEY}`,
      'Content-Type': 'application/json'
    },
    next: { revalidate: 3600 }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch movies')
  }

  const data = await response.json()
  return data.results
}

export async function getWatchProviders(movieId: number): Promise<WatchProviders | null> {
  const response = await fetch(
    `${TMDB_API_BASE}/movie/${movieId}/watch/providers`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.TMDB_API_KEY}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 3600 }
    }
  )

  if (!response.ok) {
    return null
  }

  const data = await response.json()
  return data.results?.BR || null
}

export function getImagePath(path: string | null): string {
  if (!path) return '/placeholder.svg?height=400&width=300'
  return `${TMDB_IMAGE_BASE}${path}`
}

