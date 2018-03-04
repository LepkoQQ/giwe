'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const webhook = require('./webhook');
const config = require('./config');

const options = config.load();
const port = Number.parseInt(process.env.PORT, 10) || Number.parseInt(options.port, 10) || 8001;

const app = express();
app.use(bodyParser.json());

// setup webhook route
// TODO: change to .post
app.get(options.path, webhook(options));

// send 400 (Bad Request) on all other routes
app.use((req, res) => {
  res.sendStatus(400);
});

// error middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({
    error: err.message,
  });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('giwe: listening on ', `http://localhost:${port}${options.path}`);
});
