const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  // partyId: {
  //   type: String,
  //   unique: true,
  //   // required: true
  // },
  // partyName: {
  //   type: String,
  //   // required: true,
  // },
  phoneNumber: {
    type: Number,
  },
  action: {
    type: String,
  }
});

module.exports = mongoose.model('AddParty', partySchema);
