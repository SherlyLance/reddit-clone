"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CommunityPost from '@/app/(components)/CommunityPost';

function page() {
  const [recentPosts, setRecentPosts] = useState([])

  async function fetchRecentPosts() {
    try {
      let response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/recent-posts`)
      if (response.data.success) {
        let sortedPost = response.data.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentPosts(sortedPost)
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchRecentPosts()
  }, [])
  return (
    <div className="md:max-w-[60%] lg:max-w-[80%] xl:max-w-[60%] w-full m-auto p-2 md:p-4 shadow-md bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <span className="inline-block w-2 h-6 bg-blue-500 rounded-sm"></span>
        Recent Posts
      </h2>
      {
        recentPosts.map((post, idx) => (
          <React.Fragment key={post._id || idx}>
            <CommunityPost post={post} />
            {idx !== recentPosts.length - 1 && <hr className="my-2 border-gray-200" />}
          </React.Fragment>
        ))
      }
    </div>
  )
}

export default page
