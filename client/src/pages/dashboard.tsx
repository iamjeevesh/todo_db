import DashboardHeader from '@/components/DashboardHeader'
import ProjectList from '@/components/ProjectList'
import TaskList from '@/components/TaskList'


export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProjectList />
          <TaskList />
        </div>
      </main>
    </div>
  )
}

