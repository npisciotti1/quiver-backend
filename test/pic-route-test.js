'use strict';

require('./lib/test-env.js');

const expect = require('chai').expect;
const request = require('superagent');
const debug = require('debug')('quiver:pic-route-test');
// const awsMocks = require('./lib/aws-mocks.js');

const Pic = require('../model/pic.js');
const User = require('../model/user.js');
const Setup = require('../model/setup.js');

const ServerToggle = require('./lib/server-toggle.js');
const server = require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'stank',
  password: 'dank',
  email: 'dank@stank.com',
  isArtist: true
};

const exampleVenue = {
  name: 'sparta',
  address: 'fuckyeah street',
  profPic: `${__dirname}/data/testerProfPic.png`
};

const examplePic = {
  name: 'sexytime',
  desciption: 'sexypicbruh',
  image: `${__dirname}/data/tester.png`
};

const examplePicModel = {
  name: 'sexytime model',
  description: 'sexypicbruh model',
  imageURI: awsMocks.uploadMock.Location,
  filename: awsMocks.uploadMock.Key,
  created: new Date();
};

describe('PICS MODULE --', function() {
  afterEach( done => {
    Promise.all([
      Pic.remove({}),
      User.remove({}),
      Venue.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('testing POST route for PIC', function() {
    describe('should return passing tests for:', function() {
      before( done => {
        new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then( user => user.save())
        .then( user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then( token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
      });

      after( done => {
        delete exampleVenue.userID;
        done();
      });

      it('successfully returning a pic.', done => {
        request.post(`${url}/api/gallery/${this.tempVenue._id}/pic`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .field('name', examplePic.name)
        .field('description', examplePic.description)
        .attach('image', examplePic.image)
        .end((err, res) => {
          if (err) return done(err);

          // console.log('location', aws.uploadMock.Location);
          console.log('pic url is:', res.body.imageURI);
          expect(res.body.name).to.equal(examplePic.name);
          expect(res.body.description).to.equal(examplePic.description);
          expect(res.body.venueID).to.equal(this.tempVenue._id.toString());
          // expect(res.body.imageURI).to.equal(awsMocks.uploadMock.Location);
          done();
        });
      });
    });
  });
});
