import { Button } from '@/components/ui/button'

export default function DashboardHeader() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <Button variant="outline">Logout</Button>
      </div>
    </header>
  )
}

