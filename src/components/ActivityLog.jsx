import { format } from 'date-fns'

const ActivityLog = ({ activities }) => {
  const getActionIcon = (action) => {
    switch (action) {
      case 'Task created':
        return '➕'
      case 'Task edited':
        return '✏️'
      case 'Task moved':
        return '↔️'
      case 'Task deleted':
        return '🗑️'
      default:
        return '📝'
    }
  }

  const getActionColor = (action) => {
    switch (action) {
      case 'Task created':
        return 'bg-green-100 text-green-800'
      case 'Task edited':
        return 'bg-blue-100 text-blue-800'
      case 'Task moved':
        return 'bg-purple-100 text-purple-800'
      case 'Task deleted':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No activities yet</p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <span className="text-2xl">{getActionIcon(activity.action)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getActionColor(activity.action)}`}>
                    {activity.action}
                  </span>
                </div>
                <p className="text-sm text-gray-700 font-medium">{activity.taskTitle}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ActivityLog
