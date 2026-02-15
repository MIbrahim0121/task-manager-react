import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { TaskProvider, useTasks } from '../TaskContext'

const wrapper = ({ children }) => <TaskProvider>{children}</TaskProvider>

describe('TaskContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates a task successfully', () => {
    const { result } = renderHook(() => useTasks(), { wrapper })

    act(() => {
      result.current.createTask({
        title: 'New Task',
        description: 'Test description',
        priority: 'high'
      })
    })

    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].title).toBe('New Task')
    expect(result.current.tasks[0].priority).toBe('high')
  })

  it('updates a task successfully', () => {
    const { result } = renderHook(() => useTasks(), { wrapper })

    let taskId
    act(() => {
      const task = result.current.createTask({
        title: 'Original Title',
        priority: 'low'
      })
      taskId = task.id
    })

    act(() => {
      result.current.updateTask(taskId, {
        title: 'Updated Title',
        priority: 'high'
      })
    })

    const updatedTask = result.current.tasks.find(t => t.id === taskId)
    expect(updatedTask.title).toBe('Updated Title')
    expect(updatedTask.priority).toBe('high')
  })

  it('deletes a task successfully', () => {
    const { result } = renderHook(() => useTasks(), { wrapper })

    let taskId
    act(() => {
      const task = result.current.createTask({
        title: 'Task to Delete'
      })
      taskId = task.id
    })

    expect(result.current.tasks).toHaveLength(1)

    act(() => {
      result.current.deleteTask(taskId)
    })

    expect(result.current.tasks).toHaveLength(0)
  })

  it('moves a task to different status', () => {
    const { result } = renderHook(() => useTasks(), { wrapper })

    let taskId
    act(() => {
      const task = result.current.createTask({
        title: 'Movable Task',
        status: 'todo'
      })
      taskId = task.id
    })

    act(() => {
      result.current.moveTask(taskId, 'doing')
    })

    const movedTask = result.current.tasks.find(t => t.id === taskId)
    expect(movedTask.status).toBe('doing')
  })

  it('adds activity log entry when task is created', () => {
    const { result } = renderHook(() => useTasks(), { wrapper })

    act(() => {
      result.current.createTask({
        title: 'Logged Task'
      })
    })

    expect(result.current.activityLog.length).toBeGreaterThan(0)
    expect(result.current.activityLog[0].action).toBe('Task created')
    expect(result.current.activityLog[0].taskTitle).toBe('Logged Task')
  })
})
