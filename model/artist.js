'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artistSchema = Schema({
  name: { type: String, required: true},
  userID: { type: Schema.Types.ObjectId, required: true, unique: true },
})

module.exports = mongoose.model('artist', artistSchema);
