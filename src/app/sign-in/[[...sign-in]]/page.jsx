import { SignIn } from '@clerk/nextjs'
import Image from 'next/image';

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900" style={{
      backgroundImage: 'url(/reddit.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      animation: 'fadeIn 1s'
    }}>
      <style>
        {`
                  @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                  }
                `}
      </style>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4" style={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        <SignIn appearance={{
          elements: {
            formButtonPrimary: 'bg-blue-500 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
            footerAction: 'inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-500',
            formHeaderTitle: 'text-gray-800 dark:text-gray-200 text-center text-xl mb-6'
          }
        }} />
      </div>
    </div>
  );
}