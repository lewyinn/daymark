import { useState } from "react"
import ImageLightbox from "../notes/ImageLightbox"

export default function NoteCard({ note, compact = false, onEdit, onDelete }) {
    const [selectedImage, setSelectedImage] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
    const formatTime = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
            <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-gray-800 mb-2 truncate flex-1">{note.title}</h3>
                    {/* Action buttons (Edit/Delete) */}
                    {!compact && (
                        <div className="flex gap-1">
                            {onEdit && <button onClick={() => onEdit(note)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>}
                            {onDelete && <button onClick={() => onDelete(note)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>}
                        </div>
                    )}
                </div>

                <p className={`text-sm text-gray-600 mb-3 ${compact ? 'line-clamp-2' : 'line-clamp-3'}`}>
                    {note.content}
                </p>

                {/* Image Grid Preview */}
                {note.images && note.images.length > 0 && (
                    <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                        {note.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img.url}
                                alt={`note-img-${idx}`}
                                onClick={() => setSelectedImage(img.url)}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                            />
                        ))}
                    </div>
                )}
            </div>

            {selectedImage && (
                <ImageLightbox
                    url={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}

            <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-auto pt-3 border-t border-gray-50">
                <span>{formatDate(note.createdAt)}</span>
                <span>•</span>
                <span>{formatTime(note.createdAt)}</span>
            </div>
        </div>
    )
}