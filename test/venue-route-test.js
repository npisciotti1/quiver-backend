'use strict';

require('./lib/test-env.js');

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');
const Venue = require('../model/venue.js');

const url = `http://localhost:${process.env.PORT}`;

require('../server.js');

const exampleUser = {
  username: 'example user',
  password: 'example password',
  email: 'test@test.com',
  isVenue: true
};

const exampleVenue = {
  name: 'example venue',
  address: '123 funktown'
};

describe('Venue Route Test', function() {
  afterEach( done => {
    Promise.all([
      User.remove({}),
      Venue.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('POST /api/venue', function() {

    before( done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then( user => user.save())
      .then( user => {
        this.tempUser = user;
        exampleVenue.userID = this.tempUser._id.toString()
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });

    describe('While making a valid POST', () => {
      it('should return a venue object', done => {
        request.post(`${url}/api/venue`)
        .send(exampleVenue)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(exampleVenue.name);
          expect(res.body.address).to.equal(exampleVenue.address);
          expect(res.body.userID).to.equal(this.tempUser._id.toString());
          done();
        });
      });
    });
  });
});
