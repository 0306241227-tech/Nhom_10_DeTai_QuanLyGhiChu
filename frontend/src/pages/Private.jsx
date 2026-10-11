import { useState } from 'react';

const API_URL = 'http://localhost:3001/api';

export default function Private() {
  // ===== STATE =====
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ id: null, title: '', content: '' });
  const [loading, setLoading] = useState(false);

  // ===== AUTH =====
  const handleUnlock = async () => {
    if (!passwordInput.trim()) {
      alert('Vui lòng nhập mật khẩu');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/private/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();

      if (data.success) {
        setIsUnlocked(true);
        setPasswordInput('');
        fetchPrivateNotes();
      } else {
        alert(data.message || 'Sai mật khẩu');
        setPasswordInput('');
      }
    } catch (err) {
      alert('Không kết nối được server');
    }
  };

  // ===== CRUD =====
  const fetchPrivateNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/private/notes`);
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề');
      return;
    }

    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id
      ? `${API_URL}/private/notes/${formData.id}`
      : `${API_URL}/private/notes`;

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content
        })
      });
      setFormData({ id: null, title: '', content: '' });
      fetchPrivateNotes();
    } catch (err) {
      alert('Lưu thất bại');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa ghi chú này?')) return;
    try {
      await fetch(`${API_URL}/private/notes/${id}`, { method: 'DELETE' });
      fetchPrivateNotes();
    } catch (err) {
      alert('Xóa thất bại');
    }
  };

  const handleEdit = (note) => {
    setFormData({
      id: note.id,
      title: note.title,
      content: note.content
    });
  };

  const handleCancel = () => {
    setFormData({ id: null, title: '', content: '' });
  };

  // ===== RENDER: CHƯA MỞ KHÓA =====
  if (!isUnlocked) {
    return (
      <div className="private-page" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
      }}>
        <h1>🔒 Vùng kín</h1>
        <p style={{ marginBottom: 20, color: '#666' }}>
          Nhập mật khẩu để truy cập ghi chú riêng tư
        </p>
        <div style={{
          border: '1px solid #ccc',
          padding: 24,
          borderRadius: 12,
          width: 320,
          textAlign: 'center'
        }}>
          <input
            type="password"
            placeholder="Mật khẩu vùng kín"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            style={{
              display: 'block',
              width: '100%',
              padding: 10,
              marginBottom: 12,
              borderRadius: 6,
              border: '1px solid #ccc',
              boxSizing: 'border-box'
            }}
          />
          <button
            onClick={handleUnlock}
            style={{
              width: '100%',
              padding: 10,
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            Mở khóa
          </button>
        </div>
      </div>
    );
  }

  // ===== RENDER: ĐÃ MỞ KHÓA =====
  return (
    <div className="private-page">
      <h1>🔒 Ghi chú riêng tư</h1>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Dữ liệu này được bảo vệ bằng mật khẩu
      </p>

      {/* Form thêm / sửa */}
      <div style={{
        border: '1px solid #ccc',
        padding: 16,
        marginBottom: 24,
        borderRadius: 8
      }}>
        <h3>{formData.id ? 'Sửa ghi chú' : 'Thêm ghi chú mới'}</h3>
        <input
          placeholder="Tiêu đề"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8, boxSizing: 'border-box' }}
        />
        <textarea
          placeholder="Nội dung"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          style={{ display: 'block', width: '100%', height: 80, marginBottom: 10, padding: 8, boxSizing: 'border-box' }}
        />
        <button onClick={handleSave} style={{ marginRight: 8 }}>
          {formData.id ? 'Cập nhật' : 'Thêm mới'}
        </button>
        {formData.id && <button onClick={handleCancel}>Hủy</button>}
      </div>

      {/* Danh sách */}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {notes.length === 0 && <p>Chưa có ghi chú kín nào.</p>}
          {notes.map((note) => (
            <div
              key={note.id}
              style={{
                border: '1px solid #ef4444',
                padding: 16,
                borderRadius: 8
              }}
            >
              <h4 style={{ margin: '0 0 8px 0' }}>{note.title}</h4>
              <p style={{ whiteSpace: 'pre-wrap', margin: '0 0 12px 0' }}>
                {note.content}
              </p>
              <div>
                <button onClick={() => handleEdit(note)} style={{ marginRight: 8 }}>
                  Sửa
                </button>
                <button onClick={() => handleDelete(note.id)} style={{ color: 'red' }}>
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}