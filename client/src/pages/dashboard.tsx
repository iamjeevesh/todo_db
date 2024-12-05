import DashboardHeader from '@/components/DashboardHeader'
import ProjectList from '@/components/ProjectList'


export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ProjectList />
      </main>
    </div>
  )
}

