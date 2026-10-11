const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const router = express.Router();

const PROFILE_PATH = path.join(__dirname, '../data/profile.json');
const PRIVATE_PATH = path.join(__dirname, '../data/private.json');


if (!fs.existsSync(PRIVATE_PATH)) {
  fs.writeFileSync(PRIVATE_PATH, '[]', 'utf8');
}


router.post('/auth', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.json({ success: false, message: 'Vui lòng nhập mật khẩu' });
    }

    if (!fs.existsSync(PROFILE_PATH)) {
      return res.json({ success: false, message: 'Chưa thiết lập mật khẩu' });
    }

    const profile = JSON.parse(fs.readFileSync(PROFILE_PATH, 'utf8'));
    const hash = profile.privatePasswordHash || '';

    if (!hash) {
      return res.json({ success: false, message: 'Chưa thiết lập mật khẩu vùng kín' });
    }

    const match = await bcrypt.compare(password, hash);

    if (match) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false, message: 'Sai mật khẩu' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi xác thực' });
  }
});


router.get('/notes', (req, res) => {
  try {
    if (!fs.existsSync(PRIVATE_PATH)) return res.json([]);
    const data = fs.readFileSync(PRIVATE_PATH, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ message: 'Lỗi đọc ghi chú kín' });
  }
});


router.post('/notes', (req, res) => {
  try {
    let notes = fs.existsSync(PRIVATE_PATH)
      ? JSON.parse(fs.readFileSync(PRIVATE_PATH, 'utf8'))
      : [];

    const newNote = {
      id: Date.now().toString(),
      title: req.body.title || 'Không tiêu đề',
      content: req.body.content || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    notes.push(newNote);
    fs.writeFileSync(PRIVATE_PATH, JSON.stringify(notes, null, 2), 'utf8');
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi thêm ghi chú kín' });
  }
});


router.put('/notes/:id', (req, res) => {
  try {
    let notes = JSON.parse(fs.readFileSync(PRIVATE_PATH, 'utf8'));
    const index = notes.findIndex((n) => n.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Không tìm thấy ghi chú' });
    }

    notes[index] = {
      ...notes[index],
      title: req.body.title ?? notes[index].title,
      content: req.body.content ?? notes[index].content,
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(PRIVATE_PATH, JSON.stringify(notes, null, 2), 'utf8');
    res.json(notes[index]);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật ghi chú kín' });
  }
});


router.delete('/notes/:id', (req, res) => {
  try {
    let notes = JSON.parse(fs.readFileSync(PRIVATE_PATH, 'utf8'));
    const newNotes = notes.filter((n) => n.id !== req.params.id);
    fs.writeFileSync(PRIVATE_PATH, JSON.stringify(newNotes, null, 2), 'utf8');
    res.json({ success: true, message: 'Đã xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa ghi chú kín' });
  }
});

module.exports = router;