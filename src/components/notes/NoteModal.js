'use client'

import { useState, useEffect, useRef } from 'react'

export default function NoteModal({ note, onSave, onClose }) {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    // existingImages: Gambar yg sudah ada di server (objek {url, publicId})
    const [existingImages, setExistingImages] = useState([])

    // newImages: File baru yg dipilih user (File object)
    const [newFiles, setNewFiles] = useState([])

    // previews: URL lokal untuk preview file baru
    const [newPreviews, setNewPreviews] = useState([])

    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef(null)

    useEffect(() => {
        if (note) {
            setTitle(note.title || '')
            setContent(note.content || '')
            setExistingImages(note.images || [])
        } else {
            // Reset form for create
            setTitle('')
            setContent('')
            setExistingImages([])
            setNewFiles([])
            setNewPreviews([])
        }
    }, [note])

    // Handle File Selection
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files)
        if (files.length > 0) {
            setNewFiles(prev => [...prev, ...files])

            // Create preview URLs
            const newUrls = files.map(file => URL.createObjectURL(file))
            setNewPreviews(prev => [...prev, ...newUrls])
        }
    }

    // Remove Existing Image (Tandai untuk dihapus di server nanti)
    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index))
    }

    // Remove New File (Belum diupload, hapus dari state aja)
    const removeNewFile = (index) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index))
        setNewPreviews(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim()) {
            alert('Please enter a title')
            return
        }

        setIsSubmitting(true)

        // Kita gunakan FormData karena ada file upload
        const formData = new FormData()
        formData.append('title', title)
        formData.append('content', content)

        // Kirim gambar lama yg masih dipertahankan sebagai JSON string
        formData.append('existingImages', JSON.stringify(existingImages))

        // Kirim file baru
        newFiles.forEach(file => {
            // Biar gampang, backend POST pakai 'images', PUT pakai 'newImages'
            const key = note ? 'newImages' : 'images';
            formData.append(key, file)
        })

        await onSave(formData) // Kirim FormData ke parent
        setIsSubmitting(false)
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">

                {/* Header */}
                <div className="bg-gradient-to-r from-[#28C3B0] to-teal-600 px-6 py-4 flex items-center justify-between shrink-0">
                    <h2 className="text-xl font-bold text-white tracking-wide">
                        {note ? 'Edit Note' : 'Create Note'}
                    </h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-5">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl text-gray-600 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#28C3B0]"
                                placeholder="Title..."
                                required
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-3 rounded-xl text-gray-600 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#28C3B0] resize-none"
                                placeholder="Write something..."
                            />
                        </div>

                        {/* Image Upload Area */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Images</label>

                            {/* Previews Grid */}
                            <div className="grid grid-cols-4 gap-3 mb-3">
                                {/* Existing Images */}
                                {existingImages.map((img, idx) => (
                                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                                        <img src={img.url} alt="existing" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(idx)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}

                                {/* New File Previews */}
                                {newPreviews.map((url, idx) => (
                                    <div key={`new-${idx}`} className="relative group aspect-square rounded-xl overflow-hidden border border-green-200">
                                        <img src={url} alt="preview" className="w-full h-full object-cover opacity-80" />
                                        <button
                                            type="button"
                                            onClick={() => removeNewFile(idx)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                        {/* Badge New */}
                                        <span className="absolute bottom-1 left-1 text-[10px] bg-green-500 text-white px-1.5 rounded">New</span>
                                    </div>
                                ))}

                                {/* Add Button */}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-[#28C3B0] hover:text-[#28C3B0] transition-colors bg-gray-50"
                                >
                                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    <span className="text-xs">Add Photo</span>
                                </button>
                            </div>

                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#28C3B0] to-teal-600 text-white font-medium shadow-lg shadow-teal-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 flex justify-center items-center gap-2">
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Processing...
                                </>
                            ) : (
                                note ? 'Save Changes' : 'Create Note'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}