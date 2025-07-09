import { SignedIn, UserButton } from '@clerk/nextjs';
import React from 'react'
import { IoSearchOutline } from "react-icons/io5";
import { IoAdd } from "react-icons/io5";
import { LuMenu } from "react-icons/lu";
import Link from 'next/link';
import CustomUserButton from './CustomUserButton';

function Navbar({ setIsBarOpen }) {
    return (
        <div className='w-full flex justify-between items-center bg-gray-800 text-white lg:px-6 px-3 py-4'>
            <LuMenu className='text-4xl p-0.5 lg:hidden block' onClick={() => setIsBarOpen(true)} />
            <div className='hidden lg:flex items-center border h-10 w-[400px] justify-between bg-gray-700 px-3 rounded-full'>
                <IoSearchOutline className='text-2xl' />
                <input type="text" placeholder='Reddit search' name='search' className='w-[90%] h-full outline-none' />
            </div>
            <div className='flex items-center gap-3'>
                <Link href={'/home/create-post'} className='flex items-center gap-2 bg-gray-700 px-3 py-2 cursor-pointer rounded-full'><IoAdd className='text-2xl' /> Create</Link>
                <SignedIn>
                    <CustomUserButton/>
                </SignedIn>
            </div>
        </div>
    )
}

export default Navbar
