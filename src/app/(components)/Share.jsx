import React from 'react'
import { memo } from 'react'
import { FaFacebook, FaInstagram, FaLinkedin, FaTelegram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { IoClose, IoCopy, IoMail, IoShareSocialOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';

function Share({ setShowShare, shareurl }) {
    const shareUrl = shareurl;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            toast.info('Link copied to clipboard!');
        } catch (err) {
            toast.error('Failed to copy link.');
        }
    };

    return (
        <div className='fixed inset-0 z-40 flex items-center justify-center bg-gray-400/40 p-4'>
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 flex flex-col gap-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <IoShareSocialOutline className="text-blue-500" size={24} />
                        Share this content
                    </h2>
                    <button
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        onClick={() => setShowShare(false)}
                    >
                        <IoClose size={24} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer" />
                    </button>
                </div>

                <div className="relative mt-2">
                    <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg py-2 px-4 pr-24 text-sm text-gray-700 dark:text-gray-300"
                    />
                    <button
                        onClick={handleCopy}
                        className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors flex items-center gap-2"
                    >
                        <IoCopy size={16} />
                        Copy
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        className="flex items-center justify-center gap-2 p-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-lg transition-all hover:scale-105"
                    >
                        <FaTwitter size={20} />
                        <span className="text-sm font-medium">Twitter</span>
                    </a>
                    <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        className="flex items-center justify-center gap-2 p-2 bg-[#4267B2] hover:bg-[#365899] text-white rounded-lg transition-all hover:scale-105"
                    >
                        <FaFacebook size={20} />
                        <span className="text-sm font-medium">Facebook</span>
                    </a>
                    <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        className="flex items-center justify-center gap-2 p-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg transition-all hover:scale-105"
                    >
                        <FaWhatsapp size={20} />
                        <span className="text-sm font-medium">WhatsApp</span>
                    </a>
                    <a
                        href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        className="flex items-center justify-center gap-2 p-2 bg-[#0077B5] hover:bg-[#006399] text-white rounded-lg transition-all hover:scale-105"
                    >
                        <FaLinkedin size={20} />
                        <span className="text-sm font-medium">LinkedIn</span>
                    </a>
                    <a
                        href={`https://telegram.me/share/url?url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        className="flex items-center justify-center gap-2 p-2 bg-[#0088cc] hover:bg-[#0077b3] text-white rounded-lg transition-all hover:scale-105"
                    >
                        <FaTelegram size={20} />
                        <span className="text-sm font-medium">Telegram</span>
                    </a>
                    <a
                        href={`mailto:?body=${encodeURIComponent(shareUrl)}`}
                        className="flex items-center justify-center gap-2 p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all hover:scale-105"
                    >
                        <IoMail size={20} />
                        <span className="text-sm font-medium">Email</span>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default memo(Share)
