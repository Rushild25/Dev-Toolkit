"use client"

import type React from "react"

import axios from "axios"
import { debounce } from "lodash"
import { Film, Search, Star } from "lucide-react"
import { useEffect, useState } from "react"
import LazyLoad from "react-lazyload"
import { BeatLoader } from "react-spinners"
import { toast } from "react-toastify"
import { v4 as uuidv4 } from "uuid"

interface Movie {
  id: string
  title: string
  year: string
  poster: string
  type: string
  imdbID: string
  rating?: number
}

export default function MoviesPage() {
  const [query, setQuery] = useState("")
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [lastSearched, setLastSearched] = useState<string | null>(null)

  const debouncedSearch = debounce(async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=3e974fca&s=${encodeURIComponent(searchQuery)}&type=movie`,
      )

      if (response.data.Response === "True") {
        const movieData = response.data.Search.map((item: any) => ({
          id: uuidv4(),
          title: item.Title,
          year: item.Year,
          poster: item.Poster !== "N/A" ? item.Poster : null,
          type: item.Type,
          imdbID: item.imdbID,
          rating: (Math.random() * 4 + 6) / 2,
        }))

        setMovies(movieData)
        setLastSearched(searchQuery)
        toast.success(`Found ${movieData.length} movies for "${searchQuery}"`)
      } else {
        setMovies([])
        toast.info(`No movies found for "${searchQuery}"`)
      }
    } catch (error) {
      console.error("Error fetching movies:", error)
      toast.error("Failed to fetch movies. Please try again.")
      setMovies([])
    } finally {
      setLoading(false)
    }
  }, 500)

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    debouncedSearch(value)
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Movie Database</h1>
        <p className="text-gray-600">
          Search for movies using the OMDB API. Demonstrates Axios, React-Spinners, and React-LazyLoad.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search for movies..."
            className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <BeatLoader color="#3B82F6" />
        </div>
      ) : (
        <>
          {lastSearched && movies.length > 0 && (
            <p className="text-gray-600 mb-4 text-center">Showing results for "{lastSearched}"</p>
          )}

          {movies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <LazyLoad key={movie.id} height={300} offset={100} once>
                  <div className="border rounded-lg overflow-hidden h-full flex flex-col">
                    <div className="p-2 bg-gray-50 flex items-center justify-center h-64">
                      {movie.poster ? (
                        <img
                          src={movie.poster || "/placeholder.svg"}
                          alt={movie.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Film className="h-16 w-16 text-gray-300" />
                      )}
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{movie.year}</p>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                        <span className="text-sm font-medium">{movie.rating?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </LazyLoad>
              ))}
            </div>
          ) : (
            lastSearched && (
              <div className="text-center py-12">
                <Film className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-1">No movies found</h3>
                <p className="text-gray-600">Try a different search term</p>
              </div>
            )
          )}
        </>
      )}

      {!query && !loading && movies.length === 0 && (
        <div className="text-center py-12">
          <Film className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">Search for movies</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Enter a title, actor, or keyword to discover movies using the OMDB API
          </p>
        </div>
      )}
    </div>
  )
}
