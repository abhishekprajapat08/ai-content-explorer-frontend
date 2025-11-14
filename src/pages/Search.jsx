import { useState } from 'react'
import axios from 'axios'

const Search = () => {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')
    setResult('')

    try {
      const response = await axios.post('/api/search/', { query })
      setResult(response.data.result)
    } catch (err) {
      const status = err.response?.status
      const detail = err.response?.data?.detail || 'Search failed. Please try again.'
      
      if (status === 429) {
        // Rate limit error - show helpful message
        setError('⚠️ Search rate limit reached. DuckDuckGo has strict rate limits. Please wait 30-60 seconds and try again. If you searched this before, try checking your dashboard for cached results.')
      } else {
        setError(detail)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Web Search
        </h1>
        
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your search query (e.g., 'What is quantum computing?')"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
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

        {result && !loading && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Search Results
            </h2>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-sans">
                {result}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search

