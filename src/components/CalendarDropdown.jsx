import { useState, useEffect, useRef } from 'react'

function CalendarDropdown({ selectedDate, onDateChange, startDate, endDate, onDateRangeChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [mode, setMode] = useState('single') // 'single' or 'range'
  const [rangeStart, setRangeStart] = useState(null)
  const [rangeEnd, setRangeEnd] = useState(null)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatDate = (date) => {
    if (!date) return 'Select Date'
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const formatDateRange = (start, end) => {
    if (!start && !end) return 'Select Date Range'
    if (!start) return `Until ${formatDate(end)}`
    if (!end) return `From ${formatDate(start)}`
    return `${formatDate(start)} - ${formatDate(end)}`
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const handleDateClick = (date) => {
    if (mode === 'single') {
      onDateChange(date)
      setIsOpen(false)
    } else {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart(date)
        setRangeEnd(null)
      } else {
        if (date < rangeStart) {
          setRangeStart(date)
          setRangeEnd(rangeStart)
        } else {
          setRangeEnd(date)
        }
      }
    }
  }

  const handleApplyRange = () => {
    if (rangeStart) {
      console.log('Applying date range:', rangeStart, 'to:', rangeEnd)
      onDateRangeChange(rangeStart, rangeEnd)
      setIsOpen(false)
    }
  }

  const handleClearAll = () => {
    onDateChange(null)
    onDateRangeChange(null, null)
    setRangeStart(null)
    setRangeEnd(null)
    setIsOpen(false)
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const days = getDaysInMonth(currentMonth)
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-transparent border border-white text-white py-1.5 px-3 rounded-full cursor-pointer text-xs hover:bg-white hover:bg-opacity-10 flex items-center gap-1"
      >
        📅 {mode === 'single' ? formatDate(selectedDate) : formatDateRange(startDate, endDate)}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 min-w-[280px]">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ◀
            </button>
            <div className="text-center">
              <h3 className="font-semibold text-gray-800 mb-2">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('single')}
                  className={`flex-1 py-1 px-2 rounded text-xs ${mode === 'single' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Single Date
                </button>
                <button
                  onClick={() => setMode('range')}
                  className={`flex-1 py-1 px-2 rounded text-xs ${mode === 'range' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Date Range
                </button>
              </div>
            </div>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ▶
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 p-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => (
              <div key={index} className="aspect-square">
                {date ? (
                  <button
                    onClick={() => handleDateClick(date)}
                    className={`w-full h-full text-xs p-1 rounded hover:bg-gray-100 ${
                      (mode === 'single' && selectedDate && 
                       date.toDateString() === selectedDate.toDateString())
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : (mode === 'range' && rangeStart && 
                           ((rangeEnd && date >= rangeStart && date <= rangeEnd) ||
                            (!rangeEnd && date.toDateString() === rangeStart.toDateString())))
                        ? 'bg-orange-200 text-orange-800 hover:bg-orange-300'
                        : 'text-gray-800'
                    }`}
                  >
                    {date.getDate()}
                  </button>
                ) : (
                  <div className="w-full h-full"></div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-2 border-t border-gray-200 space-y-2">
            {mode === 'range' && (
              <button
                onClick={handleApplyRange}
                disabled={!rangeStart}
                className={`w-full text-xs py-1 rounded ${rangeStart ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                Apply Range
              </button>
            )}
            <button
              onClick={handleClearAll}
              className="w-full text-xs text-gray-600 hover:text-gray-800 py-1"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarDropdown
