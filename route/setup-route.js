'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('quiver:setup-route');

const Setup = require('../model/setup.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const setupRouter = module.exports = Router();

setupRouter.post('/api/venue/:venueID/setup', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/venue/:venueID/setup');

  req.body.venueID = req.params.venueID;
  new Setup(req.body).save()
  .then( setup => res.json(setup) )
  .catch(next);
});

setupRouter.get('/api/venue/:venueID/setup/:setupID', bearerAuth, function(req, res, next) {
  debug('GET: /api/venue/:venueID/setup/:setupID');

  Setup.findById(req.params.setupID)
  .then( setup => res.json(setup) )
  .catch( () => next(createError(404, 'not found')));
});

setupRouter.put('/api/venue/:venueID/setup/:setupID', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT /api/venue/:venueID/setup/:setupID');

  Setup.findByIdAndUpdate(req.params.setupID, req.body, { new: true})
  .then( setup => res.json(setup) )
  .catch( () => next(createError(404, 'not found')));
});
