export default function MovieCard({ movie, compact = false, onEdit, onDelete }) {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'watching': return 'bg-blue-100 text-blue-700'
            case 'completed': return 'bg-green-100 text-green-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const getProgress = () => {
        if (movie.status !== 'watching') return 0
        
        // Untuk Series, progress bar menunjukkan progress episode dalam satu season
        if (movie.type === 'series') {
            if (!movie.currentEpisode || !movie.totalEpisodes) return 0
            return Math.min(100, Math.round((movie.currentEpisode / movie.totalEpisodes) * 100))
        } else {
            // Untuk Movie, progress bar menunjukkan durasi menit
            if (!movie.lastWatchedMinute || !movie.totalMinutes) return 0
            return Math.min(100, Math.round((movie.lastWatchedMinute / movie.totalMinutes) * 100))
        }
    }

    const progressPercent = getProgress()

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group relative flex flex-col h-full">
            <div className="flex items-start gap-3 flex-1">
                {/* Icon Type */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${movie.type === 'series' ? 'bg-purple-100 text-purple-600' : 'bg-teal-100 text-teal-600'}`}>
                    {movie.type === 'series' ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-gray-800 text-base truncate w-full">{movie.title}</h3>
                        <div className="flex gap-2">
                             <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${getStatusBadge(movie.status)}`}>
                                {movie.status.replace(/-/g, ' ')}
                            </span>
                        </div>
                    </div>

                    {/* Info Series/Movie Details */}
                    {movie.status === 'watching' && (
                        <div className="mt-3 mb-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1 font-medium">
                                <span>
                                    {movie.type === 'series' 
                                        // Series: S1:E2 • 20m
                                        ? `S${movie.currentSeason}:Ep${movie.currentEpisode} ${movie.lastWatchedMinute ? `• ${movie.lastWatchedMinute}m` : ''}`
                                        // Movie: 45 min
                                        : `${movie.lastWatchedMinute} min`}
                                </span>
                                <span>
                                    {movie.type === 'series' 
                                        ? `${movie.totalEpisodes} eps` 
                                        : `${movie.totalMinutes} min`}
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${movie.type === 'series' ? 'bg-purple-500' : 'bg-[#28C3B0]'}`}
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Rating Section */}
                    {(movie.status === 'completed' || movie.rating > 0) && (
                        <div className="flex items-center gap-1 text-yellow-400 mt-2">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-3.5 h-3.5 ${i < movie.rating ? 'fill-current' : 'fill-gray-200 text-gray-200'}`} viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                    )}
                    
                    {/* Note Section (New) */}
                    {movie.note && (
                        <div className="mt-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-500 italic line-clamp-2">"{movie.note}"</p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Actions */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-lg p-1">
                {onEdit && (
                    <button onClick={() => onEdit(movie)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                )}
                {onDelete && (
                    <button onClick={() => onDelete(movie)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                )}
            </div>
        </div>
    )
}