const mongoose = require('mongoose');


const addVendorSchema = new mongoose.Schema({
  vendorId: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number
  },
  balance: {
    type: Number,
    // required: true,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessSchema",
  },
  openingBalance: {
    type: Number,
    default: 0,
  },
  Purchases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "AddPurchases",
  }],
  payments: [{
    type: mongoose.Schema.Types.ObjectId,
    default: "PaymentOutDetails"
  }],
  action: {
    type: String,
  },
  addressLine1: {
    type: String,
  },
  addressLine2: {
    type: String,
  },
  PANNumber: {
    type: String
  },
});

module.exports = mongoose.model('AddVendor', addVendorSchema);
