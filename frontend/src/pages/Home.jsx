import { useApp } from '../context/AppContext';

export default function Home() {
  const { displayName, theme } = useApp();

  return (
    <div className="home-page">
      <h1>Xin chào, {displayName || 'bạn'}! 👋</h1>
      <p>Đây là trang chủ của hệ thống quản lý ghi chú.</p>
      <p>Theme hiện tại: <strong>{theme === 'dark' ? 'Tối' : 'Sáng'}</strong></p>
    </div>
  );
}