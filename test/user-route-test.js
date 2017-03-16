'use strict';

require('./lib/test-env.js');

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');

const server = require('../server.js');
const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'weasel',
  password: 'bruh',
  email: 'testing@test.com',
  isVenue: true
};

describe('USER ROUTES --', function() {
  describe('for POST routes in USER-', function() {
    describe('should return a user:', function() {
      after( done => {
        User.remove({})
        .then( () => done())
        .catch(done);
      });
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

    describe('with an invalid route', function() {
      it('should return a 404 error', done => {
        request.post(`${url}/api/willIsABigDummy`)
        .send(exampleUser)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with an invalid body', function() {
      it('should return a 400 error', done => {
        request.post(`${url}/api/signup`)
        .send('wrong!')
        .end( (err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });

  describe ('for GET routes in USER', function() {

    describe('with valid basic-auth:', function() {
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
        .then( () => done())
        .catch(done);
      });

      it('should return a token', done => {
        // console.log('this.tempUser', this.tempUser);
        request.get(`${url}/api/signin`)
        .auth('weasel', 'bruh')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    describe('with an invalid password', function() {
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
        .then( () => done())
        .catch(done);
      });
      it('should return a 401 error', done => {
        // console.log('this.tempuser:', this.tempUser);
        request.get(`${url}/api/signin`)
        .auth('weasel', 'bad password')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        })
      })
    })

    describe('with an invalid username', function() {
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
        .then( () => done())
        .catch(done);
      });
      it('should return a 400 error', done => {
        request.get(`${url}/api/signin`)
        .auth('fakeUser', 'bruh')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with an invalid route', function() {
      it('should return a 404 error', done => {
        request.get(`${url}/api/badroute`)
        .auth('bad request')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        })
      })
    });
  });
});
