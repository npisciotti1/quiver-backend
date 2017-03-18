'use strict';

// one line test for travis

const express = require('express');
const debug = require('debug')('quiver:server');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

const userRouter = require('./route/user-route.js');
const venueRouter = require('./route/venue-route.js');
const artistRouter = require('./route/artist-route.js');
const setupRouter = require('./route/setup-route.js');
const picRouter = require('./route/pic-route.js');
const errors = require('./lib/error-middleware.js');

dotenv.load();

const PORT = process.env.PORT;
const app = express();

mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(userRouter);
app.use(venueRouter);
app.use(setupRouter);
app.use(artistRouter);
// app.use(picRouter);
app.use(errors);

app.get('/', (req, res) => {
  res.send('this worked');
});

app.listen(PORT, () => {
  debug(`Port up: ${PORT}`);
});
