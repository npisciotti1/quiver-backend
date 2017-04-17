'use strict';

const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const debug = require('debug')('quiver:bearer-auth-middleware');

const User = require('../model/user.js');

module.exports = function(req, res, next) {
  debug('bearer auth middleware');

  var authHeader = req.headers.authorization;
  if(!authHeader) return next(createError(401, 'authorization headers required'));

  var token = authHeader.split('Bearer ')[1];
  if(!token) return next(createError(401, 'token required'));

  console.log('bearer-auth was hit:', token);

  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    if(err) return next(err);

    User.findOne({ findHash: decoded.token })
    .then( user => {
      req.user = user;
      next();
    })
    .catch(err => next(err));
  });
};
