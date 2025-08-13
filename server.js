const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();


app.use('/api', (req, res, next) => {
  console.log('Proxying /api request:', req.url);
  next();
});

// Proxy for /api (dynamic target based on environment)
const isDocker = process.env.IS_DOCKER === 'true';
app.use(
  '/api',
  createProxyMiddleware({
    target: isDocker ? 'http://backend:3333' : process.env.REACT_APP_API_URL,
    changeOrigin: true,
    secure: false,
  })
);

// Serve static files from build
app.use(express.static(path.join(__dirname, 'build')));

// React Router fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 


