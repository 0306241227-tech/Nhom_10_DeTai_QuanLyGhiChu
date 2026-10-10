const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const profileRoutes = require('./routes/profile');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Tạo thư mục data nếu chưa có
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Routes
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Note Management API is running' });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});