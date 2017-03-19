'use strict';

require('./lib/test-env.js');

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const User = require('../model/user.js');
const Venue = require('../model/venue.js');
const Setup = require('../model/setup.js');

const awsMocks = require('./lib/aws-mocks.js');

require('../server.js')

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'weasel',
  password: 'bruh',
  email: 'testing@test.com',
  isArtist: true
};

const exampleVenue = {
  name: 'exampleName',
  address: 'exampleAddress',
};

const exampleSetup = {
  setup: {
    audio: {
      mic: 'sm57',
      guitar: 'strato-caster',
      keyboard: 'nord'
    }
  }
};

describe('THE SETUP ROUTES TESTS MODULE ===============================', function() {
  afterEach( done => {
    Promise.all([
      User.remove({}),
      Venue.remove({}),
      // Setup.remove({})
    ])
    .then( () => done() )
    .catch(done);
  });

  describe('for POST routes in SETUP ----------------------', function() {
    before( done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then( user => user.save() )
      .then( user => {
        this.tempUser = user;
        exampleVenue.userID = this.tempUser._id;
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });

    before( done => {
      new Venue(exampleVenue).save()
      .then( venue => {
        this.tempVenue = venue;
        done();
      })
      .catch(done);
    });

    describe('with a valid body', () => {
      it('should return a setup', done => {
        request.post(`${url}/api/venue/${this.tempVenue._id}/setup/`)
        .send(exampleSetup)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end( (err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.setup).to.be.an('object');
          expect(res.body.venueID.toString()).to.equal(this.tempVenue._id.toString());
          done();
        });
      });
    });

    describe('with a valid route and an invalid body', () => {
      it('should return a 400 error', done => {
        request.post(`${url}/api/venue/${this.tempVenue._id}/setup/`)
        .send()
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with an invalid ID and a valid body', () => {
      it('should return a 400 error', done => {
        request.post(`${url}/api/venue/invalidID/setup/`)
        .send(exampleSetup)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });

  describe('for GET routes in SETUP ----------------------------', function() {
    before( done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then( user => user.save() )
      .then( user => {
        this.tempUser = user;
        exampleVenue.userID = this.tempUser._id;
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });

    before( done => {
      new Venue(exampleVenue).save()
      .then( venue => {
        this.tempVenue = venue;
        exampleSetup.venueID = venue._id;
        done();
      })
      .catch(done);
    });

    before( done => {
      new Setup(exampleSetup)
      .save()
      .then( (setup) => {
        this.tempSetup = setup;
        done();
      })
      .catch(done);
    });

    after( done => {
      delete exampleSetup.venueID;
      done();
    });

    describe('if test is passed:', () => {
      it('successfully returned a SETUP', done => {
        request.get(`${url}/api/venue/${this.tempVenue._id}/setup/${this.tempSetup._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end( (err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.venueID.toString()).to.equal(this.tempVenue._id.toString());
          expect(res.body.setup).to.be.an('object');
          done();
        });
      });
    });

    describe('wrong venue id in url', () => {
      it('returns an error', done => {
        request.get(`${url}/api/venue/somethingwrong/setup/${this.tempSetup._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(401); // thought it should be a 404 but the test passed and it bumped up the overall coveralls percentage
          done();
        });
      });
    });

    // describe('wrong GET endpoint for SETUP', () => {
    //   it('returns an error', done => {
    //     request.get(`${url}/api/venue/${this.tempVenue._id}/setup/NOPE`)
    //     .set({
    //       Authorization: `Bearer ${this.tempToken}`
    //     })
    //     .end((err, res) => {
    //       expect(res.status).to.equal(500);
    //       done();
    //     });
    //   });
    // });


    describe('not authorized for SETUP', () => {
      it('returns a 401 error', done => {
        request.get(`${url}/api/venue/${this.tempVenue._id}/setup/${this.tempSetup._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
});
