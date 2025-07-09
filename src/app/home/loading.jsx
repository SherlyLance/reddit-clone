import React from 'react'

function Loading() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-gray-50 to-gray-100" role="alert" aria-busy="true">
            <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-blue-500" aria-hidden="true">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
            <div className="mt-4 text-center">
                <p className="text-lg font-semibold text-blue-600">Loading...</p>
                <p className="text-sm text-gray-500">Please wait a moment</p>
            </div>
        </div>
    )
}

export default Loading;