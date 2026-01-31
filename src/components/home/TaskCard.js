export default function TaskCard({ task, compact = false, onEdit, onDelete }) {
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-700'
            case 'medium':
                return 'bg-yellow-100 text-yellow-700'
            case 'low':
                return 'bg-green-100 text-green-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    const isOverdue = () => {
        const today = new Date()
        const deadline = new Date(task.deadline)
        today.setHours(0, 0, 0, 0)
        deadline.setHours(0, 0, 0, 0)
        return deadline < today && task.status !== 'completed'
    }

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-semibold text-gray-800 truncate">{task.title}</h3>
                        {task.priority && (
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                            </span>
                        )}
                    </div>

                    {!compact && task.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className={isOverdue() ? 'text-red-600 font-medium' : ''}>
                                {formatDate(task.deadline)}
                                {isOverdue() && ' (Overdue)'}
                            </span>
                        </div>
                    </div>
                </div>

                {!compact && (
                    <div className="flex gap-2">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(task)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(task)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}