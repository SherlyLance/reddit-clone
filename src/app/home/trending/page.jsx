"use client"
import CommunityPost from '@/app/(components)/CommunityPost';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

function page() {
  const [trendingPosts, setTrendingPosts] = useState([])

  const getTrendingScore = (post) => {
    const now = new Date();
    const createdAt = new Date(post.createdAt);
    const hoursSincePost = (now - createdAt) / (1000 * 60 * 60);

    const voteWeight = 2;
    const commentWeight = 1;
    const timeDecay = 1.5;

    const score =
      (post.votes.length * voteWeight + post.comments.length * commentWeight) /
      Math.pow(hoursSincePost + 2, timeDecay);

    return score;
  };

  async function fetchRecentPosts() {
    try {
      let response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/recent-posts`)
      if (response.data.success) {
        const trendingPostsArray = await response.data.posts.sort((a, b) => getTrendingScore(b) - getTrendingScore(a));
        setTrendingPosts(trendingPostsArray)
        console.log(trendingPostsArray)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    fetchRecentPosts()
  }, [])
  return (
    <div className="md:max-w-[60%] lg:max-w-[80%] xl:max-w-[60%] w-full m-auto p-2 md:p-4 shadow-md bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <span className="inline-block w-2 h-6 bg-blue-500 rounded-sm"></span>
        Trending Posts
      </h2>
      {
        trendingPosts.length != 0 &&
        trendingPosts.map((post, idx) => (
          <React.Fragment key={post._id || idx}>
            <CommunityPost post={post} />
            {idx !== trendingPosts.length - 1 && <hr className="my-2 border-gray-200" />}
          </React.Fragment>
        ))
      }
    </div>
  )
}

export default page
