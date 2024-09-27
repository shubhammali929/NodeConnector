// src/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Enable CORS for requests from the frontend
app.use(cors());

// Parse incoming JSON request bodies
app.use(bodyParser.json());

// Use OAuth routes
app.use('/oauth', routes);

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
