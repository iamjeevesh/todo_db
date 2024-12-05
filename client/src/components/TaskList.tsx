'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Pencil, Trash2 } from 'lucide-react'
import apiClient from '@/lib/client'

interface Task {
  id: number
  title: string
  description: string
  status: string
  priority: string
}

interface TaskListProps {
  projectId: number
}

export default function TaskList({ projectId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState<Task>({
    id: 0,
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
  })
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await apiClient.get(`/api/projects/${projectId}/tasks`)
        setTasks(response.data)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [projectId])

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await apiClient.post(`/api/projects/${projectId}/tasks/create`, newTask)
      setTasks([...tasks, response.data])
      setNewTask({
        id: 0,
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
      })
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTask) {
      try {
        await apiClient.put(`/api/projects/${projectId}/tasks/${editingTask.id}`, editingTask)
        setTasks(tasks.map((t) => (t.id === editingTask.id ? editingTask : t)))
        setEditingTask(null)
      } catch (error) {
        console.error('Error updating task:', error)
      }
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    try {
      await apiClient.delete(`/api/projects/${projectId}/tasks/${taskId}`)
      setTasks(tasks.filter((t) => t.id !== taskId))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  if (loading) return <p>Loading tasks...</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={editingTask ? handleUpdateTask : handleAddTask} className="mb-4 space-y-2">
         
          <Input
            placeholder="Task Title"
            value={editingTask ? editingTask.title : newTask.title}
            onChange={(e) =>
              editingTask
                ? setEditingTask({ ...editingTask, title: e.target.value })
                : setNewTask({ ...newTask, title: e.target.value })
            }
            required
          />
          <Textarea
            placeholder="Description"
            value={editingTask ? editingTask.description : newTask.description}
            onChange={(e) =>
              editingTask
                ? setEditingTask({ ...editingTask, description: e.target.value })
                : setNewTask({ ...newTask, description: e.target.value })
            }
          />
          <Select
            value={editingTask ? editingTask.status : newTask.status}
            onValueChange={(value) =>
              editingTask
                ? setEditingTask({ ...editingTask, status: value })
                : setNewTask({ ...newTask, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={editingTask ? editingTask.priority : newTask.priority}
            onValueChange={(value) =>
              editingTask
                ? setEditingTask({ ...editingTask, priority: value })
                : setNewTask({ ...newTask, priority: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">{editingTask ? 'Update Task' : 'Add Task'}</Button>
          {editingTask && (
            <Button type="button" variant="outline" onClick={() => setEditingTask(null)}>
              Cancel
            </Button>
          )}
        </form>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="border p-2 rounded flex justify-between items-center">
              <span>{task.title}</span>
              <div className="space-x-2 flex items-center">
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{task.status}</span>
                <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{task.priority}</span>
                <Button variant="ghost" size="icon" onClick={() => setEditingTask(task)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
