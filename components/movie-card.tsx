import Image from 'next/image'
//import { Star } from 'lucide-react'
import { type Movie } from '@/utils/tmdb'
import { getImagePath } from '@/utils/tmdb'

export function MovieCard({ title, poster_path, vote_average, release_date }: Movie) {
  const year = new Date(release_date).getFullYear()
  
  return (
    <div className="nes-container is-dark with-title">
      <p className="title line-clamp-1">{title}</p>
      <div className="relative aspect-[2/3] overflow-hidden mb-4">
        <Image
          src={getImagePath(poster_path)}
          alt={title}
          fill
          className="object-cover pixelated"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="nes-text is-primary">{year}</span>
        <div className="flex items-center gap-1">
          <i className="nes-icon is-small star"></i>
          <span className="nes-text is-success">{vote_average.toFixed(1)}</span>
        </div>
      </div>
    </div>
  )
}

