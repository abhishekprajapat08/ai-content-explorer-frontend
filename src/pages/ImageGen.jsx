import { useState } from 'react'
import axios from 'axios'

const ImageGen = () => {
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    setError('')
    setImageUrl('')

    try {
      const response = await axios.post('/api/image/', { prompt })
      setImageUrl(response.data.image_url)
    } catch (err) {
      setError(err.response?.data?.detail || 'Image generation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Image Generation
        </h1>
        
        <form onSubmit={handleGenerate} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter image prompt (e.g., 'An astronaut riding a unicorn on Mars')"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {imageUrl && !loading && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Generated Image
            </h2>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <img
                src={imageUrl}
                alt={prompt}
                className="max-w-full h-auto rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/512x512?text=Image+Not+Available'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageGen

