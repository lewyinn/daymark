'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'

export default function Header({ user, pageTitle }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    let displayName = 'Guest';
    
    if (user?.name) {
        displayName = user.name;
    } else if (user?.email) {
        displayName = user.email.split('@')[0]; // lewyin@gmail.com -> lewyin
    }

    // Inisial untuk Avatar
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <div className="flex items-center justify-between relative z-30">
            {/* Left Side: Greeting / Page Title */}
            <div>
                {pageTitle ? (
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{pageTitle}</h1>
                ) : (
                    <>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Hi, {displayName} 👋
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">Welcome back to your workspace</p>
                    </>
                )}
            </div>

            {/* Right Side: Avatar & Dropdown */}
            <div className="relative">
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="relative w-12 h-12 bg-gradient-to-br from-[#28C3B0] to-[#0cb39f] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-[#28C3B0]/20">
                    {initial}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-slide-down origin-top-right z-50">
                        {/* User Info Mini */}
                        <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                            <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="p-1">
                            <button 
                                onClick={() => signOut({ callbackUrl: '/sign-in' })}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Overlay transparan untuk menutup dropdown saat klik di luar */}
                {isDropdownOpen && (
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsDropdownOpen(false)}
                    />
                )}
            </div>
        </div>
    )
}