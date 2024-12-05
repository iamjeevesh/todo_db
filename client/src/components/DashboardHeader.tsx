import { Button } from '@/components/ui/button'
import apiClient from '@/lib/client';
import { useNavigate } from 'react-router-dom';

export default function DashboardHeader() {
    const navigate = useNavigate();

    async function handleLogout() {
        await apiClient.post('/api/users/logout');
        navigate('/', {replace: true});
    }
    
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
    </header>
  )
}

