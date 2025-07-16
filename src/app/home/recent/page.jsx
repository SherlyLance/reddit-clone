"use client"
import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react' // Import useCallback
import CommunityPost from '@/app/(components)/CommunityPost';

function Page() { // Renamed 'page' to 'Page' for consistency
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  async function fetchRecentPosts() {
    try {
      setLoading(true);
      setError(null);
      let response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/recent-posts`);
      if (response.data.success) {
        let sortedPost = response.data.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentPosts(sortedPost);
      } else {
        setError(response.data.message || 'Failed to fetch recent posts.');
      }
    } catch (err) {
      console.error("Error fetching recent posts:", err);
      setError('Could not fetch recent posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Callback to handle post deletion from child component
  const handlePostDeleted = useCallback((deletedPostId) => {
    setRecentPosts(prevPosts => prevPosts.filter(post => post._id !== deletedPostId));
  }, []);

  // Callback to handle post update from child component
  const handlePostUpdated = useCallback((updatedPost) => {
    setRecentPosts(prevPosts => prevPosts.map(post =>
      post._id === updatedPost._id ? updatedPost : post
    ));
  }, []);

  useEffect(() => {
    fetchRecentPosts();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <div className="md:max-w-[60%] lg:max-w-[80%] xl:max-w-[60%] w-full m-auto p-4 md:p-4 shadow-md bg-white rounded-lg text-center">Loading posts...</div>;
  }

  if (error) {
    return <div className="md:max-w-[60%] lg:max-w-[80%] xl:max-w-[60%] w-full m-auto p-4 md:p-4 shadow-md bg-white rounded-lg text-center text-red-600">{error}</div>;
  }

  if (recentPosts.length === 0) {
    return <div className="md:max-w-[60%] lg:max-w-[80%] xl:max-w-[60%] w-full m-auto p-4 md:p-4 shadow-md bg-white rounded-lg text-center text-gray-500">No recent posts available.</div>;
  }

  return (
    <div className="md:max-w-[60%] lg:max-w-[80%] xl:max-w-[60%] w-full m-auto p-2 md:p-4 shadow-md bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <span className="inline-block w-2 h-6 bg-blue-500 rounded-sm"></span>
        Recent Posts
      </h2>
      {
        recentPosts.map((post, idx) => (
          <React.Fragment key={post._id}> {/* Use post._id as key */}
            <CommunityPost
              post={post}
              onPostDeleted={handlePostDeleted}
              onPostUpdated={handlePostUpdated}
            />
            {idx !== recentPosts.length - 1 && <hr className="my-4 border-gray-200" />} {/* Increased margin for better separation */}
          </React.Fragment>
        ))
      }
    </div>
  );
}

export default Page;
