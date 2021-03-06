'use strict';

//comment to test

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
const gearRouter = require('./route/gear-route.js');
const picRouter = require('./route/pic-route.js');
const errors = require('./lib/error-middleware.js');

dotenv.load();

const PORT = process.env.PORT || 3000;
const app = express();

mongoose.connect(process.env.MONGODB_URI);

let morganFormat = process.env.PRODUCTION ? 'common' : 'dev';

app.use(cors());
app.use(morgan(morganFormat));

app.use(userRouter);
app.use(venueRouter);
app.use(picRouter);
app.use(artistRouter);
app.use(gearRouter);
app.use(picRouter);
app.use(errors);

app.get('/', (req, res) => {
  res.send('this worked');
});

app.listen(PORT, () => {
  debug(`Port up: ${PORT}`);
});
