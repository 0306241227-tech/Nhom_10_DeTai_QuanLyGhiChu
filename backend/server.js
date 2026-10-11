const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const profileRoutes = require('./routes/profile');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
const notesRoutes = require('./routes/notes');
const privateRoutes = require('./routes/private');
app.use('/api/private', privateRoutes);


app.use('/api/profile', profileRoutes);
app.use('/api/notes', notesRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Note Management API is running' });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});