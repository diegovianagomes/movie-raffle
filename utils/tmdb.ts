export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface WatchProviders {
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface MovieListResponse {
  id: number;
  name: string;
  description: string;
  items: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface MovieDetails extends Movie {
  overview: string;
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
}

export interface MovieImages {
  backdrops: { file_path: string }[];
  posters: { file_path: string }[];
}

const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export async function getPersonalMovieList(listId: number = 8506824): Promise<Movie[]> {
  try {
    let allMovies: Movie[] = [];
    let currentPage = 1;
    let totalPages = 1;

    do {
      const response = await fetch(`${TMDB_API_BASE}/list/${listId}?page=${currentPage}`, {
        headers: {
          'Authorization': `Bearer ${process.env.TMDB_API_KEY}`,
          'Content-Type': 'application/json'
        },
        next: { revalidate: 3600 }
      });

      if (!response.ok) {
        console.error('Failed to fetch personal movie list:', response.status, response.statusText);
        throw new Error('Failed to fetch personal movie list');
      }

      const data = await response.json();
      console.log(`Fetched page ${currentPage} of ${data.total_pages}`);
      console.log('Movies in this page:', data.items.length);

      if (!data.items || !Array.isArray(data.items)) {
        console.error('Invalid data format:', data);
        throw new Error('Invalid data format');
      }

      const validMovies = data.items.filter((movie: Movie) => movie.title);
      console.log('Valid movies in this page:', validMovies.length);

      allMovies = [...allMovies, ...validMovies];
      totalPages = data.total_pages;
      currentPage++;

      await new Promise((resolve) => setTimeout(resolve, 500));
    } while (currentPage <= totalPages);

    // Remove filmes duplicados
    const uniqueMovies = [...new Map(allMovies.map(movie => [movie.id, movie])).values()];
    console.log('Total unique movies:', uniqueMovies.length);

    return uniqueMovies;
  } catch (error) {
    console.error('Error fetching personal movie list:', error);
    throw error;
  }
}

export async function getWatchProviders(movieId: number): Promise<WatchProviders | null> {
  try {
    const response = await fetch(
      `${TMDB_API_BASE}/movie/${movieId}/watch/providers`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.TMDB_API_KEY}`,
          'Content-Type': 'application/json'
        },
        next: { revalidate: 3600 }
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch watch providers:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    console.log('API Response:', data); // Log completo da resposta

    // Verifica se há provedores para o Brasil (BR)
    if (data.results?.BR) {
      return data.results.BR;
    } else {
      console.warn('No watch providers found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching watch providers:', error);
    return null;
  }
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails | null> {
  try {
    const response = await fetch(`${TMDB_API_BASE}/movie/${movieId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.TMDB_API_KEY}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      console.error('Failed to fetch movie details:', response.status, response.statusText);
      return null;
    }

    const data: MovieDetails = await response.json();
    console.log('Movie Details Data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

export async function getMovieImages(movieId: number): Promise<MovieImages | null> {
  try {
    const response = await fetch(`${TMDB_API_BASE}/movie/${movieId}/images`, {
      headers: {
        'Authorization': `Bearer ${process.env.TMDB_API_KEY}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      console.error('Failed to fetch movie images:', response.status, response.statusText);
      return null;
    }

    const data: MovieImages = await response.json();
    console.log('Movie Images Data:', data); // Log para depuração
    return data;
  } catch (error) {
    console.error('Error fetching movie images:', error);
    return null;
  }
}

export function getImagePath(path: string | null): string {
  if (!path) return '/placeholder.svg?height=400&width=300';
  return `${TMDB_IMAGE_BASE}${path}`;
}