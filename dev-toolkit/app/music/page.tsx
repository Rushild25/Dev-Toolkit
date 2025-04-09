"use client"

import type React from "react"
import { debounce } from "lodash"
import { Clock, Music, Search } from "lucide-react"
import { useEffect, useState } from "react"
import LazyLoad from "react-lazyload"
import { BeatLoader } from "react-spinners"
import { toast } from "react-toastify"
import { v4 as uuidv4 } from "uuid"

interface Track {
  id: string
  name: string
  artists: string[]
  album: string
  albumArt: string
  duration: number
  previewUrl: string | null
}

export default function MusicPage() {
  const [query, setQuery] = useState("")
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)
  const [lastSearched, setLastSearched] = useState<string | null>(null)
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const debouncedSearch = debounce(async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockTracks: Track[] = Array(10)
        .fill(null)
        .map((_, index) => ({
          id: uuidv4(),
          name: `${searchQuery} Song ${index + 1}`,
          artists: [`Artist ${(index % 3) + 1}`, index % 2 === 0 ? `Featured Artist` : ""].filter(Boolean),
          album: `${searchQuery} Album ${Math.floor(index / 3) + 1}`,
          albumArt: `/placeholder.svg?height=300&width=300&text=Album+${index + 1}`,
          duration: Math.floor(Math.random() * 180) + 120,
          previewUrl: null,
        }))

      setTracks(mockTracks)
      setLastSearched(searchQuery)
      toast.success(`Found ${mockTracks.length} tracks for "${searchQuery}"`)
    } catch (error) {
      console.error("Error fetching music:", error)
      toast.error("Failed to fetch music. Please try again.")
      setTracks([])
    } finally {
      setLoading(false)
    }
  }, 500)

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
      if (audio) {
        audio.pause()
      }
    }
  }, [debouncedSearch, audio])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    debouncedSearch(value)
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const playPreview = (track: Track) => {
    if (audio) {
      audio.pause()
    }

    if (playingTrackId === track.id) {
      setPlayingTrackId(null)
      return
    }
    toast.info(`Playing: ${track.name} by ${track.artists.join(", ")}`)
    setPlayingTrackId(track.id)

    setTimeout(() => {
      if (playingTrackId === track.id) {
        setPlayingTrackId(null)
      }
    }, 30000)
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Music Discovery</h1>
        <p className="text-gray-600">
          Search for music using the Spotify API (simulated). Demonstrates date-fns, UUID, and more.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search for songs, artists, or albums..."
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
          {lastSearched && tracks.length > 0 && (
            <p className="text-gray-600 mb-4 text-center">Showing results for "{lastSearched}"</p>
          )}

          {tracks.length > 0 ? (
            <div className="bg-white rounded-lg border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Album
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <Clock className="h-4 w-4" />
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tracks.map((track, index) => (
                    <tr key={track.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => playPreview(track)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {playingTrackId === track.id ? (
                            <div className="text-green-500 font-medium">{index + 1}</div>
                          ) : (
                            <div className="text-gray-500">{index + 1}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <LazyLoad height={40} once>
                            <img
                              className="h-10 w-10 rounded mr-3"
                              src={track.albumArt || "/placeholder.svg"}
                              alt={track.album}
                            />
                          </LazyLoad>
                          <div>
                            <div
                              className={`text-sm font-medium ${playingTrackId === track.id ? "text-green-500" : "text-gray-900"}`}
                            >
                              {track.name}
                            </div>
                            <div className="text-sm text-gray-500">{track.artists.join(", ")}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{track.album}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDuration(track.duration)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            lastSearched && (
              <div className="text-center py-12">
                <Music className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-1">No tracks found</h3>
                <p className="text-gray-600">Try a different search term</p>
              </div>
            )
          )}
        </>
      )}

      {!query && !loading && tracks.length === 0 && (
        <div className="text-center py-12">
          <Music className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">Search for music</h3>
          <p className="text-gray-600 max-w-md mx-auto">Enter an artist, song, or album to discover music</p>
        </div>
      )}
    </div>
  )
}
