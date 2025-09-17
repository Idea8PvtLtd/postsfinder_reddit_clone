class ApiService {
  constructor() {
    this.baseURL = 'https://n8n-klmi.onrender.com/webhook/4708ea18-23b5-43eb-8d49-a939e56d9c6e'
    // Add a different URL if n8n has a separate webhook for data response
    this.dataURL = 'https://n8n-klmi.onrender.com/webhook/YOUR_DATA_WEBHOOK_ID'
  }

  // Format date for API (YYYY.MM.DD)
  formatDateForAPI(date) {
    if (!date) return null
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
  }

  // Parse date range string "2025.8.1 to 2025.9.1"
  parseDateRange(dateRangeString) {
    if (!dateRangeString) return { startDate: null, endDate: null }
    
    const parts = dateRangeString.split(' to ')
    if (parts.length !== 2) return { startDate: null, endDate: null }

    const parseDate = (dateStr) => {
      const [year, month, day] = dateStr.split('.').map(Number)
      return new Date(year, month - 1, day)
    }

    return {
      startDate: parseDate(parts[0]),
      endDate: parseDate(parts[1])
    }
  }

  // Fetch posts from n8n webhook
  async fetchPosts(query = '', dateRange = null) {
    try {
      const payload = {
        query: query || ''
      }

      // Add date range if provided
      if (dateRange) {
        payload.time = dateRange
        console.log('Date range added to payload:', dateRange)
      } else {
        console.log('No date range provided')
      }

      console.log('Sending payload to n8n:', payload)
      console.log('Webhook URL:', this.baseURL)

      // Make actual API call to n8n webhook
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      // Check if response is empty
      const responseText = await response.text()
      console.log('Raw response text:', responseText)
      
      if (!responseText || responseText.trim() === '') {
        console.log('Empty response from n8n, returning empty array')
        return []
      }
      
      // Parse JSON response
      let data
      try {
        data = JSON.parse(responseText)
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError)
        console.log('Response text:', responseText)
        return []
      }
      
      console.log('Parsed response from n8n:', data)
      console.log('Data type:', typeof data)
      console.log('Is array:', Array.isArray(data))
      console.log('Has message:', data.message)
      console.log('Has results:', data[0]?.results)
      
      // Check if n8n returned just a success message instead of data
      if (data.message && data.message === "Workflow was started" && !data[0]?.results) {
        console.log('n8n returned success message but no data. This might be an async workflow.')
        
        // If you have a separate webhook for data, uncomment and use this:
        /*
        try {
          // Poll for results from data webhook
          const dataResponse = await fetch(this.dataURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: payload.query, time: payload.time })
          })
          
          if (dataResponse.ok) {
            const resultData = await dataResponse.json()
            console.log('Received data from data webhook:', resultData)
            return this.transformApiResponse(resultData)
          }
        } catch (pollError) {
          console.log('Error polling for data:', pollError)
        }
        */
        
        // For now, return empty array if n8n returns success message
        console.log('n8n returned success message but no data, returning empty array')
        return []
      } else {
        console.log('PROCESSING REAL N8N DATA')
      }
      
      return this.transformApiResponse(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
      throw error
    }
  }

  // Format Unix timestamp to time ago string
  formatTimeAgo(unixTimestamp) {
    if (!unixTimestamp) return 'Just now'
    
    const now = new Date()
    const postDate = new Date(unixTimestamp * 1000)
    const diffInSeconds = Math.floor((now - postDate) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`
    return `${Math.floor(diffInSeconds / 31536000)}y ago`
  }

  // Transform API response to match our post structure
  transformApiResponse(apiResponse) {
    if (!apiResponse) {
      return []
    }

    // Handle the actual n8n response format: [{ results: [...] }]
    if (Array.isArray(apiResponse) && apiResponse.length > 0 && apiResponse[0].results) {
      const results = apiResponse[0].results
      if (!Array.isArray(results)) {
        return []
      }

      return results.map(item => ({
        id: item.url || Date.now() + Math.random(),
        title: item.title || 'Untitled Post',
        content: item.preview || 'No content available',
        author: 'n8n_webhook',
        votes: Math.floor(Math.random() * 100),
        comments: item.num_comments || 0,
        timeAgo: this.formatTimeAgo(item.created_utc),
        date: item.created_utc ? new Date(item.created_utc * 1000) : new Date(),
        key_points: [],
        example_stacks: [],
        business_models: [],
        starter_actions: [],
        sources: item.url ? [{ title: 'Source', url: item.url }] : []
      }))
    }

    // Handle the old expected format (array of posts)
    if (Array.isArray(apiResponse)) {
      return apiResponse.map(item => ({
        id: item.id || Date.now() + Math.random(),
        title: item.topic || 'Untitled Post',
        content: item.summary || 'No content available',
        author: item.author || 'n8n_webhook',
        votes: item.votes || Math.floor(Math.random() * 100),
        comments: item.comments || Math.floor(Math.random() * 50),
        timeAgo: item.timeAgo || 'Just now',
        date: item.date ? new Date(item.date) : new Date(),
        key_points: item.key_points || [],
        example_stacks: item.example_stacks || [],
        business_models: item.business_models || [],
        starter_actions: item.starter_actions || [],
        sources: item.sources || []
      }))
    }

    return []
  }

  // Set the base URL for the API
  setBaseURL(url) {
    this.baseURL = url
  }
}

export default new ApiService()
