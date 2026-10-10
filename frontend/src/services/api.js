const API_URL = 'http://localhost:3001/api';

export async function getProfile() {
  const res = await fetch(`${API_URL}/profile`);
  if (!res.ok) throw new Error('Không thể lấy thông tin profile');
  return res.json();
}

export async function updateProfile(data) {
  const res = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Cập nhật thất bại');
  return res.json();
}