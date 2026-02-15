import { createContext, useContext, useState, useEffect } from 'react'

const TaskContext = createContext()

export const useTasks = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider')
  }
  return context
}

const STORAGE_KEY = 'taskBoardData'

const loadTasksFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      return {
        tasks: data.tasks || [],
        activityLog: data.activityLog || []
      }
    }
  } catch (error) {
    console.error('Error loading tasks from storage:', error)
  }
  return { tasks: [], activityLog: [] }
}

const saveTasksToStorage = (tasks, activityLog) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, activityLog }))
  } catch (error) {
    console.error('Error saving tasks to storage:', error)
  }
}

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])
  const [activityLog, setActivityLog] = useState([])

  useEffect(() => {
    const { tasks: loadedTasks, activityLog: loadedLog } = loadTasksFromStorage()
    setTasks(loadedTasks)
    setActivityLog(loadedLog)
  }, [])

  useEffect(() => {
    if (tasks.length > 0 || activityLog.length > 0) {
      saveTasksToStorage(tasks, activityLog)
    }
  }, [tasks, activityLog])

  const addActivityLog = (action, taskTitle, taskId) => {
    const logEntry = {
      id: Date.now(),
      action,
      taskTitle,
      taskId,
      timestamp: new Date().toISOString()
    }
    setActivityLog(prev => [logEntry, ...prev].slice(0, 50)) // Keep last 50 entries
  }

  const createTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || '',
      tags: taskData.tags || [],
      status: 'todo',
      createdAt: new Date().toISOString()
    }
    setTasks(prev => [...prev, newTask])
    addActivityLog('Task created', newTask.title, newTask.id)
    return newTask
  }

  const updateTask = (taskId, updates) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId)
      if (!task) return prev
      
      const updated = prev.map(t => 
        t.id === taskId ? { ...t, ...updates } : t
      )
      
      if (updates.status && updates.status !== task.status) {
        addActivityLog('Task moved', task.title, taskId)
      } else if (updates.title !== task.title || updates.description !== task.description) {
        addActivityLog('Task edited', updates.title || task.title, taskId)
      }
      
      return updated
    })
  }

  const deleteTask = (taskId) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId)
      if (task) {
        addActivityLog('Task deleted', task.title, taskId)
      }
      return prev.filter(t => t.id !== taskId)
    })
  }

  const moveTask = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus })
  }

  const resetBoard = () => {
    setTasks([])
    setActivityLog([])
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = {
    tasks,
    activityLog,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    resetBoard
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
