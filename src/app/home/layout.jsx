"use client"
import React, { useState } from 'react'
import Sidebar from '../(components)/Sidebar'
import Navbar from '../(components)/Navbar'

function layout({ children }) {
  const [isBarOpen, setIsBarOpen] = React.useState(false)
  return (
    <div className='flex flex-row'>
      <Sidebar isBarOpen={isBarOpen} setIsBarOpen={setIsBarOpen} />
      <div className='w-full'>
        <Navbar setIsBarOpen={setIsBarOpen} />
        <div className='p-3 h-[88vh] overflow-y-scroll' id="scrollableDiv">
          {children}
        </div>
      </div>
    </div>
  )
}

export default layout
