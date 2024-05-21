const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    businessId: {
        type:String,
        require: true,
    },
    businessName: {
        type: String,
    },
    phoneNumber: {
        type: Number,
    },
    email: {
        type: String,
    },
    billingAddress: {
        type: String,
    },
    state: {
        type: String,
    },
    pincode: {
        type: Number,
    },
    city: {
        type: Number,
    },
    GSTIN: {
        type: Number,
    },
    PANNumber: {
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
    termsAndConditions: {
        type: String,
    },
    signatureImage: {
        url: String,
        public_id: String,
    },
    profileImage: {
        url: String,
        public_id: String,
    }
})

module.exports = mongoose.model('BusinessModel', businessSchema);