import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Link } from 'react-router-dom'
import apiClient from '@/lib/client'

export default function ProjectList() {
  const [projects, setProjects] = useState([])
  const [newProject, setNewProject] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(true)

  // Fetch projects from the backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.get('/api/projects')
        setProjects(response.data)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // Add a new project
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await apiClient.post('/api/projects/create', newProject)
      setProjects([...projects, response.data])
      setNewProject({ name: '', description: '' })
    } catch (error) {
      console.error('Error adding project:', error)
    }
  }

  if (loading) return <p>Loading projects...</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-8">
          {projects.map((project) => (
            <li key={project.project_id} className="border p-2 rounded">
              <Link to={`/projects/${project.project_id}`} className="block hover:bg-gray-100 transition duration-150 ease-in-out">
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-sm text-gray-600">{project.description}</p>
              </Link>
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddProject} className="mt-8 space-y-6">
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
      </CardContent>
    </Card>
  )
}
