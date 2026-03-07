import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import TasksBoard from './views/TasksBoard';
import ContentPipeline from './views/ContentPipeline';
import CalendarView from './views/Calendar';
import MemoryView from './views/Memory';
import AITeam from './views/AITeam';
import CRMView from './views/CRM';
import SettingsView from './views/Settings';



function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<TasksBoard />} />
          <Route path="/pipeline" element={<ContentPipeline />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/memory" element={<MemoryView />} />
          <Route path="/ai-team" element={<AITeam />} />
          <Route path="/crm" element={<CRMView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
