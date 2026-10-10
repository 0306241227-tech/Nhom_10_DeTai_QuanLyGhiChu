import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useApp } from '../context/AppContext';

export default function Layout() {
  const { theme, loading } = useApp();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: theme === 'dark' ? '#1a1a2e' : '#f5f5f5',
        color: theme === 'dark' ? '#fff' : '#333'
      }}>
        Đang tải...
      </div>
    );
  }

  return (
    <div className={`app-layout ${theme}`}>
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}