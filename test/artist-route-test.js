'use strict';

require('./lib/test-env.js');

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');
const Artist = require('../model/artist.js');

const awsMocks = require('./lib/aws-mocks.js')

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;


const exampleUser = {
  username: 'dope boy',
  password: 'ayo',
  email: 'zen@forever.com',
  isArtist: true
};

const exampleArtist = {
  name: 'Shivvy'
}

describe('THE ARTIST ROUTES TEST MODULE ===============================', function() {
  afterEach( done => {
    Promise.all([
      User.remove({}),
      Artist.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('for POST routes in ARTIST -------------------------', function() {
    before( done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then( user => user.save())
      .then( user => {
        this.tempUser = user;
        exampleArtist.userID = this.tempUser._id.toString();
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });


    describe('while making a valid POST', () => {
      it('should post an artist object.', done => {
        request.post(`${url}/api/artist`)
        .send(exampleArtist)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.be.a('string');
          expect(res.body.name).to.equal(exampleArtist.name);
          expect(res.body.userID).to.equal(this.tempUser._id.toString());
          done();
        });
      });
    });

    describe('posting to the wrong endpoint', () => {
      it('should return 404 error', done => {
        request.post(`${url}/api/whaaaatttt`)
        .send(exampleArtist)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('unauthorized artist', () => {
      it('should return 401 error', done => {
        request.post(`${url}/api/artist`)
        .send(exampleArtist)
        .set({
          Authorization: `nah son`
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with an invalid body', () => {
      it('should return a 400 error', done => {
        request.post(`${url}/api/artist`)
        .send('not an artist')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });

  describe('for GET routes in ARTIST --------------------------', function() {
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
      exampleArtist.userID = this.tempUser._id.toString();
      new Artist(exampleArtist).save()
      .then( artist => {
        this.tempArtist = artist;
        done();
      })
      .catch(done);
    });

    after( done => {
      delete exampleArtist.userID;
      done();
    });

    describe('for a good ARTIST GET', () => {
      it('should successfully return a artist', done => {
        request.get(`${url}/api/artist/${this.tempArtist._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.be.a('string');
          expect(res.body.name).to.equal(exampleArtist.name);
          expect(res.body.userID).to.equal(this.tempUser._id.toString());
          done();
        });
      });
    });

    describe('for a wrong get artist endpoint', () => {
      it('should return an error for wrong endpoint', done => {
        request.get(`${url}/api/artist/nah`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('unauthorized artist', () => {
      it('should return 401 error', done => {
        request.get(`${url}/api/artist/${this.tempArtist._id}`)
        .set({
          Authorization: `NOT HAPPENING BABY`
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });

  describe('PUT route tests in ARTIST --------------------------', function() {
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
      exampleArtist.userID = this.tempUser._id.toString();
      new Artist(exampleArtist).save()
      .then( artist => {
        this.tempArtist = artist;
        done();
      })
      .catch(done);
    });

    after( done => {
      delete exampleArtist.userID;
      done();
    });

    describe('for a correctly updated ARTIST', () => {
      it('will return happy tests', done => {
        let newArtist = {name: 'newguy'};
        request.put(`${url}/api/artist/${this.tempArtist._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send(newArtist)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.userID).to.equal(this.tempUser._id.toString());
          expect(res.body.name).to.be.a('string');
          expect(res.body.name).to.equal(newArtist.name);
          done();
        });
      });
    });

    describe('not updated artist', () => {
      it('will not have the new artist info', done => {
        let newArtist = {name: 'no fly zone'};
        request.put(`${url}/api/artist/${this.tempArtist._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send()
        .end((err, res) => {
          expect(res.body).to.equal(null);
          done();
        });
      });
    });

    describe('updated artist to WRONG ENDPOINT', () => {
      it('will return a failed test', done => {
        let newArtist = { name: 'giggity mcSploogenuts'};
        request.put(`${url}/api/artist/spongebob`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send(newArtist)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('unauthorized PUT request in ARTIST', () => {
      it('returns 401 error', done => {
        let newArtist = { name: 'goku'}
        request.put(`${url}/api/artist/${this.tempArtist._id}`)
        .send(newArtist)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('artist user ID does not match', () => {
      it('the user id', done => {
        let newArtist = {name: 'nah son', userID: 'not goin down'}
        request.put(`${url}/api/artist/${this.tempArtist._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send(newArtist)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('for DELETE routes in ARTIST -------------------', function() {
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
      exampleArtist.userID = this.tempUser._id.toString();
      new Artist(exampleArtist).save()
      .then( artist => {
        this.tempArtist = artist;
        done();
      })
      .catch(done);
    });

    after( done => {
      delete exampleArtist.userID;
      done();
    });

    it('successfully deleting an artist', done => {
      request.delete(`${url}/api/artist/${this.tempArtist._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(204);
        done();
      });
    });

    it('invalid end point for artist delete', done => {
      request.delete(`${url}/api/artist/someonenotcreative`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });

    it('not authorized to delete artist', done=> {
      request.delete(`${url}/api/artist/${this.tempArtist._id}`)
      .set({
        Authorization: `not the realest`
      })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });
  });
});
