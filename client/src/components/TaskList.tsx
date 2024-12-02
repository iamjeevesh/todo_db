'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Mock data for tasks
const mockTasks = [
  { id: 1, title: 'Task 1', status: 'pending', priority: 'high' },
  { id: 2, title: 'Task 2', status: 'in-progress', priority: 'medium' },
]

export default function TaskList() {
  const [tasks, setTasks] = useState(mockTasks)
  const [newTask, setNewTask] = useState({ title: '', status: 'pending', priority: 'medium' })

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    const task = {
      id: tasks.length + 1,
      ...newTask,
    }
    setTasks([...tasks, task])
    setNewTask({ title: '', status: 'pending', priority: 'medium' })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddTask} className="mb-4 space-y-2">
          <Input
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <Select
            value={newTask.status}
            onValueChange={(value) => setNewTask({ ...newTask, status: value })}
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
            value={newTask.priority}
            onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
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
          <Button type="submit">Add Task</Button>
        </form>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="border p-2 rounded flex justify-between items-center">
              <span>{task.title}</span>
              <div className="space-x-2">
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{task.status}</span>
                <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{task.priority}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

