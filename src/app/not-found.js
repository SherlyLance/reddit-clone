"use client"
import React from 'react'

function notFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center p-8 bg-white rounded-lg shadow-xl animate-fade-in">
                <h1 className="text-6xl font-bold text-red-500 mb-4 animate-bounce">404</h1>
                <p className="text-2xl font-semibold text-gray-800 mb-4">Oops! Page Not Found</p>
                <p className="text-gray-600 mb-6">The page you are looking for might have been removed or doesn't exist.</p>
                <button 
                    onClick={() => window.history.back()}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
                >
                    Go Back
                </button>
            </div>
        </div>
    )
}

export default notFound
