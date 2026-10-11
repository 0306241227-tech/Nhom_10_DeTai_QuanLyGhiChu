const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const notesDir = path.join(__dirname, '..', 'data', 'notes');


if (!fs.existsSync(notesDir)) {
  fs.mkdirSync(notesDir, { recursive: true });
}

const getFilePath = (topic) => path.join(notesDir, `${topic}.json`);


router.get('/:topic', (req, res) => {
  const filePath = getFilePath(req.params.topic);
  try {
    if (!fs.existsSync(filePath)) return res.json([]);
    const data = fs.readFileSync(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ message: 'Lỗi đọc danh sách ghi chú' });
  }
});


router.post('/:topic', (req, res) => {
  const filePath = getFilePath(req.params.topic);
  try {
    let notes = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, 'utf8'))
      : [];

    const newNote = {
      id: Date.now().toString(),
      title: req.body.title || 'Không tiêu đề',
      content: req.body.content || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    notes.push(newNote);
    fs.writeFileSync(filePath, JSON.stringify(notes, null, 2), 'utf8');
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi thêm ghi chú' });
  }
});


router.put('/:topic/:id', (req, res) => {
  const filePath = getFilePath(req.params.topic);
  try {
    let notes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const index = notes.findIndex((n) => n.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Không tìm thấy ghi chú' });
    }

    notes[index] = {
      ...notes[index],
      title: req.body.title || notes[index].title,
      content: req.body.content || notes[index].content,
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(filePath, JSON.stringify(notes, null, 2), 'utf8');
    res.json(notes[index]);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật ghi chú' });
  }
});


router.delete('/:topic/:id', (req, res) => {
  const filePath = getFilePath(req.params.topic);
  try {
    let notes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const newNotes = notes.filter((n) => n.id !== req.params.id);
    fs.writeFileSync(filePath, JSON.stringify(newNotes, null, 2), 'utf8');
    res.json({ success: true, message: 'Đã xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa ghi chú' });
  }
});

module.exports = router;