import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

export default function Notes() {
  const [topic, setTopic] = useState('hoc-tap');
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ id: null, title: '', content: '' });
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/notes/${topic}`);
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [topic]);

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề');
      return;
    }

    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id
      ? `${API_URL}/notes/${topic}/${formData.id}`
      : `${API_URL}/notes/${topic}`;

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
      fetchNotes();
    } catch (err) {
      alert('Lưu thất bại');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa ghi chú này?')) return;

    try {
      await fetch(`${API_URL}/notes/${topic}/${id}`, { method: 'DELETE' });
      fetchNotes();
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

  return (
    <div className="notes-page">
      <h1>Ghi chú công khai</h1>

      
      <div className="topic-select" style={{ marginBottom: 20 }}>
        <strong>Chủ đề: </strong>
        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="hoc-tap">Học tập</option>
          <option value="cong-viec">Công việc</option>
          <option value="ca-nhan">Cá nhân</option>
        </select>
      </div>

      
      <div className="note-form" style={{
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
          style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }}
        />
        <textarea
          placeholder="Nội dung"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          style={{ display: 'block', width: '100%', height: 80, marginBottom: 10, padding: 8 }}
        />
        <button onClick={handleSave} style={{ marginRight: 8 }}>
          {formData.id ? 'Cập nhật' : 'Thêm mới'}
        </button>
        {formData.id && (
          <button onClick={handleCancel}>Hủy</button>
        )}
      </div>

      
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {notes.length === 0 && <p>Chưa có ghi chú nào.</p>}
          {notes.map((note) => (
            <div
              key={note.id}
              style={{
                border: '1px solid #3b82f6',
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