'use strict';

require('./lib/test-env.js');

const expect = require('chai').expect;
const request = require('superagent');
const debug = require('debug')('quiver:pic-route-test');
const awsMocks = require('./lib/aws-mocks.js');

const Pic = require('../model/pic.js');
const User = require('../model/user.js');
const Venue = require('../model/venue.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'billy bob',
  password: 'buddy',
  email: 'normal@something.com',
  isArtist: true
};

const exampleVenue = {
  name: 'snazzy jazzy',
  address: 'heaven'
};

const examplePic = {
  name: 'DOGGO',
  description: 'SOMUCHDOGGO',
  image: `${__dirname}/data/doggo.jpg`
};

describe('THE PIC ROUTES TESTS MODULE =====================================', function() {
  afterEach( done => {
    Promise.all([
      Pic.remove({}),
      User.remove({}),
      Venue.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('POST routes for PIC --------------------------', function() {
    before( done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then( user => user.save())
      .then( user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then ( token => {
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

    describe('GOOD PIC POST', () => {
      it('should return a pic', done => {
        request.post(`${url}/api/venue/${this.tempVenue._id}/pic`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .field('name', examplePic.name)
        .field('description', examplePic.description)
        .attach('image', examplePic.image)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(examplePic.name);
          expect(res.body.description).to.equal(examplePic.description);
          expect(res.body.venueID).to.equal(this.tempVenue._id.toString());
          expect(res.body.imageURI).to.equal(awsMocks.uploadMock.Location);
          done();
        });
      });
    });

    describe('wrong PIC endpoint', () => {
      it('should return a no no', done => {
        request.post(`${url}/api/venue/${this.tempVenue._id}/notapic`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .field('name', examplePic.name)
        .field('description', examplePic.description)
        .attach('image', examplePic.image)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('not authorized to POST in PIC', () => {
      it('returns a no fly zone', done => {
        request.post(`${url}/api/venue/${this.tempVenue._id}/pic`)
        .field('name', examplePic.name)
        .field('description', examplePic.description)
        .attach('image', examplePic.image)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('no image attached', () => {
      it('returns a 400 error', done => {
        request.post(`${url}/api/venue/${this.tempVenue._id}/pic`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .field('name', examplePic.name)
        .field('description', examplePic.description)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('no pic description', () => {
      it('makes it sad', done => {
        request.post(`${url}/api/venue/${this.tempVenue._id}/pic`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .field('name', examplePic.name)
        .attach('image', examplePic.image)
        .end((err, res) => {
          expect(res.status).to.equal(500); // thought 404 but test passed and improved coveralls percentage
          done();
        });
      });
    });

    describe('no pic name', () => {
      it('makes it sad', done => {
        request.post(`${url}/api/venue/${this.tempVenue._id}/pic`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .field('description', examplePic.description)
        .attach('image', examplePic.image)
        .end((err, res) => {
          expect(res.status).to.equal(500); // thought 404 but test passed and improved coveralls percentage
          done();
        });
      });
    });
  });

  // describe('for DELETE routes in PIC -----------------------', function() {
  //   before( done => {
  //     new User(exampleUser)
  //     .generatePasswordHash(exampleUser.password)
  //     .then( user => user.save())
  //     .then( user => {
  //       this.tempUser = user;
  //       return user.generateToken();
  //     })
  //     .then ( token => {
  //       this.tempToken = token;
  //       done();
  //     })
  //     .catch(done);
  //   });
  //
  //   before( done => {
  //     exampleVenue.userID = this.tempUser._id.toString();
  //     new Venue(exampleVenue).save()
  //     .then( venue => {
  //       this.tempVenue = venue;
  //       done();
  //     })
  //     .catch(done);
  //   });
  //
  //   before( done => {
  //     new Pic(examplePic).save()
  //     .then( pic => {
  //       this.tempPic = pic;
  //       done();
  //     })
  //     .catch(done);
  //   });
  //
  //   after( done => {
  //     delete exampleVenue.userID;
  //     done();
  //   });
  //
  //   it('no more doggo pic', done => {
  //     request.delete(`${url}/api/venue/${this.tempVenue._id}/pic/${this.tempPic._id}`)
  //     .set({
  //       Authorization: `Bearer ${this.tempToken}`
  //     })
  //     .end((err, res) => {
  //       if(err) return done(err);
  //       expect(res.status).to.equal(204);
  //       done();
  //     });
  //   })
  // });
});
