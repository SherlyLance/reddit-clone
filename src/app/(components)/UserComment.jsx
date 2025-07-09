import React from 'react'
import { memo } from 'react'
import { FaRegComment } from 'react-icons/fa'
import { PiArrowFatDownBold, PiArrowFatUpBold, PiShareFatLight } from 'react-icons/pi'
import { timeAgo } from '../functions'

function UserComment({ item }) {
  return (
    <div className='flex items-start gap-3'>
      <img src={item.authorId.imageUrl} alt="user-avatar" className='w-[35px] h-[35px] rounded-full' />
      <div className='flex-1'>
        <p className='font-bold flex items-center gap-2'>{item.authorId.username} <span className='text-gray-500 text-sm'>{timeAgo(item.createdAt)}</span></p>
        <p className='text-gray-700 text-[13px]'>{item.content}</p>
        <div className='flex items-center gap-4 mt-1 text-sm text-gray-500'>
          <button className='flex items-center gap-1'>
            <PiArrowFatUpBold className='text-lg cursor-pointer' />
            <span>12</span>
            <PiArrowFatDownBold className='text-lg cursor-pointer' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(UserComment);