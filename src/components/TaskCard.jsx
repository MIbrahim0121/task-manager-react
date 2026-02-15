import { format } from 'date-fns'
import { useTasks } from '../context/TaskContext'

const TaskCard = ({ task, onEdit }) => {
  const { deleteTask } = useTasks()

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      deleteTask(task.id)
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 mb-3 cursor-move hover:shadow-lg transition-all duration-200 border-l-4 ${
        isOverdue ? 'border-red-500' : 'border-blue-500'
      }`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('taskId', task.id)
      }}
      onClick={() => onEdit(task)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 flex-1">{task.title}</h3>
        <button
          onClick={handleDelete}
          className="ml-2 text-gray-400 hover:text-red-600 transition"
          title="Delete task"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`px-2 py-1 text-xs font-medium rounded border ${priorityColors[task.priority] || priorityColors.medium}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className={`px-2 py-1 text-xs font-medium rounded ${isOverdue ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
            {format(new Date(task.dueDate), 'MMM dd, yyyy')}
          </span>
        )}
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        Created: {format(new Date(task.createdAt), 'MMM dd, yyyy')}
      </div>
    </div>
  )
}

export default TaskCard
