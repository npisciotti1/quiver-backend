'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('quiver:gear-route');

const Gear = require('../model/gear.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const gearRouter = module.exports = Router();

gearRouter.post('/api/venue/:venueID/gear', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/venue/:venueID/gear');

  req.body.venueID = req.params.venueID;
  new Gear(req.body).save()
  .then( gear => res.json(gear) )
  .catch(next);
});

gearRouter.get('/api/venue/:venueID/gear', bearerAuth, function(req, res, next) {
  debug('GET: /api/venue/:venueID/gear');

  Gear.findOne({ 'venueID': req.params.venueID })
  .then( gear => res.json(gear) )
  .catch( () => next(createError(404, 'not found')));
});

gearRouter.put('/api/venue/:venueID/gear/:gearID', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT /api/venue/:venueID/gear/:gearID');

  var query = { _id: `${req.params.gearID}` };

  Gear.findOneAndUpdate(query, req.body, {new: true} )
  .then( gear => {
    res.json(gear);
  })
  .catch( () => next(createError(404, 'not found')));
});

gearRouter.delete('/api/venue/:venueID/gear/:gearID', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/venue/:venueID/gear/:gearID');

  Gear.findByIdAndRemove(req.params.gearID)
  .then( () => res.status(204).send())
  .catch( () => next(createError(404, 'not found')));
});
