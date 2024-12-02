'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

// Mock data for projects
const mockProjects = [
  { id: 1, name: 'Project A', description: 'Description for Project A' },
  { id: 2, name: 'Project B', description: 'Description for Project B' },
]

export default function ProjectList() {
  const [projects, setProjects] = useState(mockProjects)
  const [newProject, setNewProject] = useState({ name: '', description: '' })

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault()
    const project = {
      id: projects.length + 1,
      ...newProject,
    }
    setProjects([...projects, project])
    setNewProject({ name: '', description: '' })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddProject} className="mb-4 space-y-2">
          <Input
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            required
          />
          <Textarea
            placeholder="Project Description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />
          <Button type="submit">Add Project</Button>
        </form>
        <ul className="space-y-2">
          {projects.map((project) => (
            <li key={project.id} className="border p-2 rounded">
              <h3 className="font-semibold">{project.name}</h3>
              <p className="text-sm text-gray-600">{project.description}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

