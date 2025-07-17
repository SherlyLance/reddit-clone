"use client"
import CommunityPost from '@/app/(components)/CommunityPost';
import React, { useEffect } from 'react'
import { MdOutlineModeEdit } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import { useSearchParams } from 'next/navigation';
// REMOVE THIS LINE: import FormData from 'form-data'; // This is for Node.js environments
import axios from 'axios';
import UploadImage from '@/app/(components)/UploadImage';
import Link from 'next/link';

function page({ params }) {
  const [communityImage, setCommunityImage] = React.useState(null)
  const searchParams = useSearchParams()
  const [uploadImage, setUploadImage] = React.useState(false)
  const [communityLoader, setCommunityLoader] = React.useState(false)
  const [posts, setPosts] = React.useState([])
  const [community, setCommunity] = React.useState({
    name: '',
    description: '',
    imageUrl: '',
    posts: [],
    createdAt: '',
    updatedAt: ''
  })

  async function updateImage(e) {
    e.preventDefault()
    try {
      setCommunityLoader(true)
      // Use the native browser FormData API directly
      let formData = new window.FormData(); // Or just `new FormData();` if not concerned about global scope
      formData.append('id', searchParams.get("id"))
      console.log(searchParams.get("id"))
      formData.append('communityImage', communityImage)
      let response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/community/updateCommunityImage`, formData)
      if (response.data.success) {
        setCommunityLoader(false)
        setUploadImage(false)
        // Optionally, re-fetch community details to update the image on the page
        fetchCommunityDetails();
      }
      console.log(response.data)
      setCommunityLoader(false)
    } catch (error) {
      console.error("Error updating image:", error); // Use console.error for errors
      setCommunityLoader(false)
    }
  }

  async function fetchCommunityDetails() {
    try {
      let response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/community/get-community?q=${searchParams.get("id")}`)
      if (response.data.success) {
        setCommunity(response.data.community);
      }
    } catch (error) {
      console.error("Error fetching community details:", error); // Use console.error for errors
    }
  }

  async function fetchCommunityPosts() {
    try {
      let response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/getCommunityPosts?q=${searchParams.get('id')}`)
      if (response.data.success){
        setPosts(response.data.posts)
      }
    } catch (error) {
      console.error("Error fetching community posts:", error); // Use console.error for errors
    }
  }

  useEffect(() => {
    fetchCommunityDetails()
    fetchCommunityPosts()
  }, [searchParams]) // Add searchParams to dependency array if id can change, or make sure it only runs once per ID

  return (
    <div className='md:max-w-[60%] lg:max-w-[80%] xl:max-w-[70%] w-full m-auto md:p-4 rounded-lg lg:shadow-md'>
      {
        uploadImage &&
        <UploadImage communityImage={communityImage} setCommunityImage={setCommunityImage} uploadImage={uploadImage} setUploadImage={setUploadImage} updateImage={updateImage} communityLoader={communityLoader} />
      }
      <div>
        <div className='flex items-center justify-between py-2 sm:p-2'>
          <div className='flex items-center gap-3 sm:gap-6'>
            <div onClick={() => setUploadImage(true)}>
              {/* Ensure community.imageUrl is a valid URL or provide a fallback default image */}
              <img
                src={community.imageUrl || '/images/community.png'} // Added a default image fallback
                alt={community.name}
                className='w-[65px] sm:w-[80px] h-[65px] sm:h-[80px] rounded-full cursor-pointer border-2 border-gray-300'
              />
            </div>
            <p className='sm:text-2xl font-bold text-gray-800 text-lg'>r/{community.name}</p>
          </div>
          <div className='flex items-center gap-4'>
            <Link href={'/home/create-post'} className='flex items-center gap-2 px-2 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition cursor-pointer font-bold'>
              <IoAddSharp className='text-lg' />
              Create
            </Link>
          </div>
        </div>
        <hr />
        <div>
          <p className='text-gray-600 leading-normal mt-2 text-[15px] font-bold'>
            {community.description}
          </p>
        </div>
        <hr className='my-3' />
        {
          posts.length > 0 ? ( // Use ternary for conditional rendering
            posts.map((post) => (
              <React.Fragment key={post._id}> {/* Use key for list items, React.Fragment for multiple children */}
                <CommunityPost post={post} />
                <hr className='my-2' />
              </React.Fragment>
            ))
          ) : (
            <p className='text-center text-gray-500 mt-4'>No posts found in this community yet.</p>
          )
        }
      </div>
    </div>
  )
}

export default page;
