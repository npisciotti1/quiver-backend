'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const User = require('../model/user.js');
const Venue = require('../model/venue.js');
const Gear = require('../model/gear.js');

// const awsMocks = require('./lib/aws-mocks.js');

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'weasel',
  password: 'bruh',
  email: 'testing@test.com'
};

const exampleVenue = {
  name: 'exampleName',
  address: 'exampleAddress',
};

const exampleGear = {
  gear: {
    audio: {
      mic: 'sm57',
      guitar: 'strato-caster',
      keyboard: 'nord'
    }
  }
};

const newGear = {
  gear: {
    audio: {
      instrument: 'saxophone'
    }
  }
};

describe('THE SETUP ROUTES TESTS MODULE ===============================', function() {
  afterEach( done => {
    Promise.all([
      User.remove({}),
      Venue.remove({}),
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
      it('should return a gear', done => {
        request.post(`${url}/api/venue/${this.tempVenue._id}/gear/`)
        .send(exampleGear)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end( (err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.gear).to.be.an('object');
          expect(res.body.venueID.toString()).to.equal(this.tempVenue._id.toString());
          done();
        });
      });
    });

    describe('with a valid route and an invalid body', () => {
      it('should return a 400 error', done => {
        request.post(`${url}/api/venue/${this.tempVenue._id}/gear/`)
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
        request.post(`${url}/api/venue/invalidID/gear/`)
        .send(exampleGear)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    it('not authorized to post in gear', done => {
      request.post(`${url}/api/venue/${this.tempVenue._id}/gear/`)
      .set({
        Authorization: 'not happening'
      })
      .send(exampleGear)
      .end( (err, res) => {
        expect(res.status).to.equal(401);
        done();
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
        exampleGear.venueID = venue._id;
        done();
      })
      .catch(done);
    });

    before( done => {
      new Gear(exampleGear).save()
      .then( gear => {
        this.tempGear = gear;
        done();
      })
      .catch(done);
    });

    after( done => {
      delete exampleGear.venueID;
      delete exampleVenue.userID;
      done();
    });

    describe('if test is passed:', () => {
      it('successfully returned a SETUP', done => {
        //deleted this: '/${this.tempGear._id}' because we modified our route
        request.get(`${url}/api/venue/${this.tempVenue._id}/gear`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end( (err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.venueID.toString()).to.equal(this.tempVenue._id.toString());
          expect(res.body.gear).to.be.an('object');
          done();
        });
      });
    });

    describe('wrong gear id in url', () => {
      it('returns an error', done => {
        request.get(`${url}/api/venue/${this.tempVenue._id}/gear/NOPE`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('not authorized to get in SETUP', () => {
      it('returns a 401 error', done => {
        //deleted this: '/${this.tempGear._id}' because we modified our route
        request.get(`${url}/api/venue/${this.tempVenue._id}/gear`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });

  describe('for PUT routes in SETUP ------------------------', function() {
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

    before( done => {
      exampleGear.venueID = this.tempVenue._id.toString();
      new Gear(exampleGear).save()
      .then( gear => {
        this.tempGear = gear;
        done();
      })
      .catch(done);
    });

    after( done => {
      delete exampleGear.venueID;
      delete exampleVenue.userID;
      done();
    });

    it('for a successfully updated SETUP', done => {
      request.put(`${url}/api/venue/${this.tempVenue._id}/gear/${this.tempGear._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .send(newGear)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.venueID).to.equal(this.tempVenue._id.toString());
        expect(res.body.gear).to.be.an('object');
        expect(res.body.gear).to.deep.equal(newGear.gear);
        done();
      });
    });

    it('did not update gear', done => {
      request.put(`${url}/api/venue/${this.tempVenue._id}/gear/${this.tempGear._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.gear).to.not.equal(newGear.gear);
        done();
      });
    });

    it('sent to wrong endpoint', done=> {
      request.put(`${url}/api/venue/${this.tempVenue._id}/gear/YOUSHALLNOTPASS`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .send(newGear)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });

    it('was an unauthorized request', done => {
      request.put(`${url}/api/venue/${this.tempVenue._id}/gear/${this.tempGear._id}`)
      .set({
        Authorization: 'look! a wild ratata has appeared'
      })
      .send(newGear)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('venue ID does not match', done => {
      newGear.venueID = 'WRONG ONE';
      request.put(`${url}/api/venue/${this.tempVenue._id}/gear/${this.tempGear._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .send(newGear)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  describe('for DELETE routes in SETUP -----------------------', function() {
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

    before( done => {
      exampleGear.venueID = this.tempVenue._id.toString();
      new Gear(exampleGear).save()
      .then( gear => {
        this.tempGear = gear;
        done();
      })
      .catch(done);
    });

    it('should successfully delete a gear', done => {
      request.delete(`${url}/api/venue/${this.tempVenue._id}/gear/${this.tempGear._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(204);
        done();
      });
    });

    it('invalid end point', done => {
      request.delete(`${url}/api/venue/${this.tempVenue._id}/gear/lame`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });

    it('unauthorized delete request for SETUP', done => {
      request.delete(`${url}/api/venue/${this.tempVenue._id}/gear/${this.tempGear._id}`)
      .set({
        Authorization: 'where is the love'
      })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });
  });
});
