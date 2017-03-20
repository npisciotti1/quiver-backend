'use strict';

const jsonParser = require('body-parser').json();
const debug = require('debug')('quiver:venue-route');
const Router = require('express').Router;
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const createError = require('http-errors');

const Venue = require('../model/venue.js');

const venueRouter = module.exports = Router();

venueRouter.post('/api/venue', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/venue');

  if(!req.user) return next(createError(400, 'bad request'));

  req.body.userID = req.user._id;

  new Venue(req.body)
  .save()
  .then( venue => res.json(venue) )
  .catch( () => next(createError(400, 'bad request')) );
});

venueRouter.get('/api/venue/:id', bearerAuth, function(req, res, next) {
  debug('GET: /api/venue/:id');

  Venue.findById(req.params.id)
  .then( venue => res.json(venue) )
  .catch( () => next(createError(404, 'not found')) );
});

venueRouter.put('/api/venue/:id', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/venue/:id');

  Venue.findByIdAndUpdate(req.params.id, req.body, { new: true})
  .then( venue => res.json(venue) )
  .catch( () => next(createError(404, 'not found')));
});

venueRouter.delete('/api/venue/:id', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/venue/:id');

  Venue.findByIdAndRemove(req.params.id)
  .then( () => res.status(204).send())
  .catch( () => next(createError(404, 'not found')));
});
