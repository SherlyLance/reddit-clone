import React from 'react'
import { RxCross1 } from "react-icons/rx";
import { BiLoaderAlt } from "react-icons/bi";

function UploadImage({ communityImage, setCommunityImage, uploadImage, setUploadImage, updateImage, communityLoader }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/40 bg-opacity-40 p-4">
            <div className="w-full max-w-sm rounded-lg bg-black shadow-lg p-6 relative">
                <p>
                    <RxCross1 size={28} className='float-right text-white cursor-pointer' onClick={() => setUploadImage(false)} />
                </p>
                <h2 className="text-lg font-semibold mb-4 text-white text-center">Upload Image</h2>
                <form className="flex flex-col gap-4" onSubmit={updateImage}>
                    <div className="flex flex-col items-center">
                        <label
                            htmlFor="communityImage"
                            className="cursor-pointer w-28 h-28 rounded-full flex flex-col items-center justify-center  border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition"
                        >
                            <img
                                src={communityImage ? URL.createObjectURL(communityImage) : "https://png.pngtree.com/png-clipart/20190920/original/pngtree-file-upload-icon-png-image_4646955.jpg"}
                                alt="Preview"
                                className={`w-full h-full object-cover rounded-full`}
                            />
                        </label>
                        <input
                            id="communityImage"
                            type="file"
                            name="communityImage"
                            accept="image/*"
                            required
                            className="hidden"
                            onChange={(e) => setCommunityImage(e.target.files[0])}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer flex items-center justify-center gap-3"
                        disabled={communityLoader}
                    >
                        {
                            communityLoader && <BiLoaderAlt className='animate-spin' />
                        }
                        Upload
                    </button>
                </form>
            </div>
        </div>
    )
}

export default UploadImage
