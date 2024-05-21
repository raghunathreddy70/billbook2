const mongoose = require('mongoose');

const addGstSchema = new mongoose.Schema({
    gstPercentageName: {
        type: String,
        require: true
    },
    gstPercentageValue: {
        type: Number,
        require: true,
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BusinessSchema",
      },
});

module.exports = mongoose.model('Gst', addGstSchema);
