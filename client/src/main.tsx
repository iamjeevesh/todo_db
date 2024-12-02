import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DashboardPage from './pages/dashboard.tsx'
import AuthPage from './pages/auth.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
<BrowserRouter>
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="dashboard" element={<DashboardPage />}>
        {/* <Route index element={<RecentActivity />} />
        <Route path="project/:id" element={<Project />} /> */}
      </Route>
    </Routes>
  </BrowserRouter>
  </StrictMode>,
)
