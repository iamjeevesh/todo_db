import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DashboardPage from './pages/dashboard.tsx'
import AuthPage from './pages/auth.tsx'
import ProjectPage from './pages/project-detail.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="projects/:id" element={<ProjectPage />} />
    </Routes>
  </BrowserRouter>
  </StrictMode>,
)
