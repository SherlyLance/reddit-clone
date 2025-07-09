import React from 'react'

function Loading() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-500">Loading...</span>
                </div>
            </div>
        </div>
    )
}

export default Loading;
