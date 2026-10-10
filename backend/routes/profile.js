const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const router = express.Router();
const PROFILE_PATH = path.join(__dirname, '../data/profile.json');

// Đọc profile
router.get('/', (req, res) => {
  try {
    if (!fs.existsSync(PROFILE_PATH)) {
      return res.status(404).json({ message: 'Chưa có file profile' });
    }

    const data = JSON.parse(fs.readFileSync(PROFILE_PATH, 'utf8'));
    const { privatePasswordHash, ...safeData } = data; // không trả password ra ngoài
    res.json(safeData);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi đọc dữ liệu profile' });
  }
});

// Cập nhật profile
router.put('/', async (req, res) => {
  try {
    const { displayName, theme, primaryColor, password } = req.body;

    let currentData = {
      displayName: '',
      theme: 'light',
      primaryColor: '#3b82f6',
      privatePasswordHash: ''
    };

    if (fs.existsSync(PROFILE_PATH)) {
      currentData = JSON.parse(fs.readFileSync(PROFILE_PATH, 'utf8'));
    }

    if (displayName !== undefined) currentData.displayName = displayName;
    if (theme !== undefined) currentData.theme = theme;
    if (primaryColor !== undefined) currentData.primaryColor = primaryColor;

    // Chỉ hash khi người dùng nhập mật khẩu mới
    if (password && password.trim() !== '') {
      currentData.privatePasswordHash = await bcrypt.hash(password, 10);
    }

    fs.writeFileSync(PROFILE_PATH, JSON.stringify(currentData, null, 2), 'utf8');

    res.json({
      message: 'Cập nhật thành công',
      data: {
        displayName: currentData.displayName,
        theme: currentData.theme,
        primaryColor: currentData.primaryColor
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi ghi dữ liệu profile' });
  }
});

module.exports = router;