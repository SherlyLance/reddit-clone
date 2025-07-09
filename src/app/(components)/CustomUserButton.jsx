'use client';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { useState } from 'react';

export default function CustomUserButton() {
    const { user } = useUser();
    const [open, setOpen] = useState(false);

    if (!user) return null;

    return (
        <div className="relative">
            <button 
                onClick={() => setOpen(!open)} 
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
                <img src={user.imageUrl} alt="User" className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-white">{user.firstName}</span>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 p-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.emailAddresses[0].emailAddress}</p>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-1">
                        <SignOutButton redirectUrl='/sign-in'>
                            <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md">
                                Sign out
                            </button>
                        </SignOutButton>
                    </div>
                </div>
            )}
        </div>
    );
}