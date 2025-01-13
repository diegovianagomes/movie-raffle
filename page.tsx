import { getPersonalMovieList } from '@/utils/tmdb'
import { MovieCard } from '@/components/movie-card'
import { RaffleButton } from '@/components/raffle-button'

export default async function Home() {
  const movies = await getPersonalMovieList(8506824) // Busca a lista pessoal

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-center gap-4 flex-wrap">
          <h1 className="nes-text is-primary text-center text-3xl">
            My Movie Raffle
          </h1>
          <RaffleButton movies={movies} />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {
            movies.map((movie) => {
              // Verifica se o filme e o título existem
              if (!movie || !movie.title) {
                console.warn('Movie or title is undefined:', movie); // Log para depuração
                return null; // Retorna null para evitar erros
              }

              // Limita o título a 10 caracteres e adiciona reticências se necessário
              const truncatedTitle =
                movie.title.length > 8 ? `${movie.title.slice(0, 8)}...` : movie.title;

              return (
                <MovieCard
                  key={movie.id}
                  {...movie}
                  title={truncatedTitle} // Passa o título truncado como prop
                />
              );
            })
          }
        </div>
      </main>
    </div>
  )
}