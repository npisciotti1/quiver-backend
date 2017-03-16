'use strict';

require('./lib/test-env.js');

const expect = require('chai').expect;
const request = require('superagent');
const debug = require('debug')('quiver:pic-route-test');
// const awsMocks = require('./lib/aws-mocks.js');


const Pic = require('../model/pic.js');
const User = require('../model/user.js');
const Setup = require('../model/setup.js');
const Venue = require('../model/venue.js');
// const ServerToggle = require('./lib/server-toggle.js');
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
  // profPic: `${__dirname}/data/testerProfPic.png`
};

const examplePic = {
  name: 'sexytime',
  description: 'sexypicbruh',
  image: `${__dirname}/data/testerProfPic.png`
};

// const examplePicModel = {
//   name: 'sexytime model',
//   description: 'sexypicbruh model',
//   imageURI: `${__dirname}/data/testerProfPic.png`,
//   filename: 'testerProfPic',
//   created: new Date()
// };

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

      before( done => {
        exampleVenue.userID = this.tempUser._id.toString();
        new Venue(exampleVenue).save()
        .then( venue => {
          this.tempVenue = venue;
          done();
        })
        .catch(done);
      });

      // before( done => {
      //   examplePic.venueID = this.tempVenue._id.toString();
      //   new Pic(examplePic).save()
      //   .then( pic => {
      //     this.tempVenue = venue;
      //     done();
      //   })
      //   .catch(done);
      // });

      after( done => {
        delete exampleVenue.userID;
        done();
      });

      it('successfully returning a pic.', done => {
        console.log('this is our token', this.tempToken);
        request.post(`${url}/api/venue/${this.tempVenue._id}/pic`)
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
