export default function CalendarWidget({ todayTasks }) {
    const today = new Date()
    // Opsi format tanggal
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' })
    const dateNum = today.getDate()
    const monthName = today.toLocaleDateString('en-US', { month: 'short' })
    const year = today.getFullYear()

    return (
        <div className="relative overflow-hidden rounded-[2rem] shadow-2xl group transition-all duration-300 hover:shadow-teal-200/50">
            {/* 1. Background Gradient & Decorative Blobs */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#28C3B0] to-teal-600"></div>

            {/* Dekorasi lingkaran (Glow effect) */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-800/20 rounded-full blur-3xl"></div>

            {/* 2. Main Content Wrapper */}
            <div className="relative p-6 text-white h-full flex flex-col justify-between">

                {/* Header: Date & Task Counter */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium opacity-80 uppercase tracking-wider">{monthName} {year}</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold tracking-tighter">{dateNum}</span>
                            <span className="text-xl font-medium opacity-90">{dayName}</span>
                        </div>
                    </div>

                    {/* Badge Counter Modern */}
                    <div className="flex flex-col items-end">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-inner">
                            <span className="text-xl font-bold">{todayTasks.length}</span>
                        </div>
                        <span className="text-[10px] font-medium mt-1 opacity-80">Tasks Left</span>
                    </div>
                </div>

                {/* Divider Halus */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-5"></div>

                {/* 3. Task List Section */}
                <div className="flex-1">
                    {todayTasks.length > 0 ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-medium opacity-70 mb-2 px-1">
                                <span>UP NEXT</span>
                                <span>See all</span>
                            </div>

                            {todayTasks.slice(0, 2).map((task, index) => (
                                <div
                                    key={task.id || index}
                                    className="group/item flex items-start gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-xl p-3 transition-all duration-200 cursor-pointer"
                                >
                                    {/* Custom Checkbox UI */}
                                    <div className="mt-1 min-w-[16px] h-4 rounded-full border-2 border-white/40 group-hover/item:border-[#28C3B0] group-hover/item:bg-white transition-colors"></div>

                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold truncate pr-2">{task.title}</div>
                                        {task.description && (
                                            <div className="text-xs text-white/70 truncate mt-0.5 font-light">
                                                {task.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Indicator jika ada lebih banyak task */}
                            {todayTasks.length > 2 && (
                                <div className="text-center pt-1">
                                    <span className="inline-block px-3 py-1 rounded-full bg-black/10 text-[10px] font-medium backdrop-blur-sm">
                                        +{todayTasks.length - 2} more tasks hidden
                                    </span>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Empty State yang Aesthetic */
                        <div className="flex flex-col items-center justify-center py-2 text-center h-full min-h-[120px]">
                            <div className="w-12 h-12 mb-3 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-lg font-bold">All caught up!</p>
                            <p className="text-xs text-white/70 max-w-[150px] leading-relaxed mt-1">
                                Enjoy your free time or plan ahead for tomorrow.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}