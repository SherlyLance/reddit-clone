"use client"
import React from 'react'
import axios from 'axios'
import Suggestions from '@/app/(components)/Suggestions'
import UploadPostData from '@/app/(components)/UploadPostData'

function Page() { // Renamed 'page' to 'Page' for consistency
  const [suggestions, setSuggestions] = React.useState([])
  const [selectedValue, setSelectedValue] = React.useState({
    value: "",
    id: ""
  })

  async function handleSearchChange(e) {
    try {
      let response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/community/search-community`, {
        query: e.target.value
      })
      if (response.data.success) {
        setSuggestions(response.data.communities)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='md:max-w-[60%] lg:max-w-[80%] xl:max-w-[60%] w-full m-auto p-4 shadow-md bg-gray-800 rounded'>
      <Suggestions suggestions={suggestions} handleSearchChange={handleSearchChange} setSuggestions={setSuggestions} selectedValue={selectedValue} setSelectedValue={setSelectedValue} />
      <UploadPostData selectedValue={selectedValue}/>
    </div>
  )
}

export default Page
