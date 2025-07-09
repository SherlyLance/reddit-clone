import React from 'react'
import { memo } from 'react';

function Suggestions({ suggestions, handleSearchChange, setSuggestions, selectedValue, setSelectedValue }) {
    function clickSuggestion(value, id) {
        setSelectedValue((prev) => ({ ...prev, value, id }))
        setSuggestions(selectedValue)
        setSuggestions([])
    }
    return (
        <div>
            <h2 className='text-2xl font-bold text-white'>Create post</h2>
            <div className="relative mt-4 !w-[300px]">
                <input
                    type="text"
                    placeholder="Select community"
                    onChange={handleSearchChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
                {suggestions.length > 0 && (
                    <div className="absolute mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                        {suggestions.map((suggestion) => (
                            <div
                                key={suggestion._id}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => clickSuggestion(suggestion.name, suggestion._id)}
                            >
                                {suggestion.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default memo(Suggestions);