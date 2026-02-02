export default function MovieCard({ movie, compact = false }) {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'watching':
                return 'bg-blue-100 text-blue-700'
            case 'completed':
                return 'bg-green-100 text-green-700'
            case 'plan-to-watch':
                return 'bg-gray-100 text-gray-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    const getProgress = () => {
        if (movie.status === 'watching' && movie.lastWatchedMinute && movie.totalMinutes) {
            return Math.round((movie.lastWatchedMinute / movie.totalMinutes) * 100)
        }
        return 0
    }

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-semibold text-gray-800">{movie.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(movie.status)}`}>
                            {movie.status === 'watching' ? 'Watching' :
                                movie.status === 'completed' ? 'Completed' :
                                    'Plan to Watch'}
                        </span>
                    </div>

                    {movie.status === 'watching' && (
                        <div className="mb-2">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Progress</span>
                                {/* <span>{getProgress()}%</span> */}
                            </div>
                            <div className="">
                                {/* Episode dan Season */}
                                <p className="text-xs text-gray-500 mt-1">
                                    {movie.currentEpisode} Episode & Season {movie.currentSeason}
                                </p>
                                
                            </div>
                            <div className="mt-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                <p className="text-xs text-gray-500 italic line-clamp-2">"{movie.note}"</p>
                            </div>
                            {/* <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-[#28C3B0] to-[#28c357] h-2 rounded-full transition-all"
                                    style={{ width: `${getProgress()}%` }}
                                />
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {movie.lastWatchedMinute} / {movie.totalMinutes} minutes
                            </div> */}
                        </div>
                    )}

                    {movie.status === 'completed' && movie.rating && (
                        <div className="flex items-center gap-1 text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < movie.rating ? 'fill-current' : 'fill-gray-300'}`}
                                    viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                    )}
                </div>

                <div className="text-3xl">🎬</div>
            </div>
        </div>
    )
}