'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import MovieModal from '@/components/movies/MovieModal'
import Alert from '@/components/Alert'
import DeleteConfirmModal from '@/components/DeleteConfimModal'
import MovieCard from '@/components/movies/MovieCard'

export default function MoviesPage() {
    const { data: session, status } = useSession()
    
    // State Data Real
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    // UI States
    const [filterType, setFilterType] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [deleteItem, setDeleteItem] = useState(null)
    const [alert, setAlert] = useState(null)

    // 1. Fetch Data saat component load
    useEffect(() => {
        if (status === 'authenticated') {
            fetchMovies()
        }
    }, [status])

    const fetchMovies = async () => {
        try {
            const res = await fetch('/api/movies')
            if (res.ok) {
                const data = await res.json()
                // Transform _id to id untuk frontend konsistensi
                const formattedData = data.map(item => ({ ...item, id: item._id }))
                setItems(formattedData)
            }
        } catch (error) {
            console.error('Failed to fetch movies:', error)
        } finally {
            setLoading(false)
        }
    }

    const showAlert = (type, message) => {
        setAlert({ type, message })
        setTimeout(() => setAlert(null), 3000)
    }

    // 2. Handle Save (Create & Update)
    const handleSave = async (formData) => {
        try {
            if (editingItem) {
                // === UPDATE (PUT) ===
                const res = await fetch(`/api/movies/${editingItem.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })

                if (res.ok) {
                    const updatedItem = await res.json()
                    setItems(items.map(i => i.id === editingItem.id ? { ...updatedItem, id: updatedItem._id } : i))
                    showAlert('success', 'Media updated successfully!')
                }
            } else {
                // === CREATE (POST) ===
                const res = await fetch('/api/movies', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })

                if (res.ok) {
                    const newItem = await res.json()
                    setItems([{ ...newItem, id: newItem._id }, ...items])
                    showAlert('success', 'Added to watchlist!')
                }
            }
        } catch (error) {
            showAlert('error', 'Something went wrong.')
        } finally {
            setIsModalOpen(false)
            setEditingItem(null)
        }
    }

    // 3. Handle Delete
    const handleDeleteClick = (item) => {
        setDeleteItem(item)
    }

    const handleDeleteConfirm = async () => {
        try {
            const res = await fetch(`/api/movies/${deleteItem.id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                setItems(items.filter(i => i.id !== deleteItem.id))
                showAlert('success', 'Deleted successfully')
            }
        } catch (error) {
            showAlert('error', 'Failed to delete')
        } finally {
            setDeleteItem(null)
        }
    }

    // --- LOGIC UI BAWAAN (Filter & Stats) ---
    const filteredItems = items.filter(item => {
        const matchesType = filterType === 'all' || item.type === filterType
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesType && matchesSearch
    })

    const stats = {
        watching: items.filter(i => i.status === 'watching').length,
        completed: items.filter(i => i.status === 'completed').length,
        planned: items.filter(i => i.status === 'plan-to-watch').length
    }

    if (status === 'loading' || loading) {
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-gray-500">Loading your watchlist...</div>
    }

    const user = session?.user || { name: 'Guest', email: '' }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-32">
            <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">

                <Header user={user} pageTitle="Watchlist" />
                
                {alert && <Alert type={alert.type} message={alert.message} />}

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mt-6 mb-8">
                    <div className="bg-blue-50 border border-blue-100 p-3 rounded-2xl flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-blue-600">{stats.watching}</span>
                        <span className="text-xs text-blue-800 font-medium">Watching</span>
                    </div>
                    <div className="bg-green-50 border border-green-100 p-3 rounded-2xl flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-green-600">{stats.completed}</span>
                        <span className="text-xs text-green-800 font-medium">Finished</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-gray-600">{stats.planned}</span>
                        <span className="text-xs text-gray-800 font-medium">Planned</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-4 sticky top-0 z-20 bg-slate-50/95 backdrop-blur-sm py-2">
                    <div className="flex p-1 bg-white rounded-xl border border-gray-200 w-full sm:w-fit self-center sm:self-start">
                        {['all', 'movie', 'series'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                                    filterType === type 
                                    ? 'bg-[#28C3B0] text-white shadow-md shadow-teal-200' 
                                    : 'text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                        <div className="relative w-full sm:max-w-xs group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#28C3B0]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border text-gray-600 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#28C3B0]/50 focus:border-[#28C3B0] shadow-sm"
                            />
                        </div>

                        <button
                            onClick={() => { setEditingItem(null); setIsModalOpen(true) }}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#28C3B0] to-teal-600 text-white rounded-2xl font-semibold shadow-lg shadow-teal-200/50 hover:shadow-xl hover:shadow-teal-200 hover:-translate-y-0.5 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            <span>Add New</span>
                        </button>
                    </div>
                </div>

                {/* Grid Content */}
                <div className="mt-6">
                    {filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-4xl grayscale opacity-50">🎬</div>
                            <h3 className="text-lg font-bold text-gray-600">No media found</h3>
                            <p className="text-gray-400 text-sm mt-1">Start by adding your first movie or series.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredItems.map(item => (
                                <MovieCard 
                                    key={item.id} 
                                    movie={item} 
                                    onEdit={(i) => { setEditingItem(i); setIsModalOpen(true) }}
                                    onDelete={(i) => handleDeleteClick(i)}
                                />
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {isModalOpen && (
                <MovieModal 
                    item={editingItem} 
                    onSave={handleSave} 
                    onClose={() => { setIsModalOpen(false); setEditingItem(null) }} 
                />
            )}

            {deleteItem && (
                <DeleteConfirmModal
                    title="Remove from Watchlist"
                    message={`Are you sure you want to remove "${deleteItem.title}"?`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteItem(null)}
                />
            )}
        </div>
    )
}