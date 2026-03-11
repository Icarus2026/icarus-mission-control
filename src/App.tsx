import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import TasksBoard from './views/TasksBoard';
import FleetPage from './views/FleetPage';
import ResearchPage from './views/ResearchPage';
import ContentPipeline from './views/ContentPipeline';
import CalendarView from './views/Calendar';
import MemoryView from './views/Memory';
import AITeam from './views/AITeam';
import CRMView from './views/CRM';
import SettingsView from './views/Settings';
import ProjectsView from './views/Projects';



function Login({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Icarus2026') {
      localStorage.setItem('icarus_auth', 'Icarus2026');
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
        <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Mission Control</h1>
        <p className="text-secondary" style={{ textAlign: 'center', fontSize: '0.9rem' }}>Enter clearance code to access terminal.</p>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            placeholder="Passcode"
            style={{
              width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
              background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-light)',
              color: 'var(--text-primary)', outline: 'none'
            }}
            autoFocus
          />
          {error && <span style={{ color: 'var(--accent-mick)', fontSize: '0.8rem' }}>Invalid clearance code.</span>}
          <button
            type="submit"
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '8px',
              background: 'var(--accent-icarus)', color: 'white',
              fontWeight: 600, border: 'none', cursor: 'pointer'
            }}
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('icarus_auth') === 'Icarus2026');

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<TasksBoard />} />
          <Route path="/fleet" element={<FleetPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/pipeline" element={<ContentPipeline />} />
          <Route path="/projects" element={<ProjectsView />} />
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
