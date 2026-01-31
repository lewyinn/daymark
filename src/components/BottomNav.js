'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '../../public/Logo.png'
import { MdOutlineMovie } from "react-icons/md";

export default function BottomNav() {
    const pathname = usePathname()

    const navItems = [
        {
            name: 'Home',
            path: '/dashboard',
            icon: (active) => (
                <svg className={`w-5 h-5 ${active ? 'text-[#28C3B0]' : 'text-gray-500 group-hover:text-gray-700'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            name: 'Tasks',
            path: '/dashboard/tasks',
            icon: (active) => (
                <svg className={`w-5 h-5 ${active ? 'text-[#28C3B0]' : 'text-gray-500 group-hover:text-gray-700'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            )
        },
        {
            name: 'Notes',
            path: '/dashboard/notes',
            icon: (active) => (
                <svg className={`w-5 h-5 ${active ? 'text-[#28C3B0]' : 'text-gray-500 group-hover:text-gray-700'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            )
        },
        {
            name: 'Movie',
            path: '/dashboard/movies',
            icon: (active) => (
                <MdOutlineMovie className={`w-5 h-5 ${active ? 'text-[#28C3B0]' : 'text-gray-500 group-hover:text-gray-700'}`} />
            )
        },
        // {
        //     name: 'More',
        //     path: '/dashboard/more',
        //     icon: (active) => (
        //         <svg className={`w-5 h-5 ${active ? 'text-[#28C3B0]' : 'text-gray-500 group-hover:text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        //         </svg>
        //     )
        // }
    ]

    return (
        <>
            {/* MOBILE NAVIGATION */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
                <div className="flex items-center justify-around">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className="flex flex-col items-center gap-1 min-w-[60px]"
                            >
                                {item.icon(isActive)}
                                <span className={`text-xs font-medium ${isActive ? 'text-[#28C3B0]' : 'text-gray-400'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* DESKTOP NAVIGATION (Floating Dock)  */}
            <div className="hidden md:flex fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                <nav className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-md border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.18)]">
                    
                    {/* Logo Kecil */}
                    <div className="pl-3 pr-2 border-r border-gray-200 mr-1">
                        <Image src={Logo} width={21} height={21} alt='Logo' />
                    </div>

                    {/* Nav Items */}
                    {navItems.map((item) => {
                        const isActive = pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`group flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200 ease-in-out ${
                                    isActive
                                        ? 'bg-[#28C3B0]/10 text-[#28C3B0] font-medium'
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                {item.icon(isActive)}
                                <span className={`${isActive ? 'block' : 'hidden lg:block'} text-sm whitespace-nowrap`}>
                                    {item.name}
                                </span>
                            </Link>
                        )
                    })}

                    {/* Divider & Profile */}
                    {/* <div className="flex items-center pl-2 ml-1 border-l border-gray-200">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#28C3B0] to-teal-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:ring-2 hover:ring-[#28C3B0]/30 transition-all">
                            D
                        </div>
                    </div> */}
                </nav>
            </div>
            
            {/* Spacer */}
            <div className="hidden md:block pb-24" />
        </>
    )
}