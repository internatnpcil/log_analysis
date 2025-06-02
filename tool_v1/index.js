const express = require('express');
const multer = require('multer');
const logRoutes = require('./routes/logRoutes');

const app = express();
const port = 3000;

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api', logRoutes);

// File upload endpoint
app.post('/upload', upload.single('logfile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ message: 'File uploaded successfully', filePath: req.file.path });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});