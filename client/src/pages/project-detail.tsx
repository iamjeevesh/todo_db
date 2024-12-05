'use client'

import { useState, useEffect } from 'react'
import TaskList from '@/components/TaskList'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useParams } from 'react-router-dom'

// Mock data for projects
const mockProjects = [
  { id: 1, name: 'Project A', description: 'Description for Project A' },
  { id: 2, name: 'Project B', description: 'Description for Project B' },
]

export default function ProjectPage() {
  const params = useParams()
  const [project, setProject] = useState(null)

  useEffect(() => {
    // In a real application, you would fetch the project data from an API
    const projectId = parseInt(params.id as string)
    const foundProject = mockProjects.find(p => p.id === projectId)
    setProject(foundProject)
  }, [params.id])

  if (!project) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{project.description}</p>
        </CardContent>
      </Card>
      <TaskList projectId={project.id} />
    </div>
  )
}

