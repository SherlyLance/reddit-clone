import React from 'react'
import { RxCross1 } from "react-icons/rx";
import Image from 'next/image';
import { memo } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { BiLoaderAlt } from "react-icons/bi";
import { toast } from 'react-toastify';

function Community({ setShowCommunity }) {
    const { user } = useUser()
    const [communityName, setCommunityName] = React.useState("")
    const [communityDesc, setCommunityDesc] = React.useState("")
    const [image, setImage] = React.useState(null)
    const [isCommunityLoaded, setIsCommunityLoaded] = React.useState(false)

    async function communitySubmit(e) {
        e.preventDefault()
        try {
            setIsCommunityLoaded(true)
            const formData = new FormData();
            formData.append('name', communityName);
            formData.append('description', communityDesc);
            formData.append('email', user?.emailAddresses[0].emailAddress);
            if (image) {
                formData.append('image', image);
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/community/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.success) {
                setIsCommunityLoaded(false)
                setShowCommunity(false)
                toast.success(response.data.message)
            }
            else {
                setIsCommunityLoaded(false)
                toast.error(response.data.message)
            }
        } catch (error) {
            setIsCommunityLoaded(false)
            toast.error("Error occured")
        }
    }
    return (
        <div className="fixed z-30 inset-0 bg-gray-400/40 flex items-center justify-center p-4 overflow-y-scroll">
            <div className="p-6 rounded-lg w-full max-w-3xl bg-gray-800 text-white">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-xl sm:text-2xl">Tell us about your community</h2>
                    <RxCross1 className="text-2xl sm:text-3xl cursor-pointer" onClick={() => setShowCommunity(false)} />
                </div>
                <p className="text-sm mt-2 sm:mt-3">
                    A name and description help people understand what your community is all about.</p>
                <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row gap-4">
                    <div className="w-full sm:w-3/5 border p-4 rounded-md bg-gray-700">
                        <form onSubmit={communitySubmit} method="get">
                            <div>
                                <label htmlFor="image" className='border-white inline-block'>
                                    <Image src={`${image != null ? URL.createObjectURL(image) : '/upload-image.jpg'}`} alt="uploadImage" width={300} height={300} className='h-[70px] w-[70px] rounded-full cursor-pointer object-contain' />
                                </label>
                                <input type="file" name='image' id='image' hidden onChange={(e) => setImage(e.target.files[0])} accept='image/*' />
                            </div>
                            <div className='mb-3 mt-3'>
                                <input
                                    type="text"
                                    placeholder="Community name"
                                    name="community"
                                    required
                                    maxLength={21}
                                    className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) => setCommunityName(e.target.value)}
                                    value={communityName}
                                />
                                <p className='text-right text-sm font-bold mt-0.5'>{21 - communityName.length}</p>
                            </div>
                            <div className=''>
                                <textarea
                                    placeholder="Community description"
                                    name="description"
                                    rows="5"
                                    required
                                    maxLength={500}
                                    className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    onChange={(e) => setCommunityDesc(e.target.value)}
                                    value={communityDesc}
                                ></textarea>
                                <p className='text-right font-bold mt-0 text-sm'>{500 - communityDesc.length}</p>
                            </div>
                            <button
                                type="submit"
                                className={`mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer flex items-center justify-center gap-2 ${isCommunityLoaded && '!bg-blue-300'}`}
                                disabled={isCommunityLoaded}
                            >
                                {isCommunityLoaded && <BiLoaderAlt className='text-lg animate-spin' />}  Create
                            </button>
                        </form>
                    </div>
                    <div className="w-full sm:w-2/5 border p-4 rounded-md bg-gray-700">
                        <div className="shadow-lg p-4 rounded-md bg-gray-800">
                            <p className="text-lg font-semibold">r/{communityName.length == 0 ? 'communityname' : communityName}</p>
                            <p className="text-sm mt-2">
                                <span className="font-bold">1</span> member
                            </p>
                            <p className="text-sm mt-2 break-words">{communityDesc.length == 0 ? 'Description' : communityDesc}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(Community)
