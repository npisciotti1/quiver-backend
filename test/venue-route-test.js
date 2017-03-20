'use strict';

require('./lib/test-env.js');

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');
const Venue = require('../model/venue.js');

const awsMocks = require('./lib/aws-mocks.js');

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;


const exampleUser = {
  username: 'example user',
  password: 'example password',
  email: 'test@test.com',
  isArtist: true
};

const exampleVenue = {
  name: 'example venue',
  address: '123 funktown'
};

describe('THE VENUE ROUTES TESTS MODULE ===============================', function() {
  afterEach( done => {
    Promise.all([
      User.remove({}),
      Venue.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('for POST routes in VENUE ------------------------------', function() {
    before( done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then( user => user.save())
      .then( user => {
        this.tempUser = user;
        exampleVenue.userID = this.tempUser._id.toString();
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

    describe('With a valid route and invalid body', () => {
      it('should return a 400 error', done => {
        request.post(`${url}/api/venue`)
        .send('this was dumb')
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('With an invalid route and valid body', () => {
      it('should return a 404 error', done => {
        request.post(`${url}/api/wrongplacedunce`)
        .send(exampleVenue)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('if the user is not authorized', () => {
      it('should return a 401 error', done => {
        request.post(`${url}/api/venue`)
        .send(exampleVenue)
        .set({
          Authorization: `NOT TODAY YOUNG ONE`
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        })
      });
    });
  });

  describe('for GET routes in VENUE ----------------------------', function() {
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

    after( done => {
      delete exampleVenue.userID;
      done();
    });

    it('should successfully return a venue', done => {
      request.get(`${url}/api/venue/${this.tempVenue._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal(exampleVenue.name);
        expect(res.body.desciption).to.equal(exampleVenue.desciption);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        done();
      });
    });
    it('should return an error for wrong endpoint', done => {
      request.get(`${url}/api/venue/somewrongshit`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        expect(res.status).to.equal(404)
        done();
      });
    });

    it('should return an error for not being authorized', done=> {
      request.get(`${url}/api/venue/${this.tempVenue._id}`)
      .set({
        Authorization: `not going through my dude`
      })
      .end((err, res) => {
        expect(res.status).to.equal(401)
        done();
      });
    });
  });

  describe('for PUT routes in VENUE -------------------------------', function() {
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

    it('will return an updated venue', done => {
      let newVenue = { name: 'ONTRACK', address: 'BEASTMODE'};
      request.put(`${url}/api/venue/${this.tempVenue._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .send(newVenue)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.userID).to.equal(this.tempUser._id.toString())
        expect(res.body.name).to.equal(newVenue.name);
        expect(res.body.address).to.equal(newVenue.address);
        done();
      });
    });

    it('did not send the UPDATED venue correctly', done => {
      let newVenue = { name: 'BADBOY', address: 'IS A STRAIGHT TITAN'};
      request.put(`${url}/api/venue/${this.tempVenue._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .send()
      .end((err, res) => {
        expect(res.body).to.equal(null);
        done();
      });
    });

    it('sent the updated venue to the WRONG ENDPOINT', done => {
      let newVenue = { name: 'OHSHIT', address: 'THIS MIGHT BE FORREAL'};
      request.put(`${url}/api/venue/wrongplacesexy`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .send(newVenue)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });

    it('was an unauthorized request', done => {
      let newVenue = { name: 'more', address: 'and MORE'};
      request.put(`${url}/api/venue/${this.tempVenue.id}`)
      .set({
        Authorization: `no fly zone`
      })
      .send(newVenue)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('did not send the UPDATED venue correctly', done => {
      let newVenue = { name: 'underpantsman', address: 'is inappropriate', userID: 'giggity'};
      request.put(`${url}/api/venue/${this.tempVenue._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .send(newVenue)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  describe('for DELETE routes in VENUE ----------------------', function() {
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
    })

    it('should successfully delete a venue', done => {
      request.delete(`${url}/api/venue/${this.tempVenue._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(204);
        done();
      });
    });

    it('invalid url, cannot delete', done => {
      request.delete(`${url}/api/venue/THISISNOTRIGHT`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });

    it('not authorized to delete', done => {
      request.delete(`${url}/api/venue/${this.tempVenue._id}`)
      .set({
        Authorization: `y u no like dis venue`
      })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });
  });
});
