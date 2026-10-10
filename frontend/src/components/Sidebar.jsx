import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Sidebar() {
  const { displayName, theme } = useApp();

  return (
    <aside className={`sidebar ${theme}`}>
      <div className="sidebar-header">
        <h2>📝 Ghi chú</h2>
        <p className="user-name">{displayName || 'Chưa đặt tên'}</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          🏠 Trang chủ
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          ⚙️ Cài đặt
        </NavLink>
        <NavLink to="/private" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          🔒 Vùng kín
        </NavLink>
      </nav>
    </aside>
  );
}