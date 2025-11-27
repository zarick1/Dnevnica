const express = require('express');
const cors = require('cors');

const healthRouter = require('./routes/health');
const dbTestRouter = require('./routes/dbTest');
const adsRouter = require('./routes/ads');

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/health', healthRouter);
app.use('/db-test', dbTestRouter);
app.use('/api/v1/ads', adsRouter);

module.exports = app;
