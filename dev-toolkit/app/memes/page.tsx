"use client"
import { Download, ImageIcon, RefreshCw } from "lucide-react"
import { useState } from "react"
import { BeatLoader } from "react-spinners"
import { toast } from "react-toastify"
import { v4 as uuidv4 } from "uuid"
import md5 from "md5"

interface MemeTemplate {
  id: string
  name: string
  url: string
  box_count: number
}

export default function MemesPage() {
  const [templates, setTemplates] = useState<MemeTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null)
  const [captions, setCaptions] = useState<string[]>([])
  const [generatedMeme, setGeneratedMeme] = useState<string | null>(null)
  const [generatingMeme, setGeneratingMeme] = useState(false)

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockTemplates: MemeTemplate[] = Array(12)
        .fill(null)
        .map((_, index) => ({
          id: uuidv4(),
          name: `Meme Template ${index + 1}`,
          url: `/placeholder.svg?height=300&width=300&text=Meme+${index + 1}`,
          box_count: Math.floor(Math.random() * 2) + 1,
        }))

      setTemplates(mockTemplates)
      toast.success("Meme templates loaded successfully")
    } catch (error) {
      console.error("Error fetching meme templates:", error)
      toast.error("Failed to fetch meme templates. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const selectTemplate = (template: MemeTemplate) => {
    setSelectedTemplate(template)
    setCaptions(Array(template.box_count).fill(""))
    setGeneratedMeme(null)
  }

  const handleCaptionChange = (index: number, value: string) => {
    const newCaptions = [...captions]
    newCaptions[index] = value
    setCaptions(newCaptions)
  }

  const generateMeme = async () => {
    if (!selectedTemplate) return

    if (captions.some((caption) => !caption.trim())) {
      toast.warning("Please fill in all caption fields")
      return
    }

    setGeneratingMeme(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const hash = md5(selectedTemplate.id + captions.join(""))

      setGeneratedMeme(selectedTemplate.url)
      toast.success("Meme generated successfully!")
    } catch (error) {
      console.error("Error generating meme:", error)
      toast.error("Failed to generate meme. Please try again.")
    } finally {
      setGeneratingMeme(false)
    }
  }

  const downloadMeme = () => {
    if (!generatedMeme) return

    toast.info("Download functionality would be implemented in a real app")
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Meme Generator</h1>
        <p className="text-gray-600">
          Create and share memes using the Imgflip API (simulated). Demonstrates MD5, UUID, and more.
        </p>
      </div>

      {templates.length === 0 && !loading ? (
        <div className="text-center py-12">
          <ImageIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">No meme templates loaded</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">Click the button below to load meme templates</p>
          <button
            onClick={fetchTemplates}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Load Templates
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {selectedTemplate ? "Selected Template" : "Choose a Template"}
            </h2>

            {loading ? (
              <div className="flex justify-center my-12">
                <BeatLoader color="#3B82F6" />
              </div>
            ) : (
              <>
                {selectedTemplate ? (
                  <div className="border rounded-lg p-4">
                    <img
                      src={selectedTemplate.url || "/placeholder.svg"}
                      alt={selectedTemplate.name}
                      className="w-full h-auto rounded mb-4"
                    />
                    <h3 className="font-medium text-lg mb-4">{selectedTemplate.name}</h3>

                    {captions.map((caption, index) => (
                      <div key={index} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Caption {index + 1}</label>
                        <input
                          type="text"
                          value={caption}
                          onChange={(e) => handleCaptionChange(index, e.target.value)}
                          placeholder={`Enter caption ${index + 1}`}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}

                    <div className="flex space-x-3">
                      <button
                        onClick={generateMeme}
                        disabled={generatingMeme}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {generatingMeme ? (
                          <span className="flex items-center justify-center">
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </span>
                        ) : (
                          "Generate Meme"
                        )}
                      </button>

                      <button
                        onClick={() => setSelectedTemplate(null)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        Choose Another
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => selectTemplate(template)}
                        className="border rounded-lg p-2 cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <img
                          src={template.url || "/placeholder.svg"}
                          alt={template.name}
                          className="w-full h-auto rounded mb-2"
                        />
                        <p className="text-sm font-medium truncate">{template.name}</p>
                        <p className="text-xs text-gray-500">
                          {template.box_count} caption{template.box_count !== 1 ? "s" : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Generated Meme</h2>

            {generatedMeme ? (
              <div className="border rounded-lg p-4">
                <img
                  src={generatedMeme || "/placeholder.svg"}
                  alt="Generated Meme"
                  className="w-full h-auto rounded mb-4"
                />
                <button
                  onClick={downloadMeme}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Meme
                </button>
              </div>
            ) : (
              <div className="border rounded-lg p-8 flex flex-col items-center justify-center h-64 bg-gray-50">
                <ImageIcon className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 text-center">
                  {selectedTemplate
                    ? "Fill in the captions and click Generate Meme"
                    : "Select a template to get started"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
