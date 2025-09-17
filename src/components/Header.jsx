import { useState } from 'react'
import CalendarDropdown from './CalendarDropdown'

function Header({ searchQuery, onSearchChange, selectedDate, onDateChange, startDate, endDate, onDateRangeChange }) {
  return (
    <header className="bg-orange-500 border-b border-gray-300 sticky top-0 z-50">
      <div className="w-full mx-auto px-5 flex items-center gap-4 h-12">
        <h1 className="text-white text-xl font-bold m-0 flex-shrink-0">🔴 Reddit Clone</h1>
        <div className="flex-1 max-w-md relative flex items-center">
          <input
            type="text"
            placeholder="Search Reddit"
            className="w-full py-1.5 pr-10 pl-3 border border-gray-300 rounded text-sm bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button className="absolute right-2 bg-transparent border-none text-sm text-gray-500 cursor-pointer p-1 hover:text-gray-800">🔍</button>
        </div>
        <nav className="flex gap-4">
          <button className="bg-transparent border-none text-white py-2 px-4 rounded cursor-pointer text-sm hover:bg-white hover:bg-opacity-10">Home</button>
          <button className="bg-transparent border-none text-white py-2 px-4 rounded cursor-pointer text-sm hover:bg-white hover:bg-opacity-10">Popular</button>
          <button className="bg-transparent border-none text-white py-2 px-4 rounded cursor-pointer text-sm hover:bg-white hover:bg-opacity-10">All</button>
        </nav>
        <div className="flex gap-2">
          <CalendarDropdown 
            selectedDate={selectedDate} 
            onDateChange={onDateChange}
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={onDateRangeChange}
          />
          <button className="bg-white text-orange-500 border-none py-1.5 px-3 rounded-full font-bold cursor-pointer text-xs">+ Create Post</button>
          <button className="bg-transparent text-white border border-white py-1.5 px-3 rounded-full cursor-pointer text-xs">Login</button>
        </div>
      </div>
    </header>
  )
}

export default Header