'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import TaskCard from '@/components/home/TaskCard'
import NoteCard from '@/components/home/NoteCard'
import MovieCard from '@/components/home/MovieCard'
import CalendarWidget from '@/components/home/CalenderWidget'
import Link from 'next/link'

export default function Home() {
    const { data: session, status } = useSession()

    // State untuk data real
    const [tasks, setTasks] = useState([])
    const [notes, setNotes] = useState([])
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch semua data saat session ready
    useEffect(() => {
        if (status === 'authenticated') {
            fetchAllData()
        }
    }, [status])

    const fetchAllData = async () => {
        try {
            // Kita fetch paralel biar cepat
            const [resTasks, resNotes, resMovies] = await Promise.all([
                fetch('/api/tasks'),
                fetch('/api/notes'),
                fetch('/api/movies')
            ])

            if (resTasks.ok) {
                const data = await resTasks.json()
                // Mapping _id ke id & urutkan by deadline (terdekat dulu)
                const formatted = data.map(t => ({ ...t, id: t._id })).sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                setTasks(formatted)
            }

            if (resNotes.ok) {
                const data = await resNotes.json()
                // Mapping _id ke id & urutkan created terbaru
                const formatted = data.map(n => ({ ...n, id: n._id }))
                setNotes(formatted)
            }

            if (resMovies.ok) {
                const data = await resMovies.json()
                // Mapping _id ke id
                const formatted = data.map(m => ({ ...m, id: m._id }))
                setMovies(formatted)
            }

        } catch (error) {
            console.error("Error fetching dashboard data:", error)
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading' || loading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading your workspace...</div>
    }

    const user = session?.user || { name: 'Guest', email: '' }

    // Filter Task Hari Ini (Untuk Calendar Widget)
    const todayTasks = tasks.filter(task => {
        // Cek jika task belum selesai DAN deadline-nya hari ini
        if (task.status === 'completed') return false

        const taskDate = new Date(task.deadline).toISOString().split('T')[0]
        const today = new Date().toISOString().split('T')[0]
        return taskDate === today
    })

    // Filter Stats (Active Tasks count)
    const activeTasksCount = tasks.filter(t => t.status === 'pending').length

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 pb-32">
            <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
                {/* Header */}
                <Header user={user} />

                {/* Main Content */}
                <div className="mt-6 space-y-6">
                    {/* Calendar Widget (Tampilkan Task Hari Ini) */}
                    <CalendarWidget todayTasks={todayTasks} />

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                        <Link href="/dashboard/tasks" className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="text-2xl md:text-3xl font-bold text-green-600 group-hover:scale-110 transition-transform origin-left">{activeTasksCount}</div>
                            <div className="text-xs md:text-sm text-gray-600 mt-1">Active Tasks</div>
                        </Link>
                        <Link href="/dashboard/notes" className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="text-2xl md:text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform origin-left">{notes.length}</div>
                            <div className="text-xs md:text-sm text-gray-600 mt-1">Notes</div>
                        </Link>
                        <Link href="/dashboard/movies" className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="text-2xl md:text-3xl font-bold text-red-600 group-hover:scale-110 transition-transform origin-left">{movies.length}</div>
                            <div className="text-xs md:text-sm text-gray-600 mt-1">Watchlist</div>
                        </Link>
                    </div>

                    {/* Recent Tasks (Show max 3 pending tasks) */}
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg md:text-xl font-bold text-gray-800">Up Next</h2>
                            <Link href="/dashboard/tasks" className="text-sm text-[#28C3B0] hover:text-[#229789] hover:underline font-medium">
                                View All →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {tasks.filter(t => t.status === 'pending').slice(0, 3).map(task => (
                                <TaskCard key={task.id} task={task} compact />
                            ))}
                            {tasks.filter(t => t.status === 'pending').length === 0 && (
                                <div className="text-center py-8 bg-white/50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-gray-500 text-sm">No pending tasks! 🎉</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Recent Notes (Show max 2) */}
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg md:text-xl font-bold text-gray-800">Latest Notes</h2>
                            <Link href="/dashboard/notes" className="text-sm text-[#28C3B0] hover:text-[#229789] hover:underline font-medium">
                                View All →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {notes.slice(0, 2).map(note => (
                                <NoteCard key={note.id} note={note} compact />
                            ))}
                            {notes.length === 0 && (
                                <div className="text-center py-8 bg-white/50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-gray-500 text-sm">No notes yet.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Recent Watchlist (Show max 2) */}
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg md:text-xl font-bold text-gray-800">Watchlist</h2>
                            <Link href="/dashboard/movies" className="text-sm text-[#28C3B0] hover:text-[#229789] hover:underline font-medium">
                                View All →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {movies.slice(0, 2).map(movie => (
                                <MovieCard key={movie.id} movie={movie} compact />
                            ))}
                            {movies.length === 0 && (
                                <div className="text-center py-8 bg-white/50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-gray-500 text-sm">Watchlist is empty.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}