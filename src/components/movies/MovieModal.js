'use client'

import { useState, useEffect } from 'react'

export default function MovieModal({ item, onSave, onClose }) {
    const [formData, setFormData] = useState({
        title: '',
        type: 'movie', 
        status: 'plan-to-watch', 
        rating: 0,
        note: '', // Catatan
        
        // Movie specifics
        totalMinutes: 120,
        lastWatchedMinute: 0,
        
        // Series specifics
        currentSeason: 1,
        currentEpisode: 1,
        totalEpisodes: 12
    })

    useEffect(() => {
        if (item) {
            setFormData({
                title: item.title || '',
                type: item.type || 'movie',
                status: item.status || 'plan-to-watch',
                rating: item.rating || 0,
                note: item.note || '',
                
                totalMinutes: item.totalMinutes || 120,
                lastWatchedMinute: item.lastWatchedMinute || 0,
                
                currentSeason: item.currentSeason || 1,
                currentEpisode: item.currentEpisode || 1,
                totalEpisodes: item.totalEpisodes || 12
            })
        }
    }, [item])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.title.trim()) {
            alert('Please enter a title')
            return
        }
        onSave(formData)
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-[#28C3B0] to-teal-600 px-6 py-4 flex items-center justify-between shrink-0">
                    <h2 className="text-xl font-bold text-white tracking-wide">
                        {item ? 'Edit Media' : 'Add New Media'}
                    </h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-5">
                        
                        {/* Type Selection */}
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'movie' })}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                                    formData.type === 'movie' 
                                    ? 'bg-white text-[#28C3B0] shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Movie
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'series' })}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                                    formData.type === 'series' 
                                    ? 'bg-white text-[#28C3B0] shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Series
                            </button>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border text-gray-600 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#28C3B0]"
                                placeholder={formData.type === 'movie' ? "e.g. Dune: Part Two" : "e.g. Breaking Bad"}
                                required
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border text-gray-600 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#28C3B0] bg-white"
                            >
                                <option value="plan-to-watch">Plan to Watch</option>
                                <option value="watching">Watching</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        {/* Progress Fields (Conditional) */}
                        {formData.status === 'watching' && (
                            <div className="bg-[#28C3B0]/5 border border-[#28C3B0]/20 rounded-xl p-4 space-y-4 animate-fade-in">
                                <h4 className="text-sm font-bold text-teal-800 uppercase tracking-wider">Current Progress</h4>
                                
                                {formData.type === 'movie' ? (
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs font-medium text-gray-500 mb-1 block">Watched (mins)</label>
                                            <input
                                                type="number"
                                                value={formData.lastWatchedMinute}
                                                onChange={(e) => setFormData({ ...formData, lastWatchedMinute: parseInt(e.target.value) || 0 })}
                                                className="w-full px-3 py-2 rounded-lg border text-gray-600 border-gray-200 focus:ring-2 focus:ring-[#28C3B0]"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs font-medium text-gray-500 mb-1 block">Total (mins)</label>
                                            <input
                                                type="number"
                                                value={formData.totalMinutes}
                                                onChange={(e) => setFormData({ ...formData, totalMinutes: parseInt(e.target.value) || 0 })}
                                                className="w-full px-3 py-2 rounded-lg border text-gray-600 border-gray-200 focus:ring-2 focus:ring-[#28C3B0]"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Series: Season & Episode */}
                                        <div className="flex gap-3">
                                            <div className="w-24">
                                                <label className="text-xs font-medium text-gray-500 mb-1 block">Season</label>
                                                <input
                                                    type="number"
                                                    value={formData.currentSeason}
                                                    onChange={(e) => setFormData({ ...formData, currentSeason: parseInt(e.target.value) || 1 })}
                                                    className="w-full px-3 py-2 rounded-lg border text-gray-600 border-gray-200 focus:ring-2 focus:ring-[#28C3B0] text-center"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs font-medium text-gray-500 mb-1 block">Episode</label>
                                                <div className="flex items-center gap-2">
                                                    <button type="button" onClick={() => setFormData(prev => ({...prev, currentEpisode: Math.max(1, prev.currentEpisode - 1)}))} className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold">-</button>
                                                    <input
                                                        type="number"
                                                        value={formData.currentEpisode}
                                                        onChange={(e) => setFormData({ ...formData, currentEpisode: parseInt(e.target.value) || 1 })}
                                                        className="flex-1 px-3 py-2 rounded-lg border text-gray-600 border-gray-200 focus:ring-2 focus:ring-[#28C3B0] text-center font-bold"
                                                    />
                                                    <button type="button" onClick={() => setFormData(prev => ({...prev, currentEpisode: prev.currentEpisode + 1}))} className="w-10 h-10 rounded-lg bg-[#28C3B0]/10 hover:bg-[#28C3B0]/20 text-[#28C3B0] font-bold">+</button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Series: Timestamp & Total Eps in Season */}
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                 <label className="text-xs font-medium text-gray-500 mb-1 block">Watched (mins)</label>
                                                 <input
                                                    type="number"
                                                    value={formData.lastWatchedMinute}
                                                    onChange={(e) => setFormData({ ...formData, lastWatchedMinute: parseInt(e.target.value) || 0 })}
                                                    className="w-full px-3 py-2 rounded-lg border text-gray-600 border-gray-200 focus:ring-2 focus:ring-[#28C3B0]"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                 <label className="text-xs font-medium text-gray-500 mb-1 block">Eps in Season</label>
                                                 <input
                                                    type="number"
                                                    value={formData.totalEpisodes}
                                                    onChange={(e) => setFormData({ ...formData, totalEpisodes: parseInt(e.target.value) || 1 })}
                                                    className="w-full px-3 py-2 rounded-lg border text-gray-600 border-gray-200 focus:ring-2 focus:ring-[#28C3B0]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Rating */}
                        {(formData.status === 'completed' || formData.status === 'watching') && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                                star <= formData.rating 
                                                ? 'bg-yellow-100 text-yellow-500 scale-110' 
                                                : 'bg-gray-50 text-gray-300 hover:bg-gray-100'}`}>
                                            <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notes (Optional) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Notes <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <textarea
                                rows={3}
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border text-gray-600 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#28C3B0] resize-none"
                                placeholder="Write your thoughts..."
                            />
                        </div>

                    </div>

                    <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#28C3B0] to-teal-600 text-white font-medium shadow-lg shadow-teal-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}