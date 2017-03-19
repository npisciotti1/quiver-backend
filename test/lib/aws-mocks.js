'use strict';

const AWS = require('aws-sdk-mock');

module.exports = exports = {};

exports.uploadMock = {
  ETag: '"taggingdragon"',
  Location: 'https://dope.com/flyingforever/doggo.png',
  Key: 'DOGGO.png',
  key: 'DOGGO.png',
  Bucket: 'cfgrammm'
};

AWS.mock('S3', 'upload', function(params, callback) {
  if (!params.ACL === 'public-read') {
    return callback(new Error('ACL must be public-read'));
  };

  if (!params.Bucket === 'cfgrammm') {
    return callback(new Error('bucket mut be cfgrammm'));
  };

  if (!params.Key) {
    return callback(new Error('key required'));
  };

  if (!params.Body) {
    return callback(new Error('body required'));
  };

  callback(null, exports.uploadMock);
});
