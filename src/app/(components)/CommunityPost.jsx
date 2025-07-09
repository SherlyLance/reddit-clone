"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { PiArrowFatDownBold, PiArrowFatUpBold, PiShareFatLight } from 'react-icons/pi'
import { FaRegComment } from 'react-icons/fa'
import { memo } from 'react'
import { getMediaType, timeAgo } from '../functions.js'
import { BsDot } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
import axios from 'axios'
import Share from './Share.jsx'

function CommunityPost({ post }) {
    const [like, setLike] = React.useState(false)
    const [dislike, setDislike] = React.useState(false)
    const [totalComments, setTotalComments] = React.useState(0)
    const [showShare, setShowShare] = useState(false)
    const [shareurl, setShareurl] = useState("")

    function handleShare(){
        setShareurl(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/home/comment/${post.title.slice(0, 15)}?postId=${post._id}&authorId=${post.authorId._id}`)
        setShowShare(true)
    }

    async function voteOnPost(vote) {
        try {
            if (vote == 'up') {
                setLike(!like)
                setDislike(false)
            }
            else {
                setDislike(!dislike)
                setLike(false)
            }
            let destroy;
            if ((vote == 'up' && like) || (vote == 'down' && dislike)) {
                destroy = true
            }
            else {
                destroy = false
            }
            let response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vote/updateVote`, {
                vote,
                destroy,
                userId: post.authorId._id,
                postId: post._id
            })
            if (response.data.success) {
                const { newVote } = response.data;
                if (newVote.type == 'up') {
                    setLike(true)
                    setDislike(false)
                }
                else {
                    setDislike(true)
                    setLike(false)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function voteDetails() {
        try {
            let response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vote/getVoteDetails`, {
                userId: post.authorId._id,
                postId: post._id
            })
            if (response.data.success) {
                const { vote } = response.data;
                if (vote.type == 'up') {
                    setLike(true)
                }
                else {
                    setDislike(true)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        voteDetails()
    }, [])
    return (
        <div>
            {showShare && <Share setShowShare={setShowShare} shareurl={shareurl} />}
            <Link href="#">
                <div className='flex items-center gap-2'>
                    <img src={post.authorId.imageUrl} alt="community" className='w-[35px] h-[35px] rounded-full' />
                    <p className='font-bold'>{post.authorId.username}</p>
                    <p className='text-[14px] flex items-center'><BsDot className='text-2xl' />{timeAgo(post.createdAt)}</p>
                </div>
            </Link>
            <p className='font-bold leading-[1.1] mt-1.5 text-[25px]'>{post.title}</p>
            <p className='leading-tight text-[14px] mt-1.5'>{post.content}</p>
            <div className='w-full h-[400px] mt-1.5 bg-gradient-to-bl from-[#f3f4f6] to-[#e5e7eb]'>
                {
                    getMediaType(post.imageUrl) == "video" ? <video src={post.imageUrl} controls className='h-full w-full object-contain'></video> :
                        <img src={post.imageUrl} className='h-full w-full object-contain' />
                }
            </div>
            <div className='flex justify-between items-center w-68 mt-2'>
                <div className='flex items-center gap-2 bg-gray-600 text-white p-1.5 rounded-md'>
                    <PiArrowFatUpBold onClick={() => voteOnPost('up')} className={`text-[28px] cursor-pointer ${like && 'bg-red-800'} rounded-full p-0.5`} />
                    <p>{post.votes?.length}</p>
                    <PiArrowFatDownBold onClick={() => voteOnPost('down')} className={`text-[28px] cursor-pointer ${dislike && 'bg-blue-800'} rounded-full p-0.5`} />
                </div>
                <Link href={`/home/comment/${post.title.slice(0, 15)}?postId=${post._id}&authorId=${post.authorId._id}`} className='flex items-center gap-2 bg-gray-600 text-white p-2 rounded-md cursor-pointer'>
                    <FaRegComment className='text-2xl' />
                    <p>{post.comments?.length}</p>
                </Link>
                <div className='flex items-center gap-2 bg-gray-600 text-white p-2 rounded-md cursor-pointer' onClick={handleShare}>
                    <PiShareFatLight className='text-2xl' />
                    <p>Share</p>
                </div>
            </div>
        </div>
    )
}

export default memo(CommunityPost)
