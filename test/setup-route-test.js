'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const User = require('../model/user.js');
const Venue = require('../model/venue.js');
const Setup = require('../model/setup.js');

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

describe('setup route tests', function() {
  describe('POST: /api/venue/:venueID/setup', function() {
    afterEach( done => {
      Promise.all([
        User.remove({}),
        Venue.remove({}),
        Setup.remove({})
      ])
      .then( () => done() )
      .catch(done);
    });
    describe('with a valid body', function() {
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

      // before( done => {
      //   exampleSetup.venueID = this.tempVenue._id;
      //   new Setup(exampleSetup)
      //   .save()
      //   .then( () => done())
      //   .catch(done);
      // })

      it('should return a setup', (done) => {
        request.post(`${url}/api/venue/${this.tempVenue._id}/setup/`)
        .send(exampleSetup)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end( (err, res) => {
          if(err) return done(err);
          console.log('===========================');
          console.log(res.body.setup);
          expect(res.status).to.equal(200);
          expect(res.body.setup).to.be.an('object');
          expect(res.body.venueID.toString()).to.equal(this.tempVenue._id.toString());
          done();
        });
      });
    });
  });
});
