// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BuilderPage from './pages/BuilderPage';
import DashboardPage from './pages/DashboardPage.tsx';
import WebsiteManagePage from './pages/WebsiteManagePage.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/website/:id" element={<WebsiteManagePage />} />
        <Route path="/builder" element={<BuilderPage />} />
      </Routes>
    </BrowserRouter>
  );
}