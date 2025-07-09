"use client"
import React, { useEffect } from 'react'
import { FaReddit } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Community from './Community';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { IoMdTrendingUp } from "react-icons/io";
import { FaClockRotateLeft } from "react-icons/fa6";

function Sidebar({ isBarOpen, setIsBarOpen }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const pathname = usePathname();
    const [showCommunity, setShowCommunity] = React.useState(false)
    const [communities, setCommunities] = React.useState([])
    const { user } = useUser()

    async function fetchCommunities() {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/community/getCommunities`, {
                email: user?.emailAddresses[0].emailAddress
            })
            if (response.data.success) {
                setCommunities(response.data.communities)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCommunities()
    }, [])
    return (
        <>
            {showCommunity && <Community setShowCommunity={setShowCommunity} />}
            <div className={`flex flex-col lg:h-screen lg:!w-80 top-0 bottom-0 w-75 bg-gray-800 py-2 px-4 text-white lg:relative fixed z-10 lg:translate-x-0 ${!isBarOpen && 'translate-x-[-100%]'} transition-transform duration-300 ease-in-out`}>
                <div className="flex items-center justify-between text-red-500">
                    <div className='flex items-center text-red-500'>
                        <FaReddit className="text-6xl p-2.5" />
                        <h1 className="text-4xl font-bold">Reddit</h1>
                    </div>
                    <RxCross1 onClick={() => setIsBarOpen(false)} className='text-4xl p-1 lg:hidden block cursor-pointer text-white' />
                </div>
                <nav className="mt-[80px] my-8">
                    <ul className='flex flex-col gap-2.5'>
                        <li className={`py-2 px-4 hover:bg-gray-700 ${pathname == '/home' && 'bg-gray-700'} rounded`}>
                            <Link href="/home" className='flex gap-2 items-center'><IoMdHome className='text-2xl font-bold' /> Home</Link>
                        </li>
                        <li className={`py-2 px-4 hover:bg-gray-700 ${pathname == '/home/trending' && 'bg-gray-700'} rounded`}>
                            <Link href="/home/trending" className='flex gap-2 items-center'><IoMdTrendingUp className='text-2xl font-bold' /> Trending</Link>
                        </li>
                        <li className={`py-2 px-4 hover:bg-gray-700 ${pathname == '/home/recent' && 'bg-gray-700'} rounded`}>
                            <Link href="/home/recent" className='flex gap-2 items-center'><FaClockRotateLeft className='text-2xl font-bold' /> Recent</Link>
                        </li>
                        <hr className='text-gray-700' />
                        <li>
                            <div className='flex justify-between items-center py-2 px-4 hover:bg-gray-700 rounded select-none cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
                                <p>Communities</p>
                                {
                                    !isOpen ? <FaChevronDown /> : <FaChevronUp />
                                }
                            </div>
                            <div className={`mt-2 ${isOpen ? 'block' : 'hidden'}`}>
                                <ul>
                                    <li className='flex gap-2 items-center py-2 px-4 hover:bg-gray-700 rounded cursor-pointer' onClick={() => setShowCommunity(true)}>
                                        <IoMdAdd />
                                        <p className=''>Create a community</p>
                                    </li>
                                    {
                                        communities.length != 0 &&
                                        communities.map((item) => {
                                            return (
                                                <Link href={`/home/r/${item.name}?id=${item._id}`} key={item._id} className='flex gap-3 items-center py-2 px-4 hover:bg-gray-700 rounded cursor-pointer mt-1.5'>
                                                    <Image src={item.imageUrl} alt={item.name} className='!w-[27px] !h-[27px] rounded-[50%]' width={100} height={100} />
                                                    <p>{item.name}</p>
                                                </Link>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    )
}

export default Sidebar