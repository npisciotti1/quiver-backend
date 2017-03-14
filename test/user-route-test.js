'use strict';

require('./lib/test-env.js');

// const awsMocks = require('./lib/aws-mocks.js');
const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
// const serverToggle = require('./lib/server-toggle.js');
const User = require('../model/user.js');
// const debug = require('debug')('quiver:user-route-test');

mongoose.Promise = Promise;

const server = require('../server.js');
const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'weasel',
  password: 'bruh',
  email: 'testing@test.com'
};

describe('USER ROUTES --', function() {
  describe('for POST routes in USER-', function() {
    after( done => {
      User.remove({})
      .then( () => done())
      .catch(done);
    });

    describe('should return passing tests for:', function() {
      it('successfully posting information.', done => {
        request.post(`${url}/api/signup`)
        .send(exampleUser)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });
  });

  describe ('for GET routes in USER', function() {
    describe('should return passing tests for:', function() {
      before( done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
        .then ( user => user.save())
        .then ( user => {
          this.tempUser = user;
          done();
        })
        .catch(done);
      });

      after ( done => {
        User.remove({})
        .then( () => done)
        .catch(done);
      });

      it('successfully returned token', done=> {
        request.get(`${url}/api/signin`)
        .auth('weasel', 'bruh')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });
});
