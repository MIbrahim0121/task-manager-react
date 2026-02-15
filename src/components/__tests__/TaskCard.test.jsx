import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import TaskCard from '../TaskCard'
import { TaskProvider } from '../../context/TaskContext'

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'This is a test task',
  priority: 'high',
  dueDate: '2024-12-31',
  tags: ['urgent', 'important'],
  status: 'todo',
  createdAt: '2024-01-01T00:00:00.000Z'
}

const renderWithProvider = (component) => {
  return render(
    <TaskProvider>
      {component}
    </TaskProvider>
  )
}

describe('TaskCard', () => {
  it('renders task title', () => {
    const mockOnEdit = vi.fn()
    renderWithProvider(<TaskCard task={mockTask} onEdit={mockOnEdit} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('renders task description', () => {
    const mockOnEdit = vi.fn()
    renderWithProvider(<TaskCard task={mockTask} onEdit={mockOnEdit} />)
    expect(screen.getByText('This is a test task')).toBeInTheDocument()
  })

  it('renders priority badge', () => {
    const mockOnEdit = vi.fn()
    renderWithProvider(<TaskCard task={mockTask} onEdit={mockOnEdit} />)
    expect(screen.getByText('high')).toBeInTheDocument()
  })

  it('renders tags', () => {
    const mockOnEdit = vi.fn()
    renderWithProvider(<TaskCard task={mockTask} onEdit={mockOnEdit} />)
    expect(screen.getByText('urgent')).toBeInTheDocument()
    expect(screen.getByText('important')).toBeInTheDocument()
  })
})
