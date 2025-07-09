import React from 'react'

function InfinityLoader() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin">
      </div>
      <span className="ml-2 text-gray-600">Loading more content...</span>
    </div>
  )
}

export default InfinityLoader