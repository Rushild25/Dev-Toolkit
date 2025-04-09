"use client"

import type React from "react"

import { debounce } from "lodash"
import { Book, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { BeatLoader } from "react-spinners"
import { toast } from "react-toastify"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import { format } from "date-fns"
import LazyLoad from "react-lazyload"

interface BookType {
  id: string
  title: string
  authors: string[]
  publishedDate: string
  description: string
  imageLinks?: {
    thumbnail: string
  }
}

export default function BooksPage() {
  const [query, setQuery] = useState("")
  const [books, setBooks] = useState<BookType[]>([])
  const [loading, setLoading] = useState(false)
  const [lastSearched, setLastSearched] = useState<string | null>(null)

  const debouncedSearch = debounce(async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=12`,
      )

      const bookData = response.data.items.map((item: any) => ({
        id: item.id || uuidv4(),
        title: item.volumeInfo.title || "Unknown Title",
        authors: item.volumeInfo.authors || ["Unknown Author"],
        publishedDate: item.volumeInfo.publishedDate || "Unknown Date",
        description: item.volumeInfo.description || "No description available",
        imageLinks: item.volumeInfo.imageLinks,
      }))

      setBooks(bookData)
      setLastSearched(searchQuery)
      toast.success(`Found ${bookData.length} books for "${searchQuery}"`)
    } catch (error) {
      console.error("Error fetching books:", error)
      toast.error("Failed to fetch books. Please try again.")
      setBooks([])
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
        <h1 className="text-3xl font-bold mb-2">Books Explorer</h1>
        <p className="text-gray-600">
          Search for books using the Google Books API. Demonstrates Axios, React-Spinners, UUID, and more.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search for books..."
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
          {lastSearched && books.length > 0 && (
            <p className="text-gray-600 mb-4 text-center">Showing results for "{lastSearched}"</p>
          )}

          {books.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <LazyLoad key={book.id} height={200} offset={100} once>
                  <div className="border rounded-lg overflow-hidden h-full flex flex-col">
                    <div className="p-4 bg-gray-50 flex items-center justify-center h-48">
                      {book.imageLinks?.thumbnail ? (
                        <img
                          src={book.imageLinks.thumbnail.replace("http:", "https:") || "/placeholder.svg"}
                          alt={book.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <Book className="h-16 w-16 text-gray-300" />
                      )}
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="font-bold text-lg mb-1">{book.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">By {book.authors.join(", ")}</p>
                      {book.publishedDate && (
                        <p className="text-xs text-gray-500 mb-3">
                          Published: {format(new Date(book.publishedDate), "MMMM yyyy")}
                        </p>
                      )}
                      <p className="text-sm line-clamp-3">{book.description}</p>
                    </div>
                  </div>
                </LazyLoad>
              ))}
            </div>
          ) : (
            lastSearched && (
              <div className="text-center py-12">
                <Book className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-1">No books found</h3>
                <p className="text-gray-600">Try a different search term</p>
              </div>
            )
          )}
        </>
      )}

      {!query && !loading && books.length === 0 && (
        <div className="text-center py-12">
          <Book className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">Search for books</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Enter a title, author, or keyword to discover books using the Google Books API
          </p>
        </div>
      )}
    </div>
  )
}
