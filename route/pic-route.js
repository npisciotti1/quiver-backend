'use strict';

const fs = require('fs');
const path = require('path');
const del = require('del');
const AWS = require('aws-sdk');
const multer = require('multer');
const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('quiver:pic-route');

const Pic = require('../model/pic.js');
const Venue = require('../model/venue.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();
const dataDir = `${__dirname}/../data`;
const upload = multer({ dest: dataDir });

const picRouter = module.exports = Router();

function s3uploadProm(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, s3data) => {
      resolve(s3data);
    });
    reject(createError(400, 'bad request'));
  });
}

picRouter.post('/api/venue/:venueID/pic', bearerAuth, upload.single('image'), function(req, res, next) {
  debug('POST /api/venue/:venueID/pic');

  if(!req.file) {
    return next(createError(400, 'file not found'));
  }

  if(!req.file.path) {
    return next(createError(500, 'file not saved'));
  }

  let ext = path.extname(req.file.originalname);

  let params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET,
    Key: `${req.file.filename}${ext}`,
    Body: fs.createReadStream(req.file.path)
  };

  Venue.findById(req.params.venueID)
  .then( () => s3uploadProm(params))
  .then( s3data => {
    del([`${dataDir}/*`]);
    let picData = {
      name: req.body.name,
      description: req.body.description,
      objectKey: s3data.Key,
      imageURI: s3data.Location,
      userID: req.user._id,
      venueID: req.params.venueID
    };
    return new Pic(picData).save();
  })
  .then( pic => res.json(pic))
  .catch( err => next(err));
});
// 
// picRouter.delete('api/venue/:venueID/pic/:picID', bearerAuth, function(req, res, next) {
//   debug('DELETE: /api/venue/venueID/pic/:picID');
//
//   pic.findbyIdAndRemove(req.params.picID)
//   .then( () => res.status(204).send())
//   .catch( () => next(createError(404, 'not found')));
// })
