"use client"
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import CommunityPost from '../(components)/CommunityPost';
import InfiniteScroll from 'react-infinite-scroll-component';
import InfinityLoader from '../(components)/InfinityLoader';
import NoMorePosts from '../(components)/NoMorePosts';
import { Bounce, toast, ToastContainer } from 'react-toastify'

function page() {
  const { user, isSignedIn } = useUser();
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [homePosts, setHomePosts] = useState([])
  const [totalPosts, setTotalPosts] = useState(0)
  const [date, setDate] = useState("")

  async function fetchMore() {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/getAllPosts`, {
        page,
        limit: 3
      })
      if (response.data.success) {
        setHomePosts(prev => prev.concat(response.data.posts))
        setPage(page + 1)
        setTotalPosts(response.data.total)
        if (homePosts.length >= response.data.total) {
          setHasMore(false)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function fetchInitial() {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/getAllPosts`, {
        page,
        limit: 3
      })
      if (response.data.success) {
        setHomePosts(response.data.posts)
        setPage(page + 1)
        setTotalPosts(response.data.total)
        if (homePosts.length >= response.data.total) {
          setHasMore(false)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  async function createUser() {
    try {
      let response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/create`, {
        username: user?.fullName || "Anonymous",
        email: user?.emailAddresses[0].emailAddress,
        imageUrl: user?.imageUrl
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  async function applyFilter() {
    if (date != "") {
      try {
        let response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/filterPosts`, {
          date
        })
        if (response.data.success) {
          setHomePosts(response.data.posts)
          setHasMore(false)
          toast.success("Filter applied")
        }
        else {
          toast.error(response.data.message)
        }
      } catch (error) {
        toast.error('Error occured')
      }
    }
    else {
      toast.error("Date is required")
    }
  }

  useEffect(() => {
    if (isSignedIn) {
      createUser()
      fetchInitial()
    }
  }, [isSignedIn])

  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        theme='colored'
        transition={Bounce}
      />
      <div className="md:max-w-[60%] lg:max-w-[80%] xl:max-w-[60%] w-full m-auto p-2 md:p-4 shadow-md bg-white rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 bg-gray-50 p-4 rounded-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full">
            <div className="text-gray-700">
              <h2 className="font-semibold text-lg">Sort by Date</h2>
            </div>
            <input
              type="date"
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              onChange={(e) => setDate(e.target.value)}
            />
            <button className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
              onClick={() => applyFilter()}>
              Sort posts
            </button>
          </div>
        </div>
        {
          date != "" &&
          <p className='text-lg font-semibold text-gray-800 px-4 py-2 bg-gray-50 rounded-md shadow-sm mb-3 inline-block transform transition-all hover:scale-[1.02]'>
            Posts after {date} are:
          </p>
        }
        <hr className='my-3' />
        <InfiniteScroll
          dataLength={homePosts.length}
          next={fetchMore}
          hasMore={hasMore}
          loader={<InfinityLoader />}
          endMessage={<NoMorePosts />}
          scrollableTarget="scrollableDiv"
        >
          {homePosts.map((post) => (
            <React.Fragment key={post._id}>
              <CommunityPost post={post} />
              <hr className="my-2" />
            </React.Fragment>
          ))}
        </InfiniteScroll>
      </div>
    </>
  )
}

export default page;
