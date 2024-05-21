    const mongoose = require('mongoose');

    const profileSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
        },
        phoneNumber: {
            type: Number,
        },
        country: {
            type: String,
        },
        city: {
            type:String,
        },
        state: {
            type: String,
        },
        addressline1: {
            type: String
        },
        addressline2: {
            type: String
        },
        zipCode: {
            type: Number
        },
        profileImage: {
            url: String,
           public_id: String
        },
 
    });

module.exports = mongoose.model('ProfileModel', profileSchema);




