'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const debug = require('debug')('quiver:pic-route-test');

const Pic = require('../model/pic.js');
const User = require('../model/user.js');
const Venue = require('../model/venue.js');

const url = `http://localhost:3000`;

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

describe('PIC ROUTE TESTS MODULE --', function() {
  afterEach( done => {
    Promise.all([
      Pic.remove({}),
      User.remove({}),
      Venue.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('POST routes for PIC', function() {
    describe('successfully done', function() {
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
        });
      });
    });
  });
});
