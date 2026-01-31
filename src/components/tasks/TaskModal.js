'use client'

import { useState, useEffect } from 'react'

export default function TaskModal({ task, onSave, onClose }) {
    // Default state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadlineDate: new Date().toISOString().split('T')[0], // Default today
        deadlineTime: '09:00',
        priority: 'medium', // low, medium, high
        reminders: [] // Array of reminder objects
    })

    // Opsi Reminder Presets
    const reminderOptions = [
        { label: 'At time of event', value: 0 },
        { label: '10 minutes before', value: 10 },
        { label: '1 hour before', value: 60 },
        { label: '1 day before', value: 1440 },
    ]

    useEffect(() => {
        if (task) {
            // Memisahkan datetime string menjadi date & time untuk input HTML5
            const dateObj = new Date(task.deadline)
            const dateStr = dateObj.toISOString().split('T')[0]
            const timeStr = dateObj.toTimeString().slice(0, 5)

            setFormData({
                title: task.title || '',
                description: task.description || '',
                deadlineDate: dateStr,
                deadlineTime: timeStr,
                priority: task.priority || 'medium',
                reminders: task.reminders || []
            })
        }
    }, [task])

    const handleAddReminder = (minutes) => {
        const exists = formData.reminders.find(r => r === minutes)
        if (!exists && exists !== 0) {
            setFormData(prev => ({
                ...prev,
                reminders: [...prev.reminders, minutes].sort((a, b) => a - b)
            }))
        }
    }

    const handleRemoveReminder = (minutes) => {
        setFormData(prev => ({
            ...prev,
            reminders: prev.reminders.filter(r => r !== minutes)
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.title.trim()) {
            alert('Please enter a task title')
            return
        }

        // Gabungkan Date & Time menjadi ISO String
        const combinedDateTime = new Date(`${formData.deadlineDate}T${formData.deadlineTime}`)

        onSave({
            ...formData,
            deadline: combinedDateTime.toISOString()
        })
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">

                {/* Header */}
                <div className="bg-gradient-to-r from-[#28C3B0] to-teal-600 px-6 py-4 flex items-center justify-between shrink-0">
                    <h2 className="text-xl font-bold text-white tracking-wide">
                        {task ? 'Edit Task' : 'New Task'}
                    </h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-5">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Task Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border text-gray-600 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#28C3B0]"
                                placeholder="What needs to be done?"
                                required
                            />
                        </div>

                        {/* Date & Time Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={formData.deadlineDate}
                                    onChange={(e) => setFormData({ ...formData, deadlineDate: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border text-gray-600 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#28C3B0]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
                                <input
                                    type="time"
                                    value={formData.deadlineTime}
                                    onChange={(e) => setFormData({ ...formData, deadlineTime: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border text-gray-600 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#28C3B0]"
                                />
                            </div>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                            <div className="flex gap-3">
                                {['low', 'medium', 'high'].map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, priority: p })}
                                        className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize border transition-all ${formData.priority === p
                                                ? p === 'high' ? 'bg-red-50 border-red-200 text-red-600 ring-2 ring-red-500/50'
                                                    : p === 'medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-600 ring-2 ring-yellow-500/50'
                                                        : 'bg-green-50 border-green-200 text-green-600 ring-2 ring-green-500/50'
                                                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border text-gray-600 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#28C3B0] resize-none"
                                placeholder="Add details (optional)..."
                            />
                        </div>

                        {/* Flexible Reminders Section */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4 text-[#28C3B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                Reminders
                            </label>

                            {/* List of active reminders */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {formData.reminders.map((mins, idx) => (
                                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-blue-200 text-blue-600 rounded-full text-xs font-medium shadow-sm">
                                        {reminderOptions.find(o => o.value === mins)?.label || `${mins} mins before`}
                                        <button type="button" onClick={() => handleRemoveReminder(mins)} className="hover:text-red-500">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </span>
                                ))}
                                {formData.reminders.length === 0 && (
                                    <span className="text-xs text-gray-400 italic">No reminders set</span>
                                )}
                            </div>

                            {/* Add Reminder Dropdown */}
                            <select
                                onChange={(e) => {
                                    if (e.target.value !== "") {
                                        handleAddReminder(parseInt(e.target.value))
                                        e.target.value = "" // Reset select
                                    }
                                }}
                                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#28C3B0] bg-white text-gray-600"
                            >
                                <option value="">+ Add a reminder...</option>
                                {reminderOptions.map(opt => (
                                    <option
                                        key={opt.value}
                                        value={opt.value}
                                        disabled={formData.reminders.includes(opt.value)}
                                    >
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#28C3B0] to-teal-600 text-white font-medium shadow-lg shadow-teal-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                            Save Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}