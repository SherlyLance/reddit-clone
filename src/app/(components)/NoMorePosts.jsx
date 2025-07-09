import React from 'react'

function NoMorePosts() {
  return (
    <div className="flex items-center justify-center min-h-[15vh]">
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 animate-fade-in">
          No more content to show
        </p>
        <div className="text-gray-500 dark:text-gray-400 text-sm animate-bounce">
          You've reached the end!
        </div>
      </div>
    </div>
  )
}

export default NoMorePosts
