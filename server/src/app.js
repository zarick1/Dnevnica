const express = require('express');
const cors = require('cors');

const healthRouter = require('./routes/health');
const dbTestRouter = require('./routes/dbTest');

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/health', healthRouter);
app.use('/db-test', dbTestRouter);

module.exports = app;
