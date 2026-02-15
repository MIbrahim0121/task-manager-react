import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../context/TaskContext'
import TaskColumn from '../components/TaskColumn'
import TaskModal from '../components/TaskModal'
import ActivityLog from '../components/ActivityLog'

const TaskBoard = () => {
  const { logout } = useAuth()
  const { tasks, moveTask, activityLog, resetBoard } = useTasks()
  const [selectedTask, setSelectedTask] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, targetStatus) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('taskId')
    if (taskId) {
      moveTask(taskId, targetStatus)
    }
  }

  const handleCreateTask = () => {
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleResetBoard = () => {
    if (showResetConfirm) {
      resetBoard()
      setShowResetConfirm(false)
    } else {
      setShowResetConfirm(true)
    }
  }

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    // Sort by due date (empty values last)
    filtered = [...filtered].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate) - new Date(b.dueDate)
    })

    return filtered
  }, [tasks, searchQuery, priorityFilter])

  const todoTasks = filteredAndSortedTasks.filter(t => t.status === 'todo')
  const doingTasks = filteredAndSortedTasks.filter(t => t.status === 'doing')
  const doneTasks = filteredAndSortedTasks.filter(t => t.status === 'done')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handleResetBoard}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                {showResetConfirm ? 'Confirm Reset' : 'Reset Board'}
              </button>
              {showResetConfirm && (
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Tasks
              </label>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="md:w-48">
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Priority
              </label>
              <select
                id="priority"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleCreateTask}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition transform hover:scale-105 active:scale-95 font-semibold"
              >
                + New Task
              </button>
            </div>
          </div>
        </div>

        {/* Task Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <TaskColumn
            title="Todo"
            status="todo"
            tasks={todoTasks}
            onEdit={handleEditTask}
            onDrop={(e) => handleDrop(e, 'todo')}
            onDragOver={handleDragOver}
          />
          <TaskColumn
            title="Doing"
            status="doing"
            tasks={doingTasks}
            onEdit={handleEditTask}
            onDrop={(e) => handleDrop(e, 'doing')}
            onDragOver={handleDragOver}
          />
          <TaskColumn
            title="Done"
            status="done"
            tasks={doneTasks}
            onEdit={handleEditTask}
            onDrop={(e) => handleDrop(e, 'done')}
            onDragOver={handleDragOver}
          />
        </div>

        {/* Activity Log */}
        <ActivityLog activities={activityLog} />
      </div>

      {/* Task Modal */}
      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedTask(null)
        }}
      />
    </div>
  )
}

export default TaskBoard
