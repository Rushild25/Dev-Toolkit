"use client"
import { format } from "date-fns"
import { Code, ExternalLink, Filter, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { BeatLoader } from "react-spinners"
import { toast } from "react-toastify"
import { v4 as uuidv4 } from "uuid"

interface Problem {
  id: string
  name: string
  tags: string[]
  difficulty: string
  solvedCount: number
  contestId?: string
  date: string
  url: string
}

export default function CodingPage() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])

  const fetchProblems = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const tags = [
        "implementation",
        "math",
        "greedy",
        "dp",
        "data structures",
        "strings",
        "sortings",
        "binary search",
        "graphs",
        "trees",
      ]

      setAvailableTags(tags)

      const difficulties = ["Easy", "Medium", "Hard"]

      const mockProblems: Problem[] = Array(20)
        .fill(null)
        .map((_, index) => {
          const randomTags = tags.filter(() => Math.random() > 0.7).slice(0, Math.floor(Math.random() * 3) + 1)

          return {
            id: uuidv4(),
            name: `Problem ${index + 1}: ${["The", "A", "Some"][Math.floor(Math.random() * 3)]} ${["Great", "Small", "Interesting", "Complex", "Simple"][Math.floor(Math.random() * 5)]} ${["Challenge", "Task", "Problem", "Puzzle", "Question"][Math.floor(Math.random() * 5)]}`,
            tags: randomTags.length ? randomTags : [tags[Math.floor(Math.random() * tags.length)]],
            difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
            solvedCount: Math.floor(Math.random() * 10000),
            contestId: Math.random() > 0.3 ? `Contest ${Math.floor(Math.random() * 100) + 1}` : undefined,
            date: format(new Date(Date.now() - Math.floor(Math.random() * 10000000000)), "yyyy-MM-dd"),
            url: "#",
          }
        })

      setProblems(mockProblems)
      toast.success("Coding problems loaded successfully")
    } catch (error) {
      console.error("Error fetching coding problems:", error)
      toast.error("Failed to fetch coding problems. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProblems()
  }, [])

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = searchQuery === "" || problem.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => problem.tags.includes(tag))

    return matchesSearch && matchesTags
  })

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Coding Challenges</h1>
        <p className="text-gray-600">
          Explore programming problems from Codeforces API (simulated). Demonstrates date-fns, Lodash, and more.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-3/4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems..."
              className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="md:w-1/4">
          <button
            onClick={() => fetchProblems()}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
          >
            <Code className="h-4 w-4 mr-2" />
            Refresh Problems
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 mr-2 text-gray-500" />
              <h3 className="font-medium">Filter by Tags</h3>
            </div>

            <div className="space-y-2">
              {availableTags.map((tag) => (
                <div key={tag} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`tag-${tag}`}
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`tag-${tag}`} className="ml-2 text-sm text-gray-700">
                    {tag}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:w-3/4">
          {loading ? (
            <div className="flex justify-center my-12">
              <BeatLoader color="#3B82F6" />
            </div>
          ) : (
            <>
              {filteredProblems.length > 0 ? (
                <div className="bg-white rounded-lg border overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Problem
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Tags
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Difficulty
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Solved
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProblems.map((problem) => (
                        <tr key={problem.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  <a href={problem.url} className="hover:text-blue-500 flex items-center">
                                    {problem.name}
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {problem.contestId && <span>{problem.contestId} • </span>}
                                  <span>{problem.date}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {problem.tags.map((tag) => (
                                <span
                                  key={`${problem.id}-${tag}`}
                                  className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                problem.difficulty === "Easy"
                                  ? "bg-green-100 text-green-800"
                                  : problem.difficulty === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {problem.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {problem.solvedCount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border">
                  <Code className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-1">No problems found</h3>
                  <p className="text-gray-600">Try adjusting your filters</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
