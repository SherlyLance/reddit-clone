"use client"
import React, { useEffect, useState, memo } from 'react'
import Link from 'next/link'
import { PiArrowFatDownBold, PiArrowFatUpBold, PiShareFatLight } from 'react-icons/pi'
import { FaRegComment } from 'react-icons/fa'
import { getMediaType, timeAgo } from '../functions.js'
import { BsDot } from "react-icons/bs";
import { MdDeleteOutline, MdEditSquare } from "react-icons/md"; // Import MdEditSquare
import axios from 'axios'
import Share from './Share.jsx'
import { useUser } from '@clerk/nextjs'; // Import useUser from Clerk

// New import for text input/textarea components (You might need to adjust based on your UI library)
// For simplicity, I'll use basic HTML inputs. If you have a custom TextInput/Textarea component, use that.

function CommunityPost({ post: initialPost, onPostDeleted, onPostUpdated }) { // Receive initialPost and callbacks
    const { user } = useUser(); // Get the current authenticated user from Clerk
    const currentUserId = user?.id; // Clerk's user ID

    const [post, setPost] = useState(initialPost); // Manage post state internally
    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);
    const [totalComments, setTotalComments] = useState(0); // This isn't currently used, but keep it
    const [showShare, setShowShare] = useState(false);
    const [shareurl, setShareurl] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(post.title);
    const [editedContent, setEditedContent] = useState(post.content);

    // Determine if the current user is the author of the post
    const isAuthor = currentUserId && post.authorId && post.authorId._id === currentUserId;

    // Update internal post state if initialPost prop changes (e.g., after parent fetch)
    useEffect(() => {
        setPost(initialPost);
        setEditedTitle(initialPost.title);
        setEditedContent(initialPost.content);
    }, [initialPost]);


    function handleShare(){
        setShareurl(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/home/comment/${post.title.slice(0, 15)}?postId=${post._id}&authorId=${post.authorId._id}`)
        setShowShare(true)
    }

    async function voteOnPost(vote) {
        try {
            // Placeholder: Ideally, your vote API should also use req.user._id from backend auth
            // For now, I'm keeping your existing logic for userId in body.
            // In a real app, userId should come from backend session/JWT.
            let payload = {
                vote,
                destroy: (vote === 'up' && like) || (vote === 'down' && dislike),
                userId: post.authorId._id, // This should be the current *voting* user's ID, not the author's.
                // You should use currentUserId here if your backend allows sending userId from frontend.
                // A better approach is to get userId from backend session.
                postId: post._id
            };

            let response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vote/updateVote`, payload);

            if (response.data.success) {
                const { newVote } = response.data;
                if (newVote.type === 'up') {
                    setLike(true);
                    setDislike(false);
                } else {
                    setDislike(true);
                    setLike(false);
                }
                // Optionally update post.votes count if backend returns it
            }
        } catch (error) {
            console.error("Error voting on post:", error);
        }
    }

    async function voteDetails() {
        try {
            // Same note as above about userId.
            let response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vote/getVoteDetails`, {
                userId: post.authorId._id, // This should be the current *voting* user's ID.
                postId: post._id
            });
            if (response.data.success) {
                const { vote } = response.data;
                if (vote.type === 'up') {
                    setLike(true);
                } else {
                    setDislike(true);
                }
            }
        } catch (error) {
            console.error("Error fetching vote details:", error);
        }
    }

    // --- NEW EDIT FUNCTIONALITY ---
    const handleEditPost = async () => {
        try {
            // IMPORTANT: The backend `authenticateUser` middleware is a placeholder
            // using `email` from `req.body`. In a production Clerk app, you'd rely
            // on Clerk's session for authentication, likely not sending email in the body.
            // Adjust this payload based on how your backend authenticates `authenticateUser`
            // if you don't use Clerk's backend SDK.
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/edit/${post._id}`, {
                title: editedTitle,
                content: editedContent, // 'content' is the field name in your Post model
                email: user?.emailAddresses?.[0]?.emailAddress // Example: get primary email from Clerk user
            });

            if (response.data.success) {
                setPost(response.data.post); // Update the post state with the new data from backend
                setIsEditing(false); // Exit editing mode
                if (onPostUpdated) {
                    onPostUpdated(response.data.post); // Notify parent component if needed
                }
                alert('Post updated successfully!'); // Simple alert for now
            } else {
                alert(`Failed to update post: ${response.data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating post:', error);
            alert(`Error updating post: ${error.response?.data?.message || error.message}`);
        }
    };

    // --- NEW DELETE FUNCTIONALITY ---
    const handleDeletePost = async () => {
        if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        try {
            // IMPORTANT: Same note as above for authentication payload.
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/delete/${post._id}`, {
                data: { // Axios requires `data` property for DELETE requests with a body
                    email: user?.emailAddresses?.[0]?.emailAddress // Example: get primary email from Clerk user
                }
            });

            if (response.data.success) {
                alert('Post deleted successfully!');
                if (onPostDeleted) {
                    onPostDeleted(post._id); // Notify parent component to remove this post
                }
            } else {
                alert(`Failed to delete post: ${response.data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert(`Error deleting post: ${error.response?.data?.message || error.message}`);
        }
    };


    useEffect(() => {
        voteDetails()
    }, [post._id]) // Re-run if post ID changes
    return (
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
            {showShare && <Share setShowShare={setShowShare} shareurl={shareurl} />}
            {/* Post Header (Author, Time) */}
            <Link href="#" className="block mb-2">
                <div className='flex items-center gap-2'>
                    <img src={post.authorId.imageUrl} alt="community" className='w-[35px] h-[35px] rounded-full object-cover' />
                    <p className='font-bold text-gray-800'>{post.authorId.username}</p>
                    <p className='text-[14px] text-gray-500 flex items-center'><BsDot className='text-2xl' />{timeAgo(post.createdAt)}</p>
                    {post.lastEditedAt && <p className='text-[14px] text-gray-500'> (Edited)</p>} {/* Indicator for edited */}
                </div>
            </Link>

            {/* Post Content */}
            {isEditing ? (
                <div className="mt-2">
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        placeholder="Edit title"
                    />
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        placeholder="Edit content"
                    />
                    <div className="flex gap-2 mt-2 justify-end">
                        <button
                            onClick={handleSaveEdit}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <p className='font-bold leading-[1.1] mt-1.5 text-[25px] text-gray-900'>{post.title}</p>
                    <p className='leading-tight text-[14px] mt-1.5 text-gray-700'>{post.content}</p>
                    {post.imageUrl && ( // Only render image/video if imageUrl exists
                        <div className='w-full max-h-[400px] mt-2 bg-gray-100 flex justify-center items-center overflow-hidden rounded-md'>
                            {
                                getMediaType(post.imageUrl) === "video" ?
                                    <video src={post.imageUrl} controls className='h-full w-full object-contain'></video> :
                                    <img src={post.imageUrl} className='h-full w-full object-contain' alt="Post content" />
                            }
                        </div>
                    )}
                </>
            )}

            {/* Post Actions (Votes, Comments, Share, Edit, Delete) */}
            <div className='flex justify-between items-center w-full mt-3 flex-wrap gap-2'>
                <div className='flex items-center gap-2 bg-gray-100 text-gray-800 p-1.5 rounded-md'>
                    <PiArrowFatUpBold onClick={() => voteOnPost('up')} className={`text-[28px] cursor-pointer ${like ? 'text-red-600' : 'hover:text-red-500'} rounded-full p-0.5 transition-colors`} />
                    <p className="font-semibold">{post.votes?.length || 0}</p> {/* Display vote count */}
                    <PiArrowFatDownBold onClick={() => voteOnPost('down')} className={`text-[28px] cursor-pointer ${dislike ? 'text-blue-600' : 'hover:text-blue-500'} rounded-full p-0.5 transition-colors`} />
                </div>

                <Link href={`/home/comment/${post.title.slice(0, 15)}?postId=${post._id}&authorId=${post.authorId._id}`} className='flex items-center gap-2 bg-gray-100 text-gray-800 p-2 rounded-md cursor-pointer hover:bg-gray-200 transition-colors'>
                    <FaRegComment className='text-xl' />
                    <p>{post.comments?.length || 0}</p>
                </Link>

                <div className='flex items-center gap-2 bg-gray-100 text-gray-800 p-2 rounded-md cursor-pointer hover:bg-gray-200 transition-colors' onClick={handleShare}>
                    <PiShareFatLight className='text-xl' />
                    <p>Share</p>
                </div>

                {isAuthor && !isEditing && ( // Only show edit/delete if author and not currently editing
                    <>
                        <div className='flex items-center gap-2 bg-blue-500 text-white p-2 rounded-md cursor-pointer hover:bg-blue-600 transition-colors' onClick={() => setIsEditing(true)}>
                            <MdEditSquare className='text-xl' />
                            <p>Edit</p>
                        </div>
                        <div className='flex items-center gap-2 bg-red-500 text-white p-2 rounded-md cursor-pointer hover:bg-red-600 transition-colors' onClick={handleDeletePost}>
                            <MdDeleteOutline className='text-xl' />
                            <p>Delete</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default memo(CommunityPost);
