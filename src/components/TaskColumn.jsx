import TaskCard from './TaskCard'

const TaskColumn = ({ title, status, tasks, onEdit, onDrop, onDragOver }) => {
  const taskCount = tasks.length

  return (
    <div
      className="flex-1 bg-gray-50 rounded-lg p-4 min-h-[600px]"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">{title}</h2>
        <span className="text-sm text-gray-500">({taskCount} tasks)</span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} />
        ))}
        {tasks.length === 0 && (
          <div className="text-center text-gray-400 py-8 text-sm">
            No tasks in this column
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskColumn
