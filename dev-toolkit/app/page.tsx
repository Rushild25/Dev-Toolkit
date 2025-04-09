import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const sections = [
    {
      title: "Books Explorer",
      description: "Search and explore books using the Books API",
      link: "/books",
      icon: "📚",
    },
    {
      title: "Movie Database",
      description: "Discover movies using the Movie API",
      link: "/movies",
      icon: "🎬",
    },
    {
      title: "Music Discovery",
      description: "Explore music with the Spotify Web API",
      link: "/music",
      icon: "🎵",
    },
    {
      title: "Meme Generator",
      description: "Create and share memes with the Meme Generator API",
      link: "/memes",
      icon: "😂",
    },
    {
      title: "Coding Challenges",
      description: "Find programming challenges from Codeforces API",
      link: "/coding",
      icon: "💻",
    },
    
  ]

  return (
    <div>
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Developer's Toolkit</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Where Code Meets Culture - and Memes Make It Better.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {sections.map((section) => (
          <Link href={section.link} key={section.title}>
            <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="text-4xl mb-4">{section.icon}</div>
              <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
              <p className="text-gray-600 mb-4">{section.description}</p>
              <div className="flex items-center text-blue-500 font-medium">
                Explore <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
