const express = require('express');
const cors = require('cors');

const healthRouter = require('./routes/health');

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/health', healthRouter);

module.exports = app;
