'use strict';
 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gearSchema = Schema({
  venueID: { type: Schema.Types.ObjectId, required: true },
  gear: { type: Object, required: true }
});

module.exports = mongoose.model('gear', gearSchema);
