import React from 'react'

function FirstTab({ description, setDescription }) {
  return (
    <div className='mt-6'>
      <textarea name="description" onChange={(e) => setDescription(e.target.value)} value={description} placeholder='Body text (Optional)' className='resize-none p-2 w-full h-[200px] bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded'></textarea>
    </div>
  )
}

export default FirstTab
