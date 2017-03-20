'use strict';

require('./lib/test-env.js');

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const User = require('../model/user.js');

const awsMocks = require('./lib/aws-mocks.js');

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'weasel',
  password: 'bruh',
  email: 'testing@test.com',
  isArtist: true
};

const newUser = {
  username: 'shazam',
  password: 'epiphany',
  email: 'shabazz@lovesjazz.com',
  isArtist: true
};

describe('THE USER ROUTES TEST MODULE =================================', function() {
  describe('for POST routes in USER ------------------------------', function() {
    afterEach( done => {
      User.remove({})
      .then( () => done())
      .catch(done);
    });

    describe('should return a user:', () => {
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

    describe('with an invalid route', () => {
      it('should return a 404 error', done => {
        request.post(`${url}/api/willIsABigDummy`)
        .send(exampleUser)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with an invalid body', () => {
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

  describe ('for GET routes in USER ---------------------------', function() {
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

    describe('with valid basic-auth:', () => {
      it('should return a token', done => {
        request.get(`${url}/api/signin`)
        .auth('weasel', 'bruh')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    describe('with an invalid password', () => {
      it('should return a 401 error', done => {
        request.get(`${url}/api/signin`)
        .auth('weasel', 'bad password')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        })
      })
    })

    describe('with an invalid username', () => {
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
        });
      });
    });
  });

  describe('PUT route tests for USER -------------------------', function() {
    before ( done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then ( user => user.save())
      .then ( user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });

    before ( done => {
      new User(newUser)
      .generatePasswordHash(newUser.password)
      .then ( user => user.save())
      .then ( user => {
        this.tempUserNew = user;
        return user.generateToken();
      })
      .then( token => {
        this.tempTokenNew = token;
        done();
      })
      .catch(done);
    });

    after ( done => {
      User.remove({})
      .then( () => done())
      .catch(done);
    });

    describe('correctly updated USER', () => {
      it('will return passing tests', done => {
        request.put(`${url}/api/user`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send(newUser)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    describe('wrong user endpoint in PUT', () => {
      it('will return 404 error', done => {
        request.put(`${url}/api/CUDDLYKITTENFAIR`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send(newUser)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    it('not authorized to update user', done => {
      request.put(`${url}/api/user`)
      .send(newUser)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });
  });

  describe('DELETE route tests for USER ---------------------', function() {
    before ( done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then ( user => user.save())
      .then ( user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });

    after ( done => {
      User.remove({})
      .then( () => done())
      .catch(done);
    });

    it('successfully deleting a user', done => {
      request.delete(`${url}/api/user`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(204);
        done();
      });
    });

    it('wrong endpoint for deleting a user', done => {
      request.delete(`${url}/api/notauser`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });

    it('wrong endpoint for deleting a user', done => {
      request.delete(`${url}/api/user`)
      .set({
        Authorization: `not authorized`
      })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });
  });
});
