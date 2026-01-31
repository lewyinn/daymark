import React from 'react'
import BottomNav from '@/components/BottomNav'
import { getServerSession } from 'next-auth';
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/sign-in");
    }

    return (
        <div className="bg-gray-50">
            <div className="min-h-screen pb-20 md:pb-0">
                {children}
            </div>
            <BottomNav />
        </div>
    )
}
