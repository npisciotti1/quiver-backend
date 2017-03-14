'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const setupSchema = Schema({
  venueID: { type: Schema.Types.ObjectID, required: true },
  setup: {type: Object, required: true }
});

module.exports = mongoose.model('setup', setupSchema);
