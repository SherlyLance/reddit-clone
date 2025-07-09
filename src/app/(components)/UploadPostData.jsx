import React, { useState } from 'react'
import FirstTab from './FirstTab';
import SecondTab from './SecondTab';
import { BiLoaderAlt } from "react-icons/bi";
import FormData from 'form-data';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-toastify';

function UploadPostData({ selectedValue }) {
    const [activeTab, setActiveTab] = useState('tab1');
    const [postResource, setPostResource] = useState(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [postLoader, setPostLoader] = useState(false)

    const { user } = useUser()

    async function handlePostSubmit(e) {
        e.preventDefault()
        setPostLoader(true)
        try {
            if (selectedValue.id != "" && selectedValue.id != undefined) {
                let formData = new FormData()
                formData.append("title", title)
                if (description != "" || description != undefined) {
                    formData.append("description", description)
                }
                formData.append("postResource", postResource)
                formData.append("email", user?.emailAddresses[0].emailAddress)
                formData.append("communityId", selectedValue.id)
                let response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/uploadPost`, formData)
                if (response.data.success) {
                    toast.success(response.data.message)
                    setPostLoader(false)
                    setPostResource(null)
                    setTitle("")
                    setDescription("")
                }
                else {
                    toast.error(response.data.message)
                    setPostLoader(false)
                }
            }
            else {
                toast.warn("Please select community")
                setPostLoader(false)
            }
        } catch (error) {
            toast.error("Error occured")
            setPostLoader(false)
        }
    }

    return (
        <div className='text-white mt-4'>
            <div className='flex border-b border-gray-700'>
                <button
                    className={`px-4 py-2 focus:outline-none ${activeTab === 'tab1' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'
                        }`}
                    onClick={() => setActiveTab('tab1')}
                >
                    Text
                </button>
                <button
                    className={`px-4 py-2 focus:outline-none ${activeTab === 'tab2' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'
                        }`}
                    onClick={() => setActiveTab('tab2')}
                >
                    Image&video
                </button>
            </div>
            <form onSubmit={handlePostSubmit} method="get">
                <div className='mt-4'>
                    <input type="text" placeholder='Title' name='title' required onChange={(e) => setTitle(e.target.value)} value={title} maxLength={300} className='p-2 w-full bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded' />
                    <div className='text-right'>
                        <span className='font-bold'>{300 - title.length}</span>
                    </div>
                    {activeTab === 'tab1' && <FirstTab description={description} setDescription={setDescription} />}
                    {activeTab === 'tab2' && <SecondTab postResource={postResource} setPostResource={setPostResource} />}
                    <div className='mt-3 text-right flex justify-end'>
                        <button className='cursor-pointer relative bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2' type='submit'>{postLoader && <BiLoaderAlt className='animate-spin' />} Post</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default UploadPostData
