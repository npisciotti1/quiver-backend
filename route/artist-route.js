'use strict';

const jsonParser = require('body-parser').json();
const debug = require('debug')('quiver:artist-route');
const Router = require('express').Router;
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const createError = require('http-errors');

const Artist = require('../model/artist.js');

const artistRouter = module.exports = Router();

artistRouter.post('/api/artist', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/artist');

  if(!req.user) return next(createError(400, 'bad request'));

  req.body.userID = req.user._id;

  new Artist(req.body)
  .save()
  .then( artist => res.json(artist) )
  .catch( () => next(createError(400, 'bad request')));
});

artistRouter.get('/api/artist/:artistID', bearerAuth, function(req, res, next) {
  debug('GET: /api/artist/:artistID');

  Artist.findById(req.params.artistID)
  .then( artist => res.json(artist) )
  .catch( () => next(createError(404, 'not found')) );
});

artistRouter.put('/api/artist/:artistID', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/artist/:artistID');

  Artist.findByIdAndUpdate(req.params.artistID, req.body, { new: true})
  .then( artist => res.json(artist) )
  .catch( () => next(createError(404, 'not found')));
});

artistRouter.delete('/api/artist/:artistID', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/artist/:artistID');

  Artist.findByIdAndRemove(req.params.artistID)
  .then( () => res.status(204).send())
  .catch( () => next(createError(404, 'not found')));
});
