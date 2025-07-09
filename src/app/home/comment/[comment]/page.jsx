"use client"
import React, { useEffect, useState } from 'react'
import UserComment from '@/app/(components)/UserComment'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import { BiLoaderAlt } from "react-icons/bi";
import CommunityPost from '@/app/(components)/CommunityPost'
import InfinityLoader from '@/app/(components)/InfinityLoader'
import NoMorePosts from '@/app/(components)/NoMorePosts'
import { toast } from 'react-toastify'

function page({ params }) {
    const [userComment, setUserComment] = useState("")
    const [commentLoader, setCommentLoader] = useState(false)
    const [post, setPost] = useState({})
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [comments, setComments] = useState([])
    let searchParams = useSearchParams()

    async function addCommentHandler(e) {
        e.preventDefault()
        try {
            setCommentLoader(true)
            let response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/comment/add`, {
                content: userComment,
                postId: searchParams.get("postId"),
                authorId: searchParams.get("authorId")
            })

            if (response.data.success) {
                setUserComment("")
                toast.success(response.data.message)
                setCommentLoader(false)
            }
            else {
                setCommentLoader(false)
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error("Error occured")
        }
    }

    async function fetchPost() {
        try {
            let response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/getPost?postId=${searchParams.get("postId")}`)

            if (response.data.success) {
                setPost(response.data.post)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function fetchMoreComments() {
        try {
            let response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/comment/getComments`, {
                postId: searchParams.get("postId"),
                page,
                limit: 5
            })
            if (response.data.success) {
                setComments(prev => prev.concat(response.data.comments))
                setPage(page + 1)
                if (comments.length >= response.data.totalComments) {
                    setHasMore(false)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function fetchInitialComments() {
        try {
            let response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/comment/getComments`, {
                postId: searchParams.get("postId"),
                page,
                limit: 5
            })
            if (response.data.success) {
                setComments(response.data.comments)
                setPage(page + 1)
                if (comments.length >= response.data.totalComments) {
                    setHasMore(false)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchPost()
        fetchInitialComments()
    }, [])

    return (
        <div className='md:max-w-[60%] lg:max-w-[60%] xl:max-w-[60%] w-full m-auto p-2 md:p-4 shadow-md'>
            <div className='!w-full'>
                {
                    post.authorId &&
                    <CommunityPost post={post} />
                }
                <form onSubmit={addCommentHandler} className="mt-4 p-2 bg-gray-900 rounded-lg shadow-lg">
                    <div className='w-full flex items-center gap-2'>
                        <div className='flex-grow'>
                            <input
                                type="text"
                                placeholder='Comment here...'
                                name='comment'
                                required
                                className='w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400'
                                onChange={(e) => setUserComment(e.target.value)}
                                value={userComment}
                            />
                        </div>
                        <button
                            type='submit'
                            className='px-6 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900
                            flex items-center justify-center gap-1.5'
                        >
                            {commentLoader && <BiLoaderAlt className='animate-spin' />}
                            Add
                        </button>
                    </div>
                </form>
                <InfiniteScroll
                    dataLength={comments.length}
                    next={fetchMoreComments}
                    hasMore={hasMore}
                    loader={<InfinityLoader />}
                    endMessage={<NoMorePosts />}
                    scrollableTarget="scrollableDiv"
                >
                    {comments.length != 0 &&
                        comments.map((item, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <div className='mt-4'></div>
                                    <UserComment item={item} />
                                </React.Fragment>

                            )
                        })
                    }
                </InfiniteScroll>
            </div>
            <hr className='my-2' />
        </div>
    )
}

export default page