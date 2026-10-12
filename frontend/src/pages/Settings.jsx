import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { updateProfile } from '../services/api';

export default function Settings() {
  const {
    displayName, setDisplayName,
    theme, setTheme,
    primaryColor
  } = useApp();

  const [form, setForm] = useState({
    displayName: '',
    theme: 'light',
    password: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    setForm({
      displayName: displayName,
      theme: theme,
      password: ''
    });
  }, [displayName, theme]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await updateProfile({
        displayName: form.displayName,
        theme: form.theme,
        password: form.password
      });

      
      setDisplayName(form.displayName);
      setTheme(form.theme);

      setMessage({ type: 'success', text: 'Lưu cấu hình thành công!' });
      setForm({ ...form, password: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Lưu thất bại. Vui lòng thử lại.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-page">
      <h1>Cài đặt hệ thống</h1>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label>Tên hiển thị</label>
          <input
            type="text"
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            placeholder="Nhập tên hiển thị"
            required
          />
        </div>

        <div className="form-group">
          <label>Chế độ giao diện</label>
          <select name="theme" value={form.theme} onChange={handleChange}>
            <option value="light">Sáng (Light)</option>
            <option value="dark">Tối (Dark)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Mật khẩu riêng tư</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Để trống nếu không muốn đổi"
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </form>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}