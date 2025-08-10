const express = require('express');
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 4200;

// Proxy API requests to backend
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true
}));

// Serve static files from src directory
app.use('/assets', express.static(path.join(__dirname, 'src/assets')));
app.use(express.static(path.join(__dirname, 'src')));

// Serve Angular app's index.html for all routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'src', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Angular app not found');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔥 Angular dev server running on http://0.0.0.0:${PORT}`);
  console.log('🔗 API proxied to: http://localhost:5000');
});