'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//lolz delete me

const venueSchema = Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true, unique: true },
  profPic: { type: Schema.Types.ObjectId, ref: 'pic' },
  pics: [{ type: Schema.Types.ObjectId, ref: 'pic' }],
  userID: { Schema.Types.ObjectId, required: true, unique: true },

})

module.exports = mongoose.model('venue', venueSchema);
