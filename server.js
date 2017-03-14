'use strict';

const express = require('express');
const debug = require('debug')('quiver:server');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

dotenv.load();

const PORT = process.env.PORT;
const app = express();
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('this worked');
});

app.listen(PORT, () => {
  debug(`Port up: ${PORT}`);
});
