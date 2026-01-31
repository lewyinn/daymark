'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import NoteCard from '@/components/home/NoteCard'
import NoteModal from '@/components/notes/NoteModal'
import Alert from '@/components/Alert'
import DeleteConfirmModal from '@/components/DeleteConfimModal'

export default function NotesPage() {
    const { data: session, status } = useSession()
    const user = session?.user || { name: 'Guest', email: '' }

    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingNote, setEditingNote] = useState(null)
    const [deleteNote, setDeleteNote] = useState(null)
    const [alert, setAlert] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')

    // 1. Fetch Notes
    useEffect(() => {
        if (status === 'authenticated') {
            fetchNotes()
        }
    }, [status])

    const fetchNotes = async () => {
        try {
            const res = await fetch('/api/notes')
            if (res.ok) {
                const data = await res.json()
                const formatted = data.map(n => ({ ...n, id: n._id }))
                setNotes(formatted)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const showAlert = (type, message) => {
        setAlert({ type, message })
        setTimeout(() => setAlert(null), 3000)
    }

    // 2. Handle Save (Menerima FormData dari Modal)
    const handleSave = async (formData) => {
        try {
            if (editingNote) {
                // Update (PUT)
                // Note: FormData tidak perlu header 'Content-Type', browser yang atur boundary
                const res = await fetch(`/api/notes/${editingNote.id}`, {
                    method: 'PUT',
                    body: formData,
                })

                if (res.ok) {
                    const updated = await res.json()
                    setNotes(notes.map(n => n.id === editingNote.id ? { ...updated, id: updated._id } : n))
                    showAlert('success', 'Note updated!')
                }
            } else {
                // Create (POST)
                const res = await fetch('/api/notes', {
                    method: 'POST',
                    body: formData,
                })

                if (res.ok) {
                    const newNote = await res.json()
                    setNotes([{ ...newNote, id: newNote._id }, ...notes])
                    showAlert('success', 'Note created!')
                }
            }
        } catch (error) {
            showAlert('error', 'Something went wrong')
        } finally {
            setIsModalOpen(false)
            setEditingNote(null)
        }
    }

    // 3. Handle Delete
    const handleDeleteConfirm = async () => {
        try {
            const res = await fetch(`/api/notes/${deleteNote.id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                setNotes(notes.filter(n => n.id !== deleteNote.id))
                showAlert('success', 'Note deleted!')
            }
        } catch (error) {
            showAlert('error', 'Failed to delete')
        } finally {
            setDeleteNote(null)
        }
    }

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (status === 'loading' || loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading notes...</div>

    return (
        <div className="min-h-screen bg-slate-50/50 pb-32">
            <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
                <Header user={user} pageTitle="Notes" />
                {alert && <Alert type={alert.type} message={alert.message} />}

                {/* Search & Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-md group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#28C3B0]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 text-gray-600 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#28C3B0]/50"
                        />
                    </div>
                    <button
                        onClick={() => { setEditingNote(null); setIsModalOpen(true) }}
                        className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#28C3B0] to-teal-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        <span>New Note</span>
                    </button>
                </div>

                {/* Grid */}
                <div className="mt-8">
                    {filteredNotes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-4xl">📝</div>
                            <h3 className="text-xl font-bold text-gray-600">No notes found</h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredNotes.map(note => (
                                <NoteCard
                                    key={note.id}
                                    note={note}
                                    onEdit={(n) => { setEditingNote(n); setIsModalOpen(true) }}
                                    onDelete={(n) => setDeleteNote(n)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <NoteModal
                    note={editingNote}
                    onSave={handleSave}
                    onClose={() => { setIsModalOpen(false); setEditingNote(null) }}
                />
            )}

            {deleteNote && (
                <DeleteConfirmModal
                    title="Delete Note"
                    message={`Are you sure? Images will also be deleted permanently.`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteNote(null)}
                />
            )}
        </div>
    )
}