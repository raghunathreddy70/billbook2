const mongoose = require("mongoose");
 
const BusinessSchema = new mongoose.Schema({
    userId: {
      type: String,
      unique:true,
      // required: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    businessName: {
      type: String,
    },
    businessType: {
      type: String,
    },
    industryType: {
      type: String,
    },
    registrationType: {
      type: String,
    },
    gstNumber: {
      type: String,
    },
    OTP: {
      type: String,
    },
    businessCount: {
      type: Number,
      default: 0,
    },
    userCount: {
      type: Number,
      default: 0,
    },
    hasAdmin: {
      type: Boolean,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Deleted"],
    },
    role: {
      type: String,
    },
    adminId: {
      type: String,
    },
    roleAccess: {
      type: Object,
    },
    isUpdated: {
      type: Date,
      default: Date.now,
    },
    userImage : {
      url: String,
      public_id: String,
    },
    city: {
      type: String,
    },
    invoiceCount: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
    },
    termsConditions: {
      type: String,
    },
    country:{
    type: Object,
    },
    state: {
      type: Object,
    },
    pincode: {
      type: Number,
    },
    city: {
      type: Object,
    },
    PANNumber: {
      type: String,
    },
    template: {
      type: Number,
      default: 1,
    },
    profileImage: {
      url: String,
      public_id: String,
    },
    signatureImage: {
      url: String,
      public_id: String,
    },
    TotalRevenue : {
      type: Number,
      default: 0
    }
  },{ timestamps: true });

mongoose.models = {};
module.exports = mongoose.model("BusinessSchema", BusinessSchema);
