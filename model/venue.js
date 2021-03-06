'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const venueSchema = Schema({
  name: { type: String, required: true},
  address: { type: String, required: true},
  phone: { type: String, required: true},
  hours: { type: String, required: true},
  profPic: { type: Schema.Types.ObjectId, ref: 'pic' },
  pics: [{ type: Schema.Types.ObjectId, ref: 'pic' }],
  userID: { type: Schema.Types.ObjectId, required: true, unique: true },
});

module.exports = mongoose.model('venue', venueSchema);
