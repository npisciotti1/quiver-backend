'use strict';

const jsonParser = require('body-parser').json();
const debug = require('debug')('quiver:user-route');
const Router = require('express').Router;
const basicAuth = require('../lib/basic-auth-middleware.js');

const User = require('../model/user.js');

const userRouter = module.exports = Router();

userRouter.post('/api/signup', jsonParser, function(req, res, next) {
  debug('POST: /api/signup');

  let password = req.body.password;
  delete req.body.password;

  let user = new User(req.body);

  user.generatePasswordHash(password)
  .then( user => user.save() )
  .then( user => user.generateToken() )
  .then( token => res.send(token) )
  .catch(next);
});

userRouter.get('/api/signin', basicAuth, function(req, res, next) {
  debug('GET: /api/signin');

  User.findOne( { username: req.auth.username } )
  .then( user => user.comparePasswordHash(req.auth.password))
  .then( user => user.generateToken() )
  .then( token => res.send(token) )
  .catch(next);
});
