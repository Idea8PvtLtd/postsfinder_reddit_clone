import { useState, useEffect } from 'react'
import Header from './components/Header'
import PostList from './components/PostList'
import api from './services/api'

// Sample data removed - now using API
const samplePosts = []

function App() {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let dateRange = null
      if (startDate && endDate) {
        // Date range selected
        const startStr = api.formatDateForAPI(startDate)
        const endStr = api.formatDateForAPI(endDate)
        dateRange = `${startStr} to ${endStr}`
        console.log('Date range formatted:', dateRange)
        console.log('Start date:', startDate, 'End date:', endDate)
      } else if (selectedDate) {
        // Single date selected
        const dateStr = api.formatDateForAPI(selectedDate)
        dateRange = `${dateStr} to ${dateStr}`
        console.log('Single date formatted:', dateRange)
        console.log('Selected date:', selectedDate)
      } else {
        console.log('No date selected')
      }
      
      console.log('Calling API with query:', searchQuery, 'and dateRange:', dateRange)
      
      const fetchedPosts = await api.fetchPosts(searchQuery, dateRange)
      setPosts(fetchedPosts)
      setFilteredPosts(fetchedPosts)
    } catch (err) {
      setError('Failed to fetch posts. Please try again later.')
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch posts when component mounts or filters change
  useEffect(() => {
    fetchPosts()
  }, [searchQuery, startDate, endDate, selectedDate])

  // Handle date range selection
  const handleDateRangeChange = (start, end) => {
    console.log('handleDateRangeChange called with:', start, end)
    setStartDate(start)
    setEndDate(end)
    setSelectedDate(null) // Clear single date selection
  }

  // Handle single date selection
  const handleDateChange = (date) => {
    console.log('handleDateChange called with:', date)
    setSelectedDate(date)
    setStartDate(null) // Clear date range selection
    setEndDate(null)   // Clear date range selection
  }

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={handleDateRangeChange}
      />
      <main className="w-full mx-auto py-5 px-5">
        {loading && (
          <div className="mb-4 p-3 bg-white border border-gray-300 rounded">
            <p className="m-0 text-sm text-gray-500 font-medium">Loading posts...</p>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded">
            <p className="m-0 text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}
        
        {searchQuery && !loading && !error && (
          <div className="mb-4 p-3 bg-white border border-gray-300 rounded">
            <p className="m-0 text-sm text-gray-500 font-medium">Search results for "{searchQuery}" ({filteredPosts.length} posts)</p>
          </div>
        )}
        
        {(startDate || endDate) && !loading && !error && (
          <div className="mb-4 p-3 bg-white border border-gray-300 rounded">
            <p className="m-0 text-sm text-gray-500 font-medium">
              Posts from {startDate ? startDate.toLocaleDateString() : 'start'} to {endDate ? endDate.toLocaleDateString() : 'end'} ({filteredPosts.length} posts)
            </p>
          </div>
        )}
        
        {selectedDate && !loading && !error && (
          <div className="mb-4 p-3 bg-white border border-gray-300 rounded">
            <p className="m-0 text-sm text-gray-500 font-medium">
              Posts from {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} ({filteredPosts.length} posts)
            </p>
          </div>
        )}
        
        {!loading && !error && filteredPosts.length === 0 && (
          <div className="mb-4 p-3 bg-white border border-gray-300 rounded">
            <p className="m-0 text-sm text-gray-500 font-medium">No posts found matching your criteria.</p>
          </div>
        )}
        
        <PostList posts={filteredPosts} />
      </main>
    </div>
  )
}

export default App
