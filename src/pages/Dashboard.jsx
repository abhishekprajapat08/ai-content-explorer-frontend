import { useState, useEffect } from 'react'
import axios from 'axios'

const Dashboard = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterKeyword, setFilterKeyword] = useState('')
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    fetchItems()
  }, [filterType, filterKeyword])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterType) params.append('type', filterType)
      if (filterKeyword) params.append('keyword', filterKeyword)
      
      const response = await axios.get(`/api/dashboard/?${params.toString()}`)
      setItems(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load dashboard items.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return

    try {
      const endpoint = item.type === 'search' 
        ? `/api/dashboard/search/${item.id}`
        : `/api/dashboard/image/${item.id}`
      await axios.delete(endpoint)
      fetchItems()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete item.')
    }
  }

  const handleEdit = async (item, updates) => {
    try {
      const endpoint = item.type === 'search'
        ? `/api/dashboard/search/${item.id}`
        : `/api/dashboard/image/${item.id}`
      
      if (item.type === 'search') {
        await axios.put(endpoint, null, {
          params: {
            query: updates.query,
            result: updates.result
          }
        })
      } else {
        await axios.put(endpoint, null, {
          params: {
            prompt: updates.prompt,
            image_url: updates.image_url
          }
        })
      }
      
      setEditingItem(null)
      fetchItems()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update item.')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams()
      if (filterType) params.append('type', filterType)
      if (filterKeyword) params.append('keyword', filterKeyword)
      
      const response = await axios.get(`/api/dashboard/export/csv?${params.toString()}`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `dashboard_export_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to export CSV.')
    }
  }

  const handleExportPDF = async () => {
    try {
      const params = new URLSearchParams()
      if (filterType) params.append('type', filterType)
      if (filterKeyword) params.append('keyword', filterKeyword)
      
      const response = await axios.get(`/api/dashboard/export/pdf?${params.toString()}`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `dashboard_export_${new Date().toISOString().split('T')[0]}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to export PDF.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Dashboard
        </h1>

        {/* Filters and Export */}
        <div className="mb-6 flex gap-4 flex-wrap items-center">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Types</option>
            <option value="search">Search</option>
            <option value="image">Image</option>
          </select>
          <input
            type="text"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            placeholder="Search by keyword..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Export PDF
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No items found. Start by searching or generating an image!
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                {editingItem?.id === item.id ? (
                  <EditForm
                    item={item}
                    onSave={(updates) => handleEdit(item, updates)}
                    onCancel={() => setEditingItem(null)}
                  />
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                          {item.type}
                        </span>
                        <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {item.type === 'search' ? (
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Query: {item.query}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {item.result}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Prompt: {item.prompt}
                        </h3>
                        <img
                          src={item.image_url}
                          alt={item.prompt}
                          className="max-w-md h-auto rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/512x512?text=Image+Not+Available'
                          }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const EditForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    query: item.query || '',
    result: item.result || '',
    prompt: item.prompt || '',
    image_url: item.image_url || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {item.type === 'search' ? (
        <>
          <input
            type="text"
            value={formData.query}
            onChange={(e) => setFormData({ ...formData, query: e.target.value })}
            placeholder="Query"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <textarea
            value={formData.result}
            onChange={(e) => setFormData({ ...formData, result: e.target.value })}
            placeholder="Result"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </>
      ) : (
        <>
          <input
            type="text"
            value={formData.prompt}
            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
            placeholder="Prompt"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="text"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="Image URL"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default Dashboard

