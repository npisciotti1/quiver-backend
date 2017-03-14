'use strict';

const jsonParser = require('body-parser').json();
const debug = require('debug')('quiver:setup-route');
const Router = require('express').Router;
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const createError = require('http-errors');

const Setup = require('../model/setup.js');

const setupRouter = module.exports = Router();

setupRouter.post('/api/venue/:venueID/setup', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/venue/:venueID/setup');


  req.body.venueID = req.params.venueID;
  new Setup(req.body)
  .save()
  .then( setup => res.json(setup) )
  .catch( () => next(createError(400, 'bad request')) );

});
