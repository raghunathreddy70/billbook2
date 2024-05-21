// backend/models/Country.js
const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  population: {
    type: Number,
    required: true,
  },
  states: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
    },
  ],
});

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;
