'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import Alert from '@/components/Alert'
import DeleteConfirmModal from '@/components/DeleteConfimModal'
import TaskCard from '@/components/home/TaskCard'
import TaskModal from '@/components/tasks/TaskModal'

export default function TasksPage() {
    const { data: session, status } = useSession()
    const user = session?.user || { name: 'Guest', email: '' }

    // State Data Real
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)

    // States UI
    const [activeTab, setActiveTab] = useState('pending')
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTask, setEditingTask] = useState(null)
    const [deleteTask, setDeleteTask] = useState(null)
    const [alert, setAlert] = useState(null)

    // 1. Fetch Data
    useEffect(() => {
        if (status === 'authenticated') {
            fetchTasks()
        }
    }, [status])

    const fetchTasks = async () => {
        try {
            const res = await fetch('/api/tasks')
            if (res.ok) {
                const data = await res.json()
                const formattedData = data.map(t => ({ ...t, id: t._id })) // Mapping _id ke id
                setTasks(formattedData)
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error)
        } finally {
            setLoading(false)
        }
    }

    const showAlert = (type, message) => {
        setAlert({ type, message })
        setTimeout(() => setAlert(null), 3000)
    }

    // 2. Handle Save (Create & Update)
    const handleSave = async (taskData) => {
        try {
            if (editingTask) {
                // === UPDATE (PUT) ===
                const res = await fetch(`/api/tasks/${editingTask.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData),
                })

                if (res.ok) {
                    const updatedTask = await res.json()
                    // Update state lokal biar UI responsif
                    setTasks(tasks.map(t => t.id === editingTask.id ? { ...updatedTask, id: updatedTask._id } : t))
                    showAlert('success', 'Task updated successfully!')
                }
            } else {
                // === CREATE (POST) ===
                const res = await fetch('/api/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...taskData, status: 'pending' }), // Default status
                })

                if (res.ok) {
                    const newTask = await res.json()
                    setTasks([...tasks, { ...newTask, id: newTask._id }])
                    showAlert('success', 'Task created successfully!')
                }
            }
        } catch (error) {
            showAlert('error', 'Something went wrong.')
        } finally {
            setIsModalOpen(false)
            setEditingTask(null)
        }
    }

    // 3. Handle Delete
    const handleDeleteConfirm = async () => {
        try {
            const res = await fetch(`/api/tasks/${deleteTask.id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                setTasks(tasks.filter(t => t.id !== deleteTask.id))
                showAlert('success', 'Task deleted successfully!')
            }
        } catch (error) {
            showAlert('error', 'Failed to delete task')
        } finally {
            setDeleteTask(null)
        }
    }

    // 4. Handle Status Toggle (Pending <-> Completed)
    const handleToggleComplete = async (task) => {
        const newStatus = task.status === 'pending' ? 'completed' : 'pending'

        // Optimistic Update (Update UI dulu biar cepet)
        setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t))

        try {
            // Update Server
            const res = await fetch(`/api/tasks/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            })

            if (!res.ok) {
                throw new Error('Failed to update status')
            }

            if (newStatus === 'completed') {
                showAlert('success', 'Task completed! Great job! 🎉')
            } else {
                showAlert('info', 'Task marked as pending')
            }
        } catch (error) {
            // Revert jika gagal (Rollback UI)
            setTasks(tasks.map(t => t.id === task.id ? { ...t, status: task.status } : t))
            showAlert('error', 'Failed to update status')
        }
    }

    // --- LOGIC UI (Filter & Stats) ---
    const filteredTasks = tasks.filter(task => {
        const matchesTab = task.status === activeTab
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesTab && matchesSearch
    })

    // Sort: Pending tasks sort by deadline (urgent first), Completed sort by deadline (newest first)
    filteredTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))

    const stats = {
        pending: tasks.filter(t => t.status === 'pending').length,
        overdue: tasks.filter(t => {
            const isOver = new Date(t.deadline) < new Date()
            return t.status === 'pending' && isOver
        }).length,
        completed: tasks.filter(t => t.status === 'completed').length
    }

    if (status === 'loading' || loading) {
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-gray-500">Loading your tasks...</div>
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-32">
            <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">

                <Header user={user} pageTitle="Tasks" />

                {alert && <Alert type={alert.type} message={alert.message} />}

                {/* Stats Banner */}
                <div className="grid grid-cols-3 gap-3 mt-6 mb-8">
                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl">
                        <span className="text-2xl font-bold text-orange-600">{stats.pending}</span>
                        <div className="text-xs text-orange-800 font-medium">To Do</div>
                    </div>
                    <div className="bg-red-50 border border-red-100 p-4 rounded-2xl">
                        <span className="text-2xl font-bold text-red-600">{stats.overdue}</span>
                        <div className="text-xs text-red-800 font-medium">Overdue</div>
                    </div>
                    <div className="bg-green-50 border border-green-100 p-4 rounded-2xl">
                        <span className="text-2xl font-bold text-green-600">{stats.completed}</span>
                        <div className="text-xs text-green-800 font-medium">Done</div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-4 sticky top-0 z-20 bg-slate-50/95 backdrop-blur-sm py-2">
                    {/* Tabs */}
                    <div className="flex p-1 bg-white rounded-xl border border-gray-200 w-full sm:w-fit">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`flex-1 sm:flex-none px-8 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'pending'
                                ? 'bg-[#28C3B0] text-white shadow-md shadow-teal-200'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            To Do
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={`flex-1 sm:flex-none px-8 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'completed'
                                ? 'bg-green-500 text-white shadow-md shadow-green-200'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            Completed
                        </button>
                    </div>

                    {/* Search & Add */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                        <div className="relative w-full sm:max-w-md group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#28C3B0]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border text-gray-600 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#28C3B0]/50 focus:border-[#28C3B0] shadow-sm"
                            />
                        </div>

                        <button
                            onClick={() => { setEditingTask(null); setIsModalOpen(true) }}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#28C3B0] to-teal-600 text-white rounded-2xl font-semibold shadow-lg shadow-teal-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            <span>Add Task</span>
                        </button>
                    </div>
                </div>

                {/* Task List */}
                <div className="mt-6 space-y-4">
                    {filteredTasks.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4 opacity-30">✨</div>
                            <h3 className="text-lg font-bold text-gray-600">
                                {activeTab === 'pending' ? 'No pending tasks' : 'No completed tasks yet'}
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">
                                {activeTab === 'pending' ? 'Enjoy your free time!' : 'Finish some tasks to see them here.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {filteredTasks.map(task => (
                                <div key={task.id} className="relative group">
                                    <div className="flex items-start gap-3">
                                        <button
                                            onClick={() => handleToggleComplete(task)}
                                            className={`mt-6 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.status === 'completed'
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : 'bg-white border-gray-300 hover:border-[#28C3B0]'
                                                }`}
                                        >
                                            {task.status === 'completed' && (
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            )}
                                        </button>

                                        <div className="flex-1 min-w-0">
                                            <TaskCard
                                                task={task}
                                                onEdit={(t) => { setEditingTask(t); setIsModalOpen(true) }}
                                                onDelete={(t) => setDeleteTask(t)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* Modals */}
            {isModalOpen && (
                <TaskModal
                    task={editingTask}
                    onSave={handleSave}
                    onClose={() => { setIsModalOpen(false); setEditingTask(null) }}
                />
            )}

            {deleteTask && (
                <DeleteConfirmModal
                    title="Delete Task"
                    message={`Are you sure you want to delete "${deleteTask.title}"?`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTask(null)}
                />
            )}
        </div>
    )
}