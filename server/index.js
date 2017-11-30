const path = require('path');
const express = require('express');
const logger = require('morgan');

const app = express();
const publicPath = path.join(__dirname, '..', 'public');

app.use(logger('dev'));
app.use(express.static(publicPath));
app.use((req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

